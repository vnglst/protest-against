const isAlpha = require('validator/lib/isAlpha')
const { DEFAULT_TOPIC } = require('../common/config')

const sanatizeTopic = topic => (isAlpha(topic) ? topic : DEFAULT_TOPIC)

module.exports = {
  sanatizeTopic
}
