/**
 * @author: @AngularClass
 */
var fs = require('fs')
var helpers = require('./config/helpers')

/**
 * check custom login style exists
 */

var loginStyleExsits
try {
  loginStyleExsits = fs.statSync(helpers.root('src/assets/css/login.css')).isFile()
  console.log('login style file existence: ' + loginStyleExsits)
} catch (e) {
  console.error('no login style file found, use default')
  loginStyleExsits = false
}

const ENV = process.env.ENV = process.env.NODE_ENV
/**
 * Webpack Constants
 */
const METADATA = {
  host: '0.0.0.0',
  port: 443,
  title: process.env.SITE_TITLE || 'Altair',
  description: process.env.SITE_DESC || 'Life is short, let\'s watch anime!',
  baseUrl: '/',
  GA: process.env.GA || '',
  customLoginStyle: loginStyleExsits,
  chrome_extension_id: process.env.CHROME_EXTENSION_ID || ''
}

console.log('CHROME_EXTENSION_ID: ', METADATA.chrome_extension_id)

// Look in ./config folder for webpack.dev.js
switch (ENV) {
  case 'prod':
  case 'production':
    METADATA.port = process.env.PORT || 8080
    METADATA.ENV = ENV || 'production'
    METADATA.HMR = false
    module.exports = require('./config/webpack.prod')(METADATA)
    break
  case 'test':
  case 'testing':
    METADATA.ENV = ENV || 'test'
    module.exports = require('./config/webpack.test')(METADATA)
    break
  case 'dev':
  case 'development':
  default:
    METADATA.ENV = ENV || 'development'
    METADATA.HMR = true
    module.exports = require('./config/webpack.dev')(METADATA)
}
