import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useIsFocused } from "expo-router/react-navigation";
import { CameraView, scanFromURLAsync } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { logEvent } from "../../utils/analytics";
import { parseCustomURL } from "../../utils/urlParser";
import { saveURL } from "../../utils/storage";
import { ScanReticle } from "../../components/ScanReticle";
import { ToastProvider, useToast } from "../../components/Toast";
import { Image } from "expo-image";

const logsIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI0LjE5NTMxIiB5PSI1LjA5NzY2IiB3aWR0aD0iMTUuNjA5NCIgaGVpZ2h0PSIyLjUiIGZpbGw9IndoaXRlIi8+PHJlY3QgeD0iNC4xOTUzMSIgeT0iMTAuNDY2OCIgd2lkdGg9IjE1LjYwOTQiIGhlaWdodD0iMi41IiBmaWxsPSJ3aGl0ZSIvPjxyZWN0IHg9IjQuMTk1MzEiIHk9IjE1LjgzNTkiIHdpZHRoPSIxMC4zNzg5IiBoZWlnaHQ9IjIuNSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=";

const qrIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIxMC45MTgiIHk9IjQuNjAxNTYiIHdpZHRoPSIyLjE2NTE5IiBoZWlnaHQ9IjIuMTY1MTkiIGZpbGw9IndoaXRlIi8+PHJlY3QgeD0iMTAuOTE4IiB5PSI3Ljg0OTYxIiB3aWR0aD0iMi4xNjUxOSIgaGVpZ2h0PSIyLjE2NTE5IiBmaWxsPSJ3aGl0ZSIvPjxyZWN0IHg9IjEwLjkxOCIgeT0iMTMuOTg2MyIgd2lkdGg9IjIuMTY1MTkiIGhlaWdodD0iMi4xNjUxOSIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSIxNy43NDIyIiB5PSIxMy45ODYzIiB3aWR0aD0iMi4xNjUxOSIgaGVpZ2h0PSIyLjE2NTE5IiBmaWxsPSJ3aGl0ZSIvPjxyZWN0IHg9IjE0LjQ5NjEiIHk9IjE3LjIzMjQiIHdpZHRoPSIyLjE2NTE5IiBoZWlnaHQ9IjIuMTY1MTkiIGZpbGw9IndoaXRlIi8+PHJlY3QgeD0iMTQuNDk2MSIgeT0iMTAuOTE4IiB3aWR0aD0iMi4xNjUxOSIgaGVpZ2h0PSIyLjE2NTE5IiBmaWxsPSJ3aGl0ZSIvPjxyZWN0IHg9IjQuMDg5ODQiIHk9IjEwLjkxOCIgd2lkdGg9IjIuMTY1MTkiIGhlaWdodD0iMi4xNjUxOSIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSI3LjMzOTg0IiB5PSIxMC45MTgiIHdpZHRoPSIyLjE2NTE5IiBoZWlnaHQ9IjIuMTY1MTkiIGZpbGw9IndoaXRlIi8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05LjUwMjgyIDQuNjAxNTZINC4wODk4NFYxMC4wMTQ1SDkuNTAyODJWNC42MDE1NlpNNy45MDg1MyA2LjI1NTA2SDUuNzQzMzRWOC40MjAyNUg3LjkwODUzVjYuMjU1MDZaIiBmaWxsPSJ3aGl0ZSIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOS41MDI4MiAxMy45ODQ0SDQuMDg5ODRWMTkuMzk3NEg5LjUwMjgyVjEzLjk4NDRaTTcuOTA4NTMgMTUuNjM3OUg1Ljc0MzM0VjE3LjgwMzFINy45MDg1M1YxNS42Mzc5WiIgZmlsbD0id2hpdGUiLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE5LjkwNTIgNC42MDE1NkgxNC40OTIyVjEwLjAxNDVIMTkuOTA1MlY0LjYwMTU2Wk0xOC4zMTA5IDYuMjU1MDZIMTYuMTQ1N1Y4LjQyMDI1SDE4LjMxMDlWNi4yNTUwNloiIGZpbGw9IndoaXRlIi8+PC9zdmc+";

