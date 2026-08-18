export type VisitorLog = {
  id: string;
  ipAddress: string;
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
  isp?: string;
  page: string;
  source?: string;
  sourceDetail?: string;
  referrer?: string;
  userAgent?: string;
  rawRequest?: string | null;
  rawResponse?: string | null;
  createdAt: string;
};

export type VisitorFilters = {
  q: string;
  source: string;
  country: string;
  path: string;
  from: string;
  to: string;
};

export type VisitorStats = {
  summary: { total: number; today: number; uniqueIps: number; countries: number };
  daily: { date: string; count: number }[];
  topCountries: { country: string; countryCode: string; count: number }[];
  topPages: { page: string; count: number }[];
  topSources: { source: string; count: number }[];
};

/** One point of the 30-day daily-visits series, gap-filled with zeroes. */
export type DailyPoint = { date: string; count: number };

/** Generic label/count pair backing the horizontal bar breakdowns. */
export type BarDatum = { label: string; count: number };
