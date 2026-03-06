const { getUserByToken } = require("../memory/userStore");
const { getChatHistory } = require("../memory/chatStore");

const {brodcastUserStates} = require('../services/broadcastService')

function handleAuth(ws, data) {
  const user = getUserByToken(data.token);

  if (!user) {
    ws.send(JSON.stringify({
      type: "AUTH_ERROR",
      message: "Invalid token"
    }));
    ws.close();
    return;
  }

  ws.isAuthenticated = true;
  ws.userToken = user.token;
  ws.userEmail = user.email;

  ws.send(JSON.stringify({
    type: "HISTORY",
    messages: getChatHistory()
  }));

  ws.send(JSON.stringify({
    type: "AUTH_SUCCESS",
    email: user.email
  }));

  brodcastUserStates();
}

module.exports = { handleAuth };