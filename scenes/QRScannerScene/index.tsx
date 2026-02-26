import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { CameraView } from "expo-camera";
import { parseCustomURL } from "../../utils/urlParser";
import { saveURL } from "../../utils/storage";
import { ParsedURL } from "../../utils/types";
import { ReadyToScan } from "./ReadyToScan";
import { ScannedData } from "./ScannedData";
import { Image } from "expo-image";

const logsIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI0LjE5NTMxIiB5PSI1LjA5NzY2IiB3aWR0aD0iMTUuNjA5NCIgaGVpZ2h0PSIyLjUiIGZpbGw9IndoaXRlIi8+PHJlY3QgeD0iNC4xOTUzMSIgeT0iMTAuNDY2OCIgd2lkdGg9IjE1LjYwOTQiIGhlaWdodD0iMi41IiBmaWxsPSJ3aGl0ZSIvPjxyZWN0IHg9IjQuMTk1MzEiIHk9IjE1LjgzNTkiIHdpZHRoPSIxMC4zNzg5IiBoZWlnaHQ9IjIuNSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=";

const qrIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIxMC45MTgiIHk9IjQuNjAxNTYiIHdpZHRoPSIyLjE2NTE5IiBoZWlnaHQ9IjIuMTY1MTkiIGZpbGw9IndoaXRlIi8+PHJlY3QgeD0iMTAuOTE4IiB5PSI3Ljg0OTYxIiB3aWR0aD0iMi4xNjUxOSIgaGVpZ2h0PSIyLjE2NTE5IiBmaWxsPSJ3aGl0ZSIvPjxyZWN0IHg9IjEwLjkxOCIgeT0iMTMuOTg2MyIgd2lkdGg9IjIuMTY1MTkiIGhlaWdodD0iMi4xNjUxOSIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSIxNy43NDIyIiB5PSIxMy45ODYzIiB3aWR0aD0iMi4xNjUxOSIgaGVpZ2h0PSIyLjE2NTE5IiBmaWxsPSJ3aGl0ZSIvPjxyZWN0IHg9IjE0LjQ5NjEiIHk9IjE3LjIzMjQiIHdpZHRoPSIyLjE2NTE5IiBoZWlnaHQ9IjIuMTY1MTkiIGZpbGw9IndoaXRlIi8+PHJlY3QgeD0iMTQuNDk2MSIgeT0iMTAuOTE4IiB3aWR0aD0iMi4xNjUxOSIgaGVpZ2h0PSIyLjE2NTE5IiBmaWxsPSJ3aGl0ZSIvPjxyZWN0IHg9IjQuMDg5ODQiIHk9IjEwLjkxOCIgd2lkdGg9IjIuMTY1MTkiIGhlaWdodD0iMi4xNjUxOSIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSI3LjMzOTg0IiB5PSIxMC45MTgiIHdpZHRoPSIyLjE2NTE5IiBoZWlnaHQ9IjIuMTY1MTkiIGZpbGw9IndoaXRlIi8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05LjUwMjgyIDQuNjAxNTZINC4wODk4NFYxMC4wMTQ1SDkuNTAyODJWNC42MDE1NlpNNy45MDg1MyA2LjI1NTA2SDUuNzQzMzRWOC40MjAyNUg3LjkwODUzVjYuMjU1MDZaIiBmaWxsPSJ3aGl0ZSIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOS41MDI4MiAxMy45ODQ0SDQuMDg5ODRWMTkuMzk3NEg5LjUwMjgyVjEzLjk4NDRaTTcuOTA4NTMgMTUuNjM3OUg1Ljc0MzM0VjE3LjgwMzFINy45MDg1M1YxNS42Mzc5WiIgZmlsbD0id2hpdGUiLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE5LjkwNTIgNC42MDE1NkgxNC40OTIyVjEwLjAxNDVIMTkuOTA1MlY0LjYwMTU2Wk0xOC4zMTA5IDYuMjU1MDZIMTYuMTQ1N1Y4LjQyMDI1SDE4LjMxMDlWNi4yNTUwNloiIGZpbGw9IndoaXRlIi8+PC9zdmc+";

interface BarcodeResult {
  data: string;
}

export default function QRScannerScene() {
  const router = useRouter();
  const [scannedURL, setScannedURL] = useState<string | null>(null);
  const [parsedURL, setParsedURL] = useState<ParsedURL | null>(null);
  const [isCardVisible, setIsCardVisible] = useState(true);

  function handleBarcodeScanned(result: BarcodeResult) {
    setScannedURL(result.data);
    setParsedURL(parseCustomURL(result.data));
    saveURL(result.data);
    setIsCardVisible(true);
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={{ flex: 1 }}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={handleBarcodeScanned}
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
            <View className="relative -left-1">
              <ReadyToScan />
            </View>
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
