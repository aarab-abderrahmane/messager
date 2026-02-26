const { MAX_TOKENS, TOKEN_REFILL_RATE } = require('./config')

function canSend(client) {
  const now = Date.now()
  const elapsed = (now - client.lastRefill) / 1000
  const refill = Math.floor(elapsed * TOKEN_REFILL_RATE)
  if (refill > 0) {
    client.tokens = Math.min(MAX_TOKENS, client.tokens + refill)
    client.lastRefill = now
  }
  if (client.tokens > 0) {
    client.tokens--
    return true
  }
  return false
}

module.exports = { canSend }