import React from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import readyToScanGif from "../../assets/images/ready-to-scan.gif";

export function ReadyToScan() {
  return (
    <View className="items-center justify-center">
      <View>
        <Text className="text-white font-[JetBrainsMonoNL-Bold] text-base pb-1">
          READY TO SCAN
        </Text>
        <View>
          <Image
            source={readyToScanGif}
            style={{
              width: 360 / 3 + 4,
              height: 2,
            }}
          />
        </View>
      </View>
    </View>
  );
}
