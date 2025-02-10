import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function WeNeedPermissions(props: {
  requestPermission: () => void;
}) {
  const { requestPermission } = props;
  return (
    <View style={styles.container}>
      <View style={styles.permissionContent}>
        <Ionicons
          name="camera-outline"
          size={48}
          color="#fff"
          style={styles.cameraIcon}
        />
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.grantButton}
        >
          <Text style={styles.grantButtonText}>GRANT PERMISSION</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  permissionContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  cameraIcon: {
    marginBottom: 16,
  },
  message: {
    textAlign: "center",
    paddingBottom: 16,
    fontSize: 16,
    color: "#fff",
  },
  grantButton: {
    backgroundColor: "#40FA02",
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  grantButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});
