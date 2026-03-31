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
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.dataGrid}>
        {data.map((item, index) => {
          const total = data.reduce((sum, d) => sum + d.value, 0);
          const percentage = ((item.value / total) * 100).toFixed(0);
          return (
            <View key={index} style={styles.dataCard}>
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
                  <Text style={styles.dataLabel}>{item.name}</Text>
                  <Text style={styles.dataValue}>{item.value.toLocaleString()}</Text>
                </View>
                <Text style={styles.dataPercent}>{percentage}%</Text>
              </View>
              <View style={styles.dataBar}>
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
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 0,
    paddingRight: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.2,
    paddingHorizontal: 16,
  },
  dataGrid: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  dataCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  dataColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dataLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6b7280",
  },
  dataValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
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
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    overflow: "hidden",
  },
  dataBarFill: {
    height: "100%",
    borderRadius: 3,
  },
});
