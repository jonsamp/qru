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

const STORAGE_KEY = "@qru_scanned_urls";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [scannedURL, setScannedURL] = useState<string | null>("no data");
  const [parsedURL, setParsedURL] = useState<ParsedURL | null>(null);
  const [savedURLs, setSavedURLs] = useState<SavedQRCode[]>([]);
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();

  useEffect(() => {
    // Load saved URLs when the app starts
    loadSavedURLs();
  }, []);

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

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.historyIcon}
        onPress={() => router.push("/history")}
      >
        <Ionicons name="time-outline" size={28} color="white" />
      </TouchableOpacity>

      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={(result) => {
          setScannedURL(result.data);
          setParsedURL(parseCustomURL(result.data));
          saveURL(result.data);
        }}
      >
        <ScrollView style={styles.scannedURLContainer}>
          {parsedURL ? (
            <>
              <View style={styles.contentContainer}>
                {scannedURL !== "no data" && (
                  <ColorizedURL
                    url={scannedURL || ""}
                    style={[styles.completeUrl]}
                  />
                )}
              </View>

              <View style={styles.divider} />

              <View style={styles.contentContainer}>
                <Text style={styles.urlComponent}>
                  <Text style={styles.label}>Protocol:</Text>
                  <Text style={styles.value}> {parsedURL.protocol}</Text>
                </Text>
                <Text style={styles.urlComponent}>
                  <Text style={styles.label}>Host:</Text>
                  <Text style={styles.value}> {parsedURL.host}</Text>
                </Text>
                <Text style={styles.urlComponent}>
                  <Text style={styles.label}>Path:</Text>
                  <Text style={styles.value}> {parsedURL.pathname}</Text>
                </Text>
                {Object.entries(parsedURL.searchParams).map(([key, value]) => (
                  <Text key={key} style={styles.urlComponent}>
                    <Text style={styles.label}>{key}:</Text>
                    <Text style={styles.value}> {value}</Text>
                  </Text>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.contentContainer}>
              <Text>Scan a QR code</Text>
            </View>
          )}
        </ScrollView>
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
  scannedURLContainer: {
    backgroundColor: "#ffffff",
    padding: 0,
    borderRadius: 20,
    margin: 10,
    opacity: 0.95,
    maxWidth: "100%",
    maxHeight: "70%",
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 16,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  urlTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  dividerTitle: {
    marginTop: 24,
  },
  urlComponent: {
    fontSize: 14,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  completeUrl: {
    padding: 12,
    borderRadius: 12,
    flexWrap: "wrap",
    marginTop: 8,
    fontSize: 16,
    lineHeight: 24,
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
    top: 48,
    right: 16,
    zIndex: 10,
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
  },
});
