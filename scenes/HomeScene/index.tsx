import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

const qrIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIxMC45MTgiIHk9IjQuNjAxNTYiIHdpZHRoPSIyLjE2NTE5IiBoZWlnaHQ9IjIuMTY1MTkiIGZpbGw9IndoaXRlIi8+PHJlY3QgeD0iMTAuOTE4IiB5PSI3Ljg0OTYxIiB3aWR0aD0iMi4xNjUxOSIgaGVpZ2h0PSIyLjE2NTE5IiBmaWxsPSJ3aGl0ZSIvPjxyZWN0IHg9IjEwLjkxOCIgeT0iMTMuOTg2MyIgd2lkdGg9IjIuMTY1MTkiIGhlaWdodD0iMi4xNjUxOSIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSIxNy43NDIyIiB5PSIxMy45ODYzIiB3aWR0aD0iMi4xNjUxOSIgaGVpZ2h0PSIyLjE2NTE5IiBmaWxsPSJ3aGl0ZSIvPjxyZWN0IHg9IjE0LjQ5NjEiIHk9IjE3LjIzMjQiIHdpZHRoPSIyLjE2NTE5IiBoZWlnaHQ9IjIuMTY1MTkiIGZpbGw9IndoaXRlIi8+PHJlY3QgeD0iMTQuNDk2MSIgeT0iMTAuOTE4IiB3aWR0aD0iMi4xNjUxOSIgaGVpZ2h0PSIyLjE2NTE5IiBmaWxsPSJ3aGl0ZSIvPjxyZWN0IHg9IjQuMDg5ODQiIHk9IjEwLjkxOCIgd2lkdGg9IjIuMTY1MTkiIGhlaWdodD0iMi4xNjUxOSIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSI3LjMzOTg0IiB5PSIxMC45MTgiIHdpZHRoPSIyLjE2NTE5IiBoZWlnaHQ9IjIuMTY1MTkiIGZpbGw9IndoaXRlIi8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05LjUwMjgyIDQuNjAxNTZINC4wODk4NFYxMC4wMTQ1SDkuNTAyODJWNC42MDE1NlpNNy45MDg1MyA2LjI1NTA2SDUuNzQzMzRWOC40MjAyNUg3LjkwODUzVjYuMjU1MDZaIiBmaWxsPSJ3aGl0ZSIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOS41MDI4MiAxMy45ODQ0SDQuMDg5ODRWMTkuMzk3NEg5LjUwMjgyVjEzLjk4NDRaTTcuOTA4NTMgMTUuNjM3OUg1Ljc0MzM0VjE3LjgwMzFINy45MDg1M1YxNS42Mzc5WiIgZmlsbD0id2hpdGUiLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE5LjkwNTIgNC42MDE1NkgxNC40OTIyVjEwLjAxNDVIMTkuOTA1MlY0LjYwMTU2Wk0xOC4zMTA5IDYuMjU1MDZIMTYuMTQ1N1Y4LjQyMDI1SDE4LjMxMDlWNi4yNTUwNloiIGZpbGw9IndoaXRlIi8+PC9zdmc+";

const features = [
  {
    title: "QR Scanner",
    description:
      "Point your camera at any QR code for instant scanning. No button press needed.",
  },
  {
    title: "URL Parser",
    description:
      "Break down scanned URLs into color-coded protocol, host, path, and query parameters.",
  },
  {
    title: "Copy & Share",
    description: "Copy scanned data to your clipboard with a single tap.",
  },
  {
    title: "QR Generator",
    description:
      "Generate QR codes from scanned URLs to share or scan with other devices.",
  },
  {
    title: "Scan Log",
    description:
      "Keep a history of every code you've scanned, with timestamps and quick access.",
  },
  {
    title: "Cross-Platform",
    description:
      "Available on iOS, Android, and the web. Your QR debugging tool, everywhere.",
  },
];

