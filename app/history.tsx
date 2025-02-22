import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavedQRCode } from "../helpers/types";
import { ColorizedURL } from "../components/ColorizedURL";

const STORAGE_KEY = "@qru_scanned_urls";

export default function History() {
  const [savedURLs, setSavedURLs] = useState<SavedQRCode[]>([]);

  useEffect(() => {
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

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const renderItem = ({ item }: { item: SavedQRCode }) => (
    <View style={styles.urlItem}>
      <ColorizedURL url={item.url} style={styles.urlText} />
      <Text style={styles.timestampText}>{formatDate(item.timestamp)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {savedURLs.length > 0 ? (
        <FlatList
          data={savedURLs.slice().reverse()}
          renderItem={renderItem}
          keyExtractor={(item) => item.timestamp}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.emptyText}>No scanned URLs yet</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContent: {
    paddingVertical: 16,
  },
  urlItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  urlText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  timestampText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#888",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
});
