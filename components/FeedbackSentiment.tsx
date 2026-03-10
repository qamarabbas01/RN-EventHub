import React from "react";
import { StyleSheet, Text, View } from "react-native";

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
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Feedback Sentiment</Text>
      {data.map((item, index) => (
        <View key={index} style={styles.feedbackRow}>
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
            <Text style={styles.feedbackLabel}>{item.name}</Text>
          </View>
          <Text style={styles.feedbackCount}>{item.count}</Text>
          <View style={styles.feedbackBarContainer}>
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
          <Text style={styles.feedbackPercent}>{item.percentage}%</Text>
        </View>
      ))}
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
  feedbackRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
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
    color: "#6b7280",
  },
  feedbackCount: {
    fontSize: 11,
    fontWeight: "700",
    color: "#111827",
    width: 40,
    textAlign: "right",
  },
  feedbackBarContainer: {
    width: 60,
    height: 6,
    backgroundColor: "#e5e7eb",
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
    color: "#111827",
    width: 40,
    textAlign: "right",
  },
});
