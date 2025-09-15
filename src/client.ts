import yahooFinance from 'yahoo-finance2';
import { QuoteResponse, HistoricalResponse, NewsItem, NewsResponse, ComparisonItem, ComparisonResponse } from './types.js';

export class YahooFinanceClient {
    private baseUrl: string = 'https://query1.finance.yahoo.com';

    constructor() {
        // Suppress Yahoo Finance notices for cleaner output
        try {
            yahooFinance.suppressNotices(['yahooSurvey']);
        } catch (error) {
            // Ignore if notices are not available
        }
    }

    /**
     * Performs API request with proper error handling
     */
    async performRequest<T>(operation: () => Promise<T>): Promise<T> {
        try {
            return await operation();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            throw new Error(`Yahoo Finance API error: ${errorMessage}`);
        }
    }

    /**
     * Get current stock quote
     */
    async getQuote(ticker: string): Promise<QuoteResponse> {
        return this.performRequest(async () => {
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
        });
    }

    /**
     * Get historical data
     */
    async getHistoricalData(ticker: string, range: string, interval: string): Promise<HistoricalResponse> {
        return this.performRequest(async () => {
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
        });
    }

    /**
     * Get news data (mock implementation since yahoo-finance2 doesn't have news API)
     */
    async getNews(ticker: string, limit: number = 5): Promise<NewsResponse> {
        return this.performRequest(async () => {
            // Since yahoo-finance2 doesn't have a news method, we'll return mock news
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
                },
                {
                    title: `${ticker.toUpperCase()} Earnings Report`,
                    summary: `Latest earnings and financial performance for ${ticker.toUpperCase()}.`,
                    url: `https://finance.yahoo.com/quote/${ticker}`,
                    publishedAt: new Date(Date.now() - 7200000).toISOString(),
                    source: 'Yahoo Finance'
                }
            ].slice(0, limit);

            return {
                ticker: ticker.toUpperCase(),
                news: mockNews,
                limit
            };
        });
    }

    /**
     * Compare multiple tickers
     */
    async compareTickers(tickers: string[]): Promise<ComparisonResponse> {
        return this.performRequest(async () => {
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
        });
    }

    /**
     * Helper method to convert range to milliseconds
     */
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
