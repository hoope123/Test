const fs = require('fs');
const path = require('path');

const DB_PATH = path.resolve(__dirname, 'messages.json');
const MAX_MESSAGES = 2000;
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

// Ensure DB file exists
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify([]));
}

/**
 * Internal function: safely load JSON DB
 */
function loadDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("❌ messages.json is corrupted. Resetting DB:", err.message);
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
    return [];
  }
}

/**
 * Save a message with timestamp, deduplication, and cleanup
 */
function saveMessage(message) {
  try {
    const id = message.key?.id;
    if (!id) return false;

    const db = loadDB();

    // Prevent duplicates
    if (db.some(msg => msg.key?.id === id)) {
      console.log(`⚠️ Message ${id} already exists. Skipping.`);
      return false;
    }

    // Add timestamp
    message.__savedAt = Date.now();
    db.push(message);

    // Cleanup old or too many
    const now = Date.now();
    const cleaned = db
      .filter(msg => now - (msg.__savedAt || 0) < MAX_AGE_MS)
      .slice(-MAX_MESSAGES);

    fs.writeFileSync(DB_PATH, JSON.stringify(cleaned, null, 2));
    console.log(`✅ Saved message ${id}`);
    return true;
  } catch (err) {
    console.error('❌ Error saving message:', err);
    return false;
  }
}

/**
 * Load a message by ID
 */
function loadMessage(id) {
  try {
    const db = loadDB();
    const msg = db.find(m => m.key?.id === id);
    if (!msg) {
      console.warn("⚠️ Message not found for ID:", id);
      return null;
    }
    return msg;
  } catch (err) {
    console.error('❌ Error loading message:', err);
    return null;
  }
}

module.exports = { saveMessage, loadMessage };
