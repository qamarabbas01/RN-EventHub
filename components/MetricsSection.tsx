import { useColorScheme } from '@/hooks/use-color-scheme';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StatCard from './Card/StatCard';

interface MetricCard {
  label: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

interface MetricsSectionProps {
  title: string;
  viewAlllabel?: string;
  viewAllLink?: any;
  viewAllIcon?: React.ReactNode;
  cards: MetricCard[];
}

export default function MetricsSection({ title, viewAlllabel, viewAllLink, viewAllIcon, cards }: MetricsSectionProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <View style={[styles.section, { backgroundColor: isDark ? "#0b1220" : "#fff", borderColor: isDark ? "#111827" : "#f3f4f6", borderRadius: 16 }]}>
      <View style={[styles.headerRow, { borderColor: isDark ? "#111827" : "#f3f4f6" }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? "#e5e7eb" : "#000" }]}>{title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {viewAllLink ? (
            <Link href={viewAllLink} asChild>
              <Text style={[styles.viewAll, { color: isDark ? "#4338ca" : "#4338ca" }]}>
                {viewAlllabel || ""}
              </Text>
            </Link>
          ) : (
            <Text style={[styles.viewAll, { color: isDark ? "#4338ca" : "#4338ca" }]}>{viewAlllabel || ''}</Text>
          )}
          {viewAllIcon || ""}
        </View>
      </View>
      <View style={[styles.cardsGrid, { backgroundColor: isDark ? "#0b1220" : "#fff", borderColor: isDark ? "#111827" : "#f3f4f6" }]}>
        {cards.map((card, index) => (
          <StatCard
            valueColor={isDark ? "0b1220" : "#fff"}
            key={index}
            label={card.label}
            value={card.value}
            trend={card.trend}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
    padding: 16,
  },
  viewAll: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4338ca',
  },
  cardsGrid: {
    gap: 14,
    padding: 16,
  },
});