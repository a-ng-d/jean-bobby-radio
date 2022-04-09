const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const
  sassLoader = {
    test: /\.(sa|c)ss$/i,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options : {
          publicPath: './'
        }
      },
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: ['autoprefixer']
          }
        }
      },
      'sass-loader'
    ]
  },
  assetLoader = {
    test: /\.(png|svg|jpg)$/i,
    type: 'asset/resource'
  },
  pugLoader = {
    test: /\.pug$/i,
    use: ['pug-loader']
  },
  pluginCss = new MiniCssExtractPlugin({
    filename: '[name].min.css',
    chunkFilename: '[id].min.css',
    ignoreOrder: false
  }),
  pluginPug = new HtmlWebpackPlugin({
    template: './src/templates/main.pug'
  }),

  config = {
    entry: {
      jbradio: './src/jbradio.js'
    },
    output: {
      path: path.resolve(__dirname, 'static'),
      filename: '[name].min.js',
      assetModuleFilename: 'images/[name][ext]'
    },
    devServer: {
      client: {
        webSocketURL: {
          hostname: "0.0.0.0",
          pathname: "/ws",
          port: 8080
        },
        logging: 'info'
      },
      compress: true,
      hot: 'only',
      liveReload: true,
      static: {
        directory: path.join(__dirname, 'static'),
        staticOptions: {},
        serveIndex: true,
        watch: true
      }
    },
    plugins: [],
    module: {
      rules: []
    },
    optimization: {
      minimize: true,
      minimizer: [],
    },
  };

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.module.rules.push(sassLoader, assetLoader, pugLoader);
    config.plugins.push(pluginCss, pluginPug)
  }
  if (argv.mode === 'production') {
    config.optimization.minimizer.push(new UglifyJsPlugin(), new CssMinimizerPlugin());
    config.module.rules.push(sassLoader, assetLoader, pugLoader);
    config.plugins.push(pluginCss, pluginPug)
  }
  return config;
}
