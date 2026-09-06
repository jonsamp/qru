import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useObserve } from "expo-observe";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ColorizedURL } from "../../components/ColorizedURL";
import { ToastProvider, useToast } from "../../components/Toast";
import { parseCustomURL } from "../../utils/urlParser";
import { logEvent } from "../../utils/analytics";
import { ParsedURL } from "../../utils/types";

function CopyableField({ label, value }: { label: string; value: string }) {
  const { showToast } = useToast();

  const handlePress = async () => {
    try {
      await Clipboard.setStringAsync(value);
      logEvent("qru.scan_copied", {
        attributes: {
          source: "field",
          field: label.startsWith("Param: ") ? "param" : label.toLowerCase(),
        },
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast(`Copied ${label.replace("Param: ", "")}`);
    } catch (error) {
      console.error("Failed to copy:", error);
      showToast("Failed to copy", "error");
    }
  };

  return (
    <Pressable onPress={handlePress} className="py-2">
      <Text className="text-sm text-gray-400 mb-1 font-[JetBrainsMonoNL-Regular]">
        {label}
      </Text>
      <Text className="text-base text-white font-[JetBrainsMonoNL-Regular]">
        {value}
      </Text>
    </Pressable>
  );
}

function fieldsFor(parsedURL: ParsedURL) {
  const fields: { label: string; value: string }[] = [];
  const usable = (value: string) =>
    value && !["invalid", "null", "undefined", ":"].includes(value);

  if (usable(parsedURL.protocol)) {
    fields.push({ label: "Protocol", value: parsedURL.protocol });
  }
  if (usable(parsedURL.host)) {
    fields.push({ label: "Host", value: parsedURL.host });
  }
  if (usable(parsedURL.pathname) && parsedURL.pathname !== "/") {
    fields.push({ label: "Path", value: parsedURL.pathname });
  }
  Object.entries(parsedURL.searchParams).forEach(([key, value]) => {
    if (usable(value)) {
      fields.push({ label: `Param: ${key}`, value });
    }
  });

  return fields;
}

function ScannedContent({
  scannedURL,
  fields,
  footerHeight,
}: {
  scannedURL: string;
  fields: { label: string; value: string }[];
  footerHeight: number;
}) {
  const router = useRouter();
  const { markInteractive } = useObserve();

  useEffect(() => {
    markInteractive({ params: { fieldCount: fields.length } });
  }, [markInteractive, fields.length]);

  return (
    <ScrollView
      className="flex-1 bg-[#111111]"
      contentContainerStyle={{ paddingBottom: footerHeight + 16 }}
    >
      <View className="flex-row justify-between items-center px-6 pt-4 pb-2">
        <Text className="text-base font-[JetBrainsMonoNL-Bold] text-white">
          SCANNED DATA
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={12}
        >
          <Ionicons name="close" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View className="px-6 pt-3 pb-5">
        <ColorizedURL
          url={scannedURL}
          className="text-xl leading-8 font-[JetBrainsMonoNL-Regular]"
        />
      </View>

      {fields.length > 0 && (
        <View className="px-6 border-t border-[#262626] pt-2">
          {fields.map((field) => (
            <CopyableField
              key={field.label + field.value}
              label={field.label}
              value={field.value}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function ActionRow({
  scannedURL,
  parsedURL,
  paddingBottom,
}: {
  scannedURL: string;
  parsedURL: ParsedURL;
  paddingBottom: number;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const isURL = /^https?:\/\//i.test(scannedURL);

  const handleCopy = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(scannedURL);
      logEvent("qru.scan_copied", {
        attributes: { source: "scan_result", protocol: parsedURL.protocol },
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCopied(true);
      showToast("Copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy:", error);
      showToast("Failed to copy", "error");
    }
  }, [scannedURL, parsedURL.protocol, showToast]);

  const handleVisit = useCallback(() => {
    logEvent("qru.scanned_url_visited", {
      attributes: { protocol: parsedURL.protocol },
    });
    Linking.openURL(scannedURL);
  }, [scannedURL, parsedURL.protocol]);

  return (
    <View
      className="flex-row gap-2 px-6 pt-3 border-t border-[#262626] bg-[#111111]"
      style={{ paddingBottom }}
    >
      <TouchableOpacity
        className="flex-1 flex-row items-center justify-center gap-2 py-3.5 rounded-full border border-[#333333]"
        onPress={handleCopy}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Copy scanned data"
      >
        <Ionicons
          name={copied ? "checkmark" : "copy-outline"}
          size={18}
          color={copied ? "#4ade80" : "#FFF"}
        />
        <Text
          className={`font-[JetBrainsMonoNL-Regular] text-sm ${
            copied ? "text-green-400" : "text-white"
          }`}
        >
          {copied ? "Copied" : "Copy"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 flex-row items-center justify-center gap-2 py-3.5 rounded-full border border-[#333333]"
        onPress={() =>
          router.push({ pathname: "/generate-qr", params: { url: scannedURL } })
        }
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Show QR code"
      >
        <Ionicons name="qr-code-outline" size={18} color="#FFF" />
        <Text className="text-white font-[JetBrainsMonoNL-Regular] text-sm">
          QR Code
        </Text>
      </TouchableOpacity>

      {isURL && (
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center gap-2 py-3.5 rounded-full bg-white"
          onPress={handleVisit}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Visit link"
        >
          <Ionicons name="open-outline" size={18} color="#000" />
          <Text className="text-black font-[JetBrainsMonoNL-Regular] text-sm">
            Visit
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function ScannedDataScene() {
  const { url } = useLocalSearchParams<{ url: string }>();
  const insets = useSafeAreaInsets();

  const scannedURL = Array.isArray(url) ? url[0] : (url ?? "");
  const parsedURL = parseCustomURL(scannedURL);
  const fields = fieldsFor(parsedURL);
  const paddingBottom = Math.max(insets.bottom, 16);

  return (
    <ToastProvider
      footer={
        <ActionRow
          scannedURL={scannedURL}
          parsedURL={parsedURL}
          paddingBottom={paddingBottom}
        />
      }
    >
      <ScannedContent
        scannedURL={scannedURL}
        fields={fields}
        footerHeight={64 + paddingBottom}
      />
    </ToastProvider>
  );
}
