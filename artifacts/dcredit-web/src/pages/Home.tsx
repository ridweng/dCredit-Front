import { useGetDashboard, getGetDashboardQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useT } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, DollarSign, CreditCard, Wallet, AlertCircle, Info, Lightbulb, Zap } from "lucide-react";
import { RecommendationType } from "@workspace/api-client-react/src/generated/api.schemas";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const t = useT();

  const { data: dashboard, isLoading } = useGetDashboard({
    query: {
      enabled: isAuthenticated,
      queryKey: getGetDashboardQueryKey()
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!dashboard) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const renderRecommendationIcon = (type: RecommendationType) => {
    switch (type) {
      case 'warning': return <AlertCircle className="text-destructive h-5 w-5" />;
      case 'info': return <Info className="text-blue-500 h-5 w-5" />;
      case 'tip': return <Lightbulb className="text-yellow-500 h-5 w-5" />;
      case 'action': return <Zap className="text-primary h-5 w-5" />;
      default: return <Info className="text-muted-foreground h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground mt-1">Here's your financial summary.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.balance')}</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboard.balanceGeneral)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.income')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboard.monthlyIncome)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.debt')}</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(dashboard.totalDebt)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.obligations')}</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{formatCurrency(dashboard.monthlyDebtObligations)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {dashboard.nextPayment && (
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">{t('dashboard.nextPayment')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <p className="font-semibold text-lg">{dashboard.nextPayment.creditName}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('dashboard.dueIn', { days: dashboard.nextPayment.daysUntilDue })}
                  </p>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(dashboard.nextPayment.amount)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {dashboard.recommendations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">{t('dashboard.recommendations')}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {dashboard.recommendations.map(rec => (
              <Card key={rec.id}>
                <CardHeader className="flex flex-row gap-3 items-start space-y-0">
                  <div className="mt-1">
                    {renderRecommendationIcon(rec.type)}
                  </div>
                  <div>
                    <CardTitle className="text-base leading-tight">{rec.titleEn}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{rec.bodyEn}</p>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
