import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Stat {
    icon: string;
    label: string;
    number: string;
    desc: string;
    iconColor: string;
}

interface StatsGridProps {
    stats: Stat[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
    return (
        <View style={styles.container}>
            {stats.map((stat, index) => (
                <View key={index} style={styles.card}>
                    <View style={styles.topRow}>
                        <View style={[styles.iconBox, { backgroundColor: stat.iconColor + "20" }]}>
                            <IconSymbol name={stat.icon as any} size={18} color={stat.iconColor} />
                        </View>
                        <Text style={styles.label}>{stat.label}</Text>
                    </View>
                    <Text style={styles.number}>{stat.number}</Text>
                    <Text style={styles.desc}>{stat.desc}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 16,
        paddingVertical: 16,
        justifyContent: "space-between",
    },

    card: {
        width: "48%",
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },

    topRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },

    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },

    label: {
        fontSize: 12,
        fontWeight: "600",
        color: "#6b7280",
        flex: 1,
    },

    number: {
        fontSize: 24,
        fontWeight: "800",
        color: "#111827",
        marginBottom: 6,
    },

    desc: {
        fontSize: 11,
        color: "#9ca3af",
        fontWeight: "500",
    },
});