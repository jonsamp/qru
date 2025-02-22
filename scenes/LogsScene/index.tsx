import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ColorizedURL } from "../../components/ColorizedURL";
import { loadSavedURLs } from "../../utils/storage";
import { SavedQRCode } from "../../utils/types";

export default function LogsScene() {
  const router = useRouter();
  const [savedURLs, setSavedURLs] = useState<SavedQRCode[]>([]);

  useEffect(() => {
    async function loadURLs() {
      const urls = await loadSavedURLs();
      setSavedURLs(urls);
    }

    loadURLs();
  }, []);

  return (
    <View className="flex-1 bg-black">
      <View className="pt-safe">
        <View className="px-6 py-4 flex-row justify-between items-center">
          <Text className="text-white font-[JetBrainsMonoNL-Bold] text-lg">
            SCAN HISTORY
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-white font-[JetBrainsMonoNL-Regular]">
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView className="flex-1">
        <View className="px-6 gap-4">
          {savedURLs.map((item, index) => (
            <View key={item.url + index}>
              <ColorizedURL
                url={item.url}
                className="text-base font-[JetBrainsMonoNL-Regular]"
              />
              <Text className="text-gray-500 font-[JetBrainsMonoNL-Regular] text-sm mt-1">
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