const IDLE_RESET_MS = 1500;

interface BarcodeResult {
  data: string;
}

function CameraControl({
  icon,
  label,
  active,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className={`flex-1 flex-row items-center justify-center gap-2 py-3.5 rounded-full border ${
        active ? "bg-white border-white" : "border-[#333333]"
      }`}
      style={active ? undefined : { backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: !!active }}
    >
      <Ionicons name={icon} size={18} color={active ? "#000" : "#FFF"} />
      <Text
        className={`font-[JetBrainsMonoNL-Regular] text-sm ${
          active ? "text-black" : "text-white"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function Scanner() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { showToast } = useToast();
  const [torchOn, setTorchOn] = useState(false);
  const presentedURL = useRef<string | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
      }
    },
    []
  );

  const presentScan = useCallback(
    (data: string) => {
      if (presentedURL.current === data) {
        return;
      }
      presentedURL.current = data;

      const parsed = parseCustomURL(data);
      saveURL(data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      logEvent("qru.qr_scanned", {
        attributes: {
          isUrl: /^https?:\/\//i.test(data),
          protocol: parsed.protocol,
          contentLength: data.length,
        },
      });

      router.push({ pathname: "/scanned", params: { url: data } });
    },
    [router]
  );

  const handleBarcodeScanned = useCallback(
    (result: BarcodeResult) => {
      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
      }
      idleTimer.current = setTimeout(() => {
        presentedURL.current = null;
      }, IDLE_RESET_MS);

      presentScan(result.data);
    },
    [presentScan]
  );

  const handleScanFromPhoto = useCallback(async () => {
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });
    if (picked.canceled) {
      return;
    }

    try {
      const results = await scanFromURLAsync(picked.assets[0].uri, ["qr"]);
      if (results.length === 0) {
        logEvent("qru.photo_scan_empty");
        showToast("No QR code found in that image", "error");
        return;
      }
      logEvent("qru.photo_scanned");
      presentScan(results[0].data);
    } catch (error) {
      console.error("Failed to scan image:", error);
      showToast("Could not read that image", "error");
    }
  }, [presentScan, showToast]);

  const handleToggleTorch = useCallback(() => {
    setTorchOn((previous) => {
      logEvent("qru.torch_toggled", { attributes: { enabled: !previous } });
      return !previous;
    });
  }, []);

  return (
    <View className="flex-1 bg-black">
      <View className="pt-safe bg-black">
        <View className="px-6 py-2 flex-row items-center">
          <View className="flex-1 items-start">
            <TouchableOpacity
              className="flex-row items-center gap-1.5"
              onPress={() => router.push("/about")}
              accessibilityRole="button"
              accessibilityLabel="About QRU?"
            >
              <Image
                source={qrIcon}
                style={{ width: 26, height: 26 }}
                contentFit="contain"
              />
              <Text className="text-white font-[JetBrainsMonoNL-Bold] text-lg">
                QRU?
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-1 items-end">
            <TouchableOpacity
              className="px-4 py-1.5 items-center justify-center"
              onPress={() => router.push("/logs")}
              accessibilityRole="button"
              accessibilityLabel="Scan log"
            >
              <Image
                source={logsIcon}
                style={{ width: 20, height: 20 }}
                contentFit="contain"
              />
              <Text className="text-gray-300 font-[JetBrainsMonoNL-Regular] text-sm">
                Log
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="flex-1">
        <CameraView
          style={{ flex: 1 }}
          enableTorch={torchOn}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={isFocused ? handleBarcodeScanned : undefined}
        />
        <ScanReticle active={isFocused} />
        <View className="absolute left-0 right-0 bottom-0 px-6 pb-safe">
          <View className="flex-row gap-3 mb-6">
            <CameraControl
              icon={torchOn ? "sunny" : "sunny-outline"}
              label="Flashlight"
              active={torchOn}
              onPress={handleToggleTorch}
            />
            <CameraControl
              icon="image-outline"
              label="Photo"
              onPress={handleScanFromPhoto}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

export default function QRScannerScene() {
  return (
    <ToastProvider>
      <Scanner />
    </ToastProvider>
  );
}
