import path from 'path'

const config = {}
config.projectPath = path.resolve(__dirname, '..')
config.resolve = (newPath = '') =>  path.resolve(config.projectPath, newPath)

config.node = {
  host: 'localhost',
  port: '3000'
}

config.webpack = {
  publicPath: '/public/',
  fileName: 'main.js'
}

export default config
