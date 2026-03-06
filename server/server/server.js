const http = require('http');
const express = require("express");
// const WebSocket = require('ws');
const cors = require("cors");
require("dotenv").config();

const  PORT = process.env.PORT


const chatRoutes = require('./routes/chatRoutes')
const {setupSocket} = require('./config/socket')

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

app.use("/Dot", chatRoutes);
setupSocket(server)

// ======================
// START SERVER
// ======================

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});