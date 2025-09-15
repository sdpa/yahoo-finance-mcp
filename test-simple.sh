#!/bin/bash

echo "🧪 Testing Yahoo Finance MCP Server"
echo "=================================="
echo

# Test 1: List tools
echo "1️⃣ Testing tools/list..."
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}' | npm run mcp
echo
echo "Press Enter to continue..."
read

# Test 2: Get quote
echo "2️⃣ Testing get_quote (AAPL)..."
echo '{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "get_quote", "arguments": {"ticker": "AAPL"}}}' | npm run mcp
echo
echo "Press Enter to continue..."
read

# Test 3: Compare stocks
echo "3️⃣ Testing compare_stocks (AAPL, GOOGL, MSFT)..."
echo '{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "compare_stocks", "arguments": {"tickers": ["AAPL", "GOOGL", "MSFT"]}}}' | npm run mcp
echo
echo "Press Enter to continue..."
read

# Test 4: Historical data
echo "4️⃣ Testing get_historical_data (TSLA, 5 days)..."
echo '{"jsonrpc": "2.0", "id": 4, "method": "tools/call", "params": {"name": "get_historical_data", "arguments": {"ticker": "TSLA", "range": "5d", "interval": "1d"}}}' | npm run mcp
echo
echo "Press Enter to continue..."
read

# Test 5: News
echo "5️⃣ Testing get_news (MSFT, 3 articles)..."
echo '{"jsonrpc": "2.0", "id": 5, "method": "tools/call", "params": {"name": "get_news", "arguments": {"ticker": "MSFT", "limit": 3}}}' | npm run mcp
echo
echo "✅ All tests completed!"
