// dCredit Mobile App — apps/mobile/App.tsx
// React Native + Expo scaffold.
//
// Business logic from packages/core and packages/i18n is shared with the web app.
// Replace the placeholder content with real screens as features are built.

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';

const TEAL = '#0f766e';
const LIGHT_TEAL = '#ccfbf1';
const SLATE = '#1e293b';
const MUTED = '#64748b';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>d</Text>
        </View>
        <Text style={styles.appName}>dCredit</Text>
      </View>

      <Text style={styles.tagline}>Your debt, made clear.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Mobile App Scaffold</Text>
        <Text style={styles.cardBody}>
          This is the <Text style={styles.bold}>apps/mobile</Text> React Native + Expo starter.
          {'\n\n'}
          Business logic from <Text style={styles.code}>packages/core</Text> and translations from{' '}
          <Text style={styles.code}>packages/i18n</Text> will be shared between this app and the
          web frontend.
        </Text>
      </View>

      <View style={styles.stepsList}>
        <Text style={styles.stepsTitle}>Next steps:</Text>
        {[
          'Add navigation (React Navigation)',
          'Wire up API client → NestJS backend',
          'Build screens: Onboarding → Dashboard → Debts',
          'Add push notifications',
          'Configure EAS Build for app stores',
        ].map((step, i) => (
          <Text key={i} style={styles.step}>
            {i + 1}. {step}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: SLATE,
  },
  tagline: {
    fontSize: 14,
    color: MUTED,
    fontStyle: 'italic',
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: SLATE,
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 14,
    color: MUTED,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '600',
    color: SLATE,
  },
  code: {
    fontFamily: 'Courier',
    backgroundColor: '#f1f5f9',
    color: TEAL,
  },
  stepsList: {
    width: '100%',
    backgroundColor: LIGHT_TEAL,
    borderRadius: 16,
    padding: 16,
  },
  stepsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: TEAL,
    marginBottom: 8,
  },
  step: {
    fontSize: 13,
    color: SLATE,
    lineHeight: 24,
  },
});
