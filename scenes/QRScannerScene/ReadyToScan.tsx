import React, { useEffect } from "react";
import { View, Text, AppState } from "react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withDelay,
  withTiming,
  useSharedValue,
  cancelAnimation,
} from "react-native-reanimated";

const useLoadingAnimation = (visualIndex: number) => {
  const opacity = useSharedValue(0);

  const startAnimation = () => {
    // Cancel any existing animation
    cancelAnimation(opacity);

    const staggerDelay = 200;
    const fadeInDuration = 400;
    const fadeOutDuration = 400;
    const stepDuration = fadeInDuration + fadeOutDuration;

    // Reset to initial state
    opacity.value = 0.3;

    // Create the animation sequence
    opacity.value = withRepeat(
      withSequence(
        // Left to right
        withDelay(
          visualIndex * staggerDelay,
          withSequence(
            withTiming(1, { duration: fadeInDuration }),
            withTiming(0.3, { duration: fadeOutDuration })
          )
        ),
        // Wait for the rest of the bars in the first sequence
        withTiming(0.3, { duration: (5 - visualIndex) * staggerDelay }),
        // Right to left
        withDelay(
          (5 - visualIndex) * staggerDelay,
          withSequence(
            withTiming(1, { duration: fadeInDuration }),
            withTiming(0.3, { duration: fadeOutDuration })
          )
        ),
        // Wait for the rest of the bars in the second sequence
        withTiming(0.3, { duration: visualIndex * staggerDelay })
      ),
      -1,
      false
    );
  };

  useEffect(() => {
    // Start initial animation
    startAnimation();

    // Handle app state changes
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        startAnimation();
      }
    });

    // Cleanup function to cancel animation and remove listener
    return () => {
      cancelAnimation(opacity);
      subscription.remove();
    };
  }, [visualIndex]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
};

export function ReadyToScan() {
  return (
    <View className="items-center">
      <View>
        <Text className="text-white font-[JetBrainsMonoNL-Bold] text-base pb-1">
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
