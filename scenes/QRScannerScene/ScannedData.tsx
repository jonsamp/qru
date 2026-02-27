import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Pressable,
  ScrollView,
  Linking,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { ColorizedURL } from "../../components/ColorizedURL";
import { ParsedURL } from "../../utils/types";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";

interface ScannedDataProps {
  parsedURL: ParsedURL;
  scannedURL: string | null;
  onClose: () => void;
}

function CopyableText({ label, value }: { label: string; value: string }) {
  const handlePress = async () => {
    try {
      await Clipboard.setStringAsync(value);
      const displayLabel = label.startsWith("Param: ")
        ? label.replace("Param: ", "parameter ")
        : label.toLowerCase();
      Alert.alert("Copied!", `Copied ${displayLabel} to clipboard`);
    } catch (error) {
      console.error("Failed to copy:", error);
      Alert.alert("Error", "Failed to copy text");
    }
  };

  return (
    <View>
      <Text className="text-base text-gray-400 mb-1 font-[JetBrainsMonoNL-Regular]">
        {label}
      </Text>
      <Pressable onPress={handlePress}>
        <Text className="text-base text-white font-[JetBrainsMonoNL-Regular]">
          {value}
        </Text>
      </Pressable>
    </View>
  );
}

export function ScannedData({
  parsedURL,
  scannedURL,
  onClose,
}: ScannedDataProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const isURL = scannedURL
    ? /^https?:\/\//i.test(scannedURL)
    : false;

  const handleVisit = useCallback(() => {
    if (scannedURL) {
      Linking.openURL(scannedURL);
    }
  }, [scannedURL]);

  const handleCopy = useCallback(async () => {
    if (scannedURL) {
      await Clipboard.setStringAsync(scannedURL);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [scannedURL]);

  return (
    <Animated.View
      entering={SlideInDown.duration(400)}
      exiting={SlideOutDown.duration(400)}
      className="absolute z-10 bottom-0 left-0 right-0 bg-black max-h-[60%]"
    >
      <View className="flex-row justify-between items-center px-6 py-4">
        <Text className="text-base font-[JetBrainsMonoNL-Bold] text-white">
          SCANNED DATA
        </Text>
        <TouchableOpacity onPress={onClose} activeOpacity={1}>
          <Ionicons name="close" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        <View className="px-6 py-4">
          {scannedURL !== "no data" && (
            <ColorizedURL
              url={scannedURL || ""}
              className="text-base font-[JetBrainsMonoNL-Regular] text-white"
            />
          )}
        </View>

        {((parsedURL.protocol && parsedURL.protocol !== "invalid") ||
          (parsedURL.host && parsedURL.host !== "invalid") ||
          (parsedURL.pathname &&
            parsedURL.pathname !== "/" &&
            parsedURL.pathname !== "invalid") ||
          Object.entries(parsedURL.searchParams).some(
            ([_, value]) => value && value !== "invalid"
          )) && (
          <>
            <View className="px-6 gap-4">
              {parsedURL.protocol &&
                parsedURL.protocol !== ":" &&
                parsedURL.protocol !== "invalid" && (
                  <CopyableText label="Protocol" value={parsedURL.protocol} />
                )}
              {parsedURL.host &&
                parsedURL.host !== "null" &&
                parsedURL.host !== "undefined" &&
                parsedURL.host !== "invalid" && (
                  <CopyableText label="Host" value={parsedURL.host} />
                )}
              {parsedURL.pathname &&
                parsedURL.pathname !== "/" &&
                parsedURL.pathname !== "null" &&
                parsedURL.pathname !== "undefined" &&
                parsedURL.pathname !== "invalid" && (
                  <CopyableText label="Path" value={parsedURL.pathname} />
                )}
              {Object.entries(parsedURL.searchParams).length > 0 &&
                Object.entries(parsedURL.searchParams).map(
                  ([key, value]) =>
                    value &&
                    value !== "null" &&
                    value !== "undefined" &&
                    value !== "invalid" && (
                      <CopyableText
                        key={key + value}
                        label={`Param: ${key}`}
                        value={value}
                      />
                    )
                )}
            </View>
          </>
        )}
      </ScrollView>
      <View className={`flex-row px-6 pt-4 ${Platform.OS === "web" ? "pb-4" : "pb-safe"}`}>
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center gap-2 py-4 border-l border-t border-b border-r border-[#333333] bg-black"
          onPress={handleCopy}
          activeOpacity={0.7}
        >
          <Ionicons name={copied ? "checkmark" : "copy-outline"} size={18} color={copied ? "#4ade80" : "#FFF"} />
          <Text className={`font-[JetBrainsMonoNL-Regular] text-sm ${copied ? "text-green-400" : "text-white"}`}>
            {copied ? "Copied" : "Copy"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center gap-2 py-4 border-t border-b border-r border-[#333333] bg-black"
          onPress={() => router.push({ pathname: "/generate-qr", params: { url: scannedURL || "" } })}
          activeOpacity={0.7}
        >
          <Ionicons name="qr-code-outline" size={18} color="#FFF" />
          <Text className="text-white font-[JetBrainsMonoNL-Regular] text-sm">
            QR Code
          </Text>
        </TouchableOpacity>
        {isURL && (
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center gap-2 py-4 border-t border-b border-r border-[#333333] bg-black"
            onPress={handleVisit}
            activeOpacity={0.7}
          >
            <Ionicons name="open-outline" size={18} color="#FFF" />
            <Text className="text-white font-[JetBrainsMonoNL-Regular] text-sm">
              Visit
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}
