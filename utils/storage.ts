import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavedQRCode } from "./types";

const STORAGE_KEY = "@qru_scanned_urls";

export async function saveURL(url: string) {
  try {
    // Get existing URLs
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const existingURLs: SavedQRCode[] = existingData
      ? JSON.parse(existingData)
      : [];

    // Create new QR code entry
    const newQRCode: SavedQRCode = {
      url,
      timestamp: new Date().toISOString(),
    };

    // Add to list, removing any duplicates of the same URL
    const updatedURLs = [
      ...existingURLs.filter((item) => item.url !== url),
      newQRCode,
    ];

    // Save back to storage
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedURLs));
  } catch (error) {
    console.error("Error saving URL:", error);
  }
}

export async function deleteURL(url: string, timestamp: string) {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const existingURLs: SavedQRCode[] = existingData
      ? JSON.parse(existingData)
      : [];
    const updatedURLs = existingURLs.filter(
      (item) => !(item.url === url && item.timestamp === timestamp)
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedURLs));
  } catch (error) {
    console.error("Error deleting URL:", error);
  }
}

export async function loadSavedURLs(): Promise<SavedQRCode[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading saved URLs:", error);
    return [];
  }
}
