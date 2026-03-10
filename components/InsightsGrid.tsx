import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { Text, View } from "react-native";

interface InsightCard {
  icon: string;
  label: string;
  value: string;
  color: string;
  bgColor: string;
}

interface InsightsGridProps {
  cards: InsightCard[];
  styles: any;
}

export default function InsightsGrid({ cards, styles }: InsightsGridProps) {
  return (
    <View style={styles.insightsGrid}>
      {cards.map((card, index) => (
        <View key={index} style={styles.insightCard}>
          <View
            style={[styles.insightIcon, { backgroundColor: card.bgColor }]}
          >
            <IconSymbol
              name={card.icon as any}
              size={20}
              color={card.color}
            />
          </View>
          <Text style={styles.insightLabel}>{card.label}</Text>
          <Text style={styles.insightValue}>{card.value}</Text>
        </View>
      ))}
    </View>
  );
}
