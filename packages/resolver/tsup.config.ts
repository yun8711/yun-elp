import { defineConfig } from 'tsup';
import { resolve } from 'path';

export default defineConfig({
  entry: {
    resolver: 'index.ts'
  },
  format: ['esm'],
  dts: {
    resolve: true,
    entry: {
      resolver: 'index.ts'
    }
  },
  splitting: false,
  sourcemap: true,
  outDir: resolve(__dirname, '../../dist'),
  outExtension() {
    return {
      js: '.mjs'
    };
  },
  name: 'resolver',
  noExternal: [/.*/],
  esbuildOptions(options) {
    options.outbase = '.';
  }
});
