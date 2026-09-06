import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function EmptyState({
  icon,
  title,
  body,
  actionLabel,
  onAction,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center px-10">
      <Ionicons name={icon} size={44} color="#3f3f46" />
      <Text className="text-white font-[JetBrainsMonoNL-Bold] text-base text-center mt-5">
        {title}
      </Text>
      <Text className="text-gray-500 font-[JetBrainsMonoNL-Regular] text-sm text-center leading-5 mt-2">
        {body}
      </Text>
      {actionLabel && onAction && (
        <TouchableOpacity
          className="bg-white rounded-full px-6 py-3 mt-6"
          onPress={onAction}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text className="text-black font-[JetBrainsMonoNL-Bold] text-sm">
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
