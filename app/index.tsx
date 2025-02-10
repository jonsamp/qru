import React, { useEffect } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { parseCustomURL } from "../helpers/urlParser";
import { SavedQRCode, ParsedURL } from "../helpers/types";
import { ColorizedURL } from "../components/ColorizedURL";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeOut, SlideInDown } from "react-native-reanimated";
import WeNeedPermissions from "@/components/WeNeedPermissions";

const STORAGE_KEY = "@qru_scanned_urls";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [scannedURL, setScannedURL] = useState<string | null>("no data");
  const [parsedURL, setParsedURL] = useState<ParsedURL | null>(null);
  const [savedURLs, setSavedURLs] = useState<SavedQRCode[]>([]);
  const [isCardVisible, setIsCardVisible] = useState(false);

  useEffect(() => {
    // Load saved URLs when the app starts
    loadSavedURLs();
  }, []);

  useEffect(() => {
    if (parsedURL) {
      setIsCardVisible(true);
    }
  }, [parsedURL]);

  const loadSavedURLs = async () => {
    try {
      const urls = await AsyncStorage.getItem(STORAGE_KEY);
      if (urls) {
        setSavedURLs(JSON.parse(urls));
      }
    } catch (error) {
      console.error("Error loading saved URLs:", error);
    }
  };

  const saveURL = async (url: string) => {
    try {
      const newQRCode: SavedQRCode = {
        url,
        timestamp: new Date().toISOString(),
      };
      const updatedURLs = [
        ...savedURLs.filter((item) => item.url !== url),
        newQRCode,
      ];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedURLs));
      setSavedURLs(updatedURLs);
    } catch (error) {
      console.error("Error saving URL:", error);
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
        }}
      />
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return <WeNeedPermissions requestPermission={requestPermission} />;
  }

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
        onBarcodeScanned={(result) => {
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
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  cardContainer: {
    backgroundColor: "#ffffff",
    opacity: 0.9,
    borderRadius: 20,
    margin: 16,
    maxWidth: "100%",
    maxHeight: "70%",
    position: "absolute",
    left: 0,
    right: 0,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  completeUrl: {
    fontSize: 16,
    lineHeight: 20,
    paddingVertical: 8,
    fontWeight: "bold",
  },
  urlComponent: {
    marginVertical: 6,
  },
  label: {
    fontWeight: "600",
    color: "#888",
    marginRight: 4,
    fontSize: 16,
  },
  value: {
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
    fontSize: 14,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    width: "100%",
  },
  historyIcon: {
    position: "absolute",
    zIndex: 10,
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 100,
  },
  closeButton: {
    position: "absolute",
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
  },
});
