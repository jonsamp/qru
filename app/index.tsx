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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { parseCustomURL } from "../helpers/urlParser";
import { SavedQRCode, ParsedURL } from "../helpers/types";

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
              <Text style={styles.urlTitle}>Complete URL:</Text>
              <Text
                style={[styles.urlComponent, styles.completeUrl]}
                numberOfLines={0}
              >
                {scannedURL}
              </Text>

              <Text style={[styles.urlTitle, styles.dividerTitle]}>
                URL Components:
              </Text>
              <View style={styles.divider} />

              <Text style={styles.urlComponent}>
                <Text style={styles.label}>Protocol:</Text> {parsedURL.protocol}
              </Text>
              <Text style={styles.urlComponent}>
                <Text style={styles.label}>Host:</Text> {parsedURL.host}
              </Text>
              <Text style={styles.urlComponent}>
                <Text style={styles.label}>Path:</Text> {parsedURL.pathname}
              </Text>
              {Object.entries(parsedURL.searchParams).map(([key, value]) => (
                <Text key={key} style={styles.urlComponent}>
                  <Text style={styles.label}>{key}:</Text> {value}
                </Text>
              ))}

              <TouchableOpacity
                style={styles.historyButton}
                onPress={() => router.push("/history")}
              >
                <Text style={styles.historyButtonText}>
                  View All Scanned URLs
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text>Scan a QR code</Text>
              <TouchableOpacity
                style={[styles.historyButton, styles.historyButtonEmpty]}
                onPress={() => router.push("/history")}
              >
                <Text style={styles.historyButtonText}>View History</Text>
              </TouchableOpacity>
            </>
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
    padding: 15,
    borderRadius: 10,
    margin: 10,
    opacity: 0.9,
    maxWidth: "100%",
    maxHeight: "70%",
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
  },
  urlTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dividerTitle: {
    marginTop: 15,
  },
  urlComponent: {
    fontSize: 14,
    marginBottom: 4,
    flexWrap: "wrap",
  },
  completeUrl: {
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    flexWrap: "wrap",
  },
  label: {
    fontWeight: "bold",
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },
  historyButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  historyButtonEmpty: {
    marginTop: 40,
  },
  historyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
