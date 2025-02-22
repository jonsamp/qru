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
