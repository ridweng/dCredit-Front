import { Controller, Get, Query, UseGuards, Req } from "@nestjs/common";
import { db, transactionsTable } from "@workspace/db";
import { eq, and, gte } from "drizzle-orm";
import { AuthGuard, getUserFromRequest } from "./lib/auth.guard";
import {
  GetWeeklySpendingResponse,
  GetSpendingCategoriesResponse,
  GetTransactionsResponse,
  GetTransactionsQueryParams,
} from "@workspace/api-zod";

const CATEGORY_META: Record<string, { labelEn: string; labelEs: string; icon: string }> = {
  food: { labelEn: "Food & Dining", labelEs: "Comida", icon: "utensils" },
  transport: { labelEn: "Transport", labelEs: "Transporte", icon: "car" },
  shopping: { labelEn: "Shopping", labelEs: "Compras", icon: "shopping-bag" },
  entertainment: { labelEn: "Entertainment", labelEs: "Entretenimiento", icon: "tv" },
  health: { labelEn: "Health", labelEs: "Salud", icon: "heart" },
  utilities: { labelEn: "Utilities", labelEs: "Servicios", icon: "zap" },
  other: { labelEn: "Other", labelEs: "Otros", icon: "more-horizontal" },
};

@Controller("spending")
export class SpendingController {
  @Get("weekly")
  @UseGuards(AuthGuard)
  async getWeeklySpending(@Req() req: Record<string, unknown>) {
    const { userId } = getUserFromRequest(req);
    const txns = await db.select().from(transactionsTable).where(eq(transactionsTable.userId, userId));

    const weeks = [];
    for (let i = 3; i >= 0; i--) {
      const end = new Date();
      end.setDate(end.getDate() - i * 7);
      const start = new Date(end);
      start.setDate(start.getDate() - 6);

      const startStr = start.toISOString().split("T")[0]!;
      const endStr = end.toISOString().split("T")[0]!;
      const weekTxns = txns.filter(t => t.date >= startStr && t.date <= endStr);
      const total = weekTxns.reduce((s, t) => s + Number(t.amount), 0);

      const byCategory: Record<string, number> = {};
      weekTxns.forEach(t => {
        byCategory[t.category] = (byCategory[t.category] ?? 0) + Number(t.amount);
      });

      weeks.push({
        weekLabel: i === 0 ? "This week" : i === 1 ? "Last week" : `${i} weeks ago`,
        startDate: startStr,
        endDate: endStr,
        total: Math.round(total),
        byCategory,
      });
    }

    return GetWeeklySpendingResponse.parse(weeks);
  }

  @Get("categories")
  @UseGuards(AuthGuard)
  async getCategories(@Req() req: Record<string, unknown>) {
    const { userId } = getUserFromRequest(req);
    const txns = await db.select().from(transactionsTable).where(eq(transactionsTable.userId, userId));

    const totalAll = txns.reduce((s, t) => s + Number(t.amount), 0);
    const byCat: Record<string, { total: number; count: number }> = {};

    txns.forEach(t => {
      if (!byCat[t.category]) byCat[t.category] = { total: 0, count: 0 };
      byCat[t.category]!.total += Number(t.amount);
      byCat[t.category]!.count += 1;
    });

    const categories = Object.entries(byCat).map(([cat, data]) => {
      const meta = CATEGORY_META[cat] ?? CATEGORY_META["other"]!;
      return {
        category: cat,
        labelEn: meta.labelEn,
        labelEs: meta.labelEs,
        total: Math.round(data.total),
        percentage: totalAll > 0 ? Math.round((data.total / totalAll) * 100) : 0,
        transactionCount: data.count,
        icon: meta.icon,
      };
    }).sort((a, b) => b.total - a.total);

    return GetSpendingCategoriesResponse.parse(categories);
  }

  @Get("transactions")
  @UseGuards(AuthGuard)
  async getTransactions(@Req() req: Record<string, unknown>, @Query() query: unknown) {
    const { userId } = getUserFromRequest(req);
    const params = GetTransactionsQueryParams.parse(query);
    const limit = params.limit ?? 30;

    const txns = await db.select().from(transactionsTable).where(eq(transactionsTable.userId, userId));
    const filtered = params.category
      ? txns.filter(t => t.category === params.category)
      : txns;

    return GetTransactionsResponse.parse(
      filtered
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, limit)
        .map(t => ({
          id: t.id,
          date: t.date,
          description: t.description,
          amount: Number(t.amount),
          category: t.category,
          institution: t.institution,
        }))
    );
  }
}
