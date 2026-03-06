const { MAX_MESSAGE_LENGTH } = require('./config')

function validateMessage(data) {
  if (!data.type || !data.message) return false
  if (data.message.length > MAX_MESSAGE_LENGTH) return false
  return true
}

module.exports = { validateMessage }