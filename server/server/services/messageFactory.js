function createBaseMessage(user, type, extra = {}) {
  return {
    id: Date.now().toString() + Math.random(),
    type,
    email: user.email,
    username: user.username,
    avatar: user.avatar,
    timestamp: Date.now(),
    replyTo: extra.replyTo || null,
    ...extra
  };
}

module.exports = { createBaseMessage };