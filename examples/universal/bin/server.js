require('babel-register')
const server = require('../server').default
const config = require('../config').default

const ignore = new RegExp(
  `(\\/\\.|~$|\\.json$|^${config.resolve().replace('/', '\\/')}\\/src\\/)`, 'i')
if (!(require('piping')({ hook: true, ignore }))) {
  return
}

server.listen(config.node.port, config.node.host)
global.console.log(`==> 🌎  Listening on port ${config.node.port}. Open up http://${config.node.host}:${config.node.port}/ in your browser.`)
