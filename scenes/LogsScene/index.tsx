import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
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

  const handleDelete = useCallback((item: SavedQRCode) => {
    Alert.alert("Delete Entry", "Are you sure you want to delete this scan?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteURL(item.url, item.timestamp);
          setSavedURLs((prev) =>
            prev.filter(
              (i) => !(i.url === item.url && i.timestamp === item.timestamp)
            )
          );
        },
      },
    ]);
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
                className="py-6"
              >
                <View className="flex-row mb-3">
                  <View className="flex-1 h-14 justify-center px-6 border-t border-b border-[#333333] bg-[#141414]">
                    <Text className="text-white font-[JetBrainsMonoNL-Bold] text-base">
                      Scan {savedURLs.length - index}
                    </Text>
                  </View>
                  <TouchableOpacity
                    className="w-14 h-14 items-center justify-center border-l border-t border-b border-[#333333] bg-[#141414]"
                    onPress={() => handleCopy(item.url, index)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name={copiedIndex === index ? "checkmark" : "copy-outline"} size={20} color={copiedIndex === index ? "#4ade80" : "#FFF"} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="w-14 h-14 items-center justify-center border-l border-t border-b border-[#333333] bg-[#141414]"
                    onPress={() => router.push({ pathname: "/generate-qr", params: { url: item.url } })}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="qr-code-outline" size={20} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="w-14 h-14 items-center justify-center border-l border-t border-b border-[#333333] bg-[#141414]"
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
                  <Text className="text-gray-500 font-[JetBrainsMonoNL-Regular] text-sm mt-1">
                    {new Date(item.timestamp).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
