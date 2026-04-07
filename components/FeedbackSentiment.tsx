import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface FeedbackItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface FeedbackSentimentProps {
  data: FeedbackItem[];
}

export default function FeedbackSentiment({
  data,
}: FeedbackSentimentProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <View
      style={[
        styles.section,
        { backgroundColor: isDark ? "#0b1220" : "#fff", borderColor: isDark ? "#111827" : "#f3f4f6" },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: isDark ? "#e5e7eb" : "#111827" }]}>
        Feedback Sentiment
      </Text>
      {data.map((item, index) => (
        <View
          key={index}
          style={[
            styles.feedbackRow,
            { borderBottomColor: isDark ? "#111827" : "#f3f4f6" },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              flex: 1,
            }}
          >
            <View
              style={[styles.feedbackDot, { backgroundColor: item.color }]}
            />
            <Text style={[styles.feedbackLabel, { color: isDark ? "#9ca3af" : "#6b7280" }]}>{item.name}</Text>
          </View>
          <Text style={[styles.feedbackCount, { color: isDark ? "#e5e7eb" : "#111827" }]}>{item.count}</Text>
          <View style={[styles.feedbackBarContainer, { backgroundColor: isDark ? "#111827" : "#e5e7eb" }]}>
            <View
              style={[
                styles.feedbackBar,
                {
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                },
              ]}
            />
          </View>
          <Text style={[styles.feedbackPercent, { color: isDark ? "#e5e7eb" : "#111827" }]}>
            {item.percentage}%
          </Text>
        </View>
      ))}
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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.2,
    paddingHorizontal: 16,
  },
  feedbackRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  feedbackDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  feedbackLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  feedbackCount: {
    fontSize: 11,
    fontWeight: "700",
    width: 40,
    textAlign: "right",
  },
  feedbackBarContainer: {
    width: 60,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  feedbackBar: {
    height: "100%",
    borderRadius: 3,
  },
  feedbackPercent: {
    fontSize: 11,
    fontWeight: "700",
    width: 40,
    textAlign: "right",
  },
});
