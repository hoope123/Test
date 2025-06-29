// princemsgdel.js 
/*
const { isJidGroup, isJidBroadcast, getContentType, jidNormalizedUser } = require('@whiskeysockets/baileys');
const config = require('../set');
const { loadMessage } = require('./gmddatabase');
const { ANTI_DELETE, TIME_ZONE } = config;

const formatTime = (timestamp) => {
    const timeZone = TIME_ZONE || 'Africa/Douala'; 
    const date = new Date(timestamp);
    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, timeZone };
    return new Intl.DateTimeFormat('en-US', options).format(date);
};

const formatDate = (timestamp) => {
    const timeZone = TIME_ZONE || 'Africa/Douala';
    const date = new Date(timestamp);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone };
    return new Intl.DateTimeFormat('en-GB', options).format(date); 
};

async function GiftedAntidelete(updates, Gifted) {
    if (!ANTI_DELETE || ANTI_DELETE === "false") return;

    for (const update of updates) {
        const key = update?.key;
        const updateContent = update?.update;

        if (key && (updateContent?.deleteMessage || updateContent?.message === null)) {
            // Skip if the deleted message was from me
            if (key.fromMe) continue;
            
            // Check if this is a broadcast (status update)
            const isBroadcast = isJidBroadcast(key.remoteJid);
            
            // Handle different ANTI_DELETE modes
            if (ANTI_DELETE === "inboxonly") {
                // Inbox only mode - skip groups and broadcasts
                if (isJidGroup(key.remoteJid) || isBroadcast) continue;
            } else if (ANTI_DELETE === "allchats") {
                // Chats mode - skip broadcasts only
                if (isBroadcast) continue;
            } else if (ANTI_DELETE !== "true") {
                // If not one of the valid modes, skip entirely
                continue;
            }

            const store = await loadMessage(key.id);
            if (!store) continue;

            if (isJidGroup(key.remoteJid)) {
                const gcdata = await Gifted.groupMetadata(key.remoteJid);
                const groupName = gcdata.subject;
                const time = formatTime(Date.now());
                const date = formatDate(Date.now());
                const sender = store.key.participant || key.remoteJid;
                const deleter = key.participant || key.remoteJid;

                if (!isMediaMessage(store.message)) {
                    const textMessage =
                        store?.message?.conversation || store?.message?.extendedTextMessage?.text || '';
                    await Gifted.sendMessage(
                        Gifted.user.id,
                        {
                             text: `🚨 *ANTIDELETE MESSAGES!* 🚨\n\nGroup: ${groupName}\n*𝚂𝙴𝙽𝚃 𝙱𝚈:* @${
                                sender.split('@')[0]
                            }\n𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙱𝚈: @${
                                deleter.split('@')[0]
                            }\n*𝚃𝙸𝙼𝙴:* ${time}\n*𝙳𝙰𝚃𝙴:* ${date}\n\n*𝙼𝙴𝚂𝚂𝙰𝙶𝙴:* \n${textMessage}`,
                            mentions: [sender, deleter]
                        },
                        { quoted: store }
                    );
                } else {
                    const mediaMessage = store;
                    await Gifted.sendMessage(Gifted.user.id, { forward: mediaMessage }, { quoted: store });
                }
            } else {
                const sender = key.fromMe ? jidNormalizedUser(Gifted.user.id) : key.remoteJid;
                const time = formatTime(Date.now());
                const date = formatDate(Date.now());

                if (!isMediaMessage(store.message)) {
                    const textMessage =
                        store?.message?.conversation || store?.message?.extendedTextMessage?.text || '';
                    await Gifted.sendMessage(
                        Gifted.user.id,
                        {
                            text: `🚨 *ANTIDELETE MESSAGES!* 🚨\n\n*𝚂𝙴𝙽𝚃 𝙱𝚈:* @${
                                sender.split('@')[0]
                            }\n*𝚃𝙸𝙼𝙴:* ${time}\n*𝙳𝙰𝚃𝙴:* ${date}\n\n*𝙼𝙴𝚂𝚂𝙰𝙶𝙴:*\n${textMessage}`,
                            mentions: [sender]
                        },
                        { quoted: store }
                    );
                } else {
                    const mediaMessage = store;
                    await Gifted.sendMessage(Gifted.user.id, { forward: mediaMessage }, { quoted: store });
                }
            }
        }
    }
}

const isMediaMessage = message => {
    const typeOfMessage = getContentType(message);
    const mediaTypes = [
        'imageMessage',
        'videoMessage',
        'audioMessage',
        'documentMessage',
        'stickerMessage'
    ];
    return mediaTypes.includes(typeOfMessage);
};

module.exports = { GiftedAntidelete };
*/

const { isJidGroup, isJidBroadcast, getContentType, jidNormalizedUser } = require('@whiskeysockets/baileys');
const config = require('../set');
const { loadMessage } = require('./gmddatabase');
const { ANTI_DELETE, TIME_ZONE } = config;

