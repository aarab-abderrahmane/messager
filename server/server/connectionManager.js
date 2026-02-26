const clients = new Map() // deviceID → client object

function addClient(deviceID, clientObj) {
  clients.set(deviceID, clientObj)
}

function removeClient(deviceID) {
  clients.delete(deviceID)
}

function getClient(deviceID) {
  return clients.get(deviceID)
}

function broadcast(data) {
  const msg = JSON.stringify(data)
  for (const client of clients.values()) {
    client.socket.send(msg)
  }
}

module.exports = { clients, addClient, removeClient, getClient, broadcast }