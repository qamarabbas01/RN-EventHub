import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { mockEvents } from '../../data/mockEvents';

export default function EventDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const event = mockEvents.find(e => e.id === id);

  if (!event) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Event not found</Text>
      </View>
    );
  }

  const statusColors = {
    upcoming: { bg: '#dbeafe', text: '#0369a1' },
    live: { bg: '#fecaca', text: '#991b1b' },
    ended: { bg: '#e5e7eb', text: '#6b7280' },
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: event.imageUrl }} style={styles.image} />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={[styles.statusBadge, { backgroundColor: statusColors[event.status as keyof typeof statusColors].bg }]}> 
            <Text style={[styles.statusText, { color: statusColors[event.status as keyof typeof statusColors].text }]}> 
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>{event.title}</Text>
          <View style={styles.row}>
            <Ionicons name="calendar" size={18} color="#6366f1" style={styles.icon} />
            <Text style={styles.meta}>{event.date}</Text>
            <Ionicons name="time" size={18} color="#6366f1" style={styles.icon} />
            <Text style={styles.meta}>{event.time}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="location" size={18} color="#6366f1" style={styles.icon} />
            <Text style={styles.meta}>{event.location}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="people" size={18} color="#6366f1" style={styles.icon} />
            <Text style={styles.meta}>{event.attendees} Attending</Text>
            {event.capacity && (
              <Text style={styles.meta}>/ {event.capacity} Capacity</Text>
            )}
          </View>
          <Text style={styles.description}>{event.description}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2ff',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  imageWrapper: {
    width: '100%',
    height: 260,
    position: 'relative',
    marginBottom: -32,
    zIndex: 2,
  },
  image: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    objectFit: 'cover',
  },
  backBtn: {
    position: 'absolute',
    top: 36,
    left: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  statusBadge: {
    position: 'absolute',
    top: 36,
    right: 18,
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
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 18,
    marginTop: -32,
    borderRadius: 22,
    padding: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'center',
  },
  icon: {
    marginHorizontal: 4,
  },
  meta: {
    fontSize: 15,
    color: '#6366f1',
    fontWeight: '700',
    marginHorizontal: 2,
  },
  description: {
    marginTop: 18,
    fontSize: 15,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 22,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  notFound: {
    fontSize: 18,
    color: '#991b1b',
    fontWeight: '700',
  },
});