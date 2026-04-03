import EventCard from "@/components/Card/EventCard";
import EventForm from "@/components/EventForm";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    const [modalVisible, setModalVisible] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any | null>(null);
    const router = useRouter();

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


    useEffect(() => {
        fetchEvents();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchEvents();
        }, [])
    );

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
                        renderItem={({ item }) => {
                            let eventDate: Date | null = null;
                            if (item.time && typeof item.time === 'object' && item.time.seconds) {
                                eventDate = new Date(item.time.seconds * 1000);
                            } else if (typeof item.time === 'string' && item.time.trim() !== '') {
                                const parsed = new Date(item.time);
                                if (!isNaN(parsed.getTime())) eventDate = parsed;
                            } else if (item.date && typeof item.date === 'object' && item.date.seconds) {
                                eventDate = new Date(item.date.seconds * 1000);
                            } else if (typeof item.date === 'string' && item.date.trim() !== '') {
                                const parsed = new Date(item.date);
                                if (!isNaN(parsed.getTime())) eventDate = parsed;
                            }

                            type StatusType = 'upcoming' | 'live' | 'ended';
                            let status: StatusType = 'upcoming';
                            if (eventDate) {
                                const now = new Date();
                                const eventDay = eventDate.setHours(0, 0, 0, 0);
                                const today = now.setHours(0, 0, 0, 0);
                                if (eventDay < today) {
                                    status = 'ended';
                                } else if (eventDay === today) {
                                    status = 'live';
                                } else {
                                    status = 'upcoming';
                                }
                            }

                            return (
                                <View style={{ marginBottom: 12 }}>
                                    <EventCard
                                        id={item.id}
                                        title={item.title}
                                        date={renderDate(item.date, item.time)}
                                        time={renderTime(item.time)}
                                        location={item.location}
                                        status={status}
                                        onPress={() => router.push(`/events/${item.id}`)}
                                        image={item.imageUrl}
                                    />
                                </View>
                            );
                        }}
                        scrollEnabled={false}
                        nestedScrollEnabled={true}
                    />
                )}
            </ScrollView>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    setModalVisible(false);
                    setEditingEvent(null);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 18, padding: 16, marginTop: 90, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 }}>
                        <EventForm
                            event={editingEvent}
                            onSuccess={() => {
                                setModalVisible(false);
                                setEditingEvent(null);
                                fetchEvents();
                            }}
                            onCancel={() => {
                                setModalVisible(false);
                                setEditingEvent(null);
                            }}
                        />
                    </View>
                </View>
            </Modal>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    setEditingEvent(null);
                    setModalVisible(true);
                }}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={32} color="#fff" />
            </TouchableOpacity>
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
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 36,
        backgroundColor: '#6366f1',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 6,
        zIndex: 100,
    },
});
