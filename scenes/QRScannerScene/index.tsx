import React from "react";
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
import Animated, { SlideInDown, FadeOut } from "react-native-reanimated";
import { CameraView } from "expo-camera";
import { ColorizedURL } from "../../components/ColorizedURL";
import { parseCustomURL } from "../../utils/urlParser";
import { saveURL } from "../../utils/storage";
import { useState } from "react";
import { ParsedURL } from "../../utils/types";

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
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          ...styles.historyIcon,
          top: 8 + insets.top,
          right: Platform.select({
            ios: 20 + insets.right,
            android: 8 + insets.right,
          }),
        }}
        onPress={() => router.push("/history")}
      >
        <Ionicons name="time-outline" size={28} color="white" />
      </TouchableOpacity>

      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={(result: BarcodeResult) => {
          setScannedURL(result.data);
          setParsedURL(parseCustomURL(result.data));
          saveURL(result.data);
        }}
      >
        {parsedURL && isCardVisible && (
          <Animated.View
            entering={SlideInDown.springify()
              .damping(15)
              .stiffness(80)
              .mass(0.8)}
            exiting={FadeOut.duration(200)}
            style={{
              ...styles.cardContainer,
              bottom: 8 + insets.bottom,
            }}
          >
            <View
              style={{
                ...styles.contentContainer,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: "#888",
              }}
            >
              <Text style={{ fontWeight: "600", fontSize: 16 }}>
                Scanned data
              </Text>
              <TouchableOpacity
                onPress={() => setIsCardVisible(false)}
                activeOpacity={1}
              >
                <Ionicons name="close" size={24} color="#888" />
              </TouchableOpacity>
            </View>
            <Animated.ScrollView>
              <View style={styles.contentContainer}>
                {scannedURL !== "no data" && (
                  <ColorizedURL
                    url={scannedURL || ""}
                    style={styles.completeUrl}
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
                  <View style={styles.divider} />

                  <View style={styles.contentContainer}>
                    {parsedURL.protocol &&
                      parsedURL.protocol !== ":" &&
                      parsedURL.protocol !== "invalid" && (
                        <View style={styles.urlComponent}>
                          <Text style={styles.label}>Protocol</Text>
                          <Text style={styles.value}>{parsedURL.protocol}</Text>
                        </View>
                      )}
                    {parsedURL.host &&
                      parsedURL.host !== "null" &&
                      parsedURL.host !== "undefined" &&
                      parsedURL.host !== "invalid" && (
                        <View style={styles.urlComponent}>
                          <Text style={styles.label}>Host</Text>
                          <Text style={styles.value}>{parsedURL.host}</Text>
                        </View>
                      )}
                    {parsedURL.pathname &&
                      parsedURL.pathname !== "/" &&
                      parsedURL.pathname !== "null" &&
                      parsedURL.pathname !== "undefined" &&
                      parsedURL.pathname !== "invalid" && (
                        <View style={styles.urlComponent}>
                          <Text style={styles.label}>Path</Text>
                          <Text style={styles.value}>{parsedURL.pathname}</Text>
                        </View>
                      )}
                    {Object.entries(parsedURL.searchParams).length > 0 &&
                      Object.entries(parsedURL.searchParams).map(
                        ([key, value]) =>
                          value &&
                          value !== "null" &&
                          value !== "undefined" &&
                          value !== "invalid" && (
                            <View key={key + value} style={styles.urlComponent}>
                              <Text style={styles.label}>{key}</Text>
                              <Text style={styles.value}>{value}</Text>
                            </View>
                          )
                      )}
                  </View>
                </>
              )}
            </Animated.ScrollView>
          </Animated.View>
        )}
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  historyIcon: {
    position: "absolute",
    zIndex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    position: "absolute",
    left: 8,
    right: 8,
    backgroundColor: "white",
    borderRadius: 16,
    maxHeight: "60%",
    overflow: "hidden",
  },
  contentContainer: {
    padding: 16,
  },
  completeUrl: {
    fontSize: 16,
    fontFamily: "JetBrainsMonoNL-Regular",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#888",
  },
  urlComponent: {
    marginTop: 12,
  },
  label: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontFamily: "JetBrainsMonoNL-Regular",
  },
});
