#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { YahooFinanceService } from './yahoo-finance-service.js';

class YahooFinanceMCPServer {
  private server: Server;
  private yahooFinanceService: YahooFinanceService;

  constructor() {
    this.server = new Server(
      {
        name: 'yahoo-finance-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.yahooFinanceService = new YahooFinanceService();
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_quote',
            description: 'Get current stock price and market data for a ticker symbol',
            inputSchema: {
              type: 'object',
              properties: {
                ticker: {
                  type: 'string',
                  description: 'Stock ticker symbol (e.g., AAPL, GOOGL, MSFT)',
                },
              },
              required: ['ticker'],
            },
          },
          {
            name: 'get_historical_data',
            description: 'Get historical OHLCV data for a stock over a specified time range',
            inputSchema: {
              type: 'object',
              properties: {
                ticker: {
                  type: 'string',
                  description: 'Stock ticker symbol',
                },
                range: {
                  type: 'string',
                  description: 'Time range for historical data',
                  enum: ['1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max'],
                  default: '1mo',
                },
                interval: {
                  type: 'string',
                  description: 'Data interval',
                  enum: ['1m', '2m', '5m', '15m', '30m', '60m', '90m', '1h', '1d', '5d', '1wk', '1mo', '3mo'],
                  default: '1d',
                },
              },
              required: ['ticker'],
            },
          },
          {
            name: 'get_news',
            description: 'Get latest news headlines for a stock ticker',
            inputSchema: {
              type: 'object',
              properties: {
                ticker: {
                  type: 'string',
                  description: 'Stock ticker symbol',
                },
                limit: {
                  type: 'number',
                  description: 'Number of news articles to return (1-50)',
                  minimum: 1,
                  maximum: 50,
                  default: 5,
                },
              },
              required: ['ticker'],
            },
          },
          {
            name: 'compare_stocks',
            description: 'Compare multiple stocks side by side with their current market data',
            inputSchema: {
              type: 'object',
              properties: {
                tickers: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                  description: 'Array of stock ticker symbols to compare (2-10 tickers)',
                  minItems: 2,
                  maxItems: 10,
                },
              },
              required: ['tickers'],
            },
          },
        ] as Tool[],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_quote': {
            const { ticker } = args as { ticker: string };
            const quote = await this.yahooFinanceService.getQuote(ticker);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(quote, null, 2),
                },
              ],
            };
          }

          case 'get_historical_data': {
            const { ticker, range = '1mo', interval = '1d' } = args as {
              ticker: string;
              range?: string;
              interval?: string;
            };
            const historicalData = await this.yahooFinanceService.getHistoricalData(
              ticker,
              range,
              interval
            );
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(historicalData, null, 2),
                },
              ],
            };
          }

          case 'get_news': {
            const { ticker, limit = 5 } = args as {
              ticker: string;
              limit?: number;
            };
            const news = await this.yahooFinanceService.getNews(ticker, limit);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(news, null, 2),
                },
              ],
            };
          }

          case 'compare_stocks': {
            const { tickers } = args as { tickers: string[] };
            const comparison = await this.yahooFinanceService.compareTickers(tickers);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(comparison, null, 2),
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Yahoo Finance MCP Server running on stdio');
  }
}

// Start the server
const server = new YahooFinanceMCPServer();
server.run().catch(console.error);
