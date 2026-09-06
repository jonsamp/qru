import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  TextInput,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { logEvent } from "../../utils/analytics";
import { useObserve } from "expo-observe";
import { loadSavedURLs, deleteURL } from "../../utils/storage";
import { parseCustomURL } from "../../utils/urlParser";
import { SavedQRCode } from "../../utils/types";
import { ToastProvider, useToast } from "../../components/Toast";
import { LogRow } from "./LogRow";
import { EmptyState } from "./EmptyState";

const backIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMTFINy44M0wxMy40MiA1LjQxTDEyIDRMNCAxMkwxMiAyMEwxMy40MSAxOC41OUw3LjgzIDEzSDIwVjExWiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=";

type FilterKey = "all" | "links" | "deeplinks" | "text";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "links", label: "Links" },
  { key: "deeplinks", label: "Deep links" },
  { key: "text", label: "Text" },
];

const HAS_SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*:/;
const IS_WEB_LINK = /^https?:\/\//i;

function matchesFilter(url: string, filter: FilterKey) {
  if (filter === "all") return true;
  if (filter === "links") return IS_WEB_LINK.test(url);
  if (filter === "deeplinks") return HAS_SCHEME.test(url) && !IS_WEB_LINK.test(url);
  return !HAS_SCHEME.test(url);
}

