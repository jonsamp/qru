import React from "react";
import { Text, Pressable } from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { tokenizeURL } from "../utils/urlParser";
import { URLTokenKind } from "../utils/types";
import { useToast } from "./Toast";

interface ColorizedURLProps {
  url: string;
  style?: any;
  className?: string;
  copyable?: boolean;
  numberOfLines?: number;
}

const TOKEN_COLORS: Record<URLTokenKind, string> = {
  scheme: "#FF4DB8",
  punct: "#6B7280",
  host: "#00B7FF",
  path: "#4ADE80",
  key: "#D8B4FE",
  value: "#FFB84D",
  fragment: "#FFB84D",
  text: "#FFFFFF",
};

export function ColorizedURL({
  url,
  style,
  className,
  copyable = true,
  numberOfLines,
}: ColorizedURLProps) {
  const { showToast } = useToast();
  const tokens = tokenizeURL(url);

  const handlePress = async () => {
    if (!copyable) return;
    try {
      await Clipboard.setStringAsync(url);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast("Copied to clipboard");
    } catch (error) {
      console.error("Failed to copy:", error);
      showToast("Failed to copy", "error");
    }
  };

  const label = (
    <Text
      className={`font-[JetBrainsMonoNL-Regular] text-lg ${className}`}
      style={style}
      numberOfLines={numberOfLines}
    >
      {tokens.map((token, index) => (
        <Text key={index} style={{ color: TOKEN_COLORS[token.kind] }}>
          {token.text}
        </Text>
      ))}
    </Text>
  );

  if (!copyable) {
    return label;
  }

  return (
    <Pressable onPress={handlePress} className="w-full">
      {label}
    </Pressable>
  );
}
