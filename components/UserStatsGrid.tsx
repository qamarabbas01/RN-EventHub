import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Stat {
  icon: string;
  label: string;
  value: string;
}

interface UserStatsGridProps {
  stats: Stat[];
}

export default function UserStatsGrid({ stats }: UserStatsGridProps) {
  const colors = [
    { bg: "#ede9fe", icon: "#8b5cf6" },
    { bg: "#f0f4ff", icon: "#3b82f6" },
    { bg: "#fef3c7", icon: "#d97706" },
  ];

  return (
    <View style={styles.statsContainer}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statCard}>
          <View
            style={[
              styles.statIconBg,
              {
                backgroundColor: colors[index]?.bg || colors[0].bg,
              },
            ]}
          >
            <IconSymbol
              name={stat.icon as any}
              size={20}
              color={colors[index]?.icon || colors[0].icon}
            />
          </View>
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6b7280",
    textAlign: "center",
  },
});
