import { ParsedURL } from "./types";

export function parseCustomURL(url: string): ParsedURL {
  try {
    const parsedUrl = new URL(url);

    // Extract search params
    const searchParams: Record<string, string> = {};
    parsedUrl.searchParams.forEach((value, key) => {
      searchParams[key] = value;
    });

    return {
      protocol: parsedUrl.protocol.replace(":", ""),
      host: parsedUrl.host,
      pathname: parsedUrl.pathname,
      searchParams,
    };
  } catch (error) {
    // Return invalid state for all fields if URL parsing fails
    return {
      protocol: "invalid",
      host: "invalid",
      pathname: "invalid",
      searchParams: {},
    };
  }
}
