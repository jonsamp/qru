import { ParsedURL, URLToken } from "./types";

const SCHEME_PATTERN = /^([A-Za-z][A-Za-z0-9+.-]*):/;

function indexOfAny(raw: string, from: number, chars: string) {
  for (let i = from; i < raw.length; i += 1) {
    if (chars.includes(raw[i])) {
      return i;
    }
  }
  return raw.length;
}

function tokenizeQuery(query: string): URLToken[] {
  if (query.length === 0) {
    return [];
  }

  const tokens: URLToken[] = [];

  query.split("&").forEach((pair, index) => {
    if (index > 0) {
      tokens.push({ text: "&", kind: "punct" });
    }
    if (pair.length === 0) {
      return;
    }

    const equals = pair.indexOf("=");
    if (equals === -1) {
      tokens.push({ text: pair, kind: "key" });
      return;
    }
    if (equals > 0) {
      tokens.push({ text: pair.slice(0, equals), kind: "key" });
    }
    tokens.push({ text: "=", kind: "punct" });

    const value = pair.slice(equals + 1);
    if (value.length > 0) {
      tokens.push({ text: value, kind: "value" });
    }
  });

  return tokens;
}

export function tokenizeURL(raw: string): URLToken[] {
  const scheme = raw.match(SCHEME_PATTERN);
  if (!scheme) {
    return raw.length > 0 ? [{ text: raw, kind: "text" }] : [];
  }

  const tokens: URLToken[] = [{ text: scheme[0], kind: "scheme" }];
  let cursor = scheme[0].length;

  if (raw.startsWith("//", cursor)) {
    tokens.push({ text: "//", kind: "punct" });
    cursor += 2;

    const hostEnd = indexOfAny(raw, cursor, "/?#");
    if (hostEnd > cursor) {
      tokens.push({ text: raw.slice(cursor, hostEnd), kind: "host" });
      cursor = hostEnd;
    }
  }

  const pathEnd = indexOfAny(raw, cursor, "?#");
  if (pathEnd > cursor) {
    tokens.push({ text: raw.slice(cursor, pathEnd), kind: "path" });
    cursor = pathEnd;
  }

  if (raw[cursor] === "?") {
    tokens.push({ text: "?", kind: "punct" });
    cursor += 1;

    const queryEnd = indexOfAny(raw, cursor, "#");
    tokens.push(...tokenizeQuery(raw.slice(cursor, queryEnd)));
    cursor = queryEnd;
  }

  if (raw[cursor] === "#") {
    tokens.push({ text: "#", kind: "punct" });
    cursor += 1;
  }

  if (cursor < raw.length) {
    tokens.push({ text: raw.slice(cursor), kind: "fragment" });
  }

  return tokens;
}

export function parseCustomURL(url: string): ParsedURL {
  try {
    const parsedUrl = new URL(url);

    const searchParams: Record<string, string> = {};
    parsedUrl.searchParams.forEach((value, key) => {
      searchParams[key] = value;
    });

    const scheme = url.match(SCHEME_PATTERN);

    return {
      protocol: scheme
        ? scheme[1]
        : parsedUrl.protocol.replace(":", ""),
      host: parsedUrl.host,
      pathname: parsedUrl.pathname,
      searchParams,
    };
  } catch {
    return {
      protocol: "invalid",
      host: "invalid",
      pathname: "invalid",
      searchParams: {},
    };
  }
}
