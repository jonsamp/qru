import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="history"
        options={{
          title: "Scan History",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
