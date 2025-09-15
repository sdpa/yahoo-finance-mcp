#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testMCPServer() {
  console.log('🧪 Testing Yahoo Finance MCP Server...\n');

  const server = spawn('node', [join(__dirname, 'dist', 'index.js')], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  // Test 1: List tools
  console.log('1️⃣ Testing tools/list...');
  const listToolsRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: {}
  };

  await sendRequest(server, listToolsRequest);
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 2: Get quote
  console.log('\n2️⃣ Testing get_quote tool...');
  const quoteRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'get_quote',
      arguments: { ticker: 'AAPL' }
    }
  };

  await sendRequest(server, quoteRequest);
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 3: Compare stocks
  console.log('\n3️⃣ Testing compare_stocks tool...');
  const compareRequest = {
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'compare_stocks',
      arguments: { tickers: ['AAPL', 'GOOGL', 'MSFT'] }
    }
  };

  await sendRequest(server, compareRequest);
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 4: Get historical data
  console.log('\n4️⃣ Testing get_historical_data tool...');
  const historicalRequest = {
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'get_historical_data',
      arguments: { 
        ticker: 'TSLA',
        range: '5d',
        interval: '1d'
      }
    }
  };

  await sendRequest(server, historicalRequest);
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 5: Get news
  console.log('\n5️⃣ Testing get_news tool...');
  const newsRequest = {
    jsonrpc: '2.0',
    id: 5,
    method: 'tools/call',
    params: {
      name: 'get_news',
      arguments: { 
        ticker: 'MSFT',
        limit: 3
      }
    }
  };

  await sendRequest(server, newsRequest);
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('\n✅ All tests completed!');
  server.kill();
}

function sendRequest(server, request) {
  return new Promise((resolve) => {
    let responseData = '';
    
    server.stdout.on('data', (data) => {
      responseData += data.toString();
    });

    server.stdout.on('end', () => {
      try {
        const response = JSON.parse(responseData.trim());
        if (response.result) {
          console.log('✅ Success:', JSON.stringify(response.result, null, 2));
        } else if (response.error) {
          console.log('❌ Error:', JSON.stringify(response.error, null, 2));
        }
      } catch (e) {
        console.log('📄 Raw response:', responseData);
      }
      resolve();
    });

    server.stdin.write(JSON.stringify(request) + '\n');
  });
}

testMCPServer().catch(console.error);
