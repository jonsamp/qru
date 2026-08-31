import { useEffect } from "react";
import { View } from "react-native";
import QRScannerScene from "../scenes/QRScannerScene";
import WeNeedPermissions from "../scenes/WaitingForPermissionsScene";
import { useCameraPermissions } from "expo-camera";
import { useObserve } from "expo-observe";

export default function Index() {
  const [permission, requestPermission, getPermission] = useCameraPermissions();
  const { markInteractive } = useObserve();

  useEffect(() => {
    if (!permission) {
      return;
    }

    markInteractive({
      params: {
        cameraPermission: permission.status,
        canScan: permission.status === "granted",
      },
    });
  }, [permission, markInteractive]);

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
