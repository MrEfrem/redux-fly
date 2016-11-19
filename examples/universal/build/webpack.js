import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import findCacheDir from 'find-cache-dir'
import config from '../config'

const webpackConfig = {
  name: 'client',
  target: 'web',
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'babel-polyfill',
    config.resolve('src/index'),
    `webpack-hot-middleware/client`
  ],
  output: {
    path: config.resolve('public/dist'),
    publicPath: config.webpack.publicPath,
    filename: `${config.webpack.fileName}?hash=[hash]`
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: config.resolve('src/index.html'),
      hash: true,
      minify: false
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: config.resolve('src'),
        loader: 'babel',
        query: {
          cacheDirectory: findCacheDir({ name: 'app-bundle' }),
          presets: [
            ['env', {
              targets: {
                "ie": 9
              }
            }],
            'react'
          ],
          plugins: [
            'transform-react-jsx-source',
            'transform-react-jsx-self'
          ]
        }
      }
    ]
  }
}

export default webpackConfig
