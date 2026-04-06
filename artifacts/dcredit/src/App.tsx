import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { FinancialProvider } from "@/contexts/FinancialContext";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Debts from "@/pages/Debts";
import Simulator from "@/pages/Simulator";
import Insights from "@/pages/Insights";
import DataConfidence from "@/pages/DataConfidence";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Onboarding} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/debts" component={Debts} />
      <Route path="/simulator" component={Simulator} />
      <Route path="/insights" component={Insights} />
      <Route path="/data" component={DataConfidence} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <FinancialProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </FinancialProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
