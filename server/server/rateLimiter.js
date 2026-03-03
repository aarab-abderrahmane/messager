const { MAX_TOKENS } = require('./config');

function canSend(client) {
  const now = Date.now();

  // 1. Check if the user is currently in the "Penalty Box"
  if (client.lockUntil && now < client.lockUntil) {
    return false;
  }

  // 2. Initialize tokens if this is a new connection
  if (client.tokens === undefined) {
    client.tokens = MAX_TOKENS;
  }

  // 3. If they have tokens, let them send
  if (client.tokens > 0) {
    client.tokens -= 1;
    return true;
  }

  // 4. IF TOKENS ARE RUN OUT (0):
  // Set a strict lock for 1 minute (60,000 milliseconds)
  client.lockUntil = now + 60000;
  
  // Reset tokens so they can use them after the minute is over
  client.tokens = MAX_TOKENS; 
  
  return false;
}



module.exports = { canSend }