const {
      default: GiftedConnect,
      useMultiFileAuthState,
      DisconnectReason,
      jidNormalizedUser,
      getContentType,
      proto,
      makeInMemoryStore,
      areJidsSameUser,
      generateWAMessageContent,
      generateWAMessage,
      AnyMessageContent,
      prepareWAMessageMedia,
      downloadContentFromMessage,
      MessageRetryMap,
      generateForwardMessageContent,
      generateWAMessageFromContent,
      generateMessageID,
      jidDecode,
      fetchLatestBaileysVersion,
      Browsers,
      isJidBroadcast,
    } = require("@whiskeysockets/baileys");

const express = require("express"), 
      app = express(), 
      port = process.env.PORT || 8000, 
      fs = require('fs'), 
      P = require('pino'),
      path = require('path'), 
      os = require('os'), 
      qrcode = require('qrcode-terminal'), 
      util = require('util'), 
      config = require('./set'),
      fromBuffer = require("buffer"),
      axios = require('axios'), 
      mime = require('mime-types'),
      { totalmem: totalMemoryBytes, 
      freemem: freeMemoryBytes } = os;

const {
      PREFIX: prefix,
      MODE: botMode,
      BOT_PIC: botPic,
      TIME_ZONE: tz,
      BOT_NAME: botName,
      OWNER_NAME: ownerName,
      OWNER_NUMBER: ownerNumber,
      SUDO_NUMBERS } = config;
    const sudoNumbers = SUDO_NUMBERS && SUDO_NUMBERS.trim() ? SUDO_NUMBERS : "No Sudos set";

const {
      GiftedAnticall,
      GroupUpdate,
      getBuffer,
      getGroupAdmins,
      GiftedAntidelete,
      getRandom,
      h2k,
      isUrl,
      Json,
      runtime,
      sleep,
      fetchJson,
      emojis,
      commands,
      doReact,
      giftedmd,
      eventlogger, 
      saveMessage,
      loadSession,
    getSudoNumbers,
      downloadMediaMessage
    } = require("./gift");


const giftedMdgc = 'KJQNQ1RkuImChXtXfnq84X';
const giftedChannelId = '120363322606369079@newsletter';



 const tempDir = path.join(os.tmpdir(), 'cache-temp')
  if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir)
  }
  const clearTempDir = () => {
      fs.readdir(tempDir, (err, files) => {
          if (err) throw err;
          for (const file of files) {
              fs.unlink(path.join(tempDir, file), err => {
                  if (err) throw err;
              });
          }
      });
  }


const byteToKB = 1 / 1024;
const byteToMB = byteToKB / 1024;
const byteToGB = byteToMB / 1024;

function formatBytes(bytes) {
  if (bytes >= Math.pow(1024, 3)) {
    return (bytes * byteToGB).toFixed(2) + ' GB';
  } else if (bytes >= Math.pow(1024, 2)) {
    return (bytes * byteToMB).toFixed(2) + ' MB';
  } else if (bytes >= 1024) {
    return (bytes * byteToKB).toFixed(2) + ' KB';
  } else {
    return bytes.toFixed(2) + ' bytes';
  }
}

