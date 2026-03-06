// handlers/messageHandler.js
const {
  validateTextMessage,
  validateImageMessage,
  validateVoiceMessage,
  validatePdfMessage
} = require("../middleware/validateMessage");

const { getUserByToken } = require("../memory/userStore");
const { addMessage } = require("../memory/chatStore");
const { broadcast } = require("../services/broadcastService");
const { createBaseMessage } = require("../services/messageFactory");

function handleChatMessage(ws, data) {
  const user = getUserByToken(ws.userToken);
  if (!user) return;

  if (data.type === "text") {
    const sanitizedText = validateTextMessage(data);
    if (!sanitizedText) return;

    const message = createBaseMessage(user, "text", {
      content: sanitizedText,
      replyTo: data.replyTo
    });

    addMessage(message);
    broadcast(message);
    return;
  }

  if (data.type === "image") {
    if (!validateImageMessage(data)) return;

    const message = createBaseMessage(user, "image", {
      text: data.text,
      content: data.content,
      replyTo: data.replyTo
    });

    addMessage(message);
    broadcast(message);
    return;
  }

  if (data.type === "voice") {
    if (!validateVoiceMessage(data)) return;

    const message = createBaseMessage(user, "voice", {
      text: data.text,
      content: data.content,
      replyTo: data.replyTo
    });

    addMessage(message);
    broadcast(message);
    return;
  }

  if (data.type === "pdf") {
    if (!validatePdfMessage(data)) return;

    const message = createBaseMessage(user, "pdf", {
      text: data.text,
      attachments: data.attachments,
      replyTo: data.replyTo
    });

    addMessage(message);
    broadcast(message);
    return;
  }

  if (data.type === "sticker" || data.type === "gif") {
    const message = createBaseMessage(user, data.type, {
      content: data.content,
      replyTo: data.replyTo
    });

    addMessage(message);
    broadcast(message);
  }
}

module.exports = { handleChatMessage };