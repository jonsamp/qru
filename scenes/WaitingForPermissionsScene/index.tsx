import React, { useRef } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
  Text,
  StyleSheet,
} from "react-native";
import { useEffect, useState, useMemo } from "react";
import { PermissionResponse, PermissionStatus } from "expo-camera";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";

const styles = StyleSheet.create({
  pulsingText: {
    opacity: 0.5,
    animationName: "pulse",
    animationDuration: "1s",
    animationIterationCount: "infinite",
    animationDirection: "alternate",
  },
});

export default function WeNeedPermissions(props: {
  requestPermission: () => Promise<PermissionResponse>;
  getPermission: () => Promise<PermissionResponse>;
}) {
  const { requestPermission, getPermission } = props;
  const [cameraPermission, setCameraPermission] =
    useState<PermissionStatus | null>(null);
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);
  const [allMessagesDisplayed, setAllMessagesDisplayed] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const pulseOpacity = useSharedValue(0.5);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const screenWidth = Dimensions.get("window").width;
  const CHAR_WIDTH = 8.3404255319;
  const HORIZONTAL_PADDING = 48;
  const maxChars = Math.floor((screenWidth - HORIZONTAL_PADDING) / CHAR_WIDTH);

  const openSettings = () => {
    Linking.openSettings();
  };

  function formatMessage(message: string, status: string) {
    const prefix = "> ";
    const messageWithoutPeriods = prefix + message;
    const numPeriods = Math.max(
      0,
      maxChars - messageWithoutPeriods.length - status.length
    );
    return prefix + message + ".".repeat(numPeriods) + status;
  }

  const bootingMessages = useMemo(
    () => [
      "> BOOT SEQUENCE INITIATED",
      formatMessage("Verifying system integrity", "OK"),
      formatMessage("Loading core modules", "OK"),
      formatMessage("Initializing memory banks", "OK"),
      formatMessage("Running diagnostics", "OK"),
      formatMessage("Scanning I/O ports", "OK"),
      formatMessage("Starting optical systems", "OK"),
      formatMessage(
        "Getting camera permission",
        cameraPermission !== PermissionStatus.UNDETERMINED
          ? cameraPermission?.toUpperCase() ?? "UNDETERMINED"
          : "PENDING"
      ),
    ],
    [cameraPermission]
  );

  useEffect(() => {
    async function loadPermissionAsync() {
      const result = await getPermission();
      setCameraPermission(result.status);
    }

    loadPermissionAsync();
  }, []);

  useEffect(() => {
    // Clear any existing timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    // Reset messages when permission changes
    setVisibleMessages([]);
    setAllMessagesDisplayed(false);

    const messages = [...bootingMessages];

    // Show messages one by one
    messages.forEach((message, index) => {
      const timeout = setTimeout(() => {
        setVisibleMessages((prev) => [...prev, message]);

        // Add denied message after the last message if permission is denied
        if (
          index === messages.length - 1 &&
          cameraPermission === PermissionStatus.DENIED
        ) {
          const deniedTimeout = setTimeout(() => {
            setVisibleMessages((prev) => [
              ...prev.slice(0, -1),
              formatMessage("Getting camera permission", "DENIED"),
              formatMessage(
                "Camera access denied. Grant camera access in Settings to continue.",
                ""
              ),
            ]);
            setAllMessagesDisplayed(true);
          }, 200);
          timeoutsRef.current.push(deniedTimeout);
        } else if (index === messages.length - 1) {
          // If this is the last message and not denied, set all messages as displayed
          setAllMessagesDisplayed(true);
        }
      }, 150 * (index + 1));

      timeoutsRef.current.push(timeout);
    });

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [cameraPermission]);

  useEffect(() => {
    if (cameraPermission === PermissionStatus.DENIED) {
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0.5, { duration: 500 })
        ),
        -1,
        true
      );
    }
  }, [cameraPermission]);

  async function requestCameraAccessAsync() {
    const result = await requestPermission();
    setCameraPermission(result.status);
  }

  const isDenied = cameraPermission === PermissionStatus.DENIED;

  return (
    <View className="flex-1 bg-black p-safe">
      <ScrollView className="flex-1 pt-10">
        <View className="flex-1 px-6 gap-1">
          <Text className="text-white text-md font-[JetBrainsMonoNL-Bold]">
            {"> === WELCOME TO QRU ==="}
          </Text>
          {visibleMessages.map((message, index) => {
            const isDeniedMessage = message.includes("Camera access denied");
            const MessageComponent = isDeniedMessage ? Animated.Text : Text;

            return (
              <MessageComponent
                key={index}
                className={`text-md font-[JetBrainsMonoNL-Regular] ${
                  isDeniedMessage ? "text-red-400" : "text-white"
                }`}
                style={isDeniedMessage ? pulseStyle : undefined}
              >
                {message}
              </MessageComponent>
            );
          })}
          {allMessagesDisplayed && (
            <>
              {cameraPermission === PermissionStatus.UNDETERMINED && (
                <View className="mt-3">
                  <TouchableOpacity
                    onPress={requestCameraAccessAsync}
                    className="bg-white px-6 py-3"
                  >
                    <Text className="text-black text-lg font-[JetBrainsMonoNL-Bold] text-center">
                      GRANT CAMERA ACCESS
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {isDenied && (
                <View className="mt-3">
                  <TouchableOpacity
                    onPress={openSettings}
                    className="bg-white px-6 py-3"
                  >
                    <Text className="text-black text-lg font-[JetBrainsMonoNL-Bold] text-center">
                      OPEN SETTINGS
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
