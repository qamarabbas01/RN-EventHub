import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StatCard from './Card/StatCard';
import { IconSymbol } from './ui/icon-symbol';

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
  cards: MetricCard[];
}

export default function MetricsSection({ title, cards }: MetricsSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Link href={'/(tabs)/attendee-insights'} style={styles.viewAll}>
            View All
          </Link>
          <IconSymbol name="arrow.forward" size={12} color="#4338ca" />
        </View>
      </View>
      <View style={styles.cardsGrid}>
        {cards.map((card, index) => (
          <StatCard
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1f2937',
    letterSpacing: -0.3,
  },
  viewAll: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4338ca',
  },
  cardsGrid: {
    gap: 14,
  },
});