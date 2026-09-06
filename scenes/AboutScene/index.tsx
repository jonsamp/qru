import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Updates from "expo-updates";
import { useObserve } from "expo-observe";

export default function AboutScene() {
  const router = useRouter();
  const { markInteractive } = useObserve();

  useEffect(() => {
    markInteractive();
  }, [markInteractive]);

  return (
    <View className="flex-1 bg-[#111111]">
      <View className={Platform.OS === "android" ? "pt-safe" : ""}>
        <View className="px-6 pt-6 pb-4 flex-row items-center justify-between">
          <Text className="text-white font-[JetBrainsMonoNL-Bold] text-lg">
            ABOUT
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={12}
          >
            <Ionicons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView className="flex-1">
        <View className="px-6 py-4">
          <Text className="text-white font-[JetBrainsMonoNL-Regular] text-base">
            QRU? is a QR code debugging app built originally to help debug EAS
            Update QR codes. Now, it's a general purpose QR code scanner. You
            can copy scanned data and view the actual QR code for scanning with
            other devices.
          </Text>
        </View>
        <View className="px-6 py-4">
          <Text className="text-white font-[JetBrainsMonoNL-Regular] text-base">
            QRU? is available on Android, iOS, and on the web at{" "}
            <Text
              className="underline"
              onPress={() => Linking.openURL("https://qru.expo.app")}
            >
              qru.expo.app
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
            App Version: {Constants.expoConfig?.version ?? "Unknown"}
          </Text>
          <Text className="text-white font-[JetBrainsMonoNL-Regular] text-base">
            Runtime Version: {Updates.runtimeVersion ?? "Unknown"}
          </Text>
          <Text className="text-white font-[JetBrainsMonoNL-Regular] text-base">
            Update ID: {Updates.updateId ?? "Embedded"}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
