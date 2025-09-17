import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  build: {
    outDir: 'gui',
    emptyOutDir: true,
    assetsDir: 'static',
    rollupOptions: {
      output: {
        entryFileNames: `static/[name].js`,   // entry JS 파일 고정
        chunkFileNames: `static/[name].js`,   // chunk 파일 고정
        assetFileNames: `static/[name].[ext]` // CSS, 이미지 등 고정
      }
    }
  }
})
