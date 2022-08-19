import { defineConfig } from 'vite';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import ViteRequireContext from '@originjs/vite-plugin-require-context';
import requireTransform from 'vite-plugin-require-transform';
import viteCompression from 'vite-plugin-compression';
import AutoImport from 'unplugin-auto-import/vite';
import AutoCps from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData:
          '@import "./src/assets/css/var.scss"; @import "./src/assets/css/mixins.scss"; @import "./src/assets/css/mediaSize.scss"; @import "./src/assets/css/mediaUnit.scss"; @import "./src/assets/css/theme.scss";',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@css': path.resolve(__dirname, './src/assets/css'),
      '@cps': path.resolve(__dirname, './src/components'),
      '@img': path.resolve(__dirname, './src/assets/img'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store'),
      '@contApi': path.resolve(__dirname, './src/contractsApi'),
      '@tools': path.resolve(__dirname, './src/utils/tools'),
      '@bpMath': path.resolve(__dirname, './src/utils/bpMath'),
    },
  },
  plugins: [
    vue(),
    viteCommonjs(),
    ViteRequireContext(),
    requireTransform({}),
    viteCompression(),

    AutoImport({
      imports: ['vue', 'vue-router'], // 自动导入vue和vue-router相关函数
      dts: 'src/auto-import.d.ts', // 生成 auto-import.d.ts 全局声明
      resolvers: [ElementPlusResolver()],
    }),

    AutoCps({
      resolvers: [ElementPlusResolver()],
    }),
  ],

  build: {
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['parallax-js'],
    },
  },

  server: {
    port: 3100,
    // 是否自动在浏览器打开
    open: false,
    // 是否开启 https
    https: false,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: '',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/'),
      },
    },
  },
});
