import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Event {
  title: string;
  attendees: number;
  revenue: string;
  satisfaction: string;
  attendance: string;
}

interface TopPerformingEventsProps {
  events: Event[];
}

export default function TopPerformingEvents({ events }: TopPerformingEventsProps) {
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
        Top Performing Events
      </Text>
      {events.map((event, index) => (
        <View
          key={index}
          style={[
            styles.eventCard,
            { borderBottomColor: isDark ? "#111827" : "#f3f4f6" },
          ]}
        >
          <View style={styles.eventRank}>
            <Text style={styles.rankText}>{index + 1}</Text>
          </View>
          <View style={styles.eventContent}>
            <Text style={[styles.eventTitle, { color: isDark ? "#e5e7eb" : "#111827" }]} numberOfLines={1}>
              {event.title}
            </Text>
            <View style={styles.eventMetrics}>
              <View style={styles.metric}>
                <IconSymbol
                  name="person.2.fill"
                  size={11}
                  color={isDark ? "#9ca3af" : "#6b7280"}
                />
                <Text style={[styles.metricText, { color: isDark ? "#9ca3af" : "#6b7280" }]}>{event.attendees}</Text>
              </View>
              <Text style={styles.separator}>•</Text>
              <View style={styles.metric}>
                <IconSymbol
                  name="dollarsign.circle"
                  size={11}
                  color={isDark ? "#9ca3af" : "#6b7280"}
                />
                <Text style={[styles.metricText, { color: isDark ? "#9ca3af" : "#6b7280" }]}>{event.revenue}</Text>
              </View>
              <Text style={styles.separator}>•</Text>
              <View style={styles.metric}>
                <IconSymbol name="star.fill" size={11} color={isDark ? "#9ca3af" : "#6b7280"} />
                <Text style={[styles.metricText, { color: isDark ? "#9ca3af" : "#6b7280" }]}>{event.satisfaction}</Text>
              </View>
            </View>
          </View>
          <View style={styles.attendanceRating}>
            <Text style={styles.attendanceText}>{event.attendance}</Text>
          </View>
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
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
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
    marginBottom: 5,
  },
  eventMetrics: { flexDirection: "row", alignItems: "center", gap: 5 },
  metric: { flexDirection: "row", alignItems: "center", gap: 3 },
  metricText: { fontSize: 10, fontWeight: "500" },
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
});
