// validation.js

// Max text length
const MAX_TEXT_LENGTH = 500;

// Max image size in bytes (~5 MB)
const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 5MB

/**
 * Sanitize text to prevent HTML / JS injection
 */
function sanitizeText(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Validate text message
 * Returns sanitized text if valid, null if invalid
 */
function validateTextMessage(data) {
  if (!data.text || typeof data.text !== "string") return null;
  if (data.text.length > MAX_TEXT_LENGTH) return null;
  return sanitizeText(data.text);
}

/**
 * Validate image message
 * Returns true if valid, false if invalid
 */
function validateImageMessage(data) {
  if (!data.imageUrl || typeof data.imageUrl !== "string") return false;
  if (!data.imageUrl.startsWith("data:image/")) return false;

  // Approximate size from Base64
  const base64Size = (data.imageUrl.length * 3) / 4;
  if (base64Size > MAX_IMAGE_SIZE) return false;

  return true;
}

module.exports = {
  validateTextMessage,
  validateImageMessage
};