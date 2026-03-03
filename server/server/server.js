const http = require('http');
const express = require("express");
const WebSocket = require('ws');
const cors = require("cors");

const { PORT ,MAX_TOKENS} = require('./config');
const { validateTextMessage, validateImageMessage ,validateVoiceMessage , validatePdfMessage } = require('./validation');
const { getRegistredUsers, getUserByToken, removeUser, addUser } = require('./authManager');
const { canSend} = require('./rateLimiter')

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


  if (!email  || !avatar || !password || !username) {
    return res.status(400).json({ error: "All fields are required !" });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  const usernamePattern = /^[a-zA-Z0-9_]{3,15}$/;
  if (!usernamePattern.test(username)) {
    return res.status(400).json({ 
      error: "Username must be 3-15 characters and contain only letters, numbers, or underscores." 
    });
  }

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  if (!passwordPattern.test(password)) {
    return res.status(400).json({ 
      error: "Password must be at least 8 characters long, including one uppercase letter and one number." 
    });
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

  ws.tokens = MAX_TOKENS;
  ws.lastRefill = Date.now();

  ws.isAuthenticated = false;
  ws.userToken = null;

  console.log("New WS connection from:", req.socket.remoteAddress);

  ws.on('message', (raw) => {

    const now = Date.now();
  
    if (!canSend(ws)) {
      // Calculate how many seconds are left in the penalty
      const secondsLeft = Math.ceil((ws.lockUntil - now) / 1000);
      
      return ws.send(JSON.stringify({ 
        type: "error", 
        message: `Limit reached! Please wait ${secondsLeft} seconds.` 
      }));
    }

    try {

      if (!canSend(ws)) {
      // You MUST use 'return' here to stop the code!
        return ws.send(JSON.stringify({ 
          type: "error", 
          message: "Slow down! You can only send 5 messages per minute." 
        }));
      }


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
          id: Date.now().toString() + Math.random(),
          type : "text" , 
          email : user.email , 
          username: user.username, 
          content: sanitizedText,
          timestamp: Date.now() , 
          replyTo: data.replyTo ? data.replyTo : null
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
          id: Date.now().toString() + Math.random(),
          type : "image" , 
          email : user.email , 
          text : data.text , 
          username: user.username, 
          content: data.content,
          timestamp: Date.now() , 
          replyTo: data.replyTo ? data.replyTo : null
        };

        addMessage(messageData);
        broadcast(messageData);
      }



       if (data.type === "voice") {

        if (!validateVoiceMessage(data)) return;

        const messageData = {
          id: Date.now().toString() + Math.random(),
          type : "voice" , 
          email : user.email , 
          text : data.text , 
          username: user.username, 
          content: data.content,
          timestamp: Date.now() , 
          replyTo: data.replyTo ? data.replyTo : null
        };

        addMessage(messageData);
        broadcast(messageData);
      }


      if (data.type === "pdf") {

        if (!validatePdfMessage(data)) return;

        const messageData = {
          id: Date.now().toString() + Math.random(),
          type : "pdf" , 
          email : user.email , 
          text : data.text , 
          username: user.username, 
          attachments: data.attachments,
          timestamp: Date.now() , 
          replyTo: data.replyTo ? data.replyTo : null
        };

        addMessage(messageData);
        broadcast(messageData);
      }



      if (data.type === "reaction") {
          const { messageId, emoji, token } = data;
          const user = getUserByToken(token);
          if (!user) return;

          const message = chatHistory.find(m => m.id === messageId);
          if (!message) return;

          if (!message.reactions) message.reactions = {};

          const hasThisEmoji = message.reactions[emoji] && message.reactions[emoji].includes(user.email);

          if (hasThisEmoji) {
            // RULE: TOGGLE OFF
            const index = message.reactions[emoji].indexOf(user.email);
            message.reactions[emoji].splice(index, 1);
          } else {
            // RULE: ONLY ONE EMOJI
            Object.keys(message.reactions).forEach(key => {
              const otherIndex = message.reactions[key].indexOf(user.email);
              if (otherIndex > -1) {
                message.reactions[key].splice(otherIndex, 1);
              }
            });

            // Now add the new one
            if (!message.reactions[emoji]) message.reactions[emoji] = [];
            message.reactions[emoji].push(user.email);
          }

          broadcast({
            type: "update_message",
            messageId: messageId,
            reactions: message.reactions
          });
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