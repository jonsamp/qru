export interface ParsedURL {
  protocol: string;
  host: string;
  pathname: string;
  searchParams: Record<string, string>;
}

export interface SavedQRCode {
  url: string;
  timestamp: string;
}

export type URLTokenKind =
  | "scheme"
  | "punct"
  | "host"
  | "path"
  | "key"
  | "value"
  | "fragment"
  | "text";

export interface URLToken {
  text: string;
  kind: URLTokenKind;
}
