import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import QRCode from "qrcode";
import * as Clipboard from "expo-clipboard";
import { ColorizedURL } from "../../components/ColorizedURL";
import { parseCustomURL } from "../../utils/urlParser";
import { ParsedURL } from "../../utils/types";

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

export default function GenerateQRScene() {
  const router = useRouter();
  const { url } = useLocalSearchParams<{ url: string }>();
  const [qrDataUri, setQrDataUri] = useState<string | null>(null);
  const [parsedURL, setParsedURL] = useState<ParsedURL | null>(null);

  useEffect(() => {
    if (url) {
      QRCode.toString(url, { type: "svg", margin: 0 }, (err, svg) => {
        if (!err && svg) {
          const base64 = btoa(svg);
          setQrDataUri(`data:image/svg+xml;base64,${base64}`);
        }
      });
      setParsedURL(parseCustomURL(url));
    }
  }, [url]);

  return (
    <View
      className={`flex-1 bg-[#111111] ${Platform.OS === "android" ? "pt-safe" : ""}`}
    >
      <View className="flex-row justify-between items-center px-6 pt-6 pb-4">
        <Text className="text-base font-[JetBrainsMonoNL-Bold] text-white">
          QR DETAILS
        </Text>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={1}>
          <Ionicons name="close" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {qrDataUri && (
          <View className="px-6 py-8 items-center">
            <View className="bg-white p-4" style={{ width: "80%", maxWidth: 300 }}>
              <Image
                source={qrDataUri}
                style={{ width: "100%", aspectRatio: 1 }}
                contentFit="contain"
              />
            </View>
          </View>
        )}
        <View className="px-6 pb-4">
          <ColorizedURL
            url={url || ""}
            className="text-base font-[JetBrainsMonoNL-Regular]"
            copyable={false}
          />
        </View>

        {parsedURL &&
          ((parsedURL.protocol && parsedURL.protocol !== "invalid") ||
            (parsedURL.host && parsedURL.host !== "invalid") ||
            (parsedURL.pathname &&
              parsedURL.pathname !== "/" &&
              parsedURL.pathname !== "invalid") ||
            Object.entries(parsedURL.searchParams).some(
              ([_, value]) => value && value !== "invalid"
            )) && (
            <View className="px-6 pt-4 gap-4">
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
          )}
      </ScrollView>
    </View>
  );
}