function dayLabel(timestamp: string) {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(date, today)) return "TODAY";
  if (sameDay(date, yesterday)) return "YESTERDAY";

  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const suffix =
    date.getFullYear() === today.getFullYear() ? "" : ` ${date.getFullYear()}`;
  return `${month} ${date.getDate()}${suffix}`;
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className={`px-3.5 py-1.5 rounded-full border ${
        active ? "bg-white border-white" : "bg-transparent border-[#333333]"
      }`}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
    >
      <Text
        className={`font-[JetBrainsMonoNL-Regular] text-xs ${
          active ? "text-black" : "text-gray-300"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function Logs() {
  const router = useRouter();
  const { showToast } = useToast();
  const [savedURLs, setSavedURLs] = useState<SavedQRCode[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [hasLoaded, setHasLoaded] = useState(false);
  const { markInteractive } = useObserve();

  useEffect(() => {
    async function loadURLs() {
      const urls = await loadSavedURLs();
      const sorted = [...urls].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setSavedURLs(sorted);
      setHasLoaded(true);
    }

    loadURLs();
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      markInteractive({ params: { savedCount: savedURLs.length } });
    }
  }, [hasLoaded, markInteractive]);

  const sections = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = savedURLs.filter(
      (item) =>
        matchesFilter(item.url, filter) &&
        (needle.length === 0 || item.url.toLowerCase().includes(needle))
    );

    const groups: { title: string; data: SavedQRCode[] }[] = [];
    filtered.forEach((item) => {
      const title = dayLabel(item.timestamp);
      const last = groups[groups.length - 1];
      if (last && last.title === title) {
        last.data.push(item);
      } else {
        groups.push({ title, data: [item] });
      }
    });

    return groups;
  }, [savedURLs, query, filter]);

  const handleCopy = useCallback(
    async (item: SavedQRCode) => {
      await Clipboard.setStringAsync(item.url);
      logEvent("qru.scan_copied", {
        attributes: { source: "log", protocol: parseCustomURL(item.url).protocol },
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast("Copied to clipboard");
    },
    [showToast]
  );

  const handleDelete = useCallback(
    async (item: SavedQRCode) => {
      const doDelete = async () => {
        await deleteURL(item.url, item.timestamp);
        logEvent("qru.scan_deleted", {
          attributes: { protocol: parseCustomURL(item.url).protocol },
        });
        setSavedURLs((previous) =>
          previous.filter(
            (entry) =>
              !(entry.url === item.url && entry.timestamp === item.timestamp)
          )
        );
        showToast("Scan deleted");
      };

      if (Platform.OS === "web") {
        await doDelete();
        return;
      }

      Alert.alert("Delete Entry", "Are you sure you want to delete this scan?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: doDelete },
      ]);
    },
    [showToast]
  );

  const handleShowQR = useCallback(
    (item: SavedQRCode) =>
      router.push({ pathname: "/generate-qr", params: { url: item.url } }),
    [router]
  );

  const handleOpen = useCallback(
    async (item: SavedQRCode) => {
      if (!HAS_SCHEME.test(item.url)) {
        showToast("That scan is not a link", "error");
        return;
      }
      try {
        await Linking.openURL(item.url);
        logEvent("qru.scanned_url_visited", {
          attributes: { protocol: parseCustomURL(item.url).protocol },
        });
      } catch (error) {
        console.error("Failed to open URL:", error);
        showToast("Could not open that link", "error");
      }
    },
    [showToast]
  );

  const isFiltered = query.trim().length > 0 || filter !== "all";

  return (
    <View className="flex-1 bg-black">
      <View className="pt-safe">
        <View className="px-6 py-4 flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="z-10 items-center"
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Image
              source={backIcon}
              style={{ width: 20, height: 20 }}
              contentFit="contain"
            />
            <Text className="text-gray-300 font-[JetBrainsMonoNL-Regular] text-sm">
              Back
            </Text>
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-white font-[JetBrainsMonoNL-Bold] text-lg">
              SCAN LOG
            </Text>
          </View>
          <View style={{ width: 36 }} />
        </View>
      </View>

      {savedURLs.length > 0 && (
        <View className="px-6 pb-3 gap-3">
          <View className="flex-row items-center gap-2 bg-[#1c1c1e] rounded-full px-3.5 py-2.5">
            <Ionicons name="search" size={16} color="#8e8e93" />
            <TextInput
              className="flex-1 text-white font-[JetBrainsMonoNL-Regular] text-sm"
              placeholder="Search scans"
              placeholderTextColor="#8e8e93"
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              accessibilityLabel="Search scans"
            />
            {query.length > 0 && (
              <TouchableOpacity
                onPress={() => setQuery("")}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
              >
                <Ionicons name="close-circle" size={16} color="#8e8e93" />
              </TouchableOpacity>
            )}
          </View>
          <View className="flex-row gap-2">
            {FILTERS.map((entry) => (
              <FilterChip
                key={entry.key}
                label={entry.label}
                active={filter === entry.key}
                onPress={() => setFilter(entry.key)}
              />
            ))}
          </View>
        </View>
      )}

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.url + item.timestamp}
        contentContainerStyle={
          sections.length === 0 ? { flexGrow: 1 } : { paddingBottom: 32 }
        }
        keyboardShouldPersistTaps="handled"
        stickySectionHeadersEnabled
        renderSectionHeader={({ section }) => (
          <View className="bg-black px-6 pt-4 pb-2">
            <Text className="text-gray-500 font-[JetBrainsMonoNL-Bold] text-xs">
              {section.title}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <LogRow
            item={item}
            onCopy={handleCopy}
            onDelete={handleDelete}
            onShowQR={handleShowQR}
            onOpen={handleOpen}
          />
        )}
        ListEmptyComponent={
          !hasLoaded ? null : isFiltered ? (
            <EmptyState
              icon="search-outline"
              title="No matching scans"
              body="Try a different search term, or clear the filter to see every scan."
              actionLabel="Clear filters"
              onAction={() => {
                setQuery("");
                setFilter("all");
              }}
            />
          ) : (
            <EmptyState
              icon="qr-code-outline"
              title="No scans yet"
              body="Codes you scan are saved here so you can copy, revisit, or regenerate them later."
              actionLabel="Scan a code"
              onAction={() => router.back()}
            />
          )
        }
      />
    </View>
  );
}

export default function LogsScene() {
  return (
    <ToastProvider>
      <Logs />
    </ToastProvider>
  );
}
