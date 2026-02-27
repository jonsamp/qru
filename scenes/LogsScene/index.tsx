import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Linking, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { ColorizedURL } from "../../components/ColorizedURL";
import { loadSavedURLs, deleteURL } from "../../utils/storage";
import { SavedQRCode } from "../../utils/types";

const backIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMTFINy44M0wxMy40MiA1LjQxTDEyIDRMNCAxMkwxMiAyMEwxMy40MSAxOC41OUw3LjgzIDEzSDIwVjExWiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=";

export default function LogsScene() {
  const router = useRouter();
  const [savedURLs, setSavedURLs] = useState<SavedQRCode[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = useCallback(async (url: string, index: number) => {
    await Clipboard.setStringAsync(url);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  }, []);

  const handleDelete = useCallback(async (item: SavedQRCode) => {
    const doDelete = async () => {
      await deleteURL(item.url, item.timestamp);
      setSavedURLs((prev) =>
        prev.filter(
          (i) => !(i.url === item.url && i.timestamp === item.timestamp)
        )
      );
    };

    if (Platform.OS === "web") {
      await doDelete();
    } else {
      Alert.alert("Delete Entry", "Are you sure you want to delete this scan?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: doDelete },
      ]);
    }
  }, []);

  useEffect(() => {
    async function loadURLs() {
      const urls = await loadSavedURLs();
      // Sort URLs by timestamp in descending order (newest first)
      const sortedUrls = [...urls].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setSavedURLs(sortedUrls);
    }

    loadURLs();
  }, []);

  function formatScanTime(timestamp: string) {
    const d = new Date(timestamp);
    const month = d.toLocaleString("en-US", { month: "short" });
    const day = d.getDate();
    const hours = d.getHours();
    const mins = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const h = hours % 12 || 12;
    return `${month} ${day} @ ${h}:${mins}${ampm}`;
  }

  return (
    <View className="flex-1 bg-black">
      <View className="pt-safe">
        <View className="px-6 py-4 flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="z-10 items-center"
          >
            <Image
              source={backIcon}
              style={{ width: 20, height: 20 }}
              contentFit="contain"
            />
            <Text className="text-gray-300 font-[JetBrainsMonoNL-Regular] text-sm">
              Back
            </Text>
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-white font-[JetBrainsMonoNL-Bold] text-lg">
              SCAN LOG
            </Text>
          </View>
          <View style={{ width: 36 }} />
        </View>
      </View>
      <ScrollView className="flex-1">
        {savedURLs.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-gray-500 font-[JetBrainsMonoNL-Regular] text-base">
              No scanned QR codes yet
            </Text>
          </View>
        ) : (
          <View>
            {savedURLs.map((item, index) => (
              <View
                key={item.url + index}
                className="pt-3 pb-4 border-b border-[#222]"
              >
                <View className="flex-row">
                  <View className="flex-1 h-14 justify-center px-6">
                    <Text className="text-white font-[JetBrainsMonoNL-Regular] text-base">
                      {formatScanTime(item.timestamp)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    className="w-14 h-14 items-center justify-center"
                    onPress={() => handleCopy(item.url, index)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name={copiedIndex === index ? "checkmark" : "copy-outline"} size={20} color={copiedIndex === index ? "#4ade80" : "#FFF"} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="w-14 h-14 items-center justify-center"
                    onPress={() => router.push({ pathname: "/generate-qr", params: { url: item.url } })}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="qr-code-outline" size={20} color="#FFF" />
                  </TouchableOpacity>
                  {/^https?:\/\//i.test(item.url) && (
                    <TouchableOpacity
                      className="w-14 h-14 items-center justify-center"
                      onPress={() => Linking.openURL(item.url)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="open-outline" size={20} color="#FFF" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    className="w-14 h-14 items-center justify-center"
                    onPress={() => handleDelete(item)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>
                <View className="px-6">
                  <ColorizedURL
                    url={item.url}
                    className="text-base font-[JetBrainsMonoNL-Regular]"
                    copyable={false}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
