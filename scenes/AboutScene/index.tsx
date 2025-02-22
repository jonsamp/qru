import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";

const backIcon = `data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="white"/>
</svg>`;

export default function AboutScene() {
  const router = useRouter();

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
              ABOUT
            </Text>
          </View>
          <View style={{ width: 35 }} />
        </View>
      </View>
      <View className="flex-1 px-6 py-4">
        <Text className="text-white font-[JetBrainsMonoNL-Regular] text-base">
          QRU? is a simple QR code scanner that helps you understand what's in a
          QR code before you open it.
        </Text>
      </View>
    </View>
  );
}
