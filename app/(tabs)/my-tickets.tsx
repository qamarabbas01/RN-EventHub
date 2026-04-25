import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs, orderBy, query, Timestamp, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../firebase';

interface Booking {
    id: string;
    eventId: string;
    eventTitle: string;
    eventDate: string | Timestamp;
    eventTime: string;
    bookedAt: Timestamp;
    checkInStatus: boolean;
}

export default function MyTickets() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const { user } = useAuth();
    const router = useRouter();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        fetchBookings();
    }, [user]);

    const fetchBookings = async () => {
        if (!user) return;
        try {
            const q = query(
                collection(db, 'bookings'),
                where('userId', '==', user.uid),
                orderBy('bookedAt', 'desc')
            );
            const snap = await getDocs(q);
            const list = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Booking[];
            setBookings(list);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderDate = (dateVal: any): string => {
        if (!dateVal) return 'N/A';
        if (dateVal instanceof Timestamp) {
            return dateVal.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        }
        if (typeof dateVal === 'string') {
            const parsed = new Date(dateVal);
            if (!isNaN(parsed.getTime())) {
                return parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
            }
            return dateVal;
        }
        if (typeof dateVal === 'object' && dateVal.seconds) {
            return new Date(dateVal.seconds * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        }
        return 'N/A';
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
                <View style={styles.center}>
                    <ActivityIndicator color="#6366f1" />
                    <Text style={{ marginTop: 10, color: isDark ? '#e5e7eb' : '#111827' }}>Loading your tickets...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: isDark ? '#e5e7eb' : '#111827' }]}>My Tickets</Text>
                    <Text style={[styles.subtitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                        Events you&apos;re attending
                    </Text>
                </View>

                {bookings.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="ticket" size={72} color="#9ca3af" />
                        <Text style={[styles.emptyTitle, { color: isDark ? '#e5e7eb' : '#111827' }]}>No tickets yet</Text>
                        <Text style={[styles.emptySubtitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                            Book an event to see your tickets here.
                        </Text>
                        <Pressable
                            style={styles.exploreBtn}
                            onPress={() => router.push('/(tabs)/events')}
                        >
                            <Text style={styles.exploreBtnText}>Explore Events</Text>
                        </Pressable>
                    </View>
                ) : (
                    <View style={styles.list}>
                        {bookings.map((booking) => (
                            <Pressable
                                key={booking.id}
                                style={[styles.ticketCard, { backgroundColor: isDark ? '#0b1220' : '#fff', borderColor: isDark ? '#111827' : '#e5e7eb' }]}
                                onPress={() => router.push(`/events/${booking.eventId}`)}
                            >
                                <View style={styles.ticketHeader}>
                                    <View style={[styles.iconWrap, { backgroundColor: isDark ? '#111827' : '#ede9fe' }]}>
                                        <Ionicons name="calendar" size={20} color="#6366f1" />
                                    </View>
                                    <View style={styles.ticketInfo}>
                                        <Text style={[styles.eventTitle, { color: isDark ? '#e5e7eb' : '#111827' }]} numberOfLines={1}>
                                            {booking.eventTitle}
                                        </Text>
                                        <Text style={[styles.eventDate, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                                            {renderDate(booking.eventDate)} • {booking.eventTime}
                                        </Text>
                                    </View>
                                    <View style={[
                                        styles.statusBadge,
                                        {
                                            backgroundColor: booking.checkInStatus ? '#dcfce7' : isDark ? '#111827' : '#f3f4f6',
                                            borderColor: booking.checkInStatus ? '#22c55e' : isDark ? '#374151' : '#d1d5db',
                                        },
                                    ]}>
                                        <Text style={[
                                            styles.statusText,
                                            {
                                                color: booking.checkInStatus ? '#166534' : isDark ? '#9ca3af' : '#6b7280',
                                            },
                                        ]}>
                                            {booking.checkInStatus ? 'Checked In' : 'Not Checked In'}
                                        </Text>
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16, paddingBottom: 32 },
    header: { marginBottom: 20 },
    title: { fontSize: 26, fontWeight: '800', marginBottom: 4 },
    subtitle: { fontSize: 14 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
        paddingHorizontal: 24,
    },
    emptyTitle: { fontSize: 18, fontWeight: '700', marginTop: 16, marginBottom: 6 },
    emptySubtitle: { fontSize: 14, textAlign: 'center', marginBottom: 20 },
    exploreBtn: {
        backgroundColor: '#6366f1',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    exploreBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    list: { gap: 12 },
    ticketCard: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 14,
    },
    ticketHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ticketInfo: { flex: 1 },
    eventTitle: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
    eventDate: { fontSize: 13 },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
    },
    statusText: { fontSize: 11, fontWeight: '700' },
});
