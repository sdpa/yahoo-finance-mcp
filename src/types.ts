export interface QuoteResponse {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  pe?: number;
  high52Week?: number;
  low52Week?: number;
  open?: number;
  previousClose?: number;
  timestamp: string;
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface HistoricalResponse {
  ticker: string;
  range: string;
  interval: string;
  data: HistoricalData[];
}

export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  source: string;
}

export interface NewsResponse {
  ticker: string;
  news: NewsItem[];
  limit: number;
}

export interface ComparisonItem {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  pe?: number;
}

export interface ComparisonResponse {
  tickers: string[];
  data: ComparisonItem[];
  timestamp: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
