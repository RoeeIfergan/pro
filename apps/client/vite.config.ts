/// <reference types='vitest' />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

console.log(__dirname)
export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/client',
  server: {
    port: 4200,
    host: 'localhost'
  },
  preview: {
    port: 4300,
    host: 'localhost'
  },
  plugins: [react()],
  resolve: {
    extensions: ['.jsx', '.js', '.mjs', '.mts', '.ts', '.tsx', '.json'],
    alias: {
      // fs: require.resolve('rollup-plugin-node-builtins'),
      '@client/components': path.resolve(__dirname, './src/components'),
      '@client/utils': path.resolve(__dirname, './src/utils'),
      '@client/views': path.resolve(__dirname, './src/views')

      // 'utils': path.resolve(__dirname, './src/utils'),
      // 'hooks': path.resolve(__dirname, './src/hooks'),
      // 'views': path.resolve(__dirname, './src/views'),
      // 'components': path.resolve(__dirname, './src/components'),
      // 'api': path.resolve(__dirname, './src/api'),
    }
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
}))
