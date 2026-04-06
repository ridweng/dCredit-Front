export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  VerificationInfo: { email?: string; password?: string } | undefined;
};

export type AppTabParamList = {
  Home: undefined;
  Credits: undefined;
  Spending: undefined;
  Sources: undefined;
  Profile: undefined;
};
