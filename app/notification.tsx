import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { db } from '../firebase';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isNew: boolean;
  icon: string;
}

function getIconForType(type: string): string {
  switch (type) {
    case 'confirmation':
      return 'checkmark.circle';
    case 'reminder':
      return 'clock.fill';
    case 'new_event':
      return 'sparkles';
    default:
      return 'bell.fill';
  }
}

export default function Notification() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: NotificationItem[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        let timeStr = 'Just now';
        if (data.createdAt) {
          const created = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
          const now = new Date();
          const diffMs = now.getTime() - created.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          if (diffMins < 1) timeStr = 'Just now';
          else if (diffMins < 60) timeStr = `${diffMins}m ago`;
          else if (diffMins < 1440) timeStr = `${Math.floor(diffMins / 60)}h ago`;
          else timeStr = `${Math.floor(diffMins / 1440)}d ago`;
        }
        return {
          id: doc.id,
          title: data.title || '',
          message: data.message || '',
          time: timeStr,
          isNew: !data.read,
          icon: getIconForType(data.type || ''),
        };
      });
      setNotifications(list);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View
          style={[
            styles.heroCard,
            { backgroundColor: isDark ? '#0b1220' : '#fff', borderColor: isDark ? '#111827' : '#e5e7eb' },
          ]}
        >
          <View>
            <Text style={[styles.heroTitle, { color: isDark ? '#e5e7eb' : '#111827' }]}>Notifications</Text>
            <Text style={[styles.heroSubtitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              Event updates, reminders, and new event alerts in one place.
            </Text>
          </View>
          <View style={[styles.heroIconWrap, { backgroundColor: isDark ? '#111827' : '#ede9fe' }]}>
            <IconSymbol name="bell.badge.fill" size={22} color="#4f46e5" />
          </View>
        </View>

        <View
          style={[
            styles.toggleCard,
            { backgroundColor: isDark ? '#0b1220' : '#fff', borderColor: isDark ? '#111827' : '#e5e7eb' },
          ]}
        >
          <View style={styles.toggleLeft}>
            <IconSymbol name="bell.fill" size={20} color="#4f46e5" />
            <View>
              <Text style={[styles.toggleText, { color: isDark ? '#e5e7eb' : '#111827' }]}>
                Enable Notifications
              </Text>
              <Text style={[styles.toggleSubtext, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                Turn on to stay updated about your events.
              </Text>
            </View>6
          </View>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ false: isDark ? '#334155' : '#d1d5db', true: '#c7d2fe' }}
            thumbColor={enabled ? '#4f46e5' : isDark ? '#94a3b8' : '#9ca3af'}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}>Recent</Text>
          <View style={styles.countPill}>
            <Text style={styles.countPillText}>{notifications.length}</Text>
          </View>
        </View>

        {!enabled ? (
          <View
            style={[
              styles.card,
              { backgroundColor: isDark ? '#0b1220' : '#fff', borderColor: isDark ? '#111827' : '#e5e7eb' },
            ]}
          >
            <IconSymbol name="bell.slash.fill" size={72} color="#9ca3af" />
            <Text style={[styles.title, { color: isDark ? '#e5e7eb' : '#111827' }]}>
              Notifications Disabled
            </Text>
            <Text style={[styles.subtitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              Turn on notifications to receive event updates, reminders, and new event alerts.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {notifications.map((item) => (
              <Pressable
                key={item.id}
                style={[
                  styles.notificationItem,
                  { backgroundColor: isDark ? '#0b1220' : '#fff', borderColor: isDark ? '#111827' : '#e5e7eb' },
                ]}
              >
                <View style={[styles.iconWrap, { backgroundColor: isDark ? '#111827' : '#ede9fe' }]}>
                  <IconSymbol name={item.icon as any} size={18} color="#4f46e5" />
                </View>
                <View style={styles.contentWrap}>
                  <View style={styles.itemTopRow}>
                    <Text style={[styles.itemTitle, { color: isDark ? '#e5e7eb' : '#111827' }]}>
                      {item.title}
                    </Text>
                    <Text style={styles.itemTime}>{item.time}</Text>
                  </View>
                  <Text style={[styles.itemMessage, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                    {item.message}
                  </Text>
                  {item.isNew && (
                    <View style={styles.newPill}>
                      <Text style={styles.newPillText}>New</Text>
                    </View>
                  )}
                </View>
              </Pressable>
            ))}
            {notifications.length === 0 && (
              <View
                style={[
                  styles.card,
                  { backgroundColor: isDark ? '#0b1220' : '#fff', borderColor: isDark ? '#111827' : '#e5e7eb' },
                ]}
              >
                <IconSymbol name="checkmark.circle" size={72} color="#22c55e" />
                <Text style={[styles.title, { color: isDark ? '#e5e7eb' : '#111827' }]}>
                  All caught up!
                </Text>
                <Text style={[styles.subtitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                  No new notifications yet.
                </Text>
              </View>
            )}
          </View>
        )}
        <View style={styles.footerHintWrap}>
          <Text style={[styles.footerHint, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            Receive notifications for event updates, reminders, and new events.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 28 },
  heroCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTitle: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  heroSubtitle: { fontSize: 13, lineHeight: 18, maxWidth: 240 },
  heroIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleCard: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  toggleText: { fontSize: 14, fontWeight: '700' },
  toggleSubtext: { marginTop: 2, fontSize: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 0.4, textTransform: 'uppercase' },
  countPill: { backgroundColor: '#e0e7ff', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  countPillText: { fontSize: 12, fontWeight: '700', color: '#4f46e5' },
  list: { gap: 10 },
  notificationItem: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  contentWrap: { flex: 1 },
  itemTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 },
  itemTitle: { fontSize: 14, fontWeight: '700' },
  itemTime: { fontSize: 12, color: '#9ca3af', fontWeight: '600' },
  itemMessage: { fontSize: 13, lineHeight: 18 },
  newPill: { alignSelf: 'flex-start', marginTop: 8, backgroundColor: '#dcfce7', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  newPillText: { fontSize: 11, fontWeight: '700', color: '#166534' },
  card: { marginTop: 8, borderRadius: 18, borderWidth: 1, padding: 26, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '600', marginTop: 16 },
  subtitle: { fontSize: 14, marginTop: 8, textAlign: 'center', lineHeight: 20, maxWidth: 280 },
  footerHintWrap: { marginTop: 16 },
  footerHint: { fontSize: 12, textAlign: 'center' },
});
