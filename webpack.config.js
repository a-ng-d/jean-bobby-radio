const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = {
  mode: 'production',
  entry: {
    jbradio: './src/jbradio.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].min.js',
    assetModuleFilename: 'images/[name][ext]'
  },
  devServer: {
    port: 8080,
    compress: true,
    contentBase: [
      path.join(__dirname, 'dist'),
      path.join(__dirname, '/assets/images'),
    ],
    publicPath: '/assets/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/templates/main.pug'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].min.css',
      chunkFilename: '[id].min.css',
      ignoreOrder: false
    })
  ],
  module: {
    rules: [
      {
        test: /\.(sa|c)ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options : {
              publicPath: './assets'
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
      {
        test: /\.(png|svg|jpg)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.pug$/i,
        use: ['pug-loader']
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new UglifyJsPlugin()
    ],
  },
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {}
  if (argv.mode === 'production') {}
  return config;
}
