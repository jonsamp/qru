import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { CameraView } from "expo-camera";
import { parseCustomURL } from "../../utils/urlParser";
import { saveURL } from "../../utils/storage";
import { ParsedURL } from "../../utils/types";
import { ReadyToScan } from "./ReadyToScan";
import { ScannedData } from "./ScannedData";

interface BarcodeResult {
  data: string;
}

export default function QRScannerScene() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [scannedURL, setScannedURL] = useState<string | null>(null);
  const [parsedURL, setParsedURL] = useState<ParsedURL | null>(null);
  const [isCardVisible, setIsCardVisible] = useState(true);

  return (
    <View className="flex-1 bg-black">
      <TouchableOpacity
        className="absolute z-10 bg-black px-4 py-1.5 items-center justify-center"
        style={{
          top: 8 + insets.top,
          right: Platform.select({
            ios: 20 + insets.right,
            android: 8 + insets.right,
          }),
        }}
        onPress={() => router.push("/history")}
      >
        <Ionicons name="time-outline" size={28} color="white" />
        <Text className="text-white font-[JetBrainsMonoNL-Regular] text-sm">
          Logs
        </Text>
      </TouchableOpacity>

      <CameraView
        style={{ flex: 1 }}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={(result: BarcodeResult) => {
          setScannedURL(result.data);
          setParsedURL(parseCustomURL(result.data));
          saveURL(result.data);
          setIsCardVisible(true);
        }}
      >
        <ReadyToScan />
        {parsedURL && isCardVisible && (
          <ScannedData
            parsedURL={parsedURL}
            scannedURL={scannedURL}
            onClose={() => setIsCardVisible(false)}
          />
        )}
      </CameraView>
    </View>
  );
}
