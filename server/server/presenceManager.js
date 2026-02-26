const { broadcast } = require('./connectionManager')

function userJoined(deviceID, username) {
  broadcast({ type: 'user_joined', deviceID, username })
}

function userLeft(deviceID) {
  broadcast({ type: 'user_left', deviceID })
}

module.exports = { userJoined, userLeft }