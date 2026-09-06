import { parseCustomURL, tokenizeURL } from "./urlParser";

describe("parseCustomURL", () => {
  it("should correctly parse a valid URL with all components", () => {
    const url = "https://example.com/path?param1=value1&param2=value2";
    const result = parseCustomURL(url);

    expect(result).toEqual({
      protocol: "https",
      host: "example.com",
      pathname: "/path",
      searchParams: {
        param1: "value1",
        param2: "value2",
      },
    });
  });

  it("should handle URLs without search parameters", () => {
    const url = "https://example.com/path";
    const result = parseCustomURL(url);

    expect(result).toEqual({
      protocol: "https",
      host: "example.com",
      pathname: "/path",
      searchParams: {},
    });
  });

  it("should handle URLs with only a domain", () => {
    const url = "https://example.com";
    const result = parseCustomURL(url);

    expect(result).toEqual({
      protocol: "https",
      host: "example.com",
      pathname: "/",
      searchParams: {},
    });
  });

  it("should handle URLs with multiple search parameters", () => {
    const url = "https://example.com/path?foo=bar&baz=qux&test=123";
    const result = parseCustomURL(url);

    expect(result).toEqual({
      protocol: "https",
      host: "example.com",
      pathname: "/path",
      searchParams: {
        foo: "bar",
        baz: "qux",
        test: "123",
      },
    });
  });

  it("should return invalid state for malformed URLs", () => {
    const url = "not-a-valid-url";
    const result = parseCustomURL(url);

    expect(result).toEqual({
      protocol: "invalid",
      host: "invalid",
      pathname: "invalid",
      searchParams: {},
    });
  });

  it("should handle URLs with special characters in search params", () => {
    const url =
      "https://example.com/path?name=John%20Doe&email=john@example.com";
    const result = parseCustomURL(url);

    expect(result).toEqual({
      protocol: "https",
      host: "example.com",
      pathname: "/path",
      searchParams: {
        name: "John Doe",
        email: "john@example.com",
      },
    });
  });
});

describe("tokenizeURL", () => {
  const samples = [
    "https://example.com",
    "https://example.com/path?param1=value1&param2=value2",
    "https://u.expo.dev/update/9f2c?runtime=57.0.0&channel=production#frag",
    "WIFI:S:OfficeGuest;T:WPA;P:hunter2;;",
    "qru://scan?source=cli&verbose=true",
    "mailto:someone@example.com",
    "not-a-valid-url",
    "",
  ];

  it.each(samples)("reproduces %p byte for byte", (raw) => {
    expect(tokenizeURL(raw).map((token) => token.text).join("")).toBe(raw);
  });

  it("keeps the scheme exactly as written", () => {
    const tokens = tokenizeURL("WIFI:S:OfficeGuest;;");

    expect(tokens[0]).toEqual({ text: "WIFI:", kind: "scheme" });
    expect(tokens.some((token) => token.text === "//")).toBe(false);
  });

  it("splits an http URL into addressable parts", () => {
    const tokens = tokenizeURL("https://example.com/a?b=c");

    expect(tokens).toEqual([
      { text: "https:", kind: "scheme" },
      { text: "//", kind: "punct" },
      { text: "example.com", kind: "host" },
      { text: "/a", kind: "path" },
      { text: "?", kind: "punct" },
      { text: "b", kind: "key" },
      { text: "=", kind: "punct" },
      { text: "c", kind: "value" },
    ]);
  });
});
