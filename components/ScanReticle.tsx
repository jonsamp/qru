import React, { useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  PixelRatio,
  type LayoutChangeEvent,
} from "react-native";

const ARM = 26;
const STROKE = 2;
const MAX_SIZE = 300;
const WIDTH_RATIO = 0.68;
const TOP_SHARE = 0.4;

const CORNERS = [
  { top: 0, left: 0, borderTopWidth: STROKE, borderLeftWidth: STROKE },
  { top: 0, right: 0, borderTopWidth: STROKE, borderRightWidth: STROKE },
  { bottom: 0, left: 0, borderBottomWidth: STROKE, borderLeftWidth: STROKE },
  { bottom: 0, right: 0, borderBottomWidth: STROKE, borderRightWidth: STROKE },
];

type Frame = { width: number; height: number };

const snap = (value: number) => PixelRatio.roundToNearestPixel(value);

export function ScanReticle() {
  const [frame, setFrame] = useState<Frame | null>(null);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setFrame((current) =>
      current && current.width === width && current.height === height
        ? current
        : { width, height }
    );
  }, []);

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      onLayout={handleLayout}
    >
      {frame ? <Mask frame={frame} /> : null}
    </View>
  );
}

function Mask({ frame }: { frame: Frame }) {
  const size = snap(Math.min(frame.width * WIDTH_RATIO, MAX_SIZE));
  const left = snap((frame.width - size) / 2);
  const top = snap((frame.height - size) * TOP_SHARE);
  const right = left + size;
  const bottom = top + size;

  return (
    <>
      <View style={[styles.mask, { top: 0, left: 0, right: 0, height: top }]} />
      <View style={[styles.mask, { top: bottom, left: 0, right: 0, bottom: 0 }]} />
      <View style={[styles.mask, { top, left: 0, width: left, height: size }]} />
      <View style={[styles.mask, { top, left: right, right: 0, height: size }]} />

      <View style={{ position: "absolute", top, left, width: size, height: size }}>
        {CORNERS.map((corner, index) => (
          <View
            key={index}
            style={[styles.corner, corner]}
            className="border-white"
          />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mask: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },
  corner: {
    position: "absolute",
    width: ARM,
    height: ARM,
  },
});
