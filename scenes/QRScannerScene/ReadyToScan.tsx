import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withDelay,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";

const useLoadingAnimation = (index: number) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    const duration = 2000;
    const staggerDelay = 100;
    const fadeInDuration = 200;
    const fadeOutDuration = 200;
    const totalDuration = staggerDelay * 12 + duration;
    const startDelay = index * staggerDelay;

    opacity.value = withRepeat(
      withSequence(
        // Start at 0.3 opacity
        withTiming(0.3, { duration: 0 }),
        // Delay based on position
        withDelay(
          startDelay,
          // Fade in and out sequence
          withSequence(
            withTiming(1, { duration: fadeInDuration }),
            withTiming(0.3, { duration: fadeOutDuration })
          )
        ),
        // Wait for the sequence to complete before restarting
        withDelay(
          totalDuration - duration - startDelay,
          withTiming(0.3, { duration: 0 })
        )
      ),
      -1,
      false
    );
  }, []);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
};

export function ReadyToScan() {
  return (
    <View className="items-center">
      <View>
        <Text className="text-white font-[JetBrainsMonoNL-Bold] text-base pb-2">
          READY TO SCAN
        </Text>
        <View className="flex-row items-center gap-[1px]">
          {[...Array(6)].map((_, index) => (
            <Animated.View
              key={index}
              className="w-5 h-0.5 bg-white"
              style={useLoadingAnimation(index)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
