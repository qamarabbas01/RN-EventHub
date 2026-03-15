import EventCard from '@/components/Card/EventCard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { mockEvents } from '../../data/mockEvents';
// If you want to keep the Event type, you can export it from mockEvents.ts and import here as well.

const filterTags = ['All', 'Upcoming', 'Live', 'Ended'];

export default function Events() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [search, setSearch] = useState('');
    const router = useRouter();

    const filteredEvents = mockEvents.filter((event) => {
        if (activeFilter === 'All') return event.title.toLowerCase().includes(search.toLowerCase());
        return event.status === activeFilter.toLowerCase() && event.title.toLowerCase().includes(search.toLowerCase());
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

                <View style={styles.searchBarWrapper}>
                    <Ionicons name="search" size={18} color="#a1a1aa" style={{ marginLeft: 10, marginRight: 6 }} />
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Search events, workshops..."
                        placeholderTextColor="#a1a1aa"
                        value={search}
                        onChangeText={setSearch}
                        returnKeyType="search"
                    />
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
                            onPress={() => router.push(`/events/${item.id}`)}
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
        backgroundColor: '#eef2ff',
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

    searchBarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 18,
        marginBottom: 18,
        marginTop: 2,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
    },

    searchBar: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 6,
        fontSize: 15,
        color: '#111827',
        backgroundColor: 'transparent',
    },
});