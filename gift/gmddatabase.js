//gmddatabase.js
/*
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
 *//*
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
 *//*
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
*/



const fs = require('fs');
const path = require('path');

const DB_PATH = path.resolve(__dirname, 'messages.json');

// Initialize the database file if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify([]));
}

/**
 * Normalize a JID to @s.whatsapp.net for mentions and matching.
 * Handles @lid and :xx@lid.
 * @param {string} jid
 * @returns {string}
 */
function normalizeJid(jid) {
  if (!jid) return '';
  if (jid.endsWith('@lid')) {
    // e.g. 254759108604@lid or 254759108604:7@lid
    return jid.replace(/(:\d+)?@lid$/, '@s.whatsapp.net');
  }
  return jid;
}

/**
 * Checks if the message object is a real user message (not just key distribution/system).
 * @param {Object} message
 * @returns {boolean}
 */
function isRealUserMessage(message) {
  if (!message.message) return false;
  const keys = Object.keys(message.message);
  // Exclude if only senderKeyDistributionMessage or system stubs
  if (
    keys.length === 1 &&
    (message.message.senderKeyDistributionMessage ||
      message.message.protocolMessage ||
      message.message.messageContextInfo)
  ) {
    return false;
  }
  // Optionally, you can whitelist allowed real message types:
  const allowedTypes = [
    'conversation',
    'extendedTextMessage',
    'imageMessage',
    'videoMessage',
    'audioMessage',
    'documentMessage',
    'stickerMessage'
  ];
  return keys.some((k) => allowedTypes.includes(k));
}

/**
 * Save a message to the database (only if it's a real user message).
 * @param {Object} message - The message object to save.
 * @returns {boolean} - True if saved successfully, false otherwise.
 */
function saveMessage(message) {
  try {
    if (!isRealUserMessage(message)) return false;

    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    const messageId = message.key?.id;

    // Prevent duplicate IDs
    if (data.some((msg) => msg.key?.id === messageId)) return false;

    // Optionally, add a normalized participant field for easier mention handling later
    if (message.key && message.key.participant) {
      message.key.normalized_participant = normalizeJid(message.key.participant);
    }

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

module.exports = { saveMessage, loadMessage, normalizeJid };