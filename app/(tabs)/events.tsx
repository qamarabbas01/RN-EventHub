import EventCard from "@/components/Card/EventCard";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

function renderDate(date: any, time?: any): string {
    if (time && typeof time === "object" && time.seconds) {
        const dateObj = new Date(time.seconds * 1000);
        return dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    }
    if (typeof time === "string" && time.trim() !== "") {
        const parsed = new Date(time);
        if (!isNaN(parsed.getTime())) {
            return parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        }
    }
    if (date && typeof date === "object" && date.seconds) {
        const dateObj = new Date(date.seconds * 1000);
        return dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    }
    if (typeof date === "string" && date.trim() !== "") {
        const parsed = new Date(date);
        if (!isNaN(parsed.getTime())) {
            return parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        }
        return date;
    }
    return "N/A";
}

function renderTime(time: any): string {
    if (time && typeof time === "object" && time.seconds) {
        const dateObj = new Date(time.seconds * 1000);
        return dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (typeof time === "string" && time.trim() !== "") {
        const parsed = new Date(time);
        if (!isNaN(parsed.getTime())) {
            return parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        }
        return time;
    }
    return "N/A";
}

const filterTags = ["All", "Upcoming", "Live", "Ended"];

export default function Events() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "events"));
                const eventsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setEvents(eventsData);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
            setLoading(false);
        };
        fetchEvents();
    }, []);

    const filteredEvents = events.filter((event) => {
        if (activeFilter === "All")
            return event.title.toLowerCase().includes(search.toLowerCase());
        return (
            event.status === activeFilter.toLowerCase() &&
            event.title.toLowerCase().includes(search.toLowerCase())
        );
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
                    <Ionicons
                        name="search"
                        size={18}
                        color="#a1a1aa"
                        style={{ marginLeft: 10, marginRight: 6 }}
                    />
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
                            style={[
                                styles.filterTag,
                                activeFilter === tag && styles.filterTagActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.filterTagText,
                                    activeFilter === tag && styles.filterTagTextActive,
                                ]}
                            >
                                {tag}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {loading ? (
                    <Text style={{ textAlign: "center", marginTop: 32 }}>
                        Loading events...
                    </Text>
                ) : (
                    <FlatList
                        data={filteredEvents}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <EventCard
                                id={item.id}
                                title={item.title}
                                date={renderDate(item.date, item.time)}
                                time={renderTime(item.time)}
                                location={item.location}
                                status={item.status}
                                onPress={() => router.push(`/events/${item.id}`)}
                                image={item.imageUrl}
                            />
                        )}
                        scrollEnabled={false}
                        nestedScrollEnabled={true}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eef2ff",
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
        fontWeight: "800",
        color: "#111827",
        marginBottom: 4,
    },

    headerSubtitle: {
        fontSize: 14,
        color: "#6b7280",
    },

    filterContainer: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 20,
    },

    filterTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },

    filterTagActive: {
        backgroundColor: "#4f46e5",
        borderColor: "#4f46e5",
    },

    filterTagText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#6b7280",
    },

    filterTagTextActive: {
        fontSize: 12,
        fontWeight: "600",
        color: "#fff",
    },

    searchBarWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 18,
        marginBottom: 18,
        marginTop: 2,
        shadowColor: "#6366f1",
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
        color: "#111827",
        backgroundColor: "transparent",
    },
});
