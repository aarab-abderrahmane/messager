const { clients, getClient } = require('./connectionManager')

function authenticate(deviceID, username) {
  if (!deviceID || !username) return false
  const existing = getClient(deviceID)
  if (existing) return false // prevent duplicate deviceID
  return true
}

module.exports = { authenticate }