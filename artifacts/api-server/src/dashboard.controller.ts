import { Controller, Get, UseGuards, Req } from "@nestjs/common";
import { db, creditsTable, transactionsTable, usersTable } from "@workspace/db";
import { eq, gte, sum, count } from "drizzle-orm";
import { AuthGuard, getUserFromRequest } from "./lib/auth.guard";
import { GetDashboardResponse } from "@workspace/api-zod";

@Controller("dashboard")
export class DashboardController {
  @Get()
  @UseGuards(AuthGuard)
  async getDashboard(@Req() req: Record<string, unknown>) {
    const { userId } = getUserFromRequest(req);

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

    const credits = await db.select().from(creditsTable).where(eq(creditsTable.userId, userId));

    const monthlyIncome = user?.monthlyIncome ? Number(user.monthlyIncome) : 5200;
    const totalDebt = credits.reduce((s, c) => s + Number(c.balance), 0);
    const monthlyDebtObligations = credits.reduce((s, c) => s + Number(c.monthlyPayment), 0);

    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    const fourWeeksAgoStr = fourWeeksAgo.toISOString().split("T")[0];

    const recentTxns = await db.select().from(transactionsTable)
      .where(eq(transactionsTable.userId, userId));
    const weeklySpendingTotal = recentTxns
      .filter(t => t.date >= fourWeeksAgoStr!)
      .reduce((s, t) => s + Number(t.amount), 0);

    const debtBurdenPct = monthlyIncome > 0 ? monthlyDebtObligations / monthlyIncome : 0;
    const freeCashFlow = monthlyIncome - monthlyDebtObligations - 2100;
    const balanceGeneral = freeCashFlow > 0 ? freeCashFlow * 0.85 : 0;

    const nextCredit = credits
      .filter(c => c.nextPaymentDate)
      .sort((a, b) => a.nextPaymentDate!.localeCompare(b.nextPaymentDate!))
      [0];

    const nextPaymentDate = nextCredit?.nextPaymentDate ?? new Date().toISOString().split("T")[0]!;
    const daysUntilDue = Math.max(0, Math.ceil(
      (new Date(nextPaymentDate).getTime() - Date.now()) / 86400000
    ));

    const recommendations = [];
    if (debtBurdenPct > 0.4) {
      recommendations.push({
        id: "high-burden",
        type: "warning" as const,
        titleEn: "High Debt Burden",
        titleEs: "Carga de Deuda Alta",
        bodyEn: "Your debt obligations exceed 40% of income. Prioritize paying down high-interest balances.",
        bodyEs: "Tus obligaciones de deuda superan el 40% de tus ingresos. Prioriza pagar saldos de alto interés.",
      });
    }
    if (freeCashFlow < monthlyIncome * 0.1) {
      recommendations.push({
        id: "low-fcf",
        type: "warning" as const,
        titleEn: "Low Free Cash Flow",
        titleEs: "Flujo Libre Bajo",
        bodyEn: "Less than 10% of income remains after obligations. Build a buffer before taking on new debt.",
        bodyEs: "Menos del 10% de tus ingresos queda después de las obligaciones.",
      });
    }
    recommendations.push({
      id: "autopay",
      type: "tip" as const,
      titleEn: "Set Up Autopay",
      titleEs: "Activa el Pago Automático",
      bodyEn: "Automating payments prevents late fees and protects your credit score.",
      bodyEs: "Automatizar los pagos evita cargos por mora y protege tu historial crediticio.",
    });

    return GetDashboardResponse.parse({
      balanceGeneral: Math.round(balanceGeneral),
      monthlyIncome,
      totalDebt: Math.round(totalDebt),
      monthlyDebtObligations: Math.round(monthlyDebtObligations),
      weeklySpendingTotal: Math.round(weeklySpendingTotal / 4),
      debtBurdenPct: Math.round(debtBurdenPct * 100) / 100,
      freeCashFlow: Math.round(freeCashFlow),
      nextPayment: nextCredit ? {
        creditName: nextCredit.name,
        amount: Number(nextCredit.monthlyPayment),
        dueDate: nextCredit.nextPaymentDate!,
        daysUntilDue,
      } : {
        creditName: "—",
        amount: 0,
        dueDate: new Date().toISOString().split("T")[0]!,
        daysUntilDue: 0,
      },
      recommendations,
    });
  }
}
