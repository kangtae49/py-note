import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  build: {
    outDir: 'gui',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,   // entry JS 파일 고정
        chunkFileNames: `assets/[name].js`,   // chunk 파일 고정
        assetFileNames: `assets/[name].[ext]` // CSS, 이미지 등 고정
      }
    }
  }
})
