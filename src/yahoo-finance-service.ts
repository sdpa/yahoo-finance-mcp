import yahooFinance from 'yahoo-finance2';
import { QuoteResponse, HistoricalResponse, NewsItem, NewsResponse, ComparisonItem, ComparisonResponse } from './types.js';

export class YahooFinanceService {
  async getQuote(ticker: string): Promise<QuoteResponse> {
    try {
      const result = await yahooFinance.quote(ticker);
      
      if (!result) {
        throw new Error(`No data found for ticker: ${ticker}`);
      }

      return {
        ticker: ticker.toUpperCase(),
        price: result.regularMarketPrice || 0,
        change: result.regularMarketChange || 0,
        changePercent: result.regularMarketChangePercent || 0,
        volume: result.regularMarketVolume || 0,
        marketCap: result.marketCap,
        pe: result.trailingPE,
        high52Week: result.fiftyTwoWeekHigh,
        low52Week: result.fiftyTwoWeekLow,
        open: result.regularMarketOpen,
        previousClose: result.regularMarketPreviousClose,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to fetch quote for ${ticker}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getHistoricalData(ticker: string, range: string, interval: string): Promise<HistoricalResponse> {
    try {
      // Convert range to Yahoo Finance format
      const rangeMap: { [key: string]: string } = {
        '1d': '1d',
        '5d': '5d',
        '1mo': '1mo',
        '3mo': '3mo',
        '6mo': '6mo',
        '1y': '1y',
        '2y': '2y',
        '5y': '5y',
        '10y': '10y',
        'ytd': 'ytd',
        'max': 'max'
      };

      const yahooRange = rangeMap[range] || '1mo';
      
      const result = await yahooFinance.historical(ticker, {
        period1: new Date(Date.now() - this.getRangeInMs(yahooRange)),
        period2: new Date(),
        interval: interval as any
      });

      if (!result || result.length === 0) {
        throw new Error(`No historical data found for ticker: ${ticker}`);
      }

      const data = result.map(item => ({
        date: item.date.toISOString().split('T')[0],
        open: item.open || 0,
        high: item.high || 0,
        low: item.low || 0,
        close: item.close || 0,
        volume: item.volume || 0
      }));

      return {
        ticker: ticker.toUpperCase(),
        range,
        interval,
        data
      };
    } catch (error) {
      throw new Error(`Failed to fetch historical data for ${ticker}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getNews(ticker: string, limit: number = 5): Promise<NewsResponse> {
    try {
      // Since yahoo-finance2 doesn't have a news method, we'll use quoteSummary for news
      const result = await yahooFinance.quoteSummary(ticker, {
        modules: ['summaryDetail']
      });

      // For now, we'll return a mock news response since the news API is not available
      // In a real implementation, you might want to use a different news API
      const mockNews: NewsItem[] = [
        {
          title: `Latest updates for ${ticker.toUpperCase()}`,
          summary: `Recent market activity and news for ${ticker.toUpperCase()} stock.`,
          url: `https://finance.yahoo.com/quote/${ticker}`,
          publishedAt: new Date().toISOString(),
          source: 'Yahoo Finance'
        },
        {
          title: `${ticker.toUpperCase()} Market Analysis`,
          summary: `Current market trends and analysis for ${ticker.toUpperCase()}.`,
          url: `https://finance.yahoo.com/quote/${ticker}`,
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: 'Yahoo Finance'
        }
      ].slice(0, limit);

      return {
        ticker: ticker.toUpperCase(),
        news: mockNews,
        limit
      };
    } catch (error) {
      throw new Error(`Failed to fetch news for ${ticker}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async compareTickers(tickers: string[]): Promise<ComparisonResponse> {
    try {
      const promises = tickers.map(ticker => this.getQuote(ticker));
      const results = await Promise.all(promises);

      const data: ComparisonItem[] = results.map(quote => ({
        ticker: quote.ticker,
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
        volume: quote.volume,
        marketCap: quote.marketCap,
        pe: quote.pe
      }));

      return {
        tickers: tickers.map(t => t.toUpperCase()),
        data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to compare tickers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private getRangeInMs(range: string): number {
    const rangeMap: { [key: string]: number } = {
      '1d': 24 * 60 * 60 * 1000,
      '5d': 5 * 24 * 60 * 60 * 1000,
      '1mo': 30 * 24 * 60 * 60 * 1000,
      '3mo': 90 * 24 * 60 * 60 * 1000,
      '6mo': 180 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000,
      '2y': 2 * 365 * 24 * 60 * 60 * 1000,
      '5y': 5 * 365 * 24 * 60 * 60 * 1000,
      '10y': 10 * 365 * 24 * 60 * 60 * 1000,
      'ytd': new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime(),
      'max': 20 * 365 * 24 * 60 * 60 * 1000
    };

    return rangeMap[range] || 30 * 24 * 60 * 60 * 1000; // Default to 1 month
  }
}
