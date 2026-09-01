import { Observe } from "expo-observe";

type LogEvent = typeof Observe.logEvent;

export const logEvent: LogEvent = (...args) => {
  try {
    Observe.logEvent(...args);
  } catch {}
};
