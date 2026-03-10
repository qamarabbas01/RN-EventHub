import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { Text, View } from "react-native";

interface Stat {
  icon: string;
  label: string;
  number: string;
  desc: string;
  iconColor: string;
}

interface StatsGridProps {
  stats: Stat[];
  styles: any;
}

export default function StatsGrid({ stats, styles }: StatsGridProps) {
  return (
    <View style={styles.statsGrid}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statBox}>
          <View style={styles.statHeader}>
            <IconSymbol name={stat.icon as any} size={16} color={stat.iconColor} />
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
          <Text style={styles.statNumber}>{stat.number}</Text>
          <Text style={styles.statDesc}>{stat.desc}</Text>
        </View>
      ))}
    </View>
  );
}
