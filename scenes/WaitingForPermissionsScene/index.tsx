import { View, TouchableOpacity, ScrollView } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  withSequence,
  runOnJS,
} from "react-native-reanimated";
import { useEffect } from "react";

export default function WeNeedPermissions(props: {
  requestPermission: () => void;
}) {
  const { requestPermission } = props;
  const bootingMessages = [
    "> BOOT SEQUENCE INITIATED",
    "> Verifying system integrity.................OK",
    "> Loading core modules.......................OK",
    "> Initializing memory banks..................OK",
    "> Running diagnostics........................OK",
    "> Scanning I/O ports.........................OK",
    "> Starting optical systems...................OK",
    "> Requesting camera access..............PENDING",
  ];

  const opacities = bootingMessages.map(() => useSharedValue(0));
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    bootingMessages.forEach((_, index) => {
      setTimeout(() => {
        opacities[index].value = 1;

        // Show button after last message appears
        if (index === bootingMessages.length - 1) {
          setTimeout(() => {
            buttonOpacity.value = 1;
          }, 200); // Small extra delay after last message
        }
      }, 100 * (index + 1));
    });
  }, []);

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  return (
    <View className="flex-1 bg-black p-safe">
      <ScrollView className="flex-1 mt-10">
        <View className="flex-1 px-6 gap-1">
          <Animated.Text className="text-white text-md font-[JetBrainsMonoNL-Bold]">
            &gt; WELCOME TO QRU
          </Animated.Text>
          {bootingMessages.map((message, index) => {
            const animatedStyle = useAnimatedStyle(() => ({
              opacity: opacities[index].value,
            }));

            return (
              <Animated.Text
                key={index}
                className="text-white text-md font-[JetBrainsMonoNL-Regular]"
                style={animatedStyle}
              >
                {message}
              </Animated.Text>
            );
          })}
          <Animated.View style={buttonStyle}>
            <TouchableOpacity
              onPress={requestPermission}
              className="bg-white px-6 py-3 mt-3"
            >
              <Animated.Text className="text-black text-lg font-[JetBrainsMonoNL-Bold] text-center">
                GRANT PERMISSION
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}
