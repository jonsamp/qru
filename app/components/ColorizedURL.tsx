import React from "react";
import { Text, StyleSheet, Platform, Pressable, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";

interface ColorizedURLProps {
  url: string;
  style?: any;
}

export function ColorizedURL({ url, style }: ColorizedURLProps) {
  const handlePress = async () => {
    try {
      await Clipboard.setStringAsync(url);
      Alert.alert("Copied!", "URL copied to clipboard");
    } catch (error) {
      console.error("Failed to copy:", error);
      Alert.alert("Error", "Failed to copy URL");
    }
  };

  const parseURLParts = (urlString: string) => {
    try {
      const url = new URL(urlString);
      const searchParams = Array.from(url.searchParams.entries());

      return {
        protocol: url.protocol,
        host: url.host,
        pathname: url.pathname,
        search: searchParams.map(([key, value]) => ({
          key,
          value: decodeURIComponent(value),
        })),
      };
    } catch (error) {
      return null;
    }
  };

  const urlParts = parseURLParts(url);

  if (!urlParts) {
    return (
      <Pressable onPress={handlePress} style={styles.pressable}>
        <Text selectable={true} style={[styles.text, style]}>
          {url}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={handlePress} style={styles.pressable}>
      <Text selectable={true} style={[styles.text, style]}>
        <Text style={styles.protocol}>{urlParts.protocol}</Text>
        <Text style={styles.separator}>//</Text>
        <Text style={styles.host}>{urlParts.host}</Text>
        <Text style={styles.path}>{urlParts.pathname}</Text>
        {urlParts.search.length > 0 && (
          <>
            <Text style={styles.separator}>?</Text>
            {urlParts.search.map(({ key, value }, index) => (
              <React.Fragment key={key + index}>
                {index > 0 && <Text style={styles.separator}>&</Text>}
                <Text style={styles.paramKey}>{key}</Text>
                <Text style={styles.separator}>=</Text>
                <Text style={styles.paramValue}>{value}</Text>
              </React.Fragment>
            ))}
          </>
        )}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
  },
  text: {
    fontSize: 14,
    flexWrap: "wrap",
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
  },
  protocol: {
    color: "#FF3B30", // Red
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
  },
  host: {
    color: "#007AFF", // Blue
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
  },
  path: {
    color: "#32C759", // Green
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
  },
  paramKey: {
    color: "#AF52DE", // Purple
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
  },
  paramValue: {
    color: "#FF9500", // Orange
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
  },
  separator: {
    color: "#8E8E93", // Gray
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
  },
});