export default function HomeScene() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black">
    <ScrollView className="flex-1">
      <View
        style={{
          maxWidth: 1060,
          width: "100%",
          alignSelf: "center",
        }}
        className="px-6"
      >
        {/* Nav */}
        <View className="flex-row items-center justify-between py-6">
          <View className="flex-row items-center gap-2">
            <Image
              source={qrIcon}
              style={{ width: 26, height: 26 }}
              contentFit="contain"
            />
            <Text className="text-white font-[JetBrainsMonoNL-Bold] text-lg">
              QRU?
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/privacy")}>
            <Text
              className="font-[JetBrainsMonoNL-Regular]"
              style={{ color: "#b0b4ba", fontSize: 14 }}
            >
              Privacy
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={{ paddingVertical: 80 }} className="items-center">
          <Image
            source={require("../../assets/images/icon.png")}
            style={{
              width: 80,
              height: 80,
              borderRadius: 18,
              marginBottom: 32,
            }}
            contentFit="contain"
          />
          <Text
            className="text-white font-[JetBrainsMonoNL-Bold] text-center"
            style={{ fontSize: 48 }}
          >
            Debug any QR code.
          </Text>
          <Text
            className="font-[JetBrainsMonoNL-Regular] text-center"
            style={{
              color: "#b0b4ba",
              fontSize: 18,
              lineHeight: 28,
              maxWidth: 600,
              marginTop: 16,
            }}
          >
            QRU? scans QR codes and breaks them down into readable, color-coded
            components. See exactly what's inside every code you scan.
          </Text>
          <View className="flex-row gap-4" style={{ marginTop: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
            <TouchableOpacity
              onPress={() => Linking.openURL("#")}
              style={{
                backgroundColor: "#fff",
                paddingVertical: 14,
                paddingHorizontal: 32,
                borderRadius: 999,
              }}
            >
              <Text className="font-[JetBrainsMonoNL-Regular]" style={{ color: "#000", fontSize: 16 }}>
                App Store
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL("#")}
              style={{
                backgroundColor: "#fff",
                paddingVertical: 14,
                paddingHorizontal: 32,
                borderRadius: 999,
              }}
            >
              <Text className="font-[JetBrainsMonoNL-Regular]" style={{ color: "#000", fontSize: 16 }}>
                Google Play
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/")}
              style={{
                paddingVertical: 14,
                paddingHorizontal: 32,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: "#333",
              }}
            >
              <Text className="font-[JetBrainsMonoNL-Regular]" style={{ color: "#fff", fontSize: 16 }}>
                Open Scanner
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features */}
        <View style={{ paddingVertical: 40 }}>
          <Text
            className="text-white font-[JetBrainsMonoNL-Bold] text-center"
            style={{ fontSize: 32, marginBottom: 40 }}
          >
            Everything you need to debug
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            {features.map((feature) => (
              <View
                key={feature.title}
                style={{
                  backgroundColor: "rgb(28, 28, 30)",
                  padding: 24,
                  borderRadius: 16,
                  flexBasis: "31%",
                  flexGrow: 1,
                  minWidth: 280,
                }}
              >
                <Text
                  className="text-white font-[JetBrainsMonoNL-Bold]"
                  style={{ fontSize: 17, marginBottom: 8 }}
                >
                  {feature.title}
                </Text>
                <Text
                  className="font-[JetBrainsMonoNL-Regular]"
                  style={{ color: "#b0b4ba", fontSize: 15, lineHeight: 22 }}
                >
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom section */}
        <View style={{ paddingVertical: 60 }} className="items-center">
          <Text
            className="text-white font-[JetBrainsMonoNL-Bold] text-center"
            style={{ fontSize: 32 }}
          >
            Works with any QR code
          </Text>
          <Text
            className="font-[JetBrainsMonoNL-Regular] text-center"
            style={{ color: "#b0b4ba", fontSize: 16, marginTop: 16 }}
          >
            URLs · Deep Links · EAS Updates · App Store Links · Plain Text · and
            more
          </Text>
        </View>

        {/* Footer */}
        <View
          className="flex-row justify-between items-center"
          style={{
            paddingVertical: 40,
            borderTopWidth: 1,
            borderTopColor: "#222",
          }}
        >
          <Text className="text-white font-[JetBrainsMonoNL-Bold]" style={{ fontSize: 16 }}>
            QRU?
          </Text>
          <Text
            className="font-[JetBrainsMonoNL-Regular]"
            style={{ color: "#6b7280", fontSize: 14 }}
          >
            Made by Jon Samp
          </Text>
        </View>
      </View>
    </ScrollView>
    </View>
  );
}
