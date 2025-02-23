import { Stack } from "expo-router";
import "../global.css";

export default function Layout() {
  return (
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
    </Stack>
  );
}
