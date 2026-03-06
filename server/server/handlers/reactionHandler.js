
const { getUserByToken } = require("../memory/userStore");
const { findMessageById } = require("../memory/chatStore");
const { broadcast } = require("../services/broadcastService");

function handleReaction(data) {

    const { messageId, emoji, token } = data;
    const user = getUserByToken(token);
    if (!user) return;

    const message = findMessageById(messageId);
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

module.exports = { handleReaction }