async function ConnectGiftedToWA() {
  await loadSession();
  eventlogger()
console.log('⏱️ Conneting PRINCE MDX⏱️')
const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/session/')
var { version, isLatest } = await fetchLatestBaileysVersion()

const Gifted = GiftedConnect({
        logger: P({ level: 'silent' }),
        printQRInTerminal: !config.SESSION_ID,
        fireInitQueries: false,
        browser: Browsers.macOS("Safari"),
        downloadHistory: false,
        syncFullHistory: true,
        generateHighQualityLinkPreview: true,
        markOnlineOnConnect: false,
        keepAliveIntervalMs: 30_000,
        auth: state,
        version
        })
    
Gifted.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') {
if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
ConnectGiftedToWA()
}
} else if (connection === 'open') {
 fs.readdirSync("./mayel/").forEach((plugin) => {
if (path.extname(plugin).toLowerCase() == ".js") {
require("./mayel/" + plugin); 
}
});
console.log('Plugins Synced ✅');
const totalCommands = commands.filter((command) => command.pattern).length;
const startMess = {
        image: { url: botPic },
        caption: `
*${botName} 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃*

𝐏𝐫𝐞𝐟𝐢𝐱       : *[ ${prefix} ]*
𝐌𝐨𝐝𝐞        : *${botMode}*
𝐏𝐥𝐮𝐠𝐢𝐧𝐬       : *${totalCommands.toString()}*
𝐏𝐥𝐚𝐭𝐟𝐨𝐫𝐦     : *${os.platform()}*
𝐎𝐰𝐧𝐞𝐫       : *${ownerNumber}*
𝐒𝐞𝐫𝐯𝐞𝐫 𝐑𝐚𝐦: *${formatBytes(freeMemoryBytes)}/${formatBytes(totalMemoryBytes)}*
𝐒𝐮𝐝𝐨(𝐬)        : *${sudoNumbers}*
𝐓𝐮𝐭𝐨𝐫𝐢𝐚𝐥𝐬     : *youtube.com/@princetech11*
> ${global.footer}`,
        contextInfo: {
                  forwardingScore: 5,
                  isForwarded: true,
                  forwardedNewsletterMessageInfo: {
                  newsletterJid: '120363322606369079@newsletter',
                  newsletterName: "PRINCE TECH",
                  serverMessageId: 143
                }
              }
      };
      
Gifted.sendMessage(Gifted.user.id, startMess, { disappearingMessagesInChat: true, ephemeralExpiration: 100, })
 Gifted.groupAcceptInvite(giftedMdgc);
 Gifted.newsletterFollow(giftedChannelId);
console.log('PRINCE MDX IS ACTIVE ✅')
}
})
Gifted.ev.on('creds.update', saveCreds)   

        if (config.AUTO_REACT === "true") {
            Gifted.ev.on('messages.upsert', async (mek) => {
                mek = mek.messages[0];
                try {
                    if (!mek.key.fromMe && mek.message) {
                        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                        await doReact(randomEmoji, mek, Gifted);
                    }
                } catch (err) {
                    console.error('Error during auto reaction:', err);
                }
            });
        }

      Gifted.ev.on("messages.update", async (updates) => {
  try {
    await GiftedAntidelete(updates, Gifted);
  } catch (err) {
    console.error("❌ Error in antidelete handler:", err);
  }
});
      
Gifted.ev.on("call", async (json) => {
  await GiftedAnticall(json, Gifted);
});
    
    Gifted.ev.on('group-participants.update', async (update) => {
  try {
    if (config.WELCOME !== "true") return;

    const metadata = await Gifted.groupMetadata(update.id);
    const groupName = metadata.subject;
    const groupSize = metadata.participants.length;

    for (let user of update.participants) {
      const tagUser = '@' + user.split('@')[0];
      let pfp;

      try {
        pfp = await Gifted.profilePictureUrl(user, 'image');
      } catch (err) {
        pfp = "https://files.catbox.moe/ykdtkm.jpeg";
      }

      // WELCOME HANDLER
      if (update.action === 'add') {
        const welcomeMsg = `✨ *Welcome to the squad, ${tagUser}! 🎉* ✨

🔹 You've just joined *${groupName}* 🚀
👥 Our family is now *${groupSize} members strong* 💪

Please read the group description to avoid going against the rules.

Get ready for some fun and exciting moments ahead! 🌟

Let's make this group even more awesome together! 🙌✨`;

        await Gifted.sendMessage(update.id, {
          image: { url: pfp },
          caption: welcomeMsg,
          mentions: [user],
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            mentionedJid: [user],
            forwardedNewsletterMessageInfo: {
              newsletterName: "PRINCE TECH",
              newsletterJid: "120363322606369079@newsletter",
            },
          }
        });
      }

      // GOODBYE HANDLER
      if (update.action === 'remove') {
        const goodbyeMsg = `👋 *${tagUser} just left ${groupName}*

We’ll miss you 😢

👥 We are now *${groupSize} members strong*`;

        await Gifted.sendMessage(update.id, {
          image: { url: pfp },
          caption: goodbyeMsg,
          mentions: [user],
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            mentionedJid: [user],
            forwardedNewsletterMessageInfo: {
              newsletterName: "PRINCE TECH",
              newsletterJid: "120363322606369079@newsletter",
            },
          }
        });
      }
    }

  } catch (err) {
    console.error("❌ Error in welcome/goodbye message:", err);
  }
});

  Gifted.ev.on('messages.upsert', async (m) => {
   try {
       const msg = m.messages[0];
       if (!msg || !msg.message) return;

       const targetNewsletter = "120363322606369079@newsletter";

       if (msg.key.remoteJid === targetNewsletter && msg.newsletterServerId) {
           try {
               const emojiList = ["❤️", "👍","😮","✊","❤️‍🔥","⭐","☠️"]; // Your emoji list
               const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];

               const messageId = msg.newsletterServerId.toString();
               await Gifted.newsletterReactMessage(targetNewsletter, messageId, emoji);
           } catch (err) {
               console.error("❌ Failed to react to Home message:", err);
           }
       }
   } catch (err) {
       console.log(err);
   }
});  
    
