import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

export default function Notification() {
    const [enabled, setEnabled] = React.useState(true);
    const notifications = [
        {
            id: "1",
            icon: "arrow.triangle.2.circlepath",
            title: "Event Update",
            message: "Your \"Tech Meetup\" event details were updated.",
            time: "2m ago",
            isNew: true,
        },
        {
            id: "2",
            icon: "clock.fill",
            title: "Reminder",
            message: "Reminder: \"Startup Workshop\" starts tomorrow at 10:00 AM.",
            time: "1h ago",
            isNew: false,
        },
        {
            id: "3",
            icon: "sparkles",
            title: "New Event",
            message: "New event near you: \"Design Sprint 2026\".",
            time: "Today",
            isNew: false,
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <View style={styles.heroCard}>
                    <View>
                        <Text style={styles.heroTitle}>Notifications</Text>
                        <Text style={styles.heroSubtitle}>
                            Event updates, reminders, and new event alerts in one place.
                        </Text>
                    </View>
                    <View style={styles.heroIconWrap}>
                        <IconSymbol name="bell.badge.fill" size={22} color="#4f46e5" />
                    </View>
                </View>

                <View style={styles.toggleCard}>
                    <View style={styles.toggleLeft}>
                        <IconSymbol name="bell.fill" size={20} color="#4f46e5" />
                        <View>
                            <Text style={styles.toggleText}>Enable Notifications</Text>
                            <Text style={styles.toggleSubtext}>
                                Turn on to stay updated about your events.
                            </Text>
                        </View>
                    </View>
                    <Switch
                        value={enabled}
                        onValueChange={setEnabled}
                        trackColor={{ false: "#d1d5db", true: "#c7d2fe" }}
                        thumbColor={enabled ? "#4f46e5" : "#9ca3af"}
                    />
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent</Text>
                    <View style={styles.countPill}>
                        <Text style={styles.countPillText}>{notifications.length}</Text>
                    </View>
                </View>

                {!enabled ? (
                    <View style={styles.card}>
                        <IconSymbol name="bell.slash.fill" size={72} color="#9ca3af" />
                        <Text style={styles.title}>Notifications Disabled</Text>
                        <Text style={styles.subtitle}>
                            Turn on notifications to receive event updates, reminders, and new event alerts.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.list}>
                        {notifications.map((item) => (
                            <Pressable key={item.id} style={styles.notificationItem}>
                                <View style={styles.iconWrap}>
                                    <IconSymbol name={item.icon as any} size={18} color="#4f46e5" />
                                </View>
                                <View style={styles.contentWrap}>
                                    <View style={styles.itemTopRow}>
                                        <Text style={styles.itemTitle}>{item.title}</Text>
                                        <Text style={styles.itemTime}>{item.time}</Text>
                                    </View>
                                    <Text style={styles.itemMessage}>{item.message}</Text>
                                    {item.isNew && (
                                        <View style={styles.newPill}>
                                            <Text style={styles.newPillText}>New</Text>
                                        </View>
                                    )}
                                </View>
                            </Pressable>
                        ))}
                    </View>
                )}
                <View style={styles.footerHintWrap}>
                    <Text style={styles.footerHint}>
                        Receive notifications for event updates, reminders, and new events.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eef2ff',
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 28,
    },
    heroCard: {
        backgroundColor: "#fff",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        padding: 16,
        marginBottom: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    heroTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#111827",
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: 13,
        color: "#6b7280",
        lineHeight: 18,
        maxWidth: 240,
    },
    heroIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#ede9fe",
        alignItems: "center",
        justifyContent: "center",
    },
    toggleCard: {
        backgroundColor: "#fff",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        paddingVertical: 14,
        paddingHorizontal: 14,
        marginBottom: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
    },
    toggleLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    toggleText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
    },
    toggleSubtext: {
        marginTop: 2,
        fontSize: 12,
        color: "#6b7280",
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: "700",
        color: "#6b7280",
        letterSpacing: 0.4,
        textTransform: "uppercase",
    },
    countPill: {
        backgroundColor: "#e0e7ff",
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    countPillText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#4f46e5",
    },
    list: {
        gap: 10,
    },
    notificationItem: {
        backgroundColor: "#fff",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
    },
    iconWrap: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: "#ede9fe",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    contentWrap: {
        flex: 1,
    },
    itemTopRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 3,
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
    },
    itemTime: {
        fontSize: 12,
        color: "#9ca3af",
        fontWeight: "600",
    },
    itemMessage: {
        fontSize: 13,
        color: "#6b7280",
        lineHeight: 18,
    },
    newPill: {
        alignSelf: "flex-start",
        marginTop: 8,
        backgroundColor: "#dcfce7",
        borderRadius: 999,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    newPillText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#166534",
    },
    card: {
        marginTop: 8,
        backgroundColor: "#fff",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        padding: 26,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 16,
        color: '#111827',
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 20,
        maxWidth: 280,
    },
    footerHintWrap: {
        marginTop: 16,
    },
    footerHint: {
        fontSize: 12,
        color: "#6b7280",
        textAlign: "center",
    },
})