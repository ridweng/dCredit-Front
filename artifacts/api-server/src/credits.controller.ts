import { Controller, Get, UseGuards, Req } from "@nestjs/common";
import { db, creditsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { AuthGuard, getUserFromRequest } from "./lib/auth.guard";
import { GetCreditsResponse, GetCreditsSummaryResponse } from "@workspace/api-zod";

@Controller("credits")
export class CreditsController {
  @Get()
  @UseGuards(AuthGuard)
  async getCredits(@Req() req: Record<string, unknown>) {
    const { userId } = getUserFromRequest(req);
    const credits = await db.select().from(creditsTable).where(eq(creditsTable.userId, userId));

    return GetCreditsResponse.parse(
      credits.map(c => ({
        id: c.id,
        name: c.name,
        type: c.type,
        balance: Number(c.balance),
        originalBalance: Number(c.originalBalance),
        apr: Number(c.apr),
        monthlyPayment: Number(c.monthlyPayment),
        nextPaymentDate: c.nextPaymentDate!,
        termMonths: c.termMonths,
        paidMonths: c.paidMonths,
        priority: c.priority,
        institution: c.institution,
      }))
    );
  }

  @Get("summary")
  @UseGuards(AuthGuard)
  async getCreditsSummary(@Req() req: Record<string, unknown>) {
    const { userId } = getUserFromRequest(req);
    const credits = await db.select().from(creditsTable).where(eq(creditsTable.userId, userId));

    const totalMonthlyObligations = credits.reduce((s, c) => s + Number(c.monthlyPayment), 0);
    const totalBalance = credits.reduce((s, c) => s + Number(c.balance), 0);
    const highInterestCount = credits.filter(c => Number(c.apr) > 15).length;
    const averageApr = credits.length > 0
      ? credits.reduce((s, c) => s + Number(c.apr), 0) / credits.length
      : 0;

    const nextCredit = credits
      .filter(c => c.nextPaymentDate)
      .sort((a, b) => a.nextPaymentDate!.localeCompare(b.nextPaymentDate!))[0];

    return GetCreditsSummaryResponse.parse({
      totalMonthlyObligations: Math.round(totalMonthlyObligations),
      totalBalance: Math.round(totalBalance),
      highInterestCount,
      averageApr: Math.round(averageApr * 10) / 10,
      nextPayment: nextCredit ? {
        creditName: nextCredit.name,
        amount: Number(nextCredit.monthlyPayment),
        dueDate: nextCredit.nextPaymentDate!,
        daysUntilDue: Math.max(0, Math.ceil(
          (new Date(nextCredit.nextPaymentDate!).getTime() - Date.now()) / 86400000
        )),
      } : {
        creditName: "—",
        amount: 0,
        dueDate: new Date().toISOString().split("T")[0]!,
        daysUntilDue: 0,
      },
    });
  }
}
