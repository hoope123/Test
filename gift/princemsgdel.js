const fs = require('fs-extra');
const path = require('path');
const { isJidGroup, isJidBroadcast, getContentType, jidNormalizedUser, downloadMediaMessage } = require('@whiskeysockets/baileys');
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

const isMediaMessage = (message) => {
    const type = getContentType(message);
    return ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage'].includes(type);
};

async function processMediaMessage(msg) {
    const type = getContentType(msg.message);
    const media = msg.message[type];
    const buffer = await downloadMediaMessage(msg, 'buffer');
    const extension = media?.mimetype?.split('/')[1] || 'bin';
    const filename = `antidelete_${Date.now()}.${extension}`;
    const filePath = path.join(__dirname, 'temp', filename);
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, buffer);

    return {
        path: filePath,
        type: type.replace('Message', ''),
        caption: media.caption || '',
        mimetype: media.mimetype,
        fileName: media.fileName || filename,
        ptt: media.ptt || false
    };
}

async function GiftedAntidelete(updates, Gifted) {
    if (!ANTI_DELETE || ANTI_DELETE === "false") return;

    for (const update of updates) {
        try {
            const key = update?.key;
            const updateContent = update?.update;

            if (!key || key.fromMe || (!updateContent?.deleteMessage && updateContent?.message !== null)) continue;

            const jid = key.remoteJid;
            const isBroadcast = isJidBroadcast(jid);
            const isGroup = isJidGroup(jid);

            if ((ANTI_DELETE === 'inboxonly' && (isGroup || isBroadcast)) ||
                (ANTI_DELETE === 'allchats' && isBroadcast) ||
                (ANTI_DELETE !== 'true' && ANTI_DELETE !== 'allchats' && ANTI_DELETE !== 'inboxonly')) {
                continue;
            }

            const store = await loadMessage(key.id);
            if (!store || !store.message) {
                console.warn("⚠️ Deleted message not found or missing content:", key.id);
                continue;
            }

            const time = formatTime(Date.now());
            const date = formatDate(Date.now());

            if (isGroup) {
                const gcdata = await Gifted.groupMetadata(jid);
                const groupName = gcdata.subject;
                const sender = store.key.participant || jid;
                const deleter = key.participant || jid;

                if (!isMediaMessage(store.message)) {
                    const textMessage = store.message?.conversation || store.message?.extendedTextMessage?.text || '';
                    await Gifted.sendMessage(Gifted.user.id, {
                        text: `🚨 *ANTIDELETE MESSAGES!* 🚨\n\nGroup: ${groupName}\n*𝚂𝙴𝙽𝚃 𝙱𝚈:* @${
                            sender.split('@')[0]
                        }\n𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙱𝚈: @${
                            deleter.split('@')[0]
                        }\n*𝚃𝙸𝙼𝙴:* ${time}\n*𝙳𝙰𝚃𝙴:* ${date}\n\n*𝙼𝙴𝚂𝚂𝙰𝙶𝙴:* \n${textMessage}`,
                        mentions: [sender, deleter]
                    }, { quoted: store });
                } else {
                    const media = await processMediaMessage(store);
                    await Gifted.sendMessage(Gifted.user.id, {
                        [media.type]: { url: media.path },
                        caption: media.caption || `🚨 *ANTIDELETE MESSAGES!* 🚨\n\nGroup: ${groupName}\n*𝚂𝙴𝙽𝚃 𝙱𝚈:* @${
                            sender.split('@')[0]
                        }\n𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙱𝚈: @${
                            deleter.split('@')[0]
                        }\n*𝚃𝙸𝙼𝙴:* ${time}\n*𝙳𝙰𝚃𝙴:* ${date}`,
                        mimetype: media.mimetype,
                        fileName: media.fileName,
                        ptt: media.ptt,
                        mentions: [sender, deleter]
                    });
                    setTimeout(() => fs.unlink(media.path).catch(() => {}), 30000);
                }

            } else {
                const sender = key.fromMe ? jidNormalizedUser(Gifted.user.id) : jid;

                if (!isMediaMessage(store.message)) {
                    const textMessage = store.message?.conversation || store.message?.extendedTextMessage?.text || '';
                    await Gifted.sendMessage(Gifted.user.id, {
                        text: `🚨 *ANTIDELETE MESSAGES!* 🚨\n\n*𝚂𝙴𝙽𝚃 𝙱𝚈:* @${
                            sender.split('@')[0]
                        }\n*𝚃𝙸𝙼𝙴:* ${time}\n*𝙳𝙰𝚃𝙴:* ${date}\n\n*𝙼𝙴𝚂𝚂𝙰𝙶𝙴:*\n${textMessage}`,
                        mentions: [sender]
                    }, { quoted: store });
                } else {
                    const media = await processMediaMessage(store);
                    await Gifted.sendMessage(Gifted.user.id, {
                        [media.type]: { url: media.path },
                        caption: media.caption || `🚨 *ANTIDELETE MESSAGES!* 🚨\n\n*𝚂𝙴𝙽𝚃 𝙱𝚈:* @${
                            sender.split('@')[0]
                        }\n*𝚃𝙸𝙼𝙴:* ${time}\n*𝙳𝙰𝚃𝙴:* ${date}`,
                        mimetype: media.mimetype,
                        fileName: media.fileName,
                        ptt: media.ptt,
                        mentions: [sender]
                    });
                    setTimeout(() => fs.unlink(media.path).catch(() => {}), 30000);
                }
            }
        } catch (err) {
            console.error("❌ Error in antidelete handler:", err.message);
        }
    }
}


module.exports = { GiftedAntidelete };
