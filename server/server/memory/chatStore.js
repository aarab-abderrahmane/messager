const MAX_HISTORY = 500;
const chatHistory = [];

function addMessage(message) {
  chatHistory.push(message);

  if (chatHistory.length > MAX_HISTORY) {
    chatHistory.shift();
  }
}

function getChatHistory() {
  return chatHistory;
}

function findMessageById(id) {
  return chatHistory.find(msg => msg.id === id);
}

module.exports = {
  addMessage,
  getChatHistory,
  findMessageById
};