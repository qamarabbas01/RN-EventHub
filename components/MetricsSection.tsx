import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StatCard from './Card/StatCard';

interface MetricCard {
  label: string;
  value: string | number;
  iconName: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconBg?: string;
  iconColor?: string;
}

interface MetricsSectionProps {
  title: string;
  cards: MetricCard[];
}

export default function MetricsSection({ title, cards }: MetricsSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.cardsGrid}>
        {cards.map((card, index) => (
          <StatCard
            key={index}
            label={card.label}
            value={card.value}
            iconName={card.iconName as any}
            trend={card.trend}
            iconBg={card.iconBg}
            iconColor={card.iconColor}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  cardsGrid: {
    gap: 12,
  },
});