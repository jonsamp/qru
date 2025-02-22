import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { ColorizedURL } from "../../components/ColorizedURL";
import { loadSavedURLs } from "../../utils/storage";
import { SavedQRCode } from "../../utils/types";

const backIcon = `data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="white"/>
</svg>`;

const questionIcon = `data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 8C17 4.68629 14.3137 4 12 4C9.68629 4 7 4.68629 7 8H10C10 6.5 10.5 6 12 6C13.5 6 14 6.5 14 8C14 9.5 13.5 10 12 10H11V15H13V11.5C15.5 11 17 9.5 17 8Z" fill="white"/>
<rect x="11" y="17" width="2" height="2" fill="white"/>
</svg>`;

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
        <View className="px-6 py-4 flex-row items-center border-b border-gray-700">
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
          <TouchableOpacity
            onPress={() => router.push("/about")}
            className="z-10 items-center"
          >
            <Image
              source={questionIcon}
              style={{ width: 20, height: 20 }}
              contentFit="contain"
            />
            <Text className="text-gray-300 font-[JetBrainsMonoNL-Regular] text-sm">
              About
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView className="flex-1">
        <View>
          {savedURLs.map((item, index) => (
            <View
              key={item.url + index}
              className={`py-4 px-6 ${
                index !== 0 ? "border-t border-gray-700" : ""
              }`}
            >
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
