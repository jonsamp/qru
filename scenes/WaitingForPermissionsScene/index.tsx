import {
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
} from "react-native";
import Animated from "react-native-reanimated";
import { useEffect, useState, useMemo } from "react";
import { PermissionResponse, PermissionStatus } from "expo-camera";
import { useBootSequence } from "./useBootSequence";

export default function WeNeedPermissions(props: {
  requestPermission: () => Promise<PermissionResponse>;
  getPermission: () => Promise<PermissionResponse>;
}) {
  const { requestPermission, getPermission } = props;
  const [cameraPermission, setCameraPermission] =
    useState<PermissionStatus | null>(null);
  const screenWidth = Dimensions.get("window").width;
  const CHAR_WIDTH = 8.3404255319;
  const HORIZONTAL_PADDING = 48;
  const maxChars = Math.floor((screenWidth - HORIZONTAL_PADDING) / CHAR_WIDTH);

  const openSettings = () => {
    Linking.openSettings();
  };

  useEffect(() => {
    async function loadPermissionAsync() {
      const result = await getPermission();
      setCameraPermission(result.status);
    }

    loadPermissionAsync();
  }, []);

  async function requestCameraAccessAsync() {
    const result = await requestPermission();
    setCameraPermission(result.status);
  }

  function formatMessage(message: string, status: string) {
    const prefix = "> ";
    const messageWithoutPeriods = prefix + message;
    const numPeriods = maxChars - messageWithoutPeriods.length - status.length;
    return messageWithoutPeriods + ".".repeat(numPeriods) + status;
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

  const { messageStyles, buttonStyle, deniedStyle, pulseStyle } =
    useBootSequence(bootingMessages);

  return (
    <View className="flex-1 bg-black p-safe">
      <ScrollView className="flex-1 pt-10">
        <View className="flex-1 px-6 gap-1">
          <Animated.Text className="text-white text-md font-[JetBrainsMonoNL-Bold]">
            &gt; === WELCOME TO QRU ===
          </Animated.Text>
          {bootingMessages.map((message, index) => (
            <Animated.Text
              key={index}
              className="text-white text-md font-[JetBrainsMonoNL-Regular]"
              style={messageStyles[index]}
            >
              {message}
            </Animated.Text>
          ))}
          {cameraPermission === PermissionStatus.UNDETERMINED && (
            <Animated.View style={buttonStyle}>
              <TouchableOpacity
                onPress={requestCameraAccessAsync}
                className="bg-white px-6 py-3 mt-3"
              >
                <Animated.Text className="text-black text-lg font-[JetBrainsMonoNL-Bold] text-center">
                  GRANT CAMERA ACCESS
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>
          )}
          {cameraPermission === PermissionStatus.DENIED && (
            <Animated.View style={deniedStyle}>
              <Animated.Text
                className="text-red-400 text-md font-[JetBrainsMonoNL-Regular]"
                style={pulseStyle}
              >
                &gt; Camera access denied. Grant camera access in Settings to
                continue.
              </Animated.Text>
            </Animated.View>
          )}
          {cameraPermission === PermissionStatus.DENIED && (
            <Animated.View style={buttonStyle}>
              <TouchableOpacity
                onPress={openSettings}
                className="bg-white px-6 py-3 mt-3"
              >
                <Animated.Text className="text-black text-lg font-[JetBrainsMonoNL-Bold] text-center">
                  OPEN SETTINGS
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
