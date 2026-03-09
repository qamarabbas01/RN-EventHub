import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '../ui/icon-symbol';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  image?: string;
  status?: 'upcoming' | 'live' | 'ended';
  capacity?: number;
  onPress?: () => void;
}

export default function EventCard({
  title,
  date,
  time,
  location,
  attendees,
  image,
  status = 'upcoming',
  capacity,
  onPress,
}: EventCardProps) {
  const occupancyPercent = capacity ? (attendees / capacity) * 100 : 0;

  const statusColors = {
    upcoming: { bg: '#dbeafe', text: '#0369a1' },
    live: { bg: '#fecaca', text: '#991b1b' },
    ended: { bg: '#e5e7eb', text: '#6b7280' },
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
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
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        <View style={styles.detailRow}>
          <IconSymbol name="calendar" size={14} color="#6b7280" />
          <Text style={styles.detailText}>
            {date}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <IconSymbol name="clock" size={14} color="#6b7280" />
          <Text style={styles.detailText}>{time}</Text>
        </View>

        <View style={styles.detailRow}>
          <IconSymbol name="location.fill" size={14} color="#6b7280" />
          <Text style={styles.detailText} numberOfLines={1}>
            {location}
          </Text>
        </View>

        <View style={styles.footerRow}>
          <View style={styles.attendeesSection}>
            <View style={styles.attendeeIcon}>
              <IconSymbol name="person.fill" size={12} color="#fff" />
            </View>
            <Text style={styles.attendeeText}>
              {attendees}
              {capacity && ` / ${capacity}`}
            </Text>
          </View>

          {capacity && (
            <View style={styles.capacityBar}>
              <View
                style={[
                  styles.capacityFill,
                  { width: `${Math.min(occupancyPercent, 100)}%` },
                ]}
              />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },

  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
  },

  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f9fafb',
  },

  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },

  content: {
    padding: 12,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 20,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },

  detailText: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },

  footerRow: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 10,
  },

  attendeesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },

  attendeeIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  attendeeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },

  capacityBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },

  capacityFill: {
    height: '100%',
    backgroundColor: '#4f46e5',
    borderRadius: 2,
  },
});