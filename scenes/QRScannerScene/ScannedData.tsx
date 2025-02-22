import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { SlideInDown, FadeOut } from "react-native-reanimated";
import { ColorizedURL } from "../../components/ColorizedURL";
import { ParsedURL } from "../../utils/types";

interface ScannedDataProps {
  parsedURL: ParsedURL;
  scannedURL: string | null;
  onClose: () => void;
}

export function ScannedData({
  parsedURL,
  scannedURL,
  onClose,
}: ScannedDataProps) {
  return (
    <Animated.View
      entering={SlideInDown.springify().damping(15).stiffness(80).mass(0.8)}
      exiting={FadeOut.duration(200)}
      className="absolute z-10 pb-safe bottom-0 left-0 right-0 bg-black max-h-[60%]"
    >
      <View className="flex-row justify-between items-center px-6 py-4 border-b border-gray-600">
        <Text className="text-lg font-[JetBrainsMonoNL-Bold] text-white">
          Scanned data
        </Text>
        <TouchableOpacity onPress={onClose} activeOpacity={1}>
          <Ionicons name="close" size={24} color="#888" />
        </TouchableOpacity>
      </View>
      <Animated.ScrollView>
        <View className="px-6 py-4">
          {scannedURL !== "no data" && (
            <ColorizedURL
              url={scannedURL || ""}
              className="text-base font-[JetBrainsMonoNL-Regular]"
            />
          )}
        </View>

        {((parsedURL.protocol && parsedURL.protocol !== "invalid") ||
          (parsedURL.host && parsedURL.host !== "invalid") ||
          (parsedURL.pathname &&
            parsedURL.pathname !== "/" &&
            parsedURL.pathname !== "invalid") ||
          Object.entries(parsedURL.searchParams).some(
            ([_, value]) => value && value !== "invalid"
          )) && (
          <>
            <View className="px-6 gap-4">
              {parsedURL.protocol &&
                parsedURL.protocol !== ":" &&
                parsedURL.protocol !== "invalid" && (
                  <View>
                    <Text className="text-base text-gray-400 mb-1 font-[JetBrainsMonoNL-Regular]">
                      Protocol
                    </Text>
                    <Text className="text-base text-white font-[JetBrainsMonoNL-Regular]">
                      {parsedURL.protocol}
                    </Text>
                  </View>
                )}
              {parsedURL.host &&
                parsedURL.host !== "null" &&
                parsedURL.host !== "undefined" &&
                parsedURL.host !== "invalid" && (
                  <View>
                    <Text className="text-sm text-gray-400 mb-1 font-[JetBrainsMonoNL-Regular]">
                      Host
                    </Text>
                    <Text className="text-base text-white font-[JetBrainsMonoNL-Regular]">
                      {parsedURL.host}
                    </Text>
                  </View>
                )}
              {parsedURL.pathname &&
                parsedURL.pathname !== "/" &&
                parsedURL.pathname !== "null" &&
                parsedURL.pathname !== "undefined" &&
                parsedURL.pathname !== "invalid" && (
                  <View>
                    <Text className="text-base text-gray-400 mb-1 font-[JetBrainsMonoNL-Regular]">
                      Path
                    </Text>
                    <Text className="text-base text-white font-[JetBrainsMonoNL-Regular]">
                      {parsedURL.pathname}
                    </Text>
                  </View>
                )}
              {Object.entries(parsedURL.searchParams).length > 0 &&
                Object.entries(parsedURL.searchParams).map(
                  ([key, value]) =>
                    value &&
                    value !== "null" &&
                    value !== "undefined" &&
                    value !== "invalid" && (
                      <View key={key + value}>
                        <Text className="text-base text-gray-400 mb-1 font-[JetBrainsMonoNL-Regular]">
                          Param: {key}
                        </Text>
                        <Text className="text-base text-white font-[JetBrainsMonoNL-Regular]">
                          {value}
                        </Text>
                      </View>
                    )
                )}
            </View>
          </>
        )}
      </Animated.ScrollView>
    </Animated.View>
  );
}
