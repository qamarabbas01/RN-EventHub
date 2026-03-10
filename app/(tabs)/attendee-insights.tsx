import InsightsGrid from "@/components/InsightsGrid";
import MetricsSection from "@/components/MetricsSection";
import TopPerformingEvents from "@/components/TopPerformingEvents";
import { IconSymbol } from "@/components/ui/icon-symbol";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

const chartWidth = 700;

export default function AttendeeInsights() {
  const [selectedPeriod, setSelectedPeriod] = useState("6M");
  const periods = ["1M", "3M", "6M", "1Y"];

  const attendeeStats = [
    {
      label: "Total Attendees",
      value: 2840,
      trend: { value: "+15.3%", isPositive: true },
    },
    {
      label: "New Attendees",
      value: 520,
      trend: { value: "+8.2%", isPositive: true },
    },
    {
      label: "Returning",
      value: 1920,
      trend: { value: "+12.1%", isPositive: true },
    },
    {
      label: "Avg. Satisfaction",
      value: "4.8/5",
      trend: { value: "+0.3", isPositive: true },
    },
  ];

  const retentionData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [{ data: [100, 87, 72, 65], strokeWidth: 3 }],
  };

  const attendanceByDay = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ data: [320, 380, 420, 510, 485, 620, 380] }],
  };

  const eventTypeData = [
    {
      name: "Conferences",
      value: 1120,
      color: "#4f46e5",
      legendFontColor: "#7f8c8d",
      legendFontSize: 12,
    },
    {
      name: "Workshops",
      value: 890,
      color: "#a78bfa",
      legendFontColor: "#7f8c8d",
      legendFontSize: 12,
    },
    {
      name: "Networking",
      value: 550,
      color: "#c4b5fd",
      legendFontColor: "#7f8c8d",
      legendFontSize: 12,
    },
    {
      name: "Webinars",
      value: 280,
      color: "#ddd6fe",
      legendFontColor: "#7f8c8d",
      legendFontSize: 12,
    },
  ];

  const demographicsData = [
    {
      name: "18-25",
      value: 580,
      color: "#4f46e5",
      legendFontColor: "#7f8c8d",
      legendFontSize: 12,
    },
    {
      name: "26-35",
      value: 920,
      color: "#a78bfa",
      legendFontColor: "#7f8c8d",
      legendFontSize: 12,
    },
    {
      name: "36-45",
      value: 680,
      color: "#c4b5fd",
      legendFontColor: "#7f8c8d",
      legendFontSize: 12,
    },
    {
      name: "45+",
      value: 460,
      color: "#ddd6fe",
      legendFontColor: "#7f8c8d",
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(79,70,229,${opacity})`,
    labelColor: (opacity = 1) => `rgba(107,114,128,${opacity})`,
    propsForBackgroundLines: { stroke: "#f1f5f9", strokeDasharray: "4,4" },
    fillShadowGradient: "#7c3aed",
    fillShadowGradientOpacity: 0.35,
    decimalPlaces: 0,
    barPercentage: 0.65,
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: "#4f46e5",
      fill: "#ffffff",
    },
  };

  const feedbackData = [
    { name: "Excellent", count: 1850, percentage: 65, color: "#22c55e" },
    { name: "Good", count: 680, percentage: 24, color: "#6366f1" },
    { name: "Average", count: 230, percentage: 8, color: "#f59e0b" },
    { name: "Poor", count: 80, percentage: 3, color: "#ef4444" },
  ];

  const topEvents = [
    {
      title: "Tech Conference 2026",
      attendees: 450,
      revenue: "$18,900",
      satisfaction: "4.9",
      attendance: "90%",
    },
    {
      title: "AI & Machine Learning Summit",
      attendees: 320,
      revenue: "$15,200",
      satisfaction: "4.8",
      attendance: "85%",
    },
    {
      title: "Web Development Workshop",
      attendees: 120,
      revenue: "$5,400",
      satisfaction: "4.7",
      attendance: "80%",
    },
    {
      title: "Startup Networking Night",
      attendees: 95,
      revenue: "$3,800",
      satisfaction: "4.6",
      attendance: "76%",
    },
  ];

  const insightCards = [
    {
      icon: "crown.fill",
      label: "Premium Members",
      value: "420",
      color: "#fbbf24",
      bgColor: "#fef3c7",
    },
    {
      icon: "repeat.1",
      label: "Repeat Rate",
      value: "67.6%",
      color: "#3b82f6",
      bgColor: "#dbeafe",
    },
    {
      icon: "clock.fill",
      label: "Avg Check-in",
      value: "14 min",
      color: "#8b5cf6",
      bgColor: "#ede9fe",
    },
    {
      icon: "flag.fill",
      label: "Capacity",
      value: "94.7%",
      color: "#ec4899",
      bgColor: "#fce7f3",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Attendee Insights</Text>
          <Text style={styles.headerSubtitle}>
            Deep dive into attendee analytics & behavior
          </Text>
        </View>

        <View style={styles.periodFilter}>
          {periods.map((period) => (
            <Pressable
              key={period}
              onPress={() => setSelectedPeriod(period)}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period && styles.periodTextActive,
                ]}
              >
                {period}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <MetricsSection title="Key Metrics" cards={attendeeStats} />
        </View>

        <InsightsGrid cards={insightCards} styles={styles} />

        <View style={styles.section}>
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.sectionTitle}>Attendance Patterns</Text>
              <Text style={styles.subtitle}>
                Peak attendance by day of week
              </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Peak: Sat</Text>
            </View>
          </View>
          <View style={styles.chartWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <BarChart
                data={attendanceByDay}
                width={chartWidth}
                height={260}
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                showValuesOnTopOfBars={true}
                style={styles.chart}
                yAxisLabel="$"
                yAxisSuffix=""
              />
            </ScrollView>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.sectionTitle}>Retention Trends</Text>
              <Text style={styles.subtitle}>
                Session retention rate decline
              </Text>
            </View>
            <View style={styles.retentionBadge}>
              <Text style={styles.retentionValue}>-35%</Text>
            </View>
          </View>
          <View style={styles.chartWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <LineChart
                data={retentionData}
                width={chartWidth}
                height={260}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </ScrollView>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Type Performance</Text>
          <View style={styles.dataGrid}>
            {eventTypeData.map((item, index) => {
              const total = eventTypeData.reduce((sum, d) => sum + d.value, 0);
              const percentage = ((item.value / total) * 100).toFixed(0);
              return (
                <View key={index} style={styles.dataCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <View style={[styles.dataColorDot, { backgroundColor: item.color }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.dataLabel}>{item.name}</Text>
                      <Text style={styles.dataValue}>{item.value.toLocaleString()}</Text>
                    </View>
                    <Text style={styles.dataPercent}>{percentage}%</Text>
                  </View>
                  <View style={styles.dataBar}>
                    <View style={[styles.dataBarFill, { width: (parseInt(percentage) + '%') as any, backgroundColor: item.color }]} />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Age Demographics</Text>
          <View style={styles.dataGrid}>
            {demographicsData.map((item, index) => {
              const total = demographicsData.reduce((sum, d) => sum + d.value, 0);
              const percentage = ((item.value / total) * 100).toFixed(0);
              return (
                <View key={index} style={styles.dataCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <View style={[styles.dataColorDot, { backgroundColor: item.color }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.dataLabel}>{item.name}</Text>
                      <Text style={styles.dataValue}>{item.value.toLocaleString()}</Text>
                    </View>
                    <Text style={styles.dataPercent}>{percentage}%</Text>
                  </View>
                  <View style={styles.dataBar}>
                    <View style={[styles.dataBarFill, { width: (parseInt(percentage) + '%') as any, backgroundColor: item.color }]} />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <View style={styles.statHeader}>
              <IconSymbol name="arrow.up.right" size={16} color="#22c55e" />
              <Text style={styles.statLabel}>Growth Rate</Text>
            </View>
            <Text style={styles.statNumber}>+21.5%</Text>
            <Text style={styles.statDesc}>vs last period</Text>
          </View>

          <View style={styles.statBox}>
            <View style={styles.statHeader}>
              <IconSymbol name="calendar" size={16} color="#f59e0b" />
              <Text style={styles.statLabel}>Avg Events/Attendee</Text>
            </View>
            <Text style={styles.statNumber}>3.2</Text>
            <Text style={styles.statDesc}>per quarter</Text>
          </View>

          <View style={styles.statBox}>
            <View style={styles.statHeader}>
              <IconSymbol name="person.badge.plus" size={16} color="#3b82f6" />
              <Text style={styles.statLabel}>ACQ Cost</Text>
            </View>
            <Text style={styles.statNumber}>$12.50</Text>
            <Text style={styles.statDesc}>per attendee</Text>
          </View>

          <View style={styles.statBox}>
            <View style={styles.statHeader}>
              <IconSymbol name="checkmark.circle" size={16} color="#8b5cf6" />
              <Text style={styles.statLabel}>Completion Rate</Text>
            </View>
            <Text style={styles.statNumber}>92.3%</Text>
            <Text style={styles.statDesc}>fully attended</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feedback Sentiment</Text>
          {feedbackData.map((item, index) => (
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

        <TopPerformingEvents events={topEvents} styles={styles} />

        <View style={styles.section}>
          <View style={styles.engagementCard}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <View>
                <Text style={styles.engagementTitle}>Overall Engagement</Text>
                <Text style={styles.engagementSubtitle}>Score: 8.7/10</Text>
              </View>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreText}>87%</Text>
              </View>
            </View>
            <Text style={styles.engagementDesc}>
              Attendees are highly engaged with strong repeat attendance,
              positive feedback & consistent participation.
            </Text>
            <View style={styles.metricsRow}>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Repeat Rate</Text>
                <Text style={styles.metricValue}>67.6%</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Net Rating</Text>
                <Text style={styles.metricValue}>87%</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Satisfaction</Text>
                <Text style={styles.metricValue}>4.8★</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fffcfc" },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: { fontSize: 14, color: "#6b7280" },
  periodFilter: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  periodButtonActive: { backgroundColor: "#4f46e5" },
  periodText: { fontSize: 12, fontWeight: "600", color: "#6b7280" },
  periodTextActive: { color: "#fff" },
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.2,
    paddingHorizontal: 16,
  },
  subtitle: { fontSize: 12, color: "#9ca3af", marginTop: 2, paddingHorizontal: 16 },
  badge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 10,
  },
  badgeText: { fontSize: 11, fontWeight: "600", color: "#0369a1" },
  retentionBadge: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 10,
  },
  retentionValue: { fontSize: 12, fontWeight: "700", color: "#991b1b" },
  chartWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 10,
  },
  chart: { marginVertical: 8, borderRadius: 12 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    marginVertical: 16,
    gap: 10,
  },
  statBox: {
    flex: 1,
    minWidth: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  statLabel: { fontSize: 10, fontWeight: "600", color: "#6b7280" },
  statNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 2,
  },
  statDesc: { fontSize: 10, color: "#9ca3af", fontWeight: "500" },
  feedbackRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  feedbackDot: { width: 8, height: 8, borderRadius: 4 },
  feedbackLabel: { fontSize: 12, fontWeight: "600", color: "#111827" },
  feedbackCount: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6b7280",
    minWidth: 30,
  },
  feedbackBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: "#f3f4f6",
    borderRadius: 3,
    overflow: "hidden",
    marginHorizontal: 8,
  },
  feedbackBar: { height: "100%", borderRadius: 3 },
  feedbackPercent: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6b7280",
    minWidth: 25,
    textAlign: "right",
  },
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingHorizontal: 16,
    gap: 10,
  },
  eventRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4f46e5",
    justifyContent: "center",
    alignItems: "center",
  },
  rankText: { fontSize: 13, fontWeight: "700", color: "#fff" },
  eventContent: { flex: 1 },
  eventTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 5,
  },
  eventMetrics: { flexDirection: "row", alignItems: "center", gap: 5 },
  metric: { flexDirection: "row", alignItems: "center", gap: 3 },
  metricText: { fontSize: 10, fontWeight: "500", color: "#6b7280" },
  separator: { fontSize: 7, color: "#d1d5db" },
  attendanceRating: {
    backgroundColor: "#f0f4ff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#c7d2fe",
  },
  attendanceText: { fontSize: 11, fontWeight: "700", color: "#4f46e5" },
  engagementCard: {
    backgroundColor: "#f0f4ff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e7ff",
  },
  engagementTitle: { fontSize: 14, fontWeight: "700", color: "#111827" },
  engagementSubtitle: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4f46e5",
    justifyContent: "center",
    alignItems: "center",
  },
  scoreText: { fontSize: 16, fontWeight: "800", color: "#fff" },
  engagementDesc: {
    fontSize: 12,
    color: "#6b7280",
    marginVertical: 12,
    lineHeight: 18,
  },
  metricsRow: { flexDirection: "row", gap: 10 },
  metricBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e7ff",
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 4,
  },
  metricValue: { fontSize: 14, fontWeight: "800", color: "#4f46e5" },
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
