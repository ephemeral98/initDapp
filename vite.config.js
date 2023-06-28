import { defineConfig } from 'vite';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import ViteRequireContext from '@originjs/vite-plugin-require-context';
import requireTransform from 'vite-plugin-require-transform';
import viteCompression from 'vite-plugin-compression';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver, VantResolver } from 'unplugin-vue-components/resolvers';
import postcsspxtoviewport from 'postcss-px-to-viewport';
import { getEnv } from './src/utils/buildTestnet';
import UnoCSS from 'unocss/vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

import vue from '@vitejs/plugin-vue';
import path from 'path';
import { createStyleImportPlugin, ElementPlusResolve } from 'vite-plugin-style-import';

/**
 * 获取设计稿的vw
 * @param {Number} size 设计稿宽度;
 */
function getUiVw(size, name) {
  return {
    unitToConvert: name, // 要转化的单位
    viewportWidth: size, // UI设计稿的宽度
    unitPrecision: 6, // 转换后的精度，即小数点位数
    propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
    viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
    fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
    // selectorBlackList: ['ignore-'], // 指定不转换为视窗单位的类名，
    minPixelValue: 0, // 默认值0，小于或等于1px则不进行转换
    mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
    replace: true, // 是否转换后直接更换属性值
    // exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
    exclude: [],
    landscape: false, // 是否处理横屏情况
  };
}

export default (config) => {
  // 是否要打包到测试网(生成子路径)
  return defineConfig({
    base: getEnv(config.mode).viteBase,

    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@import "./src/assets/css/var.scss"; @import "./src/assets/css/mixins.scss"; @import "./src/assets/css/mediaSize.scss"; @import "./src/assets/css/mediaUnit.scss"; @import "./src/assets/css/theme.scss";',
        },
      },

      postcss: {
        plugins: [
          postcsspxtoviewport(getUiVw(1280, 'pm')),
          postcsspxtoviewport(getUiVw(1920, 'pw')),
        ],
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
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      },

      // import时省略后缀
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.mjs'],
    },
    plugins: [
      vue(),
      viteCommonjs(),
      ViteRequireContext(),
      requireTransform({}),
      viteCompression(),
      UnoCSS(),

      AutoImport({
        imports: ['vue', 'vue-router'], // 自动导入vue和vue-router相关函数
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: 'src/auto-import.d.ts', // 生成 auto-import.d.ts 全局声明
        resolvers: [ElementPlusResolver()],
        dirs: ['./preFunc/**'],
      }),

      Components({
        // allow auto load markdown components under `./src/components/`
        extensions: ['vue', 'md'], // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: 'src/components.d.ts',
        resolvers: [ElementPlusResolver(), VantResolver()],
      }),

      // 不知道为什么，unplugin-vue-components的element自动导入 样式不生效,所以用这个包补给下
      createStyleImportPlugin({
        resolves: [ElementPlusResolve()],
      }),

      // 图片压缩
      ViteImageOptimizer({
        test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
        exclude: undefined,
        include: undefined,
        includePublic: true,
        logStats: true,
        ansiColors: true,
        svg: {
          multipass: true,
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  cleanupNumericValues: false,
                  removeViewBox: false, // https://github.com/svg/svgo/issues/1128
                },
                cleanupIDs: {
                  minify: false,
                  remove: false,
                },
                convertPathData: false,
              },
            },
            'sortAttrs',
            {
              name: 'addAttributesToSVGElement',
              params: {
                attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
              },
            },
          ],
        },
        png: {
          // https://sharp.pixelplumbing.com/api-output#png
          quality: 100,
        },
        jpeg: {
          // https://sharp.pixelplumbing.com/api-output#jpeg
          quality: 100,
        },
        jpg: {
          // https://sharp.pixelplumbing.com/api-output#jpeg
          quality: 100,
        },
        tiff: {
          // https://sharp.pixelplumbing.com/api-output#tiff
          quality: 100,
        },
        // gif does not support lossless compression
        // https://sharp.pixelplumbing.com/api-output#gif
        gif: {},
        webp: {
          // https://sharp.pixelplumbing.com/api-output#webp
          lossless: true,
        },
        avif: {
          // https://sharp.pixelplumbing.com/api-output#avif
          lossless: true,
        } /* pass your config */,
      }),
    ],

    build: {
      rollupOptions: {
        // 确保外部化处理那些你不想打包进库的依赖
        external: ['parallax-js'],
      },
      outDir: './dist',
    },

    esbuild: {
      pure: ['console.log'],
      minify: true,
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
          target: 'http://localhost:9800',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/'),
        },
      },
    },
  });
};
