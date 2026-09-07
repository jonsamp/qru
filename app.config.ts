import { ExpoConfig } from "expo/config";

const isProduction = process.env.APP_VARIANT === "production";

const config: ExpoConfig = {
  version: process.env.APP_VERSION || "2026.0",
  name: isProduction ? "QRU?" : "QRU? (Dev)",
  slug: "qru",
  orientation: "portrait",
  platforms: ["ios", "android", "web"],
  icon: isProduction
    ? "./assets/images/icon.png"
    : "./assets/images/icon-dev.png",
  scheme: "qru",
  userInterfaceStyle: "automatic",
  ios: {
    icon: isProduction
      ? "./assets/icons/qru.icon"
      : "./assets/icons/qru-dev.icon",
    supportsTablet: true,
    bundleIdentifier: `com.jonsamp.qru${isProduction ? "" : "-dev"}`,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    permissions: [
      "android.permission.CAMERA",
      "android.permission.RECORD_AUDIO",
    ],
    blockedPermissions: [
      "android.permission.READ_MEDIA_IMAGES",
      "android.permission.READ_MEDIA_VIDEO",
      "android.permission.READ_MEDIA_AUDIO",
      "android.permission.READ_MEDIA_VISUAL_USER_SELECTED",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.WRITE_SETTINGS",
    ],
    package: `com.jonsamp.qru${isProduction ? "" : "_dev"}`,
    icon: isProduction
      ? "./assets/images/icon.png"
      : "./assets/images/icon-dev.png",
    adaptiveIcon: {
      foregroundImage: isProduction
        ? "./assets/images/adaptive-foreground.png"
        : "./assets/images/adaptive-foreground-dev.png",
      backgroundImage: "./assets/images/adaptive-background.png",
      monochromeImage: isProduction
        ? "./assets/images/adaptive-monochrome.png"
        : "./assets/images/adaptive-monochrome-dev.png",
    },
  },
  web: {
    bundler: "metro",
    output: "static",
  },
  plugins: [
    "expo-image",
    "expo-web-browser",
    "expo-status-bar",
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 125,
        backgroundColor: "#1c1917",
      },
    ],
    [
      "expo-camera",
      {
        cameraPermission: "The camera will be used to scan QR codes.",
      },
    ],
    "expo-sharing",
    "expo-sqlite",
    [
      "expo-image-picker",
      {
        photosPermission:
          "Your photo library is used to pick an image and scan the QR code inside it.",
      },
    ],
    [
      "expo-media-library",
      {
        savePhotosPermission:
          "Your photo library is used to save generated QR codes.",
        isAccessMediaLocationEnabled: false,
      },
    ],
    [
      "expo-font",
      {
        fonts: [
          "./assets/fonts/JetBrainsMonoNL-Regular.ttf",
          "./assets/fonts/JetBrainsMonoNL-Bold.ttf",
          "./assets/fonts/JetBrainsMonoNL-Italic.ttf",
        ],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: "6be970d1-0dae-48d5-83c8-d146a03d0095",
    },
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  updates: {
    url: "https://u.expo.dev/6be970d1-0dae-48d5-83c8-d146a03d0095",
  },
  owner: "jonsamp",
};

export default config;
