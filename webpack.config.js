const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const PROD = process.env.NODE_ENV === 'production'
const DEV = process.env.NODE_ENV === 'development'

const copyFiles = [
  { from: './src/media/', to: './media' },
  { from: './src/images/', to: './images' }
]

const baseWebpack = {
  module: {
    rules: [
      {
        test: /\.scss/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          'postcss-loader',
          {
            loader: 'sass-loader'
          }
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
    new HtmlWebpackPlugin({
      hash: true,
      template: './src/index.html'
    }),
    new CopyWebpackPlugin(copyFiles)
  ]
}

if (PROD) {
  baseWebpack.optimization = {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          compress: true
        }
      })
    ]
  }
}

if (DEV) {
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
