// services/broadcastService.js
const WebSocket = require("ws");
const {getRegistredUsers} = require("../memory/userStore")

const clients = new Set();

function addClient(ws) {
  clients.add(ws);
}

function removeClient(ws) {
  clients.delete(ws);
}

function getClients() {
  return clients;
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


module.exports = {
  addClient,
  removeClient,
  getClients,
  broadcast,
  brodcastUserStates
};