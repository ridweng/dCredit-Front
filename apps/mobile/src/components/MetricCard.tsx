import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';

interface MetricCardProps {
  label: string;
  value: string;
  detail?: string;
  highlight?: boolean;
}

export function MetricCard({ label, value, detail, highlight }: MetricCardProps) {
  return (
    <View style={[styles.card, highlight ? styles.highlightCard : null]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  highlightCard: {
    backgroundColor: colors.primarySoft,
    borderColor: '#b8ece7',
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  detail: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
