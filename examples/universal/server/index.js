import koa from 'koa'
import logger from 'koa-logger'
import favicon from 'koa-favicon'
import render from './render'
import config from '../config'
import webpack from 'webpack'
import webpackConfig from '../build/webpack'
import webpackDevMiddleware from 'koa-webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

const app = koa()

const compiler = webpack(webpackConfig)
app.use(webpackDevMiddleware(compiler, {
  quiet: true,
  publicPath: config.webpack.publicPath,
  stats: {
    colors: true
  }
}))
app.use(function* (next) {
  yield webpackHotMiddleware(compiler).bind(null, this.req, this.res)
  yield next
})

app.use(logger())
app.use(favicon(config.resolve('public/favicon.ico')))
app.use(render)

export default app
