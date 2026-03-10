import React from "react";
import { Text, View } from "react-native";

interface FeedbackItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface FeedbackSentimentProps {
  data: FeedbackItem[];
  styles: any;
}

export default function FeedbackSentiment({
  data,
  styles,
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
