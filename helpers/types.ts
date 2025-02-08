export interface ParsedURL {
  protocol: string;
  host: string;
  pathname: string;
  searchParams: { [key: string]: string };
}

export interface SavedQRCode {
  url: string;
  timestamp: string;
}
