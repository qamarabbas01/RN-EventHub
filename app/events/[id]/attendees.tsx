import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
    orderBy,
    serverTimestamp,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../../firebase';

interface Booking {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    checkInStatus: boolean;
    bookedAt: any;
}

export default function EventAttendees() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const { id } = useLocalSearchParams();
    const { user } = useAuth();
    const router = useRouter();

    const [event, setEvent] = useState<any>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetchEventAndBookings();
    }, [id]);

    const fetchEventAndBookings = async () => {
        try {
                const eventDoc = await getDoc(doc(db, 'events', String(id)));
                if (eventDoc.exists()) {
                    const rawData = eventDoc.data();
                    const eventData = { id: eventDoc.id, ...rawData } as any;
                    setEvent(eventData);

                    // Verify organizer access
                    if (eventData.createdBy && eventData.createdBy !== user?.uid) {
                        Alert.alert('Access Denied', 'Only the organizer can view attendees.');
                        router.back();
                        return;
                    }

                // Fetch bookings
                const q = query(
                    collection(db, 'bookings'),
                    where('eventId', '==', String(id)),
                    orderBy('bookedAt', 'asc')
                );
                const snap = await getDocs(q);
                const bookingsList = snap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Booking[];
                setBookings(bookingsList);
            } else {
                Alert.alert('Error', 'Event not found');
                router.back();
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const toggleCheckIn = async (booking: Booking) => {
        try {
            await updateDoc(doc(db, 'bookings', booking.id), {
                checkInStatus: !booking.checkInStatus,
                checkedInAt: !booking.checkInStatus ? serverTimestamp() : null,
            });
            // Update local state
            setBookings(prev =>
                prev.map(b =>
                    b.id === booking.id
                        ? { ...b, checkInStatus: !b.checkInStatus }
                        : b
                )
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to update check-in status');
        }
    };

    const exportToCSV = async () => {
        const headers = ['Name', 'Email', 'Booked At', 'Checked In'];
        const rows = bookings.map(b => [
            b.userName,
            b.userEmail,
            b.bookedAt ? new Date(b.bookedAt.seconds * 1000).toLocaleString() : '',
            b.checkInStatus ? 'Yes' : 'No',
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(',')),
        ].join('\n');

        try {
            await Share.share({
                message: csvContent,
                title: `${event?.title || 'Event'} Attendees`,
            });
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
                <View style={styles.center}>
                    <Text style={{ color: isDark ? '#e5e7eb' : '#111827' }}>Loading attendees...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: isDark ? '#e5e7eb' : '#111827' }]}>
                        Attendees
                    </Text>
                    <Text style={[styles.subtitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                        {event?.title}
                    </Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={[styles.statBox, { backgroundColor: isDark ? '#0f172a' : '#f0f4ff', borderColor: isDark ? '#1f2937' : '#e0e7ff' }]}>
                        <Text style={[styles.statNumber, { color: '#4f46e5' }]}>{bookings.length}</Text>
                        <Text style={[styles.statLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>Total</Text>
                    </View>
                    <View style={[styles.statBox, { backgroundColor: isDark ? '#0f172a' : '#f0f4ff', borderColor: isDark ? '#1f2937' : '#e0e7ff' }]}>
                        <Text style={[styles.statNumber, { color: '#22c55e' }]}>
                            {bookings.filter(b => b.checkInStatus).length}
                        </Text>
                        <Text style={[styles.statLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>Checked In</Text>
                    </View>
                </View>

                <Pressable
                    style={[styles.exportBtn, { backgroundColor: isDark ? '#111827' : '#f3f4f6' }]}
                    onPress={exportToCSV}
                >
                    <Ionicons name="download-outline" size={20} color="#6366f1" />
                    <Text style={[styles.exportBtnText, { color: '#6366f1' }]}>Export CSV</Text>
                </Pressable>

                <View style={styles.list}>
                    {bookings.map((booking) => (
                        <View
                            key={booking.id}
                            style={[styles.attendeeItem, { backgroundColor: isDark ? '#0b1220' : '#fff', borderColor: isDark ? '#111827' : '#e5e7eb' }]}
                        >
                            <View style={styles.attendeeInfo}>
                                <Text style={[styles.attendeeName, { color: isDark ? '#e5e7eb' : '#111827' }]}>
                                    {booking.userName}
                                </Text>
                                <Text style={[styles.attendeeEmail, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                                    {booking.userEmail}
                                </Text>
                            </View>
                            <Pressable
                                style={[
                                    styles.checkInBtn,
                                    {
                                        backgroundColor: booking.checkInStatus
                                            ? '#dcfce7'
                                            : isDark ? '#111827' : '#f3f4f6',
                                        borderColor: booking.checkInStatus
                                            ? '#22c55e'
                                            : isDark ? '#374151' : '#d1d5db',
                                    },
                                ]}
                                onPress={() => toggleCheckIn(booking)}
                            >
                                <Ionicons
                                    name="checkmark"
                                    size={20}
                                    color={booking.checkInStatus ? '#166534' : isDark ? '#9ca3af' : '#6b7280'}
                                />
                                <Text
                                    style={[
                                        styles.checkInText,
                                        {
                                            color: booking.checkInStatus
                                                ? '#166534'
                                                : isDark ? '#9ca3af' : '#6b7280',
                                        },
                                    ]}
                                >
                                    {booking.checkInStatus ? 'Checked In' : 'Check In'}
                                </Text>
                            </Pressable>
                        </View>
                    ))}
                    {bookings.length === 0 && (
                        <View style={styles.emptyState}>
                            <Ionicons name="warning-outline" size={48} color="#9ca3af" />
                            <Text style={[styles.emptyText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                                No attendees yet
                            </Text>
                        </View>
                    )}
                </View>
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
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    statBox: {
        flex: 1,
        borderRadius: 14,
        borderWidth: 1,
        padding: 16,
        alignItems: 'center',
    },
    statNumber: { fontSize: 24, fontWeight: '800' },
    statLabel: { fontSize: 12, fontWeight: '600', marginTop: 4 },
    exportBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    exportBtnText: { fontSize: 15, fontWeight: '700' },
    list: { gap: 10 },
    attendeeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 14,
        borderWidth: 1,
        padding: 14,
    },
    attendeeInfo: { flex: 1 },
    attendeeName: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
    attendeeEmail: { fontSize: 13 },
    checkInBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1.5,
    },
    checkInText: { fontSize: 12, fontWeight: '600' },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyText: { fontSize: 15, fontWeight: '600', marginTop: 8 },
});
