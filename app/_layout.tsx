import { Colors } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { ColorSchemeProvider, useColorScheme } from '@/hooks/use-color-scheme';
import { registerForPushNotificationsAsync, sendNewEventAlert } from '@/services/notifications';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { collection, onSnapshot, query, Timestamp, where } from 'firebase/firestore';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { db } from '../firebase';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <ColorSchemeProvider>
      <AuthProvider>
        <RootLayoutInner />
      </AuthProvider>
    </ColorSchemeProvider>
  );
}

function RootLayoutInner() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();

  useEffect(() => {
    registerForPushNotificationsAsync().catch((e) => {
      console.log('Notification registration failed (expected in Expo Go):', e);
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    const cutoff = Timestamp.now();
    const q = query(collection(db, 'events'), where('createdAt', '>', cutoff));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          if (data.createdBy !== user.uid) {
            sendNewEventAlert(data.title, change.doc.id).catch((e) =>
              console.log('Failed to send new event alert:', e)
            );
          }
        }
      });
    });

    return () => unsubscribe();
  }, [user]);

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
            headerStyle: { backgroundColor: Colors[colorScheme].background }, headerTitleStyle: { color: Colors[colorScheme].text, fontWeight: '600' }, headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="events/[id]"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Register"
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
