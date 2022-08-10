import { defineConfig } from 'vite';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import ViteRequireContext from '@originjs/vite-plugin-require-context';
import requireTransform from 'vite-plugin-require-transform';
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
  server: {
    port: 3100,
    host: '0.0.0.0',
  },
  plugins: [vue(), viteCommonjs(), ViteRequireContext(), requireTransform({})],

  build: {
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['parallax-js'],
    },
  },
});
