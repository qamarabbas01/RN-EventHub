import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { Text, View } from "react-native";

interface Event {
  title: string;
  attendees: number;
  revenue: string;
  satisfaction: string;
  attendance: string;
}

interface TopPerformingEventsProps {
  events: Event[];
  styles: any;
}

export default function TopPerformingEvents({ events, styles }: TopPerformingEventsProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Top Performing Events</Text>
      {events.map((event, index) => (
        <View key={index} style={styles.eventCard}>
          <View style={styles.eventRank}>
            <Text style={styles.rankText}>{index + 1}</Text>
          </View>
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle} numberOfLines={1}>
              {event.title}
            </Text>
            <View style={styles.eventMetrics}>
              <View style={styles.metric}>
                <IconSymbol
                  name="person.2.fill"
                  size={11}
                  color="#6b7280"
                />
                <Text style={styles.metricText}>{event.attendees}</Text>
              </View>
              <Text style={styles.separator}>•</Text>
              <View style={styles.metric}>
                <IconSymbol
                  name="dollarsign.circle"
                  size={11}
                  color="#6b7280"
                />
                <Text style={styles.metricText}>{event.revenue}</Text>
              </View>
              <Text style={styles.separator}>•</Text>
              <View style={styles.metric}>
                <IconSymbol name="star.fill" size={11} color="#6b7280" />
                <Text style={styles.metricText}>{event.satisfaction}</Text>
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
