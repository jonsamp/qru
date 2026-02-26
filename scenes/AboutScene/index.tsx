import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import * as Updates from "expo-updates";

const backIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMTFINy44M0wxMy40MiA1LjQxTDEyIDRMNCAxMkwxMiAyMEwxMy40MSAxOC41OUw3LjgzIDEzSDIwVjExWiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=";

export default function AboutScene() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#111111]">
      <View className={Platform.OS === "android" ? "pt-safe" : ""}>
        <View className="px-6 pt-6 pb-4 flex-row items-center justify-between">
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
            App Version: {Updates.runtimeVersion}
          </Text>
          <Text className="text-white font-[JetBrainsMonoNL-Regular] text-base">
            Update ID: {Updates.updateId ?? "Embedded"}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
