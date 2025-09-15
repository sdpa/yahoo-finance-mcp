import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { YahooFinanceTools } from './tools/index.js';

export class YahooFinanceServer {
    private server: Server;
    private tools: YahooFinanceTools;

    constructor() {
        this.tools = new YahooFinanceTools();
        this.server = new Server(
            {
                name: 'yahoo-finance-mcp',
                version: '0.2.0',
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        );

        this.setupHandlers();
    }

    private setupHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: this.tools.getTools(),
            };
        });

        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            try {
                return await this.tools.executeTool(name, args);
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

    getServer(): Server {
        return this.server;
    }
}