Gifted.ev.on('messages.upsert', async(mek) => {
mek = mek.messages[0];
saveMessage(JSON.parse(JSON.stringify(mek, null, 2)))
const fromJid = mek.key.participant || mek.key.remoteJid;

if (!mek || !mek.message) return;

mek.message = (getContentType(mek.message) === 'ephemeralMessage') 
    ? mek.message.ephemeralMessage.message 
    : mek.message;
 
if (mek.key && isJidBroadcast(mek.key.remoteJid)) {
    try {
 
        if (config.AUTO_READ_STATUS === "true" && mek.key) {
            const giftedtech = jidNormalizedUser(Gifted.user.id);
            await Gifted.readMessages([mek.key, giftedtech]);
        }

        if (config.AUTO_LIKE_STATUS === "true") {
            const giftedtech = jidNormalizedUser(Gifted.user.id);
            const emojis = config.AUTO_LIKE_EMOJIS.split(','); 
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]; 
            if (mek.key.remoteJid && mek.key.participant) {
                await Gifted.sendMessage(
                    mek.key.remoteJid,
                    { react: { key: mek.key, text: randomEmoji } },
                    { statusJidList: [mek.key.participant, giftedtech] }
                );
            }
        }

       
          
        if (config.AUTO_REPLY_STATUS === "true") {
            const customMessage = config.STATUS_REPLY_MSG || '✅ Status Viewed by PRINCE MDX';
            if (mek.key.remoteJid) {
                await Gifted.sendMessage(
                    fromJid,
                    { text: customMessage },
                    { quoted: mek }
                );
            }
        } 
    } catch (error) {
        console.error("Error Processing Actions:", error);
    }
}
    
const m = giftedmd(Gifted, mek);
const type = getContentType(mek.message);
const content = JSON.stringify(mek.message);
const from = mek.key.remoteJid;
const quoted = 
  type == 'extendedTextMessage' && 
  mek.message.extendedTextMessage.contextInfo != null 
    ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] 
    : [];
