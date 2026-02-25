import React from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { IconSymbol, type IconSymbolName } from '../ui/icon-symbol';

interface TrendData {
    value: string;
    isPositive: boolean;
}

interface StatCardProps {
    label: string;
    value: string | number;
    valueColor?: string;
    iconName: IconSymbolName;
    iconColor?: string;
    iconBg?: string;
    trend?: TrendData;
}

export default function StatCard(props: StatCardProps) {
    const { label, value, valueColor, iconName, iconColor, iconBg, trend } = props;
    const colorScheme = useColorScheme();

    const styles = StyleSheet.create({
        card: {
            backgroundColor: valueColor || 'white',
            borderRadius: 16,
            padding: 24,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#374151' : '#e5e7eb',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1,
            elevation: 1,
        },
        flexRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        label: {
            fontSize: 14,
            color: colorScheme === 'dark' ? '#9ca3af' : '#ADA295',
            marginBottom: 4,
        },
        value: {
            fontSize: 30,
            fontWeight: 'bold',
            color: (colorScheme === 'dark' ? 'white' : 'black'),
        },
        iconContainer: {
            padding: 12,
            backgroundColor: iconBg || '#f3f4f6',
            borderRadius: 9999,
        },
        trendContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            marginTop: 8,
        },
        trendText: {
            fontSize: 12,
            fontWeight: '500',
        },
    });

    return (
        <View>
            <View style={styles.card}>
                <View style={styles.flexRow}>
                    <View>
                        <Text style={styles.label}>{label}</Text>
                        <Text style={styles.value}>{value}</Text>
                        {trend && (
                            <View style={styles.trendContainer}>
                                <Text
                                    style={[
                                        styles.trendText,
                                        { color: trend.isPositive ? '#16a34a' : '#dc2626' },
                                    ]}
                                >
                                    {trend.value}
                                </Text>
                                <TrendIcon isPositive={trend.isPositive} />
                            </View>
                        )}
                    </View>
                    <View style={styles.iconContainer}>
                        <IconSymbol name={iconName} color={iconColor || '#000'} />
                    </View>
                </View>
            </View>
        </View>
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