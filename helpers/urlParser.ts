import { ParsedURL } from "./types";

export function parseCustomURL(url: string): ParsedURL {
  try {
    // First, decode the URL parameter if it exists
    const mainUrl = new URL(url);
    const searchUrl = mainUrl.searchParams.get("url");

    if (searchUrl) {
      // Parse the nested URL if it exists
      const decodedUrl = decodeURIComponent(searchUrl);
      const nestedUrl = new URL(decodedUrl);
      return {
        protocol: mainUrl.protocol.replace(":", ""),
        host: mainUrl.host,
        pathname: mainUrl.pathname,
        searchParams: {
          nestedProtocol: nestedUrl.protocol.replace(":", ""),
          nestedHost: nestedUrl.host,
          nestedPort: nestedUrl.port,
        },
      };
    }

    return {
      protocol: mainUrl.protocol.replace(":", ""),
      host: mainUrl.host,
      pathname: mainUrl.pathname,
      searchParams: {},
    };
  } catch (error) {
    return {
      protocol: "invalid",
      host: "invalid",
      pathname: "invalid",
      searchParams: {},
    };
  }
}
