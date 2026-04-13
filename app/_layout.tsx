import { Colors } from '@/constants/theme';
import { ColorSchemeProvider, useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <ColorSchemeProvider>
      <RootLayoutInner />
    </ColorSchemeProvider>
  );
}

function RootLayoutInner() {
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
