import React, { useRef } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
  Text,
  Platform,
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

export default function WeNeedPermissions(props: {
  requestPermission: () => Promise<PermissionResponse>;
  getPermission: () => Promise<PermissionResponse>;
}) {
  const { requestPermission, getPermission } = props;
  const [cameraPermission, setCameraPermission] =
    useState<PermissionStatus | null>(null);
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);
  const [allMessagesDisplayed, setAllMessagesDisplayed] = useState(false);
  const [hasShownInitialMessages, setHasShownInitialMessages] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const pulseOpacity = useSharedValue(0.5);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const screenWidth = Math.min(Dimensions.get("window").width, Platform.OS === "web" ? 600 : 800);
  const CHAR_WIDTH = Platform.OS === "web" ? 9.63 : 8.3404255319;
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
        "Camera permission status",
        cameraPermission !== PermissionStatus.UNDETERMINED
          ? cameraPermission?.toUpperCase() ?? "UNDETERMINED"
          : "PENDING"
      ),
      "QRU? requires camera access to scan QR codes.",
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

    // Only show the boot sequence once
    if (!hasShownInitialMessages) {
      setVisibleMessages([]);
      setAllMessagesDisplayed(false);

      const messages = [...bootingMessages];

      // Show messages one by one
      messages.forEach((message, index) => {
        const timeout = setTimeout(() => {
          setVisibleMessages((prev) => [...prev, message]);

          if (index === messages.length - 1) {
            setHasShownInitialMessages(true);
            setAllMessagesDisplayed(true);

            // If permission is already denied when messages finish, show denied message
            if (cameraPermission === PermissionStatus.DENIED) {
              const deniedMessage = Platform.OS === "web"
                ? "Camera access denied. Grant camera access in your browser to continue."
                : "Camera access denied. Grant camera access in Settings to continue.";
              const deniedTimeout = setTimeout(() => {
                setVisibleMessages((prev) => [
                  ...prev.slice(0, -1),
                  formatMessage("Getting camera permission", "DENIED"),
                  formatMessage(deniedMessage, ""),
                ]);
              }, 200);
              timeoutsRef.current.push(deniedTimeout);
            }
          }
        }, 150 * (index + 1));

        timeoutsRef.current.push(timeout);
      });
    } else if (cameraPermission === PermissionStatus.DENIED) {
      const deniedMessage = Platform.OS === "web"
        ? "Camera access denied. Grant camera access in your browser to continue."
        : "Camera access denied. Grant camera access in Settings to continue.";
      // If messages are already shown and permission becomes denied, just update the last messages
      setVisibleMessages((prev) => [
        ...prev.slice(0, -1),
        formatMessage("Getting camera permission", "DENIED"),
        formatMessage(deniedMessage, ""),
      ]);
    }

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [cameraPermission, hasShownInitialMessages]);

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
    <View className="flex-1 bg-black p-safe items-center">
      <ScrollView className="flex-1 pt-10" style={Platform.OS === "web" ? { maxWidth: 600, width: "100%" } : { width: "100%" }}>
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
                      CONTINUE
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {isDenied && Platform.OS !== "web" && (
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
