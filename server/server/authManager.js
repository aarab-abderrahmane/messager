// const { clients, getClient } = require('./connectionManager')

// function authenticate(deviceID, username) {
//   if (!deviceID || !username) return false
//   const existing = getClient(deviceID)
//   if (existing) return false // prevent duplicate deviceID
//   return true
// }

const usersByToken = new Map(); 
const usersByEmail = new Map()
const ips = new Set();    // track unique IPs


const { v4: uuidv4 } = require('uuid');

function addUser(email, ip , avatar  ,password , username) {
  // ✅ Check email uniqueness
  if (usersByEmail.has(email)) {
    return {error : 'Email already in use'};
  }

  // ✅ Check IP uniqueness
  if (ips.has(ip)) {
    return {error : "An account has already been created from this network."}
  }

  // ✅ Generate unique token
  let token;
  do {
    token = uuidv4();
  } while (usersByToken.has(token)); // ensure token unique

  // Create user object
  const newUser = { email, ip, token , avatar , password , username , lastActive: Date.now() };

  // Save

  usersByEmail.set(email, newUser);
  usersByToken.set(token, newUser);

  ips.add(ip);

  return newUser;
}

function removeUser(token) {
  const user = users.get(token);
  if (!user) return;

  emails.delete(user.email);
  ips.delete(user.ip);
  // users.delete(token);
}


function getUserByToken(token) {
  return usersByToken.get(token);
}

function getOnlineUsers() {
  return Array.from(usersByToken.values());
}





module.exports = { getOnlineUsers , getUserByToken ,removeUser ,addUser }