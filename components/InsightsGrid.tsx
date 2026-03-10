import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface InsightCard {
  icon: string;
  label: string;
  value: string;
  color: string;
  bgColor: string;
}

interface InsightsGridProps {
  cards: InsightCard[];
}

export default function InsightsGrid({ cards }: InsightsGridProps) {
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

const styles = StyleSheet.create({
  insightsGrid: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  insightCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  insightLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 3,
    textAlign: "center",
  },
  insightValue: { fontSize: 14, fontWeight: "800", color: "#111827" },
});
