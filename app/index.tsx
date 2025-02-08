import React, { useEffect } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { parseCustomURL } from "../helpers/urlParser";
import { SavedQRCode, ParsedURL } from "../helpers/types";
import { ColorizedURL } from "./components/ColorizedURL";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeOut,
  FadeIn,
  SlideInDown,
} from "react-native-reanimated";

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
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          ...styles.historyIcon,
          top: 8 + insets.top,
          right: 32 + insets.right,
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
            exiting={FadeOut}
            style={{
              ...styles.cardContainer,
              bottom: 8 + insets.bottom,
            }}
          >
            <TouchableOpacity
              style={{
                ...styles.closeButton,
                top: 12,
                right: 12,
              }}
              onPress={() => setIsCardVisible(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Animated.ScrollView>
              <View style={styles.contentContainer}>
                {scannedURL !== "no data" && (
                  <ColorizedURL
                    url={scannedURL || ""}
                    style={styles.completeUrl}
                  />
                )}
              </View>

              <View style={styles.divider} />

              <View style={styles.contentContainer}>
                {parsedURL.protocol && (
                  <Text style={styles.urlComponent}>
                    <Text style={styles.label}>Protocol:</Text>
                    <Text style={styles.value}> {parsedURL.protocol}</Text>
                  </Text>
                )}
                {parsedURL.host && (
                  <Text style={styles.urlComponent}>
                    <Text style={styles.label}>Host:</Text>
                    <Text style={styles.value}> {parsedURL.host}</Text>
                  </Text>
                )}
                {parsedURL.pathname && parsedURL.pathname !== "/" && (
                  <Text style={styles.urlComponent}>
                    <Text style={styles.label}>Path:</Text>
                    <Text style={styles.value}> {parsedURL.pathname}</Text>
                  </Text>
                )}
                {Object.entries(parsedURL.searchParams).length > 0 &&
                  Object.entries(parsedURL.searchParams).map(([key, value]) => (
                    <Text key={key} style={styles.urlComponent}>
                      <Text style={styles.label}>{key}:</Text>
                      <Text style={styles.value}> {value}</Text>
                    </Text>
                  ))}
              </View>
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
    borderRadius: 20,
    margin: 16,
    opacity: 0.9,
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
    paddingVertical: 12,
  },
  urlComponent: {
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
    color: "#666",
  },
  value: {
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
  },
  closeButton: {
    position: "absolute",
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
  },
});
