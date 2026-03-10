import React from "react";
import { Text, View } from "react-native";

interface DataItem {
  name: string;
  value: number;
  color: string;
}

interface DataPerformanceGridProps {
  title: string;
  data: DataItem[];
  styles: any;
}

export default function DataPerformanceGrid({
  title,
  data,
  styles,
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
