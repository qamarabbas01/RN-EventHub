import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface DataItem {
  name: string;
  value: number;
  color: string;
}

interface DataPerformanceGridProps {
  title: string;
  data: DataItem[];
}

export default function DataPerformanceGrid({
  title,
  data,
}: DataPerformanceGridProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <View
      style={[
        styles.section,
        {
          backgroundColor: isDark ? "#0b1220" : "#fff",
          borderColor: isDark ? "#111827" : "#f3f4f6",
        },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: isDark ? "#e5e7eb" : "#111827" }]}>
        {title}
      </Text>
      <View style={styles.dataGrid}>
        {data.map((item, index) => {
          const total = data.reduce((sum, d) => sum + d.value, 0);
          const percentage = ((item.value / total) * 100).toFixed(0);
          return (
            <View
              key={index}
              style={[
                styles.dataCard,
                {
                  backgroundColor: isDark ? "#0f172a" : "#f9fafb",
                  borderColor: isDark ? "#111827" : "#f3f4f6",
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <View
                  style={[styles.dataColorDot, { backgroundColor: item.color }]}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.dataLabel, { color: isDark ? "#9ca3af" : "#6b7280" }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.dataValue, { color: isDark ? "#e5e7eb" : "#111827" }]}>
                    {item.value.toLocaleString()}
                  </Text>
                </View>
                <Text style={styles.dataPercent}>{percentage}%</Text>
              </View>
              <View style={[styles.dataBar, { backgroundColor: isDark ? "#111827" : "#e5e7eb" }]}>
                <View
                  style={[
                    styles.dataBarFill,
                    {
                      width: (parseInt(percentage) + "%") as any,
                      backgroundColor: item.color,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 0,
    paddingRight: 0,
    shadowColor: "#63f23",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.2,
    paddingHorizontal: 16,
  },
  dataGrid: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  dataCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  dataColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dataLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  dataValue: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  dataPercent: {
    fontSize: 13,
    fontWeight: "800",
    color: "#4f46e5",
  },
  dataBar: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  dataBarFill: {
    height: "100%",
    borderRadius: 3,
  },
});
