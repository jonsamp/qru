import { useEffect } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  cancelAnimation,
} from "react-native-reanimated";

export const useBootSequence = (messages: string[]) => {
  // Create all shared values at the top level
  const deniedOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const pulseOpacity = useSharedValue(0.5);

  // Create opacity shared values for each message
  const opacities = messages.map(() => useSharedValue(0));

  // Create all animated styles at the top level
  const messageStyles = opacities.map((opacity) =>
    useAnimatedStyle(() => ({
      opacity: opacity.value,
    }))
  );

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const deniedStyle = useAnimatedStyle(() => ({
    opacity: deniedOpacity.value,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  useEffect(() => {
    // Reset all opacities when messages change
    const cleanup = () => {
      opacities.forEach((opacity) => {
        cancelAnimation(opacity);
        opacity.value = 0;
      });
      cancelAnimation(deniedOpacity);
      cancelAnimation(buttonOpacity);
      cancelAnimation(pulseOpacity);
      deniedOpacity.value = 0;
      buttonOpacity.value = 0;
      pulseOpacity.value = 0.5;
    };

    // Start message animations
    messages.forEach((_, index) => {
      try {
        opacities[index].value = withDelay(
          100 * (index + 1),
          withTiming(1, { duration: 0 })
        );

        // Show denied message and button after last message
        if (index === messages.length - 1) {
          deniedOpacity.value = withDelay(
            100 * (index + 1) + 200,
            withTiming(1, { duration: 0 })
          );

          // Start the continuous pulse animation
          pulseOpacity.value = withDelay(
            100 * (index + 1) + 200,
            withRepeat(
              withSequence(
                withTiming(1, { duration: 500 }),
                withTiming(0.5, { duration: 500 })
              ),
              -1,
              true
            )
          );

          buttonOpacity.value = withDelay(
            100 * (index + 1) + 400,
            withTiming(1, { duration: 0 })
          );
        }
      } catch (error) {
        console.warn("Animation error:", error);
        cleanup();
      }
    });

    return cleanup;
  }, [messages]);

  return {
    messageStyles,
    buttonStyle,
    deniedStyle,
    pulseStyle,
  };
};
