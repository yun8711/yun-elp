#!/usr/bin/env node
import process from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { DOC_DIR } from './constants/path.js';
import registryTools from './tools/index.js';

async function main() {
  const VERSION = (
    JSON.parse(fs.readFileSync(path.join(DOC_DIR, 'package.json'), 'utf8')) as { version: string }
  ).version;

  const server = new McpServer({
    name: 'yun-elp-mcp',
    version: VERSION,
    capabilities: {
      tools: {}
    }
  });

  // 注册工具
  registryTools(server);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(err => {
  console.error('[yun-elp-mcp] fatal:', err);
  process.exit(1);
});
