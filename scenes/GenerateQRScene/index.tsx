import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import QRCode from "qrcode";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import * as Brightness from "expo-brightness";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useObserve } from "expo-observe";
import { logEvent } from "../../utils/analytics";
import { ColorizedURL } from "../../components/ColorizedURL";
import { ToastProvider, useToast } from "../../components/Toast";
import { parseCustomURL } from "../../utils/urlParser";
import { ParsedURL } from "../../utils/types";

function CopyableField({ label, value }: { label: string; value: string }) {
  const { showToast } = useToast();

  const handlePress = async () => {
    try {
      await Clipboard.setStringAsync(value);
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

function useBoostedBrightness() {
  useEffect(() => {
    if (Platform.OS === "web") {
      return;
    }

    let previous: number | null = null;
    let cancelled = false;

    (async () => {
      try {
        previous = await Brightness.getBrightnessAsync();
        if (!cancelled) {
          await Brightness.setBrightnessAsync(1);
        }
      } catch (error) {
        console.error("Failed to raise brightness:", error);
      }
    })();

    return () => {
      cancelled = true;
      if (previous !== null) {
        Brightness.setBrightnessAsync(previous).catch(() => {});
      }
    };
  }, []);
}

function GenerateQR() {
  const router = useRouter();
  const { url } = useLocalSearchParams<{ url: string }>();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { markInteractive } = useObserve();
  const [qrDataUri, setQrDataUri] = useState<string | null>(null);
  const parsedURL = useMemo(() => (url ? parseCustomURL(url) : null), [url]);
  const plateRef = useRef<View>(null);

  useBoostedBrightness();

  useEffect(() => {
    if (!url) {
      markInteractive({ params: { hasUrl: false } });
      return;
    }
    if (qrDataUri) {
      markInteractive({ params: { hasUrl: true } });
    }
  }, [url, qrDataUri, markInteractive]);

  useEffect(() => {
    if (!url || !parsedURL) {
      return;
    }

    QRCode.toString(url, { type: "svg", margin: 0 }, (error, svg) => {
      if (!error && svg) {
        setQrDataUri(`data:image/svg+xml;base64,${btoa(svg)}`);
        logEvent("qru.qr_generated", {
          attributes: {
            isUrl: /^https?:\/\//i.test(url),
            protocol: parsedURL.protocol,
          },
        });
      }
    });
  }, [url, parsedURL]);

  const capturePlate = useCallback(async () => {
    const path = await captureRef(plateRef, {
      format: "png",
      quality: 1,
      result: "tmpfile",
    });
    return path.startsWith("file://") ? path : `file://${path}`;
  }, []);

  const handleShare = useCallback(async () => {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        showToast("Sharing is not available here", "error");
        return;
      }
      const uri = await capturePlate();
      logEvent("qru.qr_shared");
      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        UTI: "public.png",
        dialogTitle: "Share QR code",
      });
    } catch (error) {
      console.error("Failed to share QR code:", error);
      showToast("Could not share the QR code", "error");
    }
  }, [capturePlate, showToast]);

  const handleSave = useCallback(async () => {
    try {
      const permission = await MediaLibrary.requestPermissionsAsync(true);
      if (!permission.granted) {
        showToast("Photo access is needed to save", "error");
        return;
      }
      const uri = await capturePlate();
      await MediaLibrary.Asset.create(uri);
      logEvent("qru.qr_saved");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast("Saved to Photos");
    } catch (error) {
      console.error("Failed to save QR code:", error);
      showToast("Could not save the QR code", "error");
    }
  }, [capturePlate, showToast]);

  const fields = parsedURL ? fieldsFor(parsedURL) : [];

  return (
    <ScrollView
      className="flex-1 bg-[#111111]"
      contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) }}
    >
        <View className="flex-row justify-between items-center px-6 pt-4 pb-2">
          <Text className="text-base font-[JetBrainsMonoNL-Bold] text-white">
            QR DETAILS
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

        {qrDataUri && (
          <View className="px-6 py-6 items-center">
            <View
              ref={plateRef}
              collapsable={false}
              className="bg-white rounded-3xl p-5"
              style={{ width: "80%", maxWidth: 300 }}
            >
              <Image
                source={qrDataUri}
                style={{ width: "100%", aspectRatio: 1 }}
                contentFit="contain"
              />
            </View>

            <View className="flex-row gap-2 mt-6 w-full px-2">
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center gap-2 py-3.5 rounded-full border border-[#333333]"
                onPress={handleShare}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Share QR code"
              >
                <Ionicons name="share-outline" size={18} color="#FFF" />
                <Text className="text-white font-[JetBrainsMonoNL-Regular] text-sm">
                  Share
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center gap-2 py-3.5 rounded-full border border-[#333333]"
                onPress={handleSave}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Save QR code to Photos"
              >
                <Ionicons name="download-outline" size={18} color="#FFF" />
                <Text className="text-white font-[JetBrainsMonoNL-Regular] text-sm">
                  Save
                </Text>
              </TouchableOpacity>
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

        {fields.length > 0 && (
          <View className="px-6 pt-2 border-t border-[#262626] mx-0">
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

export default function GenerateQRScene() {
  return (
    <ToastProvider>
      <GenerateQR />
    </ToastProvider>
  );
}
