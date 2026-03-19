import { useEffect } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppMetrics from "expo-eas-observe";
import "../global.css";

export default function Layout() {
  useEffect(() => {
    AppMetrics.markInteractive();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Scanner",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="logs"
        options={{
          title: "Logs",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: "About",
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="generate-qr"
        options={{
          title: "Generate QR",
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="home"
        options={{
          title: "QRU?",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: "Privacy Policy",
          headerShown: false,
        }}
      />
    </Stack>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
