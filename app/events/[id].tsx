import EventForm from '@/components/EventForm';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../firebase';

export default function EventDetails() {
  const renderDate = (dateVal: any, timeVal?: any) => {
    if (timeVal && typeof timeVal === 'object' && timeVal.seconds) {
      const dateObj = new Date(timeVal.seconds * 1000);
      return dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    }
    if (typeof timeVal === 'string' && timeVal.trim() !== '') {
      const parsed = new Date(timeVal);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      }
    }

    if (dateVal && typeof dateVal === 'object' && dateVal.seconds) {
      const dateObj = new Date(dateVal.seconds * 1000);
      return dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    }
    if (typeof dateVal === 'string' && dateVal.trim() !== '') {
      const parsed = new Date(dateVal);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      }
      return dateVal;
    }
    return 'N/A';
  };

  const renderTime = (val: any) => {
    if (!val) return 'N/A';
    if (typeof val === 'object' && val.seconds) {
      const dateObj = new Date(val.seconds * 1000);
      return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (typeof val === 'string' && val.trim() !== '') {
      const timeOnlyMatch = val.trim().match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);
      if (timeOnlyMatch) {
        return `${timeOnlyMatch[1]}:${timeOnlyMatch[2]} ${timeOnlyMatch[3].toUpperCase()}`;
      }
      const dateFromString = new Date(val);
      if (!isNaN(dateFromString.getTime())) {
        return dateFromString.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return val;
    }
    const dateObj = new Date(val);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return 'N/A';
  };
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [event, setEvent] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [editModal, setEditModal] = useState(false);

  React.useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    getDoc(doc(db, "events", String(id)))
      .then((docSnap) => {
        if (docSnap.exists()) {
          setEvent({ id, ...docSnap.data() });
        } else {
          setEvent(null);
        }
      })
      .catch((err) => {
        setError("Failed to load event");
        setEvent(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const safe = (val: any, fallback = 'N/A') => {
    if (val === null || val === undefined || val === '') return fallback;
    if (typeof val === 'object' && val.seconds) {
      const dateObj = new Date(val.seconds * 1000);
      if (val.nanoseconds !== undefined) {
        return dateObj.toLocaleString();
      }
    }
    return val;
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Loading event...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>{error}</Text>
      </View>
    );
  }
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: safe(event.imageUrl, 'https://via.placeholder.com/800x260?text=No+Image') }} style={styles.image} />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          {event.status && statusColors[event.status as keyof typeof statusColors] && (
            <View style={[styles.statusBadge, { backgroundColor: statusColors[event.status as keyof typeof statusColors].bg }]}>
              <Text style={[styles.statusText, { color: statusColors[event.status as keyof typeof statusColors].text }]}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>{safe(event.title)}</Text>
          <View style={styles.row}>
            <Ionicons name="calendar" size={18} color="#6366f1" style={styles.icon} />
            <Text style={styles.meta}>{renderDate(event.date, event.time)}</Text>
            <Ionicons name="time" size={18} color="#6366f1" style={styles.icon} />
            <Text style={styles.meta}>{renderTime(event.time)}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="location" size={18} color="#6366f1" style={styles.icon} />
            <Text style={styles.meta}>{safe(event.location)}</Text>
          </View>
          <Text style={styles.description}>{safe(event.description)}</Text>

          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Ionicons name="person" size={18} color="#6366f1" style={styles.icon} />
              <Text style={styles.detailLabel}>Organizer:</Text>
              <Text style={styles.detailValue}>{safe(event.organizer)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="pricetag" size={18} color="#6366f1" style={styles.icon} />
              <Text style={styles.detailLabel}>Tags:</Text>
              <Text style={styles.detailValue}>{safe(event.tags)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="cash" size={18} color="#6366f1" style={styles.icon} />
              <Text style={styles.detailLabel}>Price:</Text>
              <Text style={styles.detailValue}>{safe(event.price)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="call" size={18} color="#6366f1" style={styles.icon} />
              <Text style={styles.detailLabel}>Contact:</Text>
              <Text style={styles.detailValue}>{safe(event.contact)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="globe" size={18} color="#6366f1" style={styles.icon} />
              <Text style={styles.detailLabel}>Website:</Text>
              <Text style={styles.detailValue}>{safe(event.website)}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 24 }}>
            <Pressable
              style={{ backgroundColor: '#f3f4f6', paddingVertical: 10, paddingHorizontal: 22, borderRadius: 10, flexDirection: 'row', alignItems: 'center', marginRight: 8 }}
              onPress={() => setEditModal(true)}
            >
              <Ionicons name="pencil" size={18} color="#6366f1" style={{ marginRight: 6 }} />
              <Text style={{ color: '#6366f1', fontWeight: '700', fontSize: 15 }}>Edit</Text>
            </Pressable>
            <Pressable
              style={{ backgroundColor: '#fee2e2', paddingVertical: 10, paddingHorizontal: 22, borderRadius: 10, flexDirection: 'row', alignItems: 'center' }}
              onPress={() => {
                Alert.alert(
                  'Delete Event',
                  'Are you sure you want to delete this event?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: async () => {
                        await deleteDoc(doc(db, 'events', event.id));
                        if (router.canGoBack()) {
                          router.back();
                        } else {
                          router.replace('/(tabs)/events');
                        }
                      },
                    },
                  ]
                );
              }}
            >
              <Ionicons name="trash" size={18} color="#ef4444" style={{ marginRight: 6 }} />
              <Text style={{ color: '#ef4444', fontWeight: '700', fontSize: 15 }}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={editModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 18, padding: 16, marginTop: 90, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 }}>
            <EventForm
              event={event}
              onSuccess={() => {
                setEditModal(false);
                getDoc(doc(db, "events", String(event.id))).then((docSnap) => {
                  if (docSnap.exists()) setEvent({ id: event.id, ...docSnap.data() });
                });
              }}
              onCancel={() => setEditModal(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2ff',
  },
  ticketsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 0,
    marginBottom: 0,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  ticketsBtnWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 18,
    backgroundColor: 'rgba(238,242,255,0.95)',
    zIndex: 10,
  },
  ticketsBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.2,
  },
  detailsSection: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e0e7ef',
    paddingTop: 18,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'flex-start',
  },
  detailLabel: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '700',
    marginLeft: 6,
    marginRight: 4,
  },
  detailValue: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
    marginLeft: 2,
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
    objectFit: 'cover',
  },
  backBtn: {
    position: 'absolute',
    top: 12,
    left: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
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