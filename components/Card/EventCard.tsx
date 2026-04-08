import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '../ui/icon-symbol';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: any;
  location: string;
  image?: string;
  status?: 'upcoming' | 'live' | 'ended';
  onPress?: () => void;
}

export default function EventCard({
  title,
  date,
  time,
  location,
  image,
  status = 'upcoming',
  onPress,
}: EventCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const statusColors = {
    upcoming: { bg: '#dbeafe', text: '#0369a1' },
    live: { bg: '#fecaca', text: '#991b1b' },
    ended: { bg: '#e5e7eb', text: '#6b7280' },
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: isDark ? "#0b1220" : "#fff" }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {image ? (
          <>
            <Image source={{ uri: image }} style={styles.image} />
            <LinearGradient
              colors={["rgba(99,102,241,0.55)", "rgba(255,255,255,0.05)"]}
              style={styles.imageOverlay}
            />
          </>
        ) : (
          <View style={[styles.image, styles.imagePlaceholder, { backgroundColor: isDark ? "#0f172a" : "#f9fafb" }]}>
            <IconSymbol name="calendar" size={48} color="#9ca3af" />
          </View>
        )}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColors[status].bg },
          ]}
        >
          <Text style={[styles.statusText, { color: statusColors[status].text }]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: isDark ? "#e5e7eb" : "#1e293b" }]} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.detailRow}>
          <IconSymbol name="calendar" size={14} color="#6b7280" />
          <Text style={[styles.detailText, { color: isDark ? "#9ca3af" : "#64748b" }]}>{date}</Text>
        </View>
        <View style={styles.detailRow}>
          <IconSymbol name="clock" size={14} color="#6b7280" />
          <Text style={[styles.detailText, { color: isDark ? "#9ca3af" : "#64748b" }]}>{time}</Text>
        </View>
        <View style={styles.detailRow}>
          <IconSymbol name="location.fill" size={14} color="#6b7280" />
          <Text style={[styles.detailText, { color: isDark ? "#9ca3af" : "#64748b" }]} numberOfLines={1}>
            {location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
    borderWidth: 0,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 210,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f9fafb',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  content: {
    padding: 18,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 10,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    flex: 1,
  },
  footerRow: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#e0e7ff',
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  attendeesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attendeeIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attendeeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  capacityBar: {
    height: 5,
    width: 60,
    backgroundColor: '#e0e7ff',
    borderRadius: 3,
    overflow: 'hidden',
  },
  capacityFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 3,
  },
});