import React from "react";
import { Text, Pressable, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";

interface ColorizedURLProps {
  url: string;
  style?: any;
  className?: string;
  copyable?: boolean;
}

export function ColorizedURL({ url, style, className, copyable = true }: ColorizedURLProps) {
  const handlePress = async () => {
    if (!copyable) return;
    try {
      await Clipboard.setStringAsync(url);
      Alert.alert("Copied!", "Copied to clipboard");
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
      <Pressable onPress={handlePress} className="w-full">
        <Text
          className={`font-[JetBrainsMonoNL-Regular] text-lg text-white ${className}`}
          style={style}
        >
          {url}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={handlePress} className="w-full">
      <Text
        className={`font-[JetBrainsMonoNL-Regular] text-lg ${className}`}
        style={style}
      >
        <Text className="text-[#FF4DB8]">{urlParts.protocol}</Text>
        <Text className="text-[#6B7280]">//</Text>
        <Text className="text-[#00B7FF]">{urlParts.host}</Text>
        <Text className="text-[#4ADE80]">{urlParts.pathname}</Text>
        {urlParts.search.length > 0 && (
          <>
            <Text className="text-[#6B7280]">?</Text>
            {urlParts.search.map(({ key, value }, index) => (
              <React.Fragment key={key + index}>
                {index > 0 && <Text className="text-[#6B7280]">&</Text>}
                <Text className="text-[#D8B4FE]">{key}</Text>
                <Text className="text-[#6B7280]">=</Text>
                <Text className="text-[#FFB84D]">{value}</Text>
              </React.Fragment>
            ))}
          </>
        )}
      </Text>
    </Pressable>
  );
}
