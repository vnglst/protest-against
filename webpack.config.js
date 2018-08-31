const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const PROD = process.env.NODE_ENV === 'production'
const DEV = process.env.NODE_ENV === 'development'

const copyFiles = [
  { from: './src/media/', to: './media' },
  { from: './src/images/', to: './images' }
]

const baseWebpack = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          'sass-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new CleanWebpackPlugin(['dist']),
    new MiniCssExtractPlugin({}),
    new HtmlWebpackPlugin({
      hash: true,
      template: './src/index.html'
    }),
    new CopyWebpackPlugin(copyFiles)
  ]
}

if (PROD) {
  baseWebpack.mode = 'production'
  baseWebpack.optimization = {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          compress: true
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
}

if (DEV) {
  baseWebpack.devtool = 'source-map'
  baseWebpack.devServer = {
    inline: true,
    host: 'localhost',
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3000'
      }
    }
  }
}

module.exports = env => {
  return baseWebpack
}
