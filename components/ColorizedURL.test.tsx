import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { ColorizedURL } from "./ColorizedURL";
import * as Clipboard from "expo-clipboard";
import { Alert } from "react-native";

// Mock the expo-clipboard module
jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn(),
}));

// Mock the Alert.alert
jest.spyOn(Alert, "alert");

describe("ColorizedURL", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a simple URL correctly", () => {
    const { getByText } = render(<ColorizedURL url="https://example.com" />);

    expect(getByText("https:")).toBeTruthy();
    expect(getByText("//")).toBeTruthy();
    expect(getByText("example.com")).toBeTruthy();
  });

  it("renders a URL with pathname correctly", () => {
    const { getByText } = render(
      <ColorizedURL url="https://example.com/path" />
    );

    expect(getByText("/path")).toBeTruthy();
  });

  it("renders a URL with query parameters correctly", () => {
    const { getByText } = render(
      <ColorizedURL url="https://example.com/path?param1=value1&param2=value2" />
    );

    expect(getByText("param1")).toBeTruthy();
    expect(getByText("value1")).toBeTruthy();
    expect(getByText("param2")).toBeTruthy();
    expect(getByText("value2")).toBeTruthy();
  });

  it("handles invalid URLs gracefully", () => {
    const { getByText } = render(<ColorizedURL url="not-a-valid-url" />);

    expect(getByText("not-a-valid-url")).toBeTruthy();
  });

  it("copies URL to clipboard when pressed", async () => {
    const url = "https://example.com";
    const { getByText } = render(<ColorizedURL url={url} />);

    // Mock successful clipboard operation
    (Clipboard.setStringAsync as jest.Mock).mockResolvedValueOnce(undefined);

    // Press the component
    fireEvent.press(getByText("https:"));

    // Wait for async operations to complete
    await waitFor(() => {
      expect(Clipboard.setStringAsync).toHaveBeenCalledWith(url);
      expect(Alert.alert).toHaveBeenCalledWith(
        "Copied!",
        "Copied to clipboard"
      );
    });
  });

  it("shows error alert when clipboard operation fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const url = "https://example.com";
    const { getByText } = render(<ColorizedURL url={url} />);

    // Mock failed clipboard operation
    (Clipboard.setStringAsync as jest.Mock).mockRejectedValueOnce(
      new Error("Clipboard error")
    );

    // Press the component
    fireEvent.press(getByText("https:"));

    // Wait for async operations to complete
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Error", "Failed to copy URL");
    });
    (console.error as jest.Mock).mockRestore();
  });
});
