import { View, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useEffect } from "react";

export default function WeNeedPermissions(props: {
  requestPermission: () => void;
}) {
  const { requestPermission } = props;
  const screenWidth = Dimensions.get("window").width;
  const CHAR_WIDTH = 8.3404255319;
  const HORIZONTAL_PADDING = 48;
  const maxChars = Math.floor((screenWidth - HORIZONTAL_PADDING) / CHAR_WIDTH);

  function formatMessage(message: string, status: string) {
    const prefix = "> ";
    const messageWithoutPeriods = prefix + message;
    const numPeriods = maxChars - messageWithoutPeriods.length - status.length;
    return messageWithoutPeriods + ".".repeat(numPeriods) + status;
  }

  const bootingMessages = [
    "> BOOT SEQUENCE INITIATED",
    formatMessage("Verifying system integrity", "OK"),
    formatMessage("Loading core modules", "OK"),
    formatMessage("Initializing memory banks", "OK"),
    formatMessage("Running diagnostics", "OK"),
    formatMessage("Scanning I/O ports", "OK"),
    formatMessage("Starting optical systems", "OK"),
    formatMessage("Requesting camera access", "PENDING"),
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
