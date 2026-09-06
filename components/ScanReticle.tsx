import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";

const ARM = 26;
const STROKE = 2;
const CORNERS = [
  { top: 0, left: 0, borderTopWidth: STROKE, borderLeftWidth: STROKE },
  { top: 0, right: 0, borderTopWidth: STROKE, borderRightWidth: STROKE },
  { bottom: 0, left: 0, borderBottomWidth: STROKE, borderLeftWidth: STROKE },
  { bottom: 0, right: 0, borderBottomWidth: STROKE, borderRightWidth: STROKE },
];

export function ScanReticle() {
  const { width } = useWindowDimensions();
  const size = Math.min(Math.round(width * 0.68), 300);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[{ flex: 0.8 }, styles.mask]} />
      <View className="flex-row">
        <View style={[{ flex: 1 }, styles.mask]} />
        <View style={{ width: size, height: size }}>
          {CORNERS.map((corner, index) => (
            <View
              key={index}
              style={[styles.corner, corner]}
              className="border-white"
            />
          ))}
        </View>
        <View style={[{ flex: 1 }, styles.mask]} />
      </View>
      <View style={[{ flex: 1.2 }, styles.mask]} />
    </View>
  );
}

const styles = StyleSheet.create({
  mask: {
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },
  corner: {
    position: "absolute",
    width: ARM,
    height: ARM,
  },
});
