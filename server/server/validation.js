// Constants
const MAX_TEXT_LENGTH = 2000;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VOICE_SIZE = 5 * 1024 * 1024; // 2MB (Voice clips should be smaller)

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
 * Calculate approximate size of Base64 string in bytes
 */
function getBase64Size(base64String) {
  // Formula: (length * 3) / 4
  return (base64String.length * 3) / 4;
}

/**
 * Validate text message
 */
function validateTextMessage(data) {
  if (!data.content || typeof data.content !== "string") return null;
  if (data.content.length > MAX_TEXT_LENGTH) return null;
  return sanitizeText(data.content);
}

/**
 * Validate image message
 */
function validateImageMessage(data) {
  if (!data.content || typeof data.content !== "string") return false;
  // Strict check for image headers
  if (!data.content.startsWith("data:image/")) return false;

  if (getBase64Size(data.content) > MAX_IMAGE_SIZE) return false;

  return true;
}

/**
 * Validate voice clip message (NEW)
 */
function validateVoiceMessage(data) {
  if (!data.content || typeof data.content !== "string") return false;

  // Strict check: Must start with data:audio/
  // This covers audio/webm, audio/ogg, audio/wav, etc.
  if (!data.content.startsWith("data:audio/")) return false;

  // Check size
  if (getBase64Size(data.content) > MAX_VOICE_SIZE) return false;

  return true;
}

module.exports = {
  validateTextMessage,
  validateImageMessage,
  validateVoiceMessage // Add to exports
};