const body = 
  (type === 'conversation') ? mek.message.conversation : 
  (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : 
  (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : 
  (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : '';
const isCmd = body.startsWith(prefix);
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
const args = body.trim().split(/ +/).slice(1);
const q = args.join(' ');
const isGroup = from.endsWith('@g.us');
const sender = mek.key.fromMe 
  ? (Gifted.user.id.split(':')[0] + '@s.whatsapp.net' || Gifted.user.id) 
  : (mek.key.participant || mek.key.remoteJid);
const senderNumber = sender.split('@')[0];
const botNumber = Gifted.user.id.split(':')[0];
const pushname = mek.pushName || 'Hello User';
const isMe = botNumber.includes(senderNumber);
 const sudoNumbersFromFile = getSudoNumbers();
const Devs = '237682698517,254762016957,237677224245'; 
const ownerNumber = config.OWNER_NUMBER;
const sudoNumbers = config.SUDO_NUMBERS ? config.SUDO_NUMBERS.split(',') : []; 
const devNumbers = Devs.split(',');
const allOwnerNumbers = [...new Set([...ownerNumber, ...sudoNumbersFromFile, ...sudoNumbers, ...devNumbers])];
const isOwner = allOwnerNumbers.includes(senderNumber) || isMe;
const botNumber2 = jidNormalizedUser(Gifted.user.id);
const groupMetadata = isGroup ? await Gifted.groupMetadata(from).catch(e => {}) : '';
const groupName = isGroup ? groupMetadata.subject : '';
const participants = isGroup ? await groupMetadata.participants : '';
const groupAdmins = isGroup ? getGroupAdmins(participants) : '';
const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
const isReact = m.message.reactionMessage ? true : false;
// --- ANTI-LINK HANDLER (Place this after isGroup, isAdmins, isBotAdmins are set) ---
if (isGroup && !isAdmins && isBotAdmins) {
    let cleanBody = body.replace(/[\s\u200b-\u200d\uFEFF]/g, '').toLowerCase();
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+([\/?][^\s]*)?/gi;
    if (urlRegex.test(cleanBody)) {
        if (!global.userWarnings) global.userWarnings = {};
        let userWarnings = global.userWarnings;
        if (config.ANTILINK === "true") {
            await Gifted.sendMessage(from, { delete: mek.key });
            await Gifted.sendMessage(from, {
                text: `⚠️ Links are not allowed in this group.\n@${sender.split('@')[0]} you are being removed.`,
                mentions: [sender]
            }, { quoted: mek });
            await Gifted.groupParticipantsUpdate(from, [sender], 'remove');
            return;
        } else if (config.ANTILINK === "warn") {
            if (!userWarnings[sender]) userWarnings[sender] = 0;
            userWarnings[sender] += 1;
            if (userWarnings[sender] <= 3) {
                await Gifted.sendMessage(from, { delete: mek.key });
                await Gifted.sendMessage(from, {
                    text: `⚠️ @${sender.split('@')[0]}, this is your ${userWarnings[sender]} warning. Please avoid sharing links so that you are not removed upon reaching your warn limit.`,
                    mentions: [sender]
                }, { quoted: mek });
            } else {
                await Gifted.sendMessage(from, { delete: mek.key });
                await Gifted.sendMessage(from, {
                    text: `🚨 @${sender.split('@')[0]} has been removed after exceeding the maximum number of warn limit.`,
                    mentions: [sender]
                }, { quoted: mek });
                await Gifted.groupParticipantsUpdate(from, [sender], 'remove');
                userWarnings[sender] = 0;
            }
            return;
        } else if (config.ANTILINK === "delete") {
            await Gifted.sendMessage(from, { delete: mek.key });
            await Gifted.sendMessage(from, {
                text: `⚠️ Links are not allowed in this group.\nPlease @${sender.split('@')[0]} take note.`,
                mentions: [sender]
            }, { quoted: mek });
            return;
        }
    }
}
// --- END ANTI-LINK HANDLER ---
/*const reply = (teks) => {
  Gifted.sendMessage(from, { text: teks }, { quoted: mek });
};
*/
const reply = async (teks) => {
  try {
    await Gifted.sendMessage(
      from,
      { text: teks },
      { quoted: mek }
    );
  } catch (err) {
    console.error("❌ Failed to send reply:", err);
    await Gifted.sendMessage(
      from,
      { text: "⚠️ An error occurred while sending the reply." }
    );
  }
};
      
Gifted.decodeJid = jid => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (
        (decode.user &&
          decode.server &&
          decode.user + '@' + decode.server) ||
        jid
      );
    } else return jid;
  };

Gifted.copyNForward = async(jid, message, forceForward = false, options = {}) => {
    let vtype
    if (options.readViewOnce) {
        message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
        vtype = Object.keys(message.message.viewOnceMessage.message)[0]
        delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
        delete message.message.viewOnceMessage.message[vtype].viewOnce
        message.message = {
            ...message.message.viewOnceMessage.message
        }
    }
  
    let mtype = Object.keys(message.message)[0]
    let content = generateForwardMessageContent(message, forceForward)
    let ctype = Object.keys(content)[0]
    let context = {}
    if (mtype != "conversation") context = message.message[mtype].contextInfo
    content[ctype].contextInfo = {
        ...context,
        ...content[ctype].contextInfo
    }
    const waMessage = generateWAMessageFromContent(jid, content, options ? {
      ...content[ctype],
      ...options,
      ...(options.contextInfo ? {
        contextInfo: {
          ...content[ctype].contextInfo,
          ...options.contextInfo
        }
      } : {})
    } : {})
    await Gifted.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })
    return waMessage
  }
  //=================================================
  Gifted.downloadAndSaveMediaMessage = async(message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message
    let mime = (message.msg || message).mimetype || ''
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
    const stream = await downloadContentFromMessage(quoted, messageType)
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }
    const { fileTypeFromBuffer } = await import('file-type');
    let type = await fileTypeFromBuffer(buffer);
    trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        // save to file
    fs.writeFileSync(trueFileName, buffer)
    return trueFileName
  }
  //=================================================
  Gifted.downloadMediaMessage = async(message) => {
    let mime = (message.msg || message).mimetype || ''
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
    const stream = await downloadContentFromMessage(message, messageType)
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }
  
    return buffer
  }


