import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

export default function Layout() {
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
    </Stack>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
