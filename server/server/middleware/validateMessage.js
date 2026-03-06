// Constants
const MAX_TEXT_LENGTH = 2000;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_VOICE_SIZE = 1 * 1024 * 1024; // 1MB (Voice clips should be smaller)

// Constants
const MAX_PDF_SIZE = 2 * 1024 * 1024; // 2MB per file
const MAX_ATTACHMENTS = 3; // Max files allowed


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







function validatePdfMessage(data) {
  // 1. Check if attachments array exists
  if (!Array.isArray(data.attachments) || data.attachments.length === 0) {
    return false;
  }

  // 2. Limit the number of files (Security check)
  if (data.attachments.length > MAX_ATTACHMENTS) {
    return false;
  }

  // 3. Check every single file in the array
  for (let file of data.attachments) {
    // Check if name and content exist
    if (!file.name || !file.content) return false;

    // Strict Header Check
    if (!file.content.startsWith("data:application/pdf;base64,")) return false;

    // Size Check
    const base64Data = file.content.split(',')[1];
    const fileSize = (base64Data.length * 3) / 4;
    if (fileSize > MAX_PDF_SIZE) return false;

    // Sanitize Filename (Remove dangerous characters)
    file.name = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  }

  return true;
}



module.exports = {
  validateTextMessage,
  validateImageMessage,
  validateVoiceMessage ,
  validatePdfMessage
};