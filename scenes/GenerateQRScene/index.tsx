import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import QRCode from "qrcode";
import { ColorizedURL } from "../../components/ColorizedURL";

export default function GenerateQRScene() {
  const router = useRouter();
  const { url } = useLocalSearchParams<{ url: string }>();
  const [qrDataUri, setQrDataUri] = useState<string | null>(null);

  useEffect(() => {
    if (url) {
      QRCode.toString(url, { type: "svg", margin: 0 }, (err, svg) => {
        if (!err && svg) {
          const base64 = btoa(svg);
          setQrDataUri(`data:image/svg+xml;base64,${base64}`);
        }
      });
    }
  }, [url]);

  return (
    <View className={`flex-1 bg-[#111111] ${Platform.OS === "android" ? "pt-safe" : ""}`}>
        <View className="flex-row justify-between items-center px-6 pt-6 pb-4">
          <Text className="text-base font-[JetBrainsMonoNL-Bold] text-white">
            GENERATED QR CODE
          </Text>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={1}>
            <Ionicons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center justify-center">
          <View className="bg-white p-6">
            {qrDataUri && (
              <Image
                source={qrDataUri}
                style={{ width: 200, height: 200 }}
                contentFit="contain"
              />
            )}
          </View>
          <View className="px-6 pt-6">
            <ColorizedURL
              url={url || ""}
              className="text-sm font-[JetBrainsMonoNL-Regular]"
              copyable={false}
            />
          </View>
        </View>
    </View>
  );
}
