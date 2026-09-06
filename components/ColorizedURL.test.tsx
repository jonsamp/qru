import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { ColorizedURL } from "./ColorizedURL";
import { ToastProvider } from "./Toast";
import * as Clipboard from "expo-clipboard";

jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn(),
}));

jest.mock("expo-haptics", () => ({
  notificationAsync: jest.fn(),
  NotificationFeedbackType: { Success: "success" },
}));

function renderURL(url: string) {
  return render(
    <ToastProvider>
      <ColorizedURL url={url} />
    </ToastProvider>
  );
}

describe("ColorizedURL", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a simple URL correctly", () => {
    const { getByText } = renderURL("https://example.com");

    expect(getByText("https:")).toBeTruthy();
    expect(getByText("//")).toBeTruthy();
    expect(getByText("example.com")).toBeTruthy();
  });

  it("renders a URL with pathname correctly", () => {
    const { getByText } = renderURL("https://example.com/path");

    expect(getByText("/path")).toBeTruthy();
  });

  it("renders a URL with query parameters correctly", () => {
    const { getByText } = renderURL(
      "https://example.com/path?param1=value1&param2=value2"
    );

    expect(getByText("param1")).toBeTruthy();
    expect(getByText("value1")).toBeTruthy();
    expect(getByText("param2")).toBeTruthy();
    expect(getByText("value2")).toBeTruthy();
  });

  it("handles invalid URLs gracefully", () => {
    const { getByText } = renderURL("not-a-valid-url");

    expect(getByText("not-a-valid-url")).toBeTruthy();
  });

  it("does not invent syntax for non-hierarchical URIs", () => {
    const { getByText, queryByText } = renderURL("WIFI:S:Office;T:WPA;;");

    expect(getByText("WIFI:")).toBeTruthy();
    expect(getByText("S:Office;T:WPA;;")).toBeTruthy();
    expect(queryByText("//")).toBeNull();
  });

  it("copies URL to clipboard and confirms with a toast", async () => {
    const url = "https://example.com";
    const { getByText, findByText } = renderURL(url);

    (Clipboard.setStringAsync as jest.Mock).mockResolvedValueOnce(undefined);

    fireEvent.press(getByText("https:"));

    await waitFor(() => {
      expect(Clipboard.setStringAsync).toHaveBeenCalledWith(url);
    });
    expect(await findByText("Copied to clipboard")).toBeTruthy();
  });

  it("shows an error toast when the clipboard fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const url = "https://example.com";
    const { getByText, findByText } = renderURL(url);

    (Clipboard.setStringAsync as jest.Mock).mockRejectedValueOnce(
      new Error("Clipboard error")
    );

    fireEvent.press(getByText("https:"));

    expect(await findByText("Failed to copy")).toBeTruthy();
    (console.error as jest.Mock).mockRestore();
  });
});
