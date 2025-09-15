# Yahoo Finance MCP Server

A Model Context Protocol (MCP) server that provides real-time stock data, historical prices, news, and comparison features using Yahoo Finance data.

## Features

- **Real-time Quotes**: Get current stock prices and market data
- **Historical Data**: Retrieve OHLCV data for any time range
- **News**: Fetch latest news headlines for any ticker
- **Comparison**: Compare multiple stocks side by side

## MCP Tools

### 1. get_quote
Get current price and market snapshot for a stock.

**Parameters:**
- `ticker` (string, required): Stock ticker symbol (e.g., AAPL, GOOGL, MSFT)

**Example:**
```json
{
  "ticker": "AAPL"
}
```

**Response:**
```json
{
  "ticker": "AAPL",
  "price": 150.25,
  "change": 2.15,
  "changePercent": 1.45,
  "volume": 45000000,
  "marketCap": 2500000000000,
  "pe": 25.5,
  "high52Week": 180.00,
  "low52Week": 120.00,
  "open": 148.50,
  "previousClose": 148.10,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. get_historical_data
Get historical OHLCV data for a stock.

**Parameters:**
- `ticker` (string, required): Stock ticker symbol
- `range` (string, optional): Time range - `1d`, `5d`, `1mo`, `3mo`, `6mo`, `1y`, `2y`, `5y`, `10y`, `ytd`, `max` (default: `1mo`)
- `interval` (string, optional): Data interval - `1m`, `2m`, `5m`, `15m`, `30m`, `60m`, `90m`, `1h`, `1d`, `5d`, `1wk`, `1mo`, `3mo` (default: `1d`)

**Example:**
```json
{
  "ticker": "TSLA",
  "range": "1mo",
  "interval": "1d"
}
```

**Response:**
```json
{
  "ticker": "TSLA",
  "range": "1mo",
  "interval": "1d",
  "data": [
    {
      "date": "2024-01-15",
      "open": 200.00,
      "high": 205.50,
      "low": 198.75,
      "close": 203.25,
      "volume": 25000000
    }
  ]
}
```

### 3. get_news
Get latest news headlines for a stock.

**Parameters:**
- `ticker` (string, required): Stock ticker symbol
- `limit` (number, optional): Number of news items (1-50, default: 5)

**Example:**
```json
{
  "ticker": "MSFT",
  "limit": 5
}
```

**Response:**
```json
{
  "ticker": "MSFT",
  "news": [
    {
      "title": "Microsoft Reports Strong Q4 Earnings",
      "summary": "Microsoft exceeded expectations with revenue growth...",
      "url": "https://example.com/news/1",
      "publishedAt": "2024-01-15T09:00:00.000Z",
      "source": "Yahoo Finance"
    }
  ],
  "limit": 5
}
```

### 4. compare_stocks
Compare multiple stocks side by side.

**Parameters:**
- `tickers` (array, required): Array of stock ticker symbols (2-10 tickers)

**Example:**
```json
{
  "tickers": ["AAPL", "GOOGL", "AMZN"]
}
```

**Response:**
```json
{
  "tickers": ["AAPL", "GOOGL", "AMZN"],
  "data": [
    {
      "ticker": "AAPL",
      "price": 150.25,
      "change": 2.15,
      "changePercent": 1.45,
      "volume": 45000000,
      "marketCap": 2500000000000,
      "pe": 25.5
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd yahoo-finance-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Usage

### As an MCP Server

The server runs as a standard MCP server using stdio transport. It can be integrated with any MCP-compatible client.

#### For Claude Desktop

1. Add the server to your Claude Desktop configuration:

**On macOS:**
```json
{
  "mcpServers": {
    "yahoo-finance": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/path/to/your/yahoo-finance-mcp"
    }
  }
}
```

2. Restart Claude Desktop

3. The tools will be available in Claude Desktop for financial data queries

#### For Other MCP Clients

The server can be used with any MCP-compatible client by connecting to it via stdio transport.

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
# or
npm run mcp
```

## Configuration

The server includes configuration files for easy setup:

- `mcp-config.json`: General MCP server configuration
- `claude_desktop_config.json`: Claude Desktop specific configuration

## Error Handling

All tools return appropriate error messages in the MCP response format:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Error: Failed to fetch quote for INVALID_TICKER: No data found for ticker: INVALID_TICKER"
    }
  ],
  "isError": true
}
```

## Dependencies

- **@modelcontextprotocol/sdk**: Official MCP SDK for TypeScript
- **yahoo-finance2**: Yahoo Finance API client
- **typescript**: TypeScript support

## Architecture

The server is built using the official MCP SDK and follows MCP best practices:

- **Tools**: Each financial operation is exposed as an MCP tool
- **Type Safety**: Full TypeScript support with proper type definitions
- **Error Handling**: Comprehensive error handling with MCP-compliant responses
- **Validation**: Input validation for all tool parameters
- **Documentation**: Self-documenting tools with detailed schemas

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions, please open an issue on the GitHub repository.