import { defineConfig } from 'tsup';
import { resolve } from 'path';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: {
    entry: 'src/index.ts'
  },
  splitting: false,
  sourcemap: true,
  // 构建到 dist 目录下的 mcp-server 子目录
  outDir: resolve(__dirname, '../../dist/mcp-server'),
  outExtension() {
    return {
      js: '.js'
    };
  },
  banner: {
    js: '#!/usr/bin/env node'
  },
  noExternal: [/^@modelcontextprotocol/],
  esbuildOptions(options) {
    options.outbase = '.';
  }
});

