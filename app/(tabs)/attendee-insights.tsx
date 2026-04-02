import DataPerformanceGrid from "@/components/DataPerformanceGrid";
import FeedbackSentiment from "@/components/FeedbackSentiment";
import InsightsGrid from "@/components/InsightsGrid";
import MetricsSection from "@/components/MetricsSection";
import StatsGrid from "@/components/StatsGrid";
import TopPerformingEvents from "@/components/TopPerformingEvents";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebase";

const chartWidth = 700;

export default function AttendeeInsights() {
  const [selectedPeriod, setSelectedPeriod] = useState("6M");
  const periods = ["1M", "3M", "6M", "1Y"];

  const [attendeeStats, setAttendeeStats] = useState([
    { label: "Total Attendees", value: 0, trend: { value: "", isPositive: true } },
    { label: "New Attendees", value: 0, trend: { value: "", isPositive: true } },
    { label: "Returning", value: 0, trend: { value: "", isPositive: true } },
    { label: "Avg. Satisfaction", value: "-", trend: { value: "", isPositive: true } },
  ]);

  useEffect(() => {
    async function fetchAttendees() {
      const querySnapshot = await getDocs(collection(db, "attendees"));
      const attendees = querySnapshot.docs.map(doc => doc.data());
      const total = attendees.length;
      const now = new Date();
      const newAttendees = attendees.filter(a => {
        if (!a.createdAt) return false;
        const created = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
        return (now.getTime() - created.getTime()) < 30 * 24 * 60 * 60 * 1000;
      }).length;
      const returning = attendees.filter(a => Array.isArray(a.eventsAttended) && a.eventsAttended.length > 1).length;
      const avgSatisfaction = attendees.length > 0 ? (attendees.reduce((sum, a) => sum + (a.satisfaction || 0), 0) / attendees.length).toFixed(2) : "-";
      setAttendeeStats([
        { label: "Total Attendees", value: total, trend: { value: "", isPositive: true } },
        { label: "New Attendees", value: newAttendees, trend: { value: "", isPositive: true } },
        { label: "Returning", value: returning, trend: { value: "", isPositive: true } },
        { label: "Avg. Satisfaction", value: avgSatisfaction + "/5", trend: { value: "", isPositive: true } },
      ]);
    }
    fetchAttendees();
  }, []);


  const [attendanceByDay, setAttendanceByDay] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
  });

  const [retentionData, setRetentionData] = useState({
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [{ data: [0, 0, 0, 0], strokeWidth: 3 }],
  });

  useEffect(() => {
    async function fetchAttendancePatterns() {
      const snapshot = await getDocs(collection(db, "eventAttendance"));
      const attendance = snapshot.docs.map(doc => doc.data());
      const dayCounts = [0, 0, 0, 0, 0, 0, 0];
      attendance.forEach(a => {
        const d = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
        const day = d.getDay();
        dayCounts[(day + 6) % 7] += 1;
      });
      setAttendanceByDay({
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{ data: dayCounts }],
      });
    }
    async function fetchRetentionTrends() {
      const snapshot = await getDocs(collection(db, "retention"));
      const retention = snapshot.docs.map(doc => doc.data());
      const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
      const weekData = [0, 0, 0, 0];
      retention.forEach(r => {
        if (r.week >= 1 && r.week <= 4) weekData[r.week - 1] = r.retained;
      });
      setRetentionData({
        labels: weekLabels,
        datasets: [{ data: weekData, strokeWidth: 3 }],
      });
    }
    fetchAttendancePatterns();
    fetchRetentionTrends();
  }, []);

  const [eventTypeData, setEventTypeData] = useState([
    { name: "Conferences", value: 0, color: "#4f46e5", legendFontColor: "#7f8c8d", legendFontSize: 12 },
    { name: "Workshops", value: 0, color: "#a78bfa", legendFontColor: "#7f8c8d", legendFontSize: 12 },
    { name: "Networking", value: 0, color: "#c4b5fd", legendFontColor: "#7f8c8d", legendFontSize: 12 },
    { name: "Webinars", value: 0, color: "#ddd6fe", legendFontColor: "#7f8c8d", legendFontSize: 12 },
  ]);

  const [demographicsData, setDemographicsData] = useState([
    { name: "18-25", value: 0, color: "#4f46e5", legendFontColor: "#7f8c8d", legendFontSize: 12 },
    { name: "26-35", value: 0, color: "#a78bfa", legendFontColor: "#7f8c8d", legendFontSize: 12 },
    { name: "36-45", value: 0, color: "#c4b5fd", legendFontColor: "#7f8c8d", legendFontSize: 12 },
    { name: "45+", value: 0, color: "#ddd6fe", legendFontColor: "#7f8c8d", legendFontSize: 12 },
  ]);

  useEffect(() => {
    async function fetchEventTypeData() {
      const snapshot = await getDocs(collection(db, "eventTypes"));
      const types = snapshot.docs.map(doc => doc.data());
      const colorMap = {
        "Conferences": "#4f46e5",
        "Workshops": "#a78bfa",
        "Networking": "#c4b5fd",
        "Webinars": "#ddd6fe",
      };
      const mapped = ["Conferences", "Workshops", "Networking", "Webinars"].map(type => {
        const found = types.find(t => t.name === type);
        return {
          name: type,
          value: found ? found.value : 0,
          color: colorMap[type as keyof typeof colorMap],
          legendFontColor: "#7f8c8d",
          legendFontSize: 12,
        };
      });
      setEventTypeData(mapped);
    }
    async function fetchDemographicsData() {
      const snapshot = await getDocs(collection(db, "demographics"));
      const demos = snapshot.docs.map(doc => doc.data());
      const colorMap = {
        "18-25": "#4f46e5",
        "26-35": "#a78bfa",
        "36-45": "#c4b5fd",
        "45+": "#ddd6fe",
      };
      const mapped = ["18-25", "26-35", "36-45", "45+"].map(age => {
        const found = demos.find(d => d.name === age);
        return {
          name: age,
          value: found ? found.value : 0,
          color: colorMap[age as keyof typeof colorMap],
          legendFontColor: "#7f8c8d",
          legendFontSize: 12,
        };
      });
      setDemographicsData(mapped);
    }
    fetchEventTypeData();
    fetchDemographicsData();
  }, []);

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

  const [feedbackData, setFeedbackData] = useState([
    { name: "Excellent", count: 0, percentage: 0, color: "#22c55e" },
    { name: "Good", count: 0, percentage: 0, color: "#6366f1" },
    { name: "Average", count: 0, percentage: 0, color: "#f59e0b" },
    { name: "Poor", count: 0, percentage: 0, color: "#ef4444" },
  ]);

  const [topEvents, setTopEvents] = useState<any[]>([]);

  useEffect(() => {
    async function fetchFeedbackData() {
      const snapshot = await getDocs(collection(db, "feedbackStats"));
      const stats = snapshot.docs.map(doc => doc.data());
      const colorMap = {
        "Excellent": "#22c55e",
        "Good": "#6366f1",
        "Average": "#f59e0b",
        "Poor": "#ef4444",
      };
      const mapped = ["Excellent", "Good", "Average", "Poor"].map(type => {
        const found = stats.find(s => s.name === type);
        return {
          name: type,
          count: found ? found.count : 0,
          percentage: found ? found.percentage : 0,
          color: colorMap[type as keyof typeof colorMap],
        };
      });
      setFeedbackData(mapped);
    }
    async function fetchTopEvents() {

      const snapshot = await getDocs(collection(db, "topEvents"));
      setTopEvents(snapshot.docs.map(doc => doc.data()));
    }
    fetchFeedbackData();
    fetchTopEvents();
  }, []);

  const [insightCards, setInsightCards] = useState([
    { icon: "crown.fill", label: "Premium Members", value: "0", color: "#fbbf24", bgColor: "#fef3c7" },
    { icon: "repeat.1", label: "Repeat Rate", value: "0%", color: "#3b82f6", bgColor: "#dbeafe" },
    { icon: "clock.fill", label: "Avg Check-in", value: "0 min", color: "#8b5cf6", bgColor: "#ede9fe" },
    { icon: "flag.fill", label: "Capacity", value: "0%", color: "#ec4899", bgColor: "#fce7f3" },
  ]);

  const [statsData, setStatsData] = useState([
    { icon: "arrow.up.right", label: "Growth Rate", number: "0%", desc: "vs last period", iconColor: "#22c55e" },
    { icon: "calendar", label: "Avg Events/Attendee", number: "0", desc: "per quarter", iconColor: "#f59e0b" },
    { icon: "person.badge.plus", label: "ACQ Cost", number: "$0.00", desc: "per attendee", iconColor: "#3b82f6" },
    { icon: "checkmark.circle", label: "Completion Rate", number: "0%", desc: "fully attended", iconColor: "#8b5cf6" },
  ]);

  useEffect(() => {
    async function fetchInsightCards() {
      const snapshot = await getDocs(collection(db, "insightCards"));
      const cards = snapshot.docs.map(doc => doc.data());
      const order = ["Premium Members", "Repeat Rate", "Avg Check-in", "Capacity"];
      const mapped = order.map(label => {
        const found = cards.find(c => c.label === label);
        if (found && typeof found.icon === "string" && typeof found.label === "string" && typeof found.value === "string" && typeof found.color === "string" && typeof found.bgColor === "string") {
          return {
            icon: found.icon,
            label: found.label,
            value: found.value,
            color: found.color,
            bgColor: found.bgColor,
          };
        }
        return insightCards.find(c => c.label === label)!;
      });
      setInsightCards(mapped);
    }
    async function fetchStatsData() {
      const snapshot = await getDocs(collection(db, "statsData"));
      const stats = snapshot.docs.map(doc => doc.data());
      const order = ["Growth Rate", "Avg Events/Attendee", "ACQ Cost", "Completion Rate"];
      const mapped = order.map(label => {
        const found = stats.find(s => s.label === label);
        if (found && typeof found.icon === "string" && typeof found.label === "string" && typeof found.number === "string" && typeof found.desc === "string" && typeof found.iconColor === "string") {
          return {
            icon: found.icon,
            label: found.label,
            number: found.number,
            desc: found.desc,
            iconColor: found.iconColor,
          };
        }
        return statsData.find(s => s.label === label)!;
      });
      setStatsData(mapped);
    }
    fetchInsightCards();
    fetchStatsData();
  }, [insightCards, statsData]);

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
