# Claude Desktop Setup Guide

This guide shows how to integrate the Yahoo Finance MCP Server with Claude Desktop.

## Prerequisites

1. **Claude Desktop** installed on your system
2. **Node.js** (version 18 or higher)
3. This Yahoo Finance MCP Server built and ready

## Setup Steps

### 1. Build the MCP Server

```bash
cd /path/to/yahoo-finance-mcp
npm install
npm run build
```

### 2. Configure Claude Desktop

#### On macOS:

1. Open Claude Desktop
2. Go to **Settings** → **Developer** → **Model Context Protocol**
3. Add a new MCP server with the following configuration:

```json
{
  "mcpServers": {
    "yahoo-finance": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/Users/saipatibandla/dev/yahoo-finance-mcp"
    }
  }
}
```

**Note:** Update the `cwd` path to match your actual project directory.

#### On Windows:

```json
{
  "mcpServers": {
    "yahoo-finance": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "C:\\path\\to\\your\\yahoo-finance-mcp"
    }
  }
}
```

#### On Linux:

```json
{
  "mcpServers": {
    "yahoo-finance": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/home/username/yahoo-finance-mcp"
    }
  }
}
```

### 3. Restart Claude Desktop

After adding the configuration, restart Claude Desktop to load the new MCP server.

### 4. Verify Installation

Once Claude Desktop restarts, you should see the Yahoo Finance tools available. You can test them by asking Claude:

- "Get the current price of Apple stock"
- "Compare Apple, Google, and Microsoft stocks"
- "Show me Tesla's historical data for the last month"
- "Get the latest news about Microsoft"

## Available Tools

The MCP server provides these tools to Claude:

1. **get_quote** - Get current stock price and market data
2. **get_historical_data** - Get historical OHLCV data
3. **get_news** - Get latest news headlines
4. **compare_stocks** - Compare multiple stocks side by side

## Troubleshooting

### Server Not Starting

1. Check that Node.js is installed: `node --version`
2. Verify the project is built: `npm run build`
3. Test the server manually: `npm run mcp`

### Tools Not Available

1. Check Claude Desktop logs for errors
2. Verify the `cwd` path is correct
3. Ensure the server starts without errors

### Permission Issues

1. Make sure the `dist/index.js` file is executable
2. Check file permissions in the project directory

## Example Usage

Once configured, you can use the tools in Claude Desktop like this:

**User:** "What's the current price of Apple stock?"

**Claude:** I'll get the current price of Apple stock for you.

*[Uses get_quote tool]*

**User:** "Compare the performance of Apple, Google, and Amazon stocks"

**Claude:** I'll compare these three tech giants for you.

*[Uses compare_stocks tool]*

**User:** "Show me Tesla's stock performance over the last 3 months"

**Claude:** I'll get Tesla's historical data for the last 3 months.

*[Uses get_historical_data tool]*

## Support

If you encounter any issues:

1. Check the Claude Desktop logs
2. Test the MCP server manually using the test script: `node test-mcp.js`
3. Verify all dependencies are installed correctly
4. Open an issue on the GitHub repository
