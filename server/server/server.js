const http = require('http');
const express = require("express");
const WebSocket = require('ws');
const cors = require("cors");

const { PORT } = require('./config');
const { validateTextMessage, validateImageMessage } = require('./validation');
const { getRegistredUsers, getUserByToken, removeUser, addUser } = require('./authManager');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set();

// ======================
// In-Memory Chat History
// ======================

const MAX_HISTORY = 500;
const chatHistory = [];

function addMessage(message) {
  chatHistory.push(message);
  if (chatHistory.length > MAX_HISTORY) {
    chatHistory.shift();
  }
}

function broadcast(message) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

function brodcastUserStates(){

    const allUsers = getRegistredUsers() ; 
    const  connectedEmails = new Set() ; 
    clients.forEach(client => {

      if(client.userEmail ){
        connectedEmails.add(client.userEmail)
      }
    })


    const online = []
    const offline = []

    allUsers.forEach(user=>{

        const userData = {
          email : user.email,
          username  : user.username , 
          avatar : user.avatar , 
          ip : user.ip , 
          creationDate : user.creationDate
        }

        if(connectedEmails.has(user.email)){
          online.push(userData)
        }else{
          offline.push(userData)
        }

    })


    broadcast({
      type : "USER_STATUS_UPDATE" , 
      online , 
      offline
    })


}

// ======================
// HTTP ROUTES
// ======================

app.get("/test", (req, res) => {
  res.json({ message: "hello" });
});

app.post('/signup', (req, res) => {
  const { email ,avatar , password , username } = req.body;
  const ip = req.ip;

  console.log(req.body)

  if (!email  || !avatar || !password || !username) {
    return res.status(400).json({ error: "Email required" });
  }

  const response = addUser(email, ip , avatar  ,password , username);

  if (!response.error) {
    brodcastUserStates()
    return res.json(response); // contains token, email, color
  }

  return res.status(400).json(response);
});

// ======================
// WEBSOCKET
// ======================

wss.on('connection', (ws, req) => {
  clients.add(ws);
  ws.isAuthenticated = false;
  ws.userToken = null;

  console.log("New WS connection from:", req.socket.remoteAddress);

  ws.on('message', (raw) => {
    try {
      const data = JSON.parse(raw);

      // ======================
      // AUTH HANDSHAKE
      // ======================
      if (data.type === "AUTH") {

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
        ws.userEmail = user.email 

        // Send chat history after successful auth
        ws.send(JSON.stringify({
          type: "HISTORY",
          messages: chatHistory
        }));

        // Send auth success
        ws.send(JSON.stringify({
          type: "AUTH_SUCCESS",
          email: user.email,
        }));

        // Broadcast online users
        // broadcast({
        //   type: "ONLINE_USERS",
        //   users: getRegistredUsers().map(u => ({
        //     email: u.email
        //   }))
        // });

        brodcastUserStates()

        return;
      }

      // ======================
      // BLOCK UNAUTHENTICATED
      // ======================
      if (!ws.isAuthenticated) {
        ws.send(JSON.stringify({
          type: "AUTH_REQUIRED"
        }));
        return;
      }

      const user = getUserByToken(ws.userToken);
      if (!user) return;

      // ======================
      // TEXT MESSAGE
      // ======================
      if (data.type === "text") {

        const sanitizedText = validateTextMessage(data);
        if (!sanitizedText) return;

        const messageData = {
          id: Date.now().toString(),
          type: "text",
          email : user.email , 
          username: user.username, 
          text: sanitizedText,
          timestamp: Date.now()
        };
        

        addMessage(messageData);
        broadcast(messageData);
      }

      // ======================
      // IMAGE MESSAGE
      // ======================
      if (data.type === "image") {

        if (!validateImageMessage(data)) return;

        const messageData = {
          id: Date.now().toString(),
          type: "image",
          username: user.email,
          color: user.color,
          imageUrl: data.imageUrl,
          timestamp: Date.now()
        };

        addMessage(messageData);
        broadcast(messageData);
      }

    } catch (err) {
      console.error("WS Error:", err);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);

    brodcastUserStates()
    // broadcast({
    //   type: "ONLINE_USERS",
    //   users: getRegistredUsers().map(u => ({
    //     email: u.email
    //   }))
    // });

    console.log("Client disconnected");
  });
});

// ======================
// START SERVER
// ======================

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});