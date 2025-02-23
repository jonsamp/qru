import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import * as Updates from "expo-updates";

const backIcon = `data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="white"/>
</svg>`;

export default function AboutScene() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-900">
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-gray-700">
        <Text className="text-white font-[JetBrainsMonoNL-Bold] text-lg">
          ABOUT
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="z-10 items-center"
        >
          <Image
            source={backIcon}
            style={{
              width: 20,
              height: 20,
              transform: [{ rotate: "-90deg" }],
            }}
            contentFit="contain"
          />
          <Text className="text-gray-300 font-[JetBrainsMonoNL-Regular] text-sm">
            Dismiss
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1">
        <View className="px-6 py-4">
          <Text className="text-white font-[JetBrainsMonoNL-Regular] text-base">
            QRU? is a QR code debugging app built originally to help debug EAS
            Update QR codes. Now, it's a general purpose QR code scanner, and
            it's fun to scan codes to see what data they contain.
          </Text>
        </View>
        <View className="px-6 py-4">
          <Text className="text-white font-[JetBrainsMonoNL-Regular] text-base">
            You can find this app's source code on GitHub at:{" "}
            <Text
              className="underline"
              onPress={() => Linking.openURL("https://github.com/jonsamp/qru")}
            >
              https://github.com/jonsamp/qru
            </Text>
            .
          </Text>
        </View>
        <View className="px-6 py-4">
          <Text className="text-white font-[JetBrainsMonoNL-Regular] text-base">
            This app is built with{" "}
            <Text
              className="underline"
              onPress={() => Linking.openURL("https://expo.dev")}
            >
              Expo
            </Text>
            . It was built and distributed automatically with{" "}
            <Text
              className="underline"
              onPress={() => Linking.openURL("https://expo.dev/eas/workflows")}
            >
              EAS Workflows
            </Text>
            .
          </Text>
        </View>
        <View className="px-6 py-4">
          <Text className="text-white font-[JetBrainsMonoNL-Regular] text-base">
            Have feedback? Mention me on{" "}
            <Text
              className="underline"
              onPress={() =>
                Linking.openURL("https://bsky.app/profile/jonsamp.dev")
              }
            >
              🦋 BlueSky
            </Text>
            .
          </Text>
        </View>
        <View className="px-6 pt-4 pb-0">
          <Text className="text-white font-[JetBrainsMonoNL-Bold] text-base">
            === APP INFORMATION ===
          </Text>
        </View>
        <View className="px-6">
          <Text className="text-white font-[JetBrainsMonoNL-Regular] text-base">
            Runtime Version: {Updates.runtimeVersion}
          </Text>
          <Text className="text-white font-[JetBrainsMonoNL-Regular] text-base">
            Update ID: {Updates.updateId ?? "Embedded"}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
