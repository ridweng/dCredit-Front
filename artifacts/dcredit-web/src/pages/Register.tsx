import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useRegister } from "@workspace/api-client-react";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RegisterBodyLocale } from "@workspace/api-client-react/src/generated/api.schemas";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const { locale } = useLanguage();
  const t = useT();
  const { toast } = useToast();
  const registerMutation = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerMutation.mutateAsync({
        data: { 
          name, 
          email, 
          password, 
          locale: locale as RegisterBodyLocale
        }
      });
      setSuccess(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error?.data?.message || "Please check your details",
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
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{t('auth.register.title')}</h2>
          <p className="text-muted-foreground mt-2">{t('auth.register.subtitle')}</p>
        </div>

        {success ? (
          <div className="bg-primary/10 text-primary p-4 rounded-lg text-center font-medium">
            {t('auth.register.success')}
            <div className="mt-4">
              <Link href="/web/login">
                <Button variant="outline" className="w-full">{t('auth.register.signIn')}</Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('auth.register.name')}</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.register.email')}</Label>
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
                <Label htmlFor="password">{t('auth.register.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                  minLength={8}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? "..." : t('auth.register.submit')}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t('auth.register.hasAccount')}{' '}
              <Link href="/web/login" className="font-medium text-primary hover:text-primary/80">
                {t('auth.register.signIn')}
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