/**
 * Normalize a JID for WhatsApp mentions.
 * Handles both @lid and @s.whatsapp.net.
 * @param {string} jid
 * @returns {string}
 */
function normalizeMentionJid(jid) {
    if (!jid) return '';
    if (jid.endsWith('@lid')) {
        // e.g. 254759108604@lid or 254759108604:7@lid
        return jid.replace(/(:\d+)?@lid$/, '@s.whatsapp.net');
    }
    return jid;
}

const formatTime = (timestamp) => {
    const timeZone = TIME_ZONE || 'Africa/Douala'; 
    const date = new Date(timestamp);
    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, timeZone };
    return new Intl.DateTimeFormat('en-US', options).format(date);
};

const formatDate = (timestamp) => {
    const timeZone = TIME_ZONE || 'Africa/Douala';
    const date = new Date(timestamp);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone };
    return new Intl.DateTimeFormat('en-GB', options).format(date); 
};

async function GiftedAntidelete(updates, Gifted) {
    if (!ANTI_DELETE || ANTI_DELETE === "false") return;

    for (const update of updates) {
        const key = update?.key;
        const updateContent = update?.update;

        if (key && (updateContent?.deleteMessage || updateContent?.message === null)) {
            // Skip if the deleted message was from me
            if (key.fromMe) continue;
            
            // Check if this is a broadcast (status update)
            const isBroadcast = isJidBroadcast(key.remoteJid);
            
            // Handle different ANTI_DELETE modes
            if (ANTI_DELETE === "inboxonly") {
                // Inbox only mode - skip groups and broadcasts
                if (isJidGroup(key.remoteJid) || isBroadcast) continue;
            } else if (ANTI_DELETE === "allchats") {
                // Chats mode - skip broadcasts only
                if (isBroadcast) continue;
            } else if (ANTI_DELETE !== "true") {
                // If not one of the valid modes, skip entirely
                continue;
            }

            const store = await loadMessage(key.id);
            if (!store) continue;

            if (isJidGroup(key.remoteJid)) {
                const gcdata = await Gifted.groupMetadata(key.remoteJid);
                const groupName = gcdata.subject;
                const time = formatTime(Date.now());
                const date = formatDate(Date.now());

                // Normalize both sender and deleter JIDs
                const senderRaw = store.key.participant || key.remoteJid;
                const deleterRaw = key.participant || key.remoteJid;
                const sender = normalizeMentionJid(senderRaw);
                const deleter = normalizeMentionJid(deleterRaw);

                if (!isMediaMessage(store.message)) {
                    const textMessage =
                        store?.message?.conversation || store?.message?.extendedTextMessage?.text || '';
                    await Gifted.sendMessage(
                        Gifted.user.id,
                        {
                             text: `🚨 *ANTIDELETE MESSAGES!* 🚨\n\nGroup: ${groupName}\n*𝚂𝙴𝙽𝚃 𝙱𝚈:* @${
                                sender.split('@')[0]
                            }\n𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙱𝚈: @${
                                deleter.split('@')[0]
                            }\n*𝚃𝙸𝙼𝙴:* ${time}\n*𝙳𝙰𝚃𝙴:* ${date}\n\n*𝙼𝙴𝚂𝚂𝙰𝙶𝙴:* \n${textMessage}`,
                            mentions: [sender, deleter]
                        },
                        { quoted: store }
                    );
                } else {
                    const mediaMessage = store;
                    await Gifted.sendMessage(Gifted.user.id, { forward: mediaMessage }, { quoted: store });
                }
            } else {
                // Private or non-group chat
                const senderRaw = key.fromMe ? jidNormalizedUser(Gifted.user.id) : key.remoteJid;
                const sender = normalizeMentionJid(senderRaw);
                const time = formatTime(Date.now());
                const date = formatDate(Date.now());

                if (!isMediaMessage(store.message)) {
                    const textMessage =
                        store?.message?.conversation || store?.message?.extendedTextMessage?.text || '';
                    await Gifted.sendMessage(
                        Gifted.user.id,
                        {
                            text: `🚨 *ANTIDELETE MESSAGES!* 🚨\n\n*𝚂𝙴𝙽𝚃 𝙱𝚈:* @${
                                sender.split('@')[0]
                            }\n*𝚃𝙸𝙼𝙴:* ${time}\n*𝙳𝙰𝚃𝙴:* ${date}\n\n*𝙼𝙴𝚂𝚂𝙰𝙶𝙴:*\n${textMessage}`,
                            mentions: [sender]
                        },
                        { quoted: store }
                    );
                } else {
                    const mediaMessage = store;
                    await Gifted.sendMessage(Gifted.user.id, { forward: mediaMessage }, { quoted: store });
                }
            }
        }
    }
}

const isMediaMessage = message => {
    const typeOfMessage = getContentType(message);
    const mediaTypes = [
        'imageMessage',
        'videoMessage',
        'audioMessage',
        'documentMessage',
        'stickerMessage'
    ];
    return mediaTypes.includes(typeOfMessage);
};

module.exports = { GiftedAntidelete };