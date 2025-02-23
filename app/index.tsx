import { View } from "react-native";
import QRScannerScene from "../scenes/QRScannerScene";
import WeNeedPermissions from "../scenes/WaitingForPermissionsScene";
import { useCameraPermissions } from "expo-camera";

export default function Index() {
  const [permission, requestPermission, getPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (permission?.status !== "granted") {
    return (
      <WeNeedPermissions
        requestPermission={requestPermission}
        getPermission={getPermission}
      />
    );
  }

  if (permission?.status === "granted") {
    return <QRScannerScene />;
  }

  return <View />;
}
