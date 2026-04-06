import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useT } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [_, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const t = useT();

  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginMutation.mutateAsync({ data: { email, password } });
      login(response.accessToken, response.user);
      setLocation("/web/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error?.data?.message || "Invalid credentials",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl shadow-lg border border-border">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6">
            <span className="text-primary-foreground font-bold text-xl">dC</span>
          </div>
          {/* <h2 className="text-3xl font-bold tracking-tight text-foreground">{t('auth.login.title')}</h2>
          <p className="text-muted-foreground mt-2">{t('auth.login.subtitle')}</p> */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.login.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.login.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "..." : t('auth.login.submit')}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t('auth.login.noAccount')}{' '}
            <Link href="/web/register" className="font-medium text-primary hover:text-primary/80">
              {t('auth.login.signUp')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
