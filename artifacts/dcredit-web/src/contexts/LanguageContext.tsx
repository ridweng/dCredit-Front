import React, { createContext, useContext, useState, useEffect } from 'react';

type Locale = 'en' | 'es';

type Translations = {
  [key in Locale]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    'nav.home': 'Home',
    'nav.credits': 'Credits',
    'nav.spending': 'Spending',
    'nav.sources': 'Sources',
    'nav.profile': 'Profile',
    'auth.login.title': 'Welcome back',
    'auth.login.subtitle': 'Sign in to continue to dCredit',
    'auth.login.email': 'Email address',
    'auth.login.password': 'Password',
    'auth.login.submit': 'Sign in',
    'auth.login.noAccount': 'Don\'t have an account?',
    'auth.login.signUp': 'Sign up',
    'auth.register.title': 'Create an account',
    'auth.register.subtitle': 'Get clarity on your financial life',
    'auth.register.name': 'Full name',
    'auth.register.email': 'Email address',
    'auth.register.password': 'Password',
    'auth.register.submit': 'Create account',
    'auth.register.hasAccount': 'Already have an account?',
    'auth.register.signIn': 'Sign in',
    'auth.register.success': 'Account created! Please check your email to verify your account.',
    'auth.verify.title': 'Verifying email...',
    'auth.verify.success': 'Email verified successfully! Redirecting...',
    'auth.verify.error': 'Verification failed. The link might be invalid or expired.',
    'dashboard.title': 'Overview',
    'dashboard.balance': 'Available Balance',
    'dashboard.income': 'Monthly Income',
    'dashboard.debt': 'Total Debt',
    'dashboard.obligations': 'Monthly Obligations',
    'dashboard.spending': 'Weekly Spending',
    'dashboard.burden': 'Debt Burden',
    'dashboard.cashflow': 'Free Cash Flow',
    'dashboard.nextPayment': 'Next Payment',
    'dashboard.dueIn': 'due in {days} days',
    'dashboard.recommendations': 'Insights',
    'credits.title': 'Your Credits',
    'credits.summary': 'Summary',
    'credits.totalObligations': 'Total Monthly Obligations',
    'credits.totalBalance': 'Total Balance',
    'credits.highInterest': 'High Interest Accounts',
    'credits.avgApr': 'Average APR',
    'credits.apr': 'APR',
    'credits.monthly': 'Monthly',
    'credits.remaining': 'remaining',
    'credits.priority.high': 'High Priority',
    'credits.priority.medium': 'Medium Priority',
    'credits.priority.low': 'Low Priority',
    'spending.title': 'Spending Habits',
    'spending.weekly': 'Weekly Trend',
    'spending.categories': 'Categories',
    'spending.transactions': 'Recent Transactions',
    'sources.title': 'Financial Sources',
    'sources.add': 'Add Source',
    'sources.vault': 'Your data is secured with bank-grade encryption.',
    'sources.status.connected': 'Connected',
    'sources.status.pending': 'Pending',
    'sources.status.error': 'Error',
    'sources.status.disconnected': 'Disconnected',
    'sources.form.name': 'Account Name',
    'sources.form.institution': 'Institution',
    'sources.form.type': 'Account Type',
    'sources.form.submit': 'Connect Source',
    'profile.title': 'Profile',
    'profile.details': 'Personal Details',
    'profile.preferences': 'Preferences',
    'profile.language': 'Language',
    'profile.currency': 'Currency',
    'profile.income': 'Monthly Income',
    'profile.save': 'Save Changes',
    'profile.logout': 'Sign out',
    'profile.verified': 'Verified',
    'profile.unverified': 'Unverified',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.retry': 'Retry',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.credits': 'Créditos',
    'nav.spending': 'Gastos',
    'nav.sources': 'Fuentes',
    'nav.profile': 'Perfil',
    'auth.login.title': 'Bienvenido de nuevo',
    'auth.login.subtitle': 'Inicia sesión para continuar a dCredit',
    'auth.login.email': 'Correo electrónico',
    'auth.login.password': 'Contraseña',
    'auth.login.submit': 'Iniciar sesión',
    'auth.login.noAccount': '¿No tienes una cuenta?',
    'auth.login.signUp': 'Regístrate',
    'auth.register.title': 'Crear una cuenta',
    'auth.register.subtitle': 'Obtén claridad sobre tu vida financiera',
    'auth.register.name': 'Nombre completo',
    'auth.register.email': 'Correo electrónico',
    'auth.register.password': 'Contraseña',
    'auth.register.submit': 'Crear cuenta',
    'auth.register.hasAccount': '¿Ya tienes una cuenta?',
    'auth.register.signIn': 'Inicia sesión',
    'auth.register.success': '¡Cuenta creada! Por favor revisa tu correo para verificar tu cuenta.',
    'auth.verify.title': 'Verificando correo...',
    'auth.verify.success': '¡Correo verificado con éxito! Redirigiendo...',
    'auth.verify.error': 'La verificación falló. El enlace podría ser inválido o haber expirado.',
    'dashboard.title': 'Resumen',
    'dashboard.balance': 'Saldo Disponible',
    'dashboard.income': 'Ingreso Mensual',
    'dashboard.debt': 'Deuda Total',
    'dashboard.obligations': 'Obligaciones Mensuales',
    'dashboard.spending': 'Gasto Semanal',
    'dashboard.burden': 'Carga de Deuda',
    'dashboard.cashflow': 'Flujo de Caja Libre',
    'dashboard.nextPayment': 'Próximo Pago',
    'dashboard.dueIn': 'vence en {days} días',
    'dashboard.recommendations': 'Perspectivas',
    'credits.title': 'Tus Créditos',
    'credits.summary': 'Resumen',
    'credits.totalObligations': 'Obligaciones Mensuales Totales',
    'credits.totalBalance': 'Saldo Total',
    'credits.highInterest': 'Cuentas de Alto Interés',
    'credits.avgApr': 'APR Promedio',
    'credits.apr': 'APR',
    'credits.monthly': 'Mensual',
    'credits.remaining': 'restante',
    'credits.priority.high': 'Alta Prioridad',
    'credits.priority.medium': 'Prioridad Media',
    'credits.priority.low': 'Baja Prioridad',
    'spending.title': 'Hábitos de Consumo',
    'spending.weekly': 'Tendencia Semanal',
    'spending.categories': 'Categorías',
    'spending.transactions': 'Transacciones Recientes',
    'sources.title': 'Fuentes Financieras',
    'sources.add': 'Agregar Fuente',
    'sources.vault': 'Tus datos están protegidos con encriptación de nivel bancario.',
    'sources.status.connected': 'Conectado',
    'sources.status.pending': 'Pendiente',
    'sources.status.error': 'Error',
    'sources.status.disconnected': 'Desconectado',
    'sources.form.name': 'Nombre de la Cuenta',
    'sources.form.institution': 'Institución',
    'sources.form.type': 'Tipo de Cuenta',
    'sources.form.submit': 'Conectar Fuente',
    'profile.title': 'Perfil',
    'profile.details': 'Datos Personales',
    'profile.preferences': 'Preferencias',
    'profile.language': 'Idioma',
    'profile.currency': 'Moneda',
    'profile.income': 'Ingreso Mensual',
    'profile.save': 'Guardar Cambios',
    'profile.logout': 'Cerrar sesión',
    'profile.verified': 'Verificado',
    'profile.unverified': 'No verificado',
    'common.loading': 'Cargando...',
    'common.error': 'Ocurrió un error',
    'common.retry': 'Reintentar',
  }
};

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('dcredit_locale') as Locale;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'es')) {
      setLocaleState(savedLocale);
    } else {
      // Try to guess from browser
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'es') {
        setLocaleState('es');
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('dcredit_locale', newLocale);
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    let text = translations[locale][key] || translations['en'][key] || key;
    if (params) {
      Object.keys(params).forEach((paramKey) => {
        text = text.replace(`{${paramKey}}`, String(params[paramKey]));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useT() {
  return useLanguage().t;
}
