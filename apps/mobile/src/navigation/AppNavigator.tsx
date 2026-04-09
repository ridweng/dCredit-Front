import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ComponentType } from 'react';
import { Text } from 'react-native';
import { APP_SECTIONS } from '@dcredit/core';
import { LoadingView } from '@/components/LoadingView';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { RegisterScreen } from '@/screens/auth/RegisterScreen';
import { VerificationInfoScreen } from '@/screens/auth/VerificationInfoScreen';
import { CreditsScreen } from '@/screens/credits/CreditsScreen';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { SourcesScreen } from '@/screens/sources/SourcesScreen';
import { SpendingScreen } from '@/screens/spending/SpendingScreen';
import { colors } from '@/theme/colors';
import type { AppTabParamList, AuthStackParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<AppTabParamList>();

const appTabComponents: Record<keyof AppTabParamList, ComponentType<object>> = {
  Home: HomeScreen,
  Credits: CreditsScreen,
  Spending: SpendingScreen,
  Sources: SourcesScreen,
  Profile: ProfileScreen,
};

function AppTabs() {
  const { t } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          height: 74,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      {APP_SECTIONS.map((section) => (
        <Tab.Screen
          key={section.id}
          name={section.mobileRoute}
          component={appTabComponents[section.mobileRoute]}
          options={{ title: t(section.translationKey) }}
        />
      ))}
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <LoadingView
        fullScreen
        label={t('states.loadingSession')}
        hint={t('auth.login.demoHint')}
      />
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AppTabs />
      ) : (
        <AuthStack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.background },
            headerTitleStyle: { color: colors.text },
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: t('auth.login.title') }} />
          <AuthStack.Screen name="Register" component={RegisterScreen} options={{ title: t('auth.register.title') }} />
          <AuthStack.Screen
            name="VerificationInfo"
            component={VerificationInfoScreen}
            options={{
              title: t('auth.verify.title'),
              headerRight: () => <Text style={{ color: colors.textMuted }}>{t('actions.openMailpit')}</Text>,
            }}
          />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
