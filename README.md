# Yahoo Finance MCP Server

A Model Context Protocol (MCP) server that provides real-time stock data, historical prices, news, and comparison features using Yahoo Finance data. Built following [Dedalus Labs server guidelines](https://docs.dedaluslabs.ai/server-guidelines) with streamable HTTP transport as the primary method.

## Features

- **Real-time Quotes**: Get current stock prices and market data
- **Historical Data**: Retrieve OHLCV data for any time range
- **News**: Fetch latest news headlines for any ticker
- **Comparison**: Compare multiple stocks side by side
- **Streamable HTTP Transport**: Modern HTTP transport for production deployment
- **STDIO Transport**: Development-friendly transport for local testing
- **Session Management**: Proper session handling for HTTP connections
- **Health Checks**: Built-in health monitoring endpoints

## Architecture

This server follows the [Dedalus Labs MCP Server Guidelines](https://docs.dedaluslabs.ai/server-guidelines) with:

- **Modular Architecture**: Clear separation of concerns with dedicated modules
- **Streamable HTTP First**: Modern HTTP transport as the primary interface
- **Type Safety**: Full TypeScript coverage with proper interfaces
- **Production Ready**: Built-in error handling, logging, and configuration management
- **Testable**: Dependency injection and isolated components

### Directory Structure

```
src/
├── index.ts            # Main entry point
├── cli.ts              # Command-line argument parsing
├── config.ts           # Configuration management
├── server.ts           # Server instance creation
├── client.ts           # External API client (Yahoo Finance)
├── yahoo-finance-service.ts  # Service layer
├── types.ts            # TypeScript type definitions
├── tools/
│   ├── index.ts        # Tool exports
│   └── yahoo-finance.ts # Tool definitions and handlers
└── transport/
    ├── index.ts        # Transport exports
    ├── http.ts         # HTTP transport (primary)
    └── stdio.ts        # STDIO transport (development)
```

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

### 3. get_news
Get latest news headlines for a stock.

**Parameters:**
- `ticker` (string, required): Stock ticker symbol
- `limit` (number, optional): Number of news items (1-50, default: 5)

### 4. compare_stocks
Compare multiple stocks side by side.

**Parameters:**
- `tickers` (array, required): Array of stock ticker symbols (2-10 tickers)

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

### STDIO Transport (Development)

For local development and testing:

```bash
# List available tools
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}' | npm run start:stdio

# Get Apple stock quote
echo '{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "get_quote", "arguments": {"ticker": "AAPL"}}}' | npm run start:stdio

# Compare multiple stocks
echo '{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "compare_stocks", "arguments": {"tickers": ["AAPL", "GOOGL", "MSFT"]}}}' | npm run start:stdio
```

### HTTP Transport (Production)

For production deployment with streamable HTTP:

```bash
# Start HTTP server
npm start

# Health check
curl http://localhost:8080/health

# The server supports both:
# - /mcp endpoint for streamable HTTP transport
# - /sse endpoint for SSE transport (backward compatibility)
```

### Command Line Options

```bash
# Run with custom port
npm start -- --port 3000

# Force STDIO transport
npm run start:stdio

# Show help
npm start -- --help
```

## Configuration

### Environment Variables

- `PORT`: HTTP server port (default: 8080)
- `NODE_ENV`: Set to 'production' for production mode

### Client Configuration

For MCP clients, use this configuration:

```json
{
  "mcpServers": {
    "yahoo-finance": {
      "url": "http://localhost:8080/mcp"
    }
  }
}
```

For backward compatibility with SSE:

```json
{
  "mcpServers": {
    "yahoo-finance": {
      "url": "http://localhost:8080/sse"
    }
  }
}
```

## Testing

### Run Comprehensive Tests

```bash
# Test both transports
node test-dedalus-mcp.js

# Test individual tools
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}' | npm run start:stdio
```

### Health Monitoring

```bash
# Check server health
curl http://localhost:8080/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "yahoo-finance-mcp",
  "version": "0.2.0"
}
```

## Development

### Available Scripts

- `npm run build`: Compile TypeScript to JavaScript
- `npm run watch`: Watch mode for development
- `npm start`: Start HTTP server
- `npm run start:stdio`: Start STDIO server
- `npm run dev`: Build and start HTTP server
- `npm run dev:stdio`: Build and start STDIO server

### Project Structure

The server follows the Dedalus Labs guidelines with:

- **Modular Design**: Each component has a specific responsibility
- **Transport Abstraction**: Easy switching between HTTP and STDIO
- **Configuration Management**: Environment-based configuration
- **Error Handling**: Comprehensive error handling throughout
- **Type Safety**: Full TypeScript coverage

## Production Deployment

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 8080
CMD ["node", "dist/index.js"]
```

### Environment Setup

```bash
# Production environment
export NODE_ENV=production
export PORT=8080
npm start
```

## Dependencies

- **@modelcontextprotocol/sdk**: Official MCP SDK (v1.17.3+)
- **yahoo-finance2**: Yahoo Finance API client
- **dotenv**: Environment variable management

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the Dedalus Labs guidelines
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions, please open an issue on the GitHub repository.

## References

- [Dedalus Labs MCP Server Guidelines](https://docs.dedaluslabs.ai/server-guidelines)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Yahoo Finance API](https://github.com/gadicc/node-yahoo-finance2)