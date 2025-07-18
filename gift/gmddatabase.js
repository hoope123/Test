const fs = require('fs');
const path = require('path');

const DB_PATH = path.resolve(__dirname, 'messages.json');

// Initialize the database file if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify([]));
}

/**
 * Save a message to the database.
 * @param {Object} message - The message object to save.
 * @returns {boolean} - True if saved successfully, false otherwise.
 */
function saveMessage(message) {
  try {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    const messageId = message.key?.id;

    // Prevent duplicate IDs
    if (data.some((msg) => msg.key?.id === messageId)) return false;

    data.push(message);
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('Error saving message:', err);
    return false;
  }
}

/**
 * Load a message by its ID.
 * @param {string} id - Unique message ID.
 * @returns {Object|null} - The message object or null if not found.
 */
function loadMessage(id) {
  try {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    return data.find((msg) => msg.key?.id === id) || null;
  } catch (err) {
    console.error('Error loading message:', err);
    return null;
  }
}

module.exports = { saveMessage, loadMessage };
