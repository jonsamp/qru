import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { CameraView } from "expo-camera";
import { parseCustomURL } from "../../utils/urlParser";
import { saveURL } from "../../utils/storage";
import { ParsedURL } from "../../utils/types";
import { ReadyToScan } from "./ReadyToScan";
import { ScannedData } from "./ScannedData";
import { Image } from "expo-image";

const logsIcon = `data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="4.19531" y="5.09766" width="15.6094" height="2.5" fill="white"/>
<rect x="4.19531" y="10.4668" width="15.6094" height="2.5" fill="white"/>
<rect x="4.19531" y="15.8359" width="10.3789" height="2.5" fill="white"/>
</svg>`;

const qrIcon = `data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="10.918" y="4.60156" width="2.16519" height="2.16519" fill="white"/>
<rect x="10.918" y="7.84961" width="2.16519" height="2.16519" fill="white"/>
<rect x="10.918" y="13.9863" width="2.16519" height="2.16519" fill="white"/>
<rect x="17.7422" y="13.9863" width="2.16519" height="2.16519" fill="white"/>
<rect x="14.4961" y="17.2324" width="2.16519" height="2.16519" fill="white"/>
<rect x="14.4961" y="10.918" width="2.16519" height="2.16519" fill="white"/>
<rect x="4.08984" y="10.918" width="2.16519" height="2.16519" fill="white"/>
<rect x="7.33984" y="10.918" width="2.16519" height="2.16519" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.50282 4.60156H4.08984V10.0145H9.50282V4.60156ZM7.90853 6.25506H5.74334V8.42025H7.90853V6.25506Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.50282 13.9844H4.08984V19.3974H9.50282V13.9844ZM7.90853 15.6379H5.74334V17.8031H7.90853V15.6379Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.9052 4.60156H14.4922V10.0145H19.9052V4.60156ZM18.3109 6.25506H16.1457V8.42025H18.3109V6.25506Z" fill="white"/>
</svg>`;

interface BarcodeResult {
  data: string;
}

export default function QRScannerScene() {
  const router = useRouter();
  const [scannedURL, setScannedURL] = useState<string | null>(null);
  const [parsedURL, setParsedURL] = useState<ParsedURL | null>(null);
  const [isCardVisible, setIsCardVisible] = useState(true);

  return (
    <View className="flex-1 bg-black">
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
        <View className="pt-safe bg-black">
          <View className="px-6 py-2 justify-between flex-row items-center">
            <View>
              <TouchableOpacity
                className="flex-row items-center gap-1.5"
                onPress={() => router.push("/about")}
              >
                <Image
                  source={qrIcon}
                  style={{ width: 26, height: 26 }}
                  contentFit="contain"
                />
                <Text className="text-white font-[JetBrainsMonoNL-Bold] text-lg">
                  QRU?
                </Text>
              </TouchableOpacity>
            </View>
            <View className="relative -left-1">{/* <ReadyToScan /> */}</View>
            <View>
              <TouchableOpacity
                className="px-4 py-1.5 items-center justify-center"
                onPress={() => router.push("/logs")}
              >
                <Image
                  source={logsIcon}
                  style={{ width: 20, height: 20 }}
                  contentFit="contain"
                />
                <Text className="text-gray-300 font-[JetBrainsMonoNL-Regular] text-sm">
                  Log
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </CameraView>
      {parsedURL && isCardVisible && (
        <ScannedData
          parsedURL={parsedURL}
          scannedURL={scannedURL}
          onClose={() => setIsCardVisible(false)}
        />
      )}
    </View>
  );
}
