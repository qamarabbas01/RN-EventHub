import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  title?: string;
  message?: string;
  loading?: boolean;
  actionLabel?: string;
  onActionPress?: () => void;
};

export default function CenteredState({
  title,
  message,
  loading,
  actionLabel,
  onActionPress,
}: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}
      accessibilityRole="summary"
      accessibilityLabel={title ?? (loading ? 'Loading' : 'Status')}
    >
      {loading ? (
        <ActivityIndicator
          size="large"
          color={isDark ? '#a5b4fc' : '#4f46e5'}
          accessibilityLabel="Loading indicator"
        />
      ) : null}

      {title ? (
        <Text style={[styles.title, { color: isDark ? '#e5e7eb' : '#111827' }]}>{title}</Text>
      ) : null}

      {message ? (
        <Text style={[styles.message, { color: isDark ? '#9ca3af' : '#6b7280' }]}>{message}</Text>
      ) : null}

      {!loading && actionLabel && onActionPress ? (
        <Pressable
          onPress={onActionPress}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.9 }]}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  message: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: '#4f46e5',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
});

