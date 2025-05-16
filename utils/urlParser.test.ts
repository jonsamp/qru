import { parseCustomURL } from "./urlParser";

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
