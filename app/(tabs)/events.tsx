import EventCard from '@/components/Card/EventCard';
import React, { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Event {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    attendees: number;
    capacity: number;
    status: 'upcoming' | 'live' | 'ended';
    imageUrl?: string;
}

const mockEvents: Event[] = [
    {
        id: '1',
        title: 'Tech Conference 2026',
        date: 'Mar 15, 2026',
        time: '10:00 AM',
        location: 'San Francisco Convention Center',
        attendees: 450,
        capacity: 500,
        status: 'upcoming',
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '2',
        title: 'Web Development Workshop',
        date: 'Mar 12, 2026',
        time: 'Live Now',
        location: 'Online - Zoom',
        attendees: 120,
        capacity: 150,
        status: 'live',
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '3',
        title: 'Design Thinking Bootcamp',
        date: 'Mar 08, 2026',
        time: '09:00 AM',
        location: 'New York Creative Hub',
        attendees: 85,
        capacity: 100,
        status: 'ended',
        imageUrl: 'https://event-manager-three-eta.vercel.app/_app/immutable/assets/music.DareFaYV.png',
    },
    {
        id: '4',
        title: 'AI & Machine Learning Summit',
        date: 'Mar 22, 2026',
        time: '11:30 AM',
        location: 'Boston Tech Park',
        attendees: 320,
        capacity: 400,
        status: 'upcoming',
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '5',
        title: 'Startup Networking Night',
        date: 'Mar 18, 2026',
        time: '06:00 PM',
        location: 'Downtown Lounge, Chicago',
        attendees: 95,
        capacity: 150,
        status: 'upcoming',
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    },
];

const filterTags = ['All', 'Upcoming', 'Live', 'Ended'];

export default function Events() {
    const [activeFilter, setActiveFilter] = useState('All');

    const filteredEvents = mockEvents.filter((event) => {
        if (activeFilter === 'All') return true;
        return event.status === activeFilter.toLowerCase();
    });

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Events</Text>
                    <Text style={styles.headerSubtitle}>Manage your upcoming events</Text>
                </View>

                <View style={styles.filterContainer}>
                    {filterTags.map((tag) => (
                        <Pressable
                            key={tag}
                            onPress={() => setActiveFilter(tag)}
                            style={[styles.filterTag, activeFilter === tag && styles.filterTagActive]}
                        >
                            <Text style={[styles.filterTagText, activeFilter === tag && styles.filterTagTextActive]}>
                                {tag}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <FlatList
                    data={filteredEvents}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <EventCard
                            id={item.id}
                            title={item.title}
                            date={item.date}
                            time={item.time}
                            location={item.location}
                            attendees={item.attendees}
                            capacity={item.capacity}
                            status={item.status}
                            onPress={() => console.log('Event pressed:', item.id)}
                            image={item.imageUrl}
                        />
                    )}
                    scrollEnabled={false}
                    nestedScrollEnabled={true}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fffcfc',
    },

    scrollView: {
        flex: 1,
    },

    contentContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 32,
    },

    header: {
        marginBottom: 24,
    },

    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 4,
    },

    headerSubtitle: {
        fontSize: 14,
        color: '#6b7280',
    },

    filterContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 20,
    },

    filterTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },

    filterTagActive: {
        backgroundColor: '#4f46e5',
        borderColor: '#4f46e5',
    },

    filterTagText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
    },

    filterTagTextActive: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
});