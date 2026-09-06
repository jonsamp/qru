import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

type ToastTone = "success" | "error";

interface ToastMessage {
  id: number;
  text: string;
  tone: ToastTone;
}

interface ToastContextValue {
  showToast: (text: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VISIBLE_MS = 1800;

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside a ToastProvider");
  }
  return context;
}

export function ToastProvider({
  children,
  footer,
  bottomOffset = 24,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
  bottomOffset?: number;
}) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextId = useRef(0);

  const showToast = useCallback((text: string, tone: ToastTone = "success") => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    nextId.current += 1;
    setToast({ id: nextId.current, text, tone });
    timeout.current = setTimeout(() => setToast(null), VISIBLE_MS);
  }, []);

  useEffect(
    () => () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    },
    []
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View collapsable={false} style={styles.overlay} pointerEvents="box-none">
        <View
          pointerEvents="none"
          className="items-center"
          style={{ paddingBottom: footer ? 12 : bottomOffset }}
        >
          {toast && (
            <Animated.View
              key={toast.id}
              entering={FadeInDown.duration(180)}
              exiting={FadeOutDown.duration(140)}
              className="flex-row items-center gap-2 rounded-full bg-[#1c1c1e] border border-[#333333] px-4 py-2.5"
            >
              <Ionicons
                name={toast.tone === "error" ? "alert-circle" : "checkmark-circle"}
                size={16}
                color={toast.tone === "error" ? "#f87171" : "#4ade80"}
              />
              <Text className="text-white font-[JetBrainsMonoNL-Regular] text-sm">
                {toast.text}
              </Text>
            </Animated.View>
          )}
        </View>
        {footer}
      </View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