Gifted.sendFileUrl = async (jid, url, caption = '', options = {}) => {
    try {
        let buffer = await axios.get(url, { responseType: 'arraybuffer' }).then(res => res.data);

        let ext = path.extname(url).split('?')[0].toLowerCase();  
        let mimeType = mime.lookup(ext) || 'application/octet-stream';

        if (mimeType === 'application/octet-stream') {
            const { fileTypeFromBuffer } = await import('file-type');
            let detectedType = await fileTypeFromBuffer(buffer);
            if (detectedType) {
                mimeType = detectedType.mime;
                ext = detectedType.ext;
            }
        }

        let quoted = {};
        if (
            mek?.message?.extendedTextMessage?.contextInfo?.quotedMessage
        ) {
            quoted = mek.message.extendedTextMessage.contextInfo.quotedMessage;
        }
          
        if (mimeType.startsWith("image")) {
            return Gifted.sendMessage(jid, { image: buffer, caption, ...options }, quoted);
        }
        if (mimeType.startsWith("video")) {
            return Gifted.sendMessage(jid, { video: buffer, caption, mimetype: 'video/mp4', ...options }, quoted);
        }
        if (mimeType.startsWith("audio")) {
            return Gifted.sendMessage(jid, { audio: buffer, mimetype: 'audio/mpeg', ...options }, quoted);
        }
        if (mimeType === "application/pdf") {
            return Gifted.sendMessage(jid, { document: buffer, mimetype: 'application/pdf', caption, ...options }, quoted);
        }

        return Gifted.sendMessage(jid, { document: buffer, mimetype: mimeType, caption, filename: `file.${ext}`, ...options }, quoted);

    } catch (error) {
        console.error(`Error in sendFileUrl: ${error.message}`);
    }
};


Gifted.sendAlbumMessage = async function (jid, medias, options) {
  options = { ...options };

  const caption = options.text || options.caption || "";

  const album = generateWAMessageFromContent(jid, {
    albumMessage: {
      expectedImageCount: medias.filter(media => media.type === "image").length,
      expectedVideoCount: medias.filter(media => media.type === "video").length,
      ...(options.quoted ? {
        contextInfo: {
          remoteJid: options.quoted.key.remoteJid,
          fromMe: options.quoted.key.fromMe,
          stanzaId: options.quoted.key.id,
          participant: options.quoted.key.participant || options.quoted.key.remoteJid,
          quotedMessage: options.quoted.message
        }
      } : {})
    }
  }, { quoted: m });

  await Gifted.relayMessage(album.key.remoteJid, album.message, {
    messageId: album.key.id
  });

  for (const media of medias) {
    const { type, data } = media;
    const img = await generateWAMessage(album.key.remoteJid, {
      [type]: data,
      ...(media === medias[0] ? { caption } : {})
    }, {
      upload: Gifted.waUploadToServer
    });

    img.message.messageContextInfo = {
      messageAssociation: {
        associationType: 1,
        parentMessageKey: album.key
      }
    };

    await Gifted.relayMessage(img.key.remoteJid, img.message, {
      messageId: img.key.id
    });
  }

  return album;
};


