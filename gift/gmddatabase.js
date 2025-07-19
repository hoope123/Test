const fs = require('fs');
const path = require('path');

const DB_PATH = path.resolve(__dirname, 'messages.json');

// Initialize the database file if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify([]));
  console.log('🆕 messages.json file created.');
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

    if (!messageId) {
      console.warn('⚠️ Message does not have a key.id:', message);
      return false;
    }

    // Prevent duplicate IDs
    if (data.some((msg) => msg.key?.id === messageId)) {
      console.log(`⚠️ Message ${messageId} already exists in messages.json. Skipping save.`);
      return false;
    }

    data.push(message);
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    console.log(`✅ Message ${messageId} saved successfully.`);
    return true;
  } catch (err) {
    console.error('❌ Error saving message to messages.json:', err.message);
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

    if (!id) {
      console.warn("⚠️ loadMessage called with undefined/null ID.");
      return null;
    }

    const msg = data.find((msg) => msg.key?.id === id);

    if (!msg) {
      console.warn(`⚠️ No message found for ID: ${id}`);
      return null;
    }

    console.log(`🔍 Message loaded for ID: ${id}`);
    return msg;
  } catch (err) {
    console.error(`❌ Error loading message from messages.json for ID ${id}:`, err.message);
    return null;
  }
}

module.exports = { saveMessage, loadMessage };
