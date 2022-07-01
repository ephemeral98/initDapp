const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';

const cdn = {
  externals: {},
  css: [],
  js: [],
};

module.exports = {
  css: {
    // requireModuleExtension: true,
    extract: false,
    sourceMap: false,
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/assets/css/var.scss"; @import "~@/assets/css/mixins.scss"; @import "~@/assets/css/mediaSize.scss"; @import "~@/assets/css/mediaUnit.scss"; @import "~@/assets/css/theme.scss";`,
      },
    },
  },

  chainWebpack: (config) => {
    // 注入cdn
    /* config.plugin('html').tap((args) => {
      // 生产环境或本地需要cdn时，才注入cdn
      if (isProduction) {
        args[0].cdn = cdn;
      }
      return args;
    }); */
  },

  configureWebpack: (config) => {
    config.resolve = {
      extensions: ['.js', '.json', '.vue', '.ts'],
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@cps': path.resolve(__dirname, './src/components'),
        '@css': path.resolve(__dirname, './src/assets/css'),
        '@img': path.resolve(__dirname, './src/assets/img'),
        '@store': path.resolve(__dirname, './src/store'),
        '@page': path.resolve(__dirname, './src/views'),
        '@contApi': path.resolve(__dirname, './src/contractsApi'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
      },
    };

    // 在生产环境
    if (isProduction) {
      // config.mode = 'production';
      // config.externals = cdn.externals;
      // 生产环境删除console
      config.optimization.minimizer[0].options.minimizer.options.compress = {
        drop_console: true,
        drop_debugger: false,
        pure_funcs: ['console.log'],
      };
      // gzip压缩
      /* config.plugins.push(
        new CompressionPlugin({
          filename: "[path]_[query].js",
          // 压缩算法
          algorithm: "gzip",
          // 匹配文件
          test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
          minRatio: 0.8,
          threshold: 10240 // 对超过10k的数据压缩
          //删除原始文件只保留压缩后的文件
          // deleteOriginalAssets: isProduction
        })
      ); */
    }
  },
  devServer: {
    hot: true,
    port: 6300,
    proxy: {
      '/api': {
        target: 'http://120.77.211.242:9701',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '/api': '/',
        },
      },
    },
  },
  outputDir: path.resolve(__dirname, './dist'),
  assetsDir: 'static',
  // publicPath: "/MyClient/", // 这里的名字和打包后文件夹的名字一致
  productionSourceMap: false,
};
