import React, { useRef } from "react";
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface TrendData {
    value: string;
    isPositive: boolean;
}

interface StatCardProps {
    label: string;
    value: string | number;
    valueColor?: string;
    trend?: TrendData;
}

export default function StatCard(props: StatCardProps) {
    const { label, value, valueColor, trend } =
        props;
    const colorScheme = useColorScheme();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const styles = StyleSheet.create({
        card: {
            backgroundColor: valueColor || "white",
            borderRadius: 24,
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderWidth: 1.5,
            borderColor: colorScheme === "dark" ? "#374151" : "#f0f0f0",
            shadowColor: colorScheme === "dark" ? "#000" : "#1f2937",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: colorScheme === "dark" ? 0.3 : 0.08,
            shadowRadius: 12,
            elevation: 4,
        },
        flexRow: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        label: {
            fontSize: 12,
            color: colorScheme === "dark" ? "#9ca3af" : "#9ca3af",
            marginBottom: 8,
            fontWeight: "700",
            letterSpacing: 0.3,
        },
        value: {
            fontSize: 24,
            fontWeight: "800",
            color: colorScheme === "dark" ? "white" : "#1f2937",
            letterSpacing: -0.5,
        },
        trendContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
        },
        trendText: {
            fontSize: 12,
            fontWeight: "700",
        },
    });

    return (
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
            <Animated.View
                style={[styles.card, { transform: [{ scale: scaleAnim }] }]}
            >
                <View style={styles.flexRow}>
                    <View>
                        <Text style={styles.label}>{label}</Text>
                        <Text style={styles.value}>{value}</Text>
                    </View>
                    {trend && (
                        <View style={styles.trendContainer}>
                            <Text
                                style={[
                                    styles.trendText,
                                    { color: trend.isPositive ? "#16a34a" : "#dc2626" },
                                ]}
                            >
                                {trend.value}
                            </Text>
                            <TrendIcon isPositive={trend.isPositive} />
                        </View>
                    )}
                </View>
            </Animated.View>
        </Pressable>
    );
}

function TrendIcon({ isPositive }: { isPositive: boolean }) {
    return (
        <Svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            {isPositive ? (
                <>
                    <Path
                        d="M13.5 4.5L8.5 9.5L6 7L2.5 10.5"
                        stroke="#16a34a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <Path
                        d="M10.5 4.5H13.5V7.5"
                        stroke="#16a34a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </>
            ) : (
                <>
                    <Path
                        d="M2.5 11.5L7.5 6.5L10 9L13.5 5.5"
                        stroke="#dc2626"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <Path
                        d="M5.5 11.5H2.5V8.5"
                        stroke="#dc2626"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </>
            )}
        </Svg>
    );
}
