import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 這是關鍵：設定為相對路徑，這樣無論你的 repo 名稱是什麼，GitHub Pages 都能正確讀取
  base: './', 
})