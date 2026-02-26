const { broadcast } = require('./connectionManager')
const { canSend } = require('./rateLimiter')
const sanitize = require('./utils/sanitize')

function handleMessage(client, data) {
  if (!canSend(client)) return
  // sanitize message
  data.message = sanitize(data.message)
  broadcast({ type: 'CHAT', username: client.username, message: data.message })
}

module.exports = { handleMessage }