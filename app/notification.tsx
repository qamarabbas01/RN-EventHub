import { IconSymbol } from '@/components/ui/icon-symbol'
import React from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'

export default function Notification() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <IconSymbol name="bell.slash.fill" size={72} color="#9ca3af" />
                <Text style={styles.title}>No Notifications</Text>
                <Text style={styles.subtitle}>
                    You&apos;re all caught up. Check back later for new notifications.
                </Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    card: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
})