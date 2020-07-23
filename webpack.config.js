const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env, { mode }) => {
  const inDev = mode === 'development'

  const { PUBLIC_URL = '/' } = process.env

  return {
    devtool: 'cheap-module-source-map',
    output: {
      publicPath: PUBLIC_URL,
      filename: inDev ? '[name].js' : '[name].[contenthash].js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.scss$/,
          use: [
            inDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.(jpe?g|png|ico)$/i,
          use: {
            loader: 'file-loader',
            options: {
              name: inDev ? '[name].[ext]' : '[name].[hash].[ext]'
            }
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'index.html'
      }),
      new MiniCssExtractPlugin({
        filename: inDev ? '[name].css' : '[name].[hash].css',
        chunkFilename: inDev ? '[id].css' : '[id].[hash].css'
      }),
      new webpack.DefinePlugin({
        'process.env.PUBLIC_URL': JSON.stringify(PUBLIC_URL)
      })
    ]
  }
}
