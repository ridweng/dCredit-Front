import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { AppNavigator } from '@/navigation/AppNavigator';

const queryClient = new QueryClient();

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <StatusBar style="dark" />
            <AppNavigator />
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