Gifted.cMod = (jid, copy, text = '', sender = Gifted.user.id, options = {}) => {
    //let copy = message.toJSON()
    let mtype = Object.keys(copy.message)[0]
    let isEphemeral = mtype === 'ephemeralMessage'
    if (isEphemeral) {
        mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
    }
    let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
    let content = msg[mtype]
    if (typeof content === 'string') msg[mtype] = text || content
    else if (content.caption) content.caption = text || content.caption
    else if (content.text) content.text = text || content.text
    if (typeof content !== 'string') msg[mtype] = {
        ...content,
        ...options
    }
    if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
    else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
    if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
    else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
    copy.key.remoteJid = jid
    copy.key.fromMe = sender === Gifted.user.id
  
    return proto.WebMessageInfo.fromObject(copy)
  }
  
  //=====================================================
  Gifted.sendTextWithMentions = async(jid, text, quoted, options = {}) => Gifted.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })

  //=====================================================
  Gifted.sendImage = async(jid, path, caption = '', quoted = '', options) => {
    let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split `,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    return await Gifted.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
  }
  
  //=====================================================
  Gifted.sendText = (jid, text, quoted = '', options) => Gifted.sendMessage(jid, { text: text, ...options }, { quoted })
  
  //=====================================================
 Gifted.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
    let buttonMessage = {
            text,
            footer,
            buttons,
            headerType: 2,
            ...options
        }
        //========================================================================================================================================
    Gifted.sendMessage(jid, buttonMessage, { quoted, ...options })
  }
  //=====================================================
  Gifted.send5ButImg = async(jid, text = '', footer = '', img, but = [], thumb, options = {}) => {
    let message = await prepareWAMessageMedia({ image: img, jpegThumbnail: thumb }, { upload: Gifted.waUploadToServer })
    var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
        templateMessage: {
            hydratedTemplate: {
                imageMessage: message.imageMessage,
                "hydratedContentText": text,
                "hydratedFooterText": footer,
                "hydratedButtons": but
            }
        }
    }), options)
    Gifted.relayMessage(jid, template.message, { messageId: template.key.id })
  }
      
 
if (!isOwner) {
  if (config.MODE === "private") return;
  if (isGroup && config.MODE === "inbox") return;
  if (!isGroup && config.MODE === "groups") return;
}

/* if (devNumbers.includes(senderNumber)) {
  if (isReact && mek.key.fromMe === "true") {
    return;
  }
  m.react("💜");
} */

if (config.PRESENCE === "typing") await Gifted.sendPresenceUpdate("composing", from, [mek.key]);
            if (config.PRESENCE === "recording") await Gifted.sendPresenceUpdate("recording", from, [mek.key]);
            if (config.PRESENCE === "online") await Gifted.sendPresenceUpdate('available', from, [mek.key]);
            else await Gifted.sendPresenceUpdate('unavailable', from, [mek.key]);
            if (config.AUTO_READ_MESSAGES === "true") await Gifted.readMessages([mek.key]);
            if (config.AUTO_READ_MESSAGES === "commands" && isCmd) await Gifted.readMessages([mek.key]);
            if (config.AUTO_BLOCK) {
                const countryCodes = config.AUTO_BLOCK.split(',').map(code => code.trim());
                if (countryCodes.some(code => m.sender.startsWith(code))) {
                    await Gifted.updateBlockStatus(m.sender, 'block');
                }
            }
      
  
const events = require('./gift')
const EventEmitter = require('events');
EventEmitter.defaultMaxListeners = 10000; 

const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
if (isCmd) {
const gmd = events.commands.find((gmd) => gmd.pattern === (cmdName)) || events.commands.find((gmd) => gmd.alias && gmd.alias.includes(cmdName))
if (gmd) {
if (gmd.react) Gifted.sendMessage(from, { react: { text: gmd.react, key: mek.key }})

try {
gmd.function(Gifted, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply});
} catch (e) {
console.error("[PRINCE MDX PLUGIN ERROR]: " + e);
Gifted.sendMessage(from, { text: `[PRINCE MDXPLUGIN ERROR]:\n${e}`})
}
}
}
events.commands.map(async(command) => {
if (body && command.on === "body") {
command.function(Gifted, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (mek.q && command.on === "text") {
command.function(Gifted, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (
(command.on === "image" || command.on === "photo") &&
mek.type === "imageMessage"
) {
command.function(Gifted, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (
command.on === "sticker" &&
mek.type === "stickerMessage"
) {
command.function(Gifted, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
}});

})

}
setTimeout(() => {
ConnectGiftedToWA()
}, 4000);  

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'gift', 'prince.html'));
});

app.listen(port, () => console.log(`Prince Server Live on http://localhost:${port}`));
