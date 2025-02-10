import { Stack } from "expo-router";

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
        name="history"
        options={{
          title: "Scan history",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
