import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Observe, ObserveRoot } from "expo-observe";
import "../global.css";

Observe.configure({
  integrations: {
    "expo-router": { filteredParams: ["url"] },
  },
});

function Layout() {
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
            name="scanned"
            options={{
              title: "Scanned Data",
              headerShown: false,
              presentation: "formSheet",
              sheetGrabberVisible: true,
              sheetAllowedDetents: [0.45, 0.95],
              sheetLargestUndimmedDetentIndex: 0,
              contentStyle: { backgroundColor: "#111111" },
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
              presentation: "formSheet",
              sheetGrabberVisible: true,
              sheetAllowedDetents: [0.95],
              contentStyle: { backgroundColor: "#111111" },
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

export default ObserveRoot.wrap(Layout);
