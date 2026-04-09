export const FRONTEND_STORAGE_KEYS = {
  webToken: 'dcredit_token',
  mobileToken: 'dcredit_mobile_token',
  mobileLocale: 'dcredit_mobile_locale',
} as const;

export const APP_SECTIONS = [
  {
    id: 'home',
    translationKey: 'nav.home',
    webPath: '/',
    mobileRoute: 'Home',
  },
  {
    id: 'credits',
    translationKey: 'nav.credits',
    webPath: '/credits',
    mobileRoute: 'Credits',
  },
  {
    id: 'spending',
    translationKey: 'nav.spending',
    webPath: '/spending',
    mobileRoute: 'Spending',
  },
  {
    id: 'sources',
    translationKey: 'nav.sources',
    webPath: '/sources',
    mobileRoute: 'Sources',
  },
  {
    id: 'profile',
    translationKey: 'nav.profile',
    webPath: '/profile',
    mobileRoute: 'Profile',
  },
] as const;

export type AppSection = (typeof APP_SECTIONS)[number];
export type AppSectionId = AppSection['id'];
export type MobileAppRouteName = AppSection['mobileRoute'];
