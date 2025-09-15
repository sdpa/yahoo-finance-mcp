import { QuoteResponse, HistoricalResponse, NewsResponse, ComparisonResponse } from './types.js';
import { YahooFinanceClient } from './client.js';

export class YahooFinanceService {
  private client: YahooFinanceClient;

  constructor() {
    this.client = new YahooFinanceClient();
  }

  async getQuote(ticker: string): Promise<QuoteResponse> {
    return this.client.getQuote(ticker);
  }

  async getHistoricalData(ticker: string, range: string, interval: string): Promise<HistoricalResponse> {
    return this.client.getHistoricalData(ticker, range, interval);
  }

  async getNews(ticker: string, limit: number = 5): Promise<NewsResponse> {
    return this.client.getNews(ticker, limit);
  }

  async compareTickers(tickers: string[]): Promise<ComparisonResponse> {
    return this.client.compareTickers(tickers);
  }
}
