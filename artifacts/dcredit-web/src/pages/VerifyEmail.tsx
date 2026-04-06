import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useVerifyEmail } from "@workspace/api-client-react";
import { useT } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmail() {
  const [location, setLocation] = useLocation();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const t = useT();
  const verifyMutation = useVerifyEmail();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        await verifyMutation.mutateAsync({ data: { token } });
        setStatus("success");
        setTimeout(() => {
          setLocation("/web/login");
        }, 3000);
      } catch (error) {
        setStatus("error");
      }
    };

    verify();
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-lg border border-border text-center space-y-6">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          {status === "verifying" && <Loader2 className="h-6 w-6 text-primary animate-spin" />}
          {status === "success" && (
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {status === "error" && (
            <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {status === "verifying" && t('auth.verify.title')}
          {status === "success" && t('auth.verify.success')}
          {status === "error" && t('auth.verify.error')}
        </h2>

        {status === "error" && (
          <Button onClick={() => setLocation("/web/login")} className="w-full">
            Back to Login
          </Button>
        )}
      </div>
    </div>
  );
}
