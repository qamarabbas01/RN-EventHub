import DataPerformanceGrid from "@/components/DataPerformanceGrid";
import FeedbackSentiment from "@/components/FeedbackSentiment";
import InsightsGrid from "@/components/InsightsGrid";
import MetricsSection from "@/components/MetricsSection";
import StatsGrid from "@/components/StatsGrid";
import TopPerformingEvents from "@/components/TopPerformingEvents";
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
    datasets: [{ data: [320, 380, 420, 510, 485, 820, 380] }],
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

  const statsData = [
    {
      icon: "arrow.up.right",
      label: "Growth Rate",
      number: "+21.5%",
      desc: "vs last period",
      iconColor: "#22c55e",
    },
    {
      icon: "calendar",
      label: "Avg Events/Attendee",
      number: "3.2",
      desc: "per quarter",
      iconColor: "#f59e0b",
    },
    {
      icon: "person.badge.plus",
      label: "ACQ Cost",
      number: "$12.50",
      desc: "per attendee",
      iconColor: "#3b82f6",
    },
    {
      icon: "checkmark.circle",
      label: "Completion Rate",
      number: "92.3%",
      desc: "fully attended",
      iconColor: "#8b5cf6",
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

        <InsightsGrid cards={insightCards} />

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

        <DataPerformanceGrid title="Event Type Performance" data={eventTypeData} />

        <DataPerformanceGrid title="Age Demographics" data={demographicsData} />

        <StatsGrid stats={statsData} />

        <FeedbackSentiment data={feedbackData} />

        <TopPerformingEvents events={topEvents} />

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
  container: { flex: 1, backgroundColor: "#eef2ff" },
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
});
