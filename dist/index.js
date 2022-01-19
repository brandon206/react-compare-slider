
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./react-compare-slider.cjs.production.min.js')
} else {
  module.exports = require('./react-compare-slider.cjs.development.js')
}
