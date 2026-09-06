import React, { useEffect } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const ARM = 26;
const STROKE = 2;
const CORNERS = [
  { top: 0, left: 0, borderTopWidth: STROKE, borderLeftWidth: STROKE },
  { top: 0, right: 0, borderTopWidth: STROKE, borderRightWidth: STROKE },
  { bottom: 0, left: 0, borderBottomWidth: STROKE, borderLeftWidth: STROKE },
  { bottom: 0, right: 0, borderBottomWidth: STROKE, borderRightWidth: STROKE },
];

export function ScanReticle({ active = true }: { active?: boolean }) {
  const { width } = useWindowDimensions();
  const size = Math.min(Math.round(width * 0.68), 300);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!active) {
      progress.value = 0;
      return;
    }
    progress.value = withRepeat(
      withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [active, progress]);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * (size - STROKE) }],
  }));

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
          {active && (
            <Animated.View
              style={[styles.scanLine, scanLineStyle]}
              className="bg-[#A3E635]"
            />
          )}
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
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: STROKE,
    opacity: 0.9,
  },
});
