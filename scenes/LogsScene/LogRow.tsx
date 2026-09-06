import React, { useCallback, useRef } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import type { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import { ColorizedURL } from "../../components/ColorizedURL";
import { SavedQRCode } from "../../utils/types";

const ACTION_WIDTH = 76;

function SwipeAction({
  icon,
  label,
  tint,
  background,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  tint: string;
  background: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={{ width: ACTION_WIDTH, backgroundColor: background }}
      className="items-center justify-center gap-1"
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={20} color={tint} />
      <Text
        style={{ color: tint }}
        className="font-[JetBrainsMonoNL-Regular] text-xs"
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function LogRow({
  item,
  onCopy,
  onDelete,
  onShowQR,
  onOpen,
}: {
  item: SavedQRCode;
  onCopy: (item: SavedQRCode) => void;
  onDelete: (item: SavedQRCode) => void;
  onShowQR: (item: SavedQRCode) => void;
  onOpen: (item: SavedQRCode) => void;
}) {
  const swipeable = useRef<SwipeableMethods | null>(null);

  const close = useCallback(() => swipeable.current?.close(), []);

  const renderRightActions = useCallback(
    () => (
      <View className="flex-row">
        <SwipeAction
          icon="copy-outline"
          label="Copy"
          tint="#FFFFFF"
          background="#2c2c2e"
          onPress={() => {
            close();
            onCopy(item);
          }}
        />
        <SwipeAction
          icon="trash-outline"
          label="Delete"
          tint="#FFFFFF"
          background="#dc2626"
          onPress={() => {
            close();
            onDelete(item);
          }}
        />
      </View>
    ),
    [close, item, onCopy, onDelete]
  );

  return (
    <Swipeable
      ref={swipeable}
      friction={2}
      rightThreshold={ACTION_WIDTH / 2}
      overshootRight={false}
      renderRightActions={renderRightActions}
    >
      <View className="flex-row items-center bg-black border-b border-[#1c1c1e]">
        <Pressable
          className="flex-1 py-3.5 pl-6 pr-2"
          onPress={() => onOpen(item)}
          accessibilityRole="link"
          accessibilityLabel={`Open ${item.url}`}
        >
          <ColorizedURL
            url={item.url}
            className="text-base font-[JetBrainsMonoNL-Regular]"
            copyable={false}
            numberOfLines={3}
          />
          <Text className="text-gray-500 font-[JetBrainsMonoNL-Regular] text-xs mt-1.5">
            {formatScanTime(item.timestamp)}
          </Text>
        </Pressable>
        <TouchableOpacity
          className="w-14 h-14 items-center justify-center"
          onPress={() => onShowQR(item)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Show QR code"
        >
          <Ionicons name="qr-code-outline" size={20} color="#8e8e93" />
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
}

export function formatScanTime(timestamp: string) {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const suffix = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}:${minutes}${suffix}`;
}
