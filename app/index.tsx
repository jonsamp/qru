import QRScannerScene from "../scenes/QRScannerScene";
import WeNeedPermissions from "../scenes/WaitingForPermissionsScene";
import { useCameraPermissions } from "expo-camera";

export default function Index() {
  const [permission, requestPermission, getPermission] = useCameraPermissions();

  if (permission?.status !== "granted") {
    return (
      <WeNeedPermissions
        requestPermission={requestPermission}
        getPermission={getPermission}
      />
    );
  }

  return <QRScannerScene />;
}
