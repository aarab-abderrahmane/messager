// config/socket.js
const WebSocket = require("ws");
const { MAX_TOKENS } = require("../configff");
const { canSend } = require("../middleware/rateLimiter");

const {
  addClient,
  removeClient
} = require("../services/broadcastService");

const { handleAuth } = require("../handlers/authHandler");
const { handleChatMessage } = require("../handlers/messageHandler");
const { handleReaction } = require("../handlers/reactionHandler");
const { brodcastUserStates } = require("../services/broadcastService");

function setupSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    addClient(ws);

    ws.tokens = MAX_TOKENS;
    ws.lastRefill = Date.now();
    ws.isAuthenticated = false;
    ws.userToken = null;
    ws.userEmail = null;

    console.log("New WS connection from:", req.socket.remoteAddress);

    ws.on("message", raw => {
      try {
        const data = JSON.parse(raw);

        if (data.type !== "AUTH") {
          if (!canSend(ws)) {
            const now = Date.now();
            const secondsLeft = Math.ceil((ws.lockUntil - now) / 1000);

            return ws.send(JSON.stringify({
              type: "error",
              message: `Limit reached! Please wait ${secondsLeft} seconds.`
            }));
          }
        }

        if (data.type === "AUTH") {
          handleAuth(ws, data, brodcastUserStates);
          return;
        }

        if (!ws.isAuthenticated) {
          ws.send(JSON.stringify({ type: "AUTH_REQUIRED" }));
          return;
        }

        if (data.type === "reaction") {
          handleReaction(data);
          return;
        }

        handleChatMessage(ws, data);
      } catch (err) {
        console.error("WS Error:", err);
      }
    });

    ws.on("close", () => {
      removeClient(ws);
      brodcastUserStates();
      console.log("Client disconnected");
    });
  });
}


module.exports = {setupSocket}