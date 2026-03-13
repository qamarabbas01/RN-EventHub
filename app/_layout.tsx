import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen
          name="notification"
          options={{
            title: "Notifications",
            headerBackButtonDisplayMode: "minimal",
            headerStyle: { backgroundColor: '#fff' }, headerTitleStyle: { color: '#111827', fontWeight: '600' }, headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="events/[id]"
          options={{
            title: "Event Details",
            headerBackButtonDisplayMode: "minimal",
            headerStyle: { backgroundColor: '#fff' }, headerTitleStyle: { color: '#111827', fontWeight: '600' }, headerShadowVisible: false,
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
