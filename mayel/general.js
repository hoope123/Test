const { gmd, config, getBuffer, monospace, sleep, commands } = require('../gift'), 
      { BOT_PIC: botPic, 
       BOT_NAME: botName, 
       MODE: botMode, 
       VERSION: version,
       PREFIX: prefix, 
       TIME_ZONE: tz, 
       OWNER_NAME: displayName, 
       OWNER_NUMBER: waid } = config, 
      { totalmem: totalMemoryBytes, 
      freemem: freeMemoryBytes } = require('os'), 
      fs = require('fs'), 
      axios = require('axios'), 
      moment = require('moment-timezone'), 
      more = String.fromCharCode(8206), 
      readmore = more.repeat(4001);

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
const ram = `${formatBytes(freeMemoryBytes)}/${formatBytes(totalMemoryBytes)}`;


function smallCaps(text) {

  const smallCapsMap = {

    a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ',

    g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ',

    m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ',

    s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x',

    y: 'ʏ', z: 'ᴢ'

  };

  return text.toLowerCase().split('').map(c => smallCapsMap[c] || c).join('');

}



gmd({
    pattern: "menu",
    alias: ["help", "helpmenu"],
    desc: "Shows Bot Menu List",
    react: "🪀",
    category: "general",
    filename: __filename
},
async(Gifted, mek, m, { from, quoted, isCmd, command, args, q, isGroup, sender, pushname, reply }) => {
    try {
       let gift = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: `𝐏𝐑𝐈𝐍𝐂𝐄 𝐓𝐄𝐂𝐇`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:'GIFTED'\nitem1.TEL;waid=${
                        m.sender.split("@")[0]
                    }:${
                        m.sender.split("@")[0]
                    }\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            }
        };
        function formatUptime(seconds) {
            const days = Math.floor(seconds / (24 * 60 * 60));
            seconds %= 24 * 60 * 60;
            const hours = Math.floor(seconds / (60 * 60));
            seconds %= 60 * 60;
            const minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);
            return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }

        const now = new Date();
        const date = new Intl.DateTimeFormat('en-GB', {
            timeZone: tz,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(now);

        const time = new Intl.DateTimeFormat('en-GB', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }).format(now);

        const uptime = formatUptime(process.uptime());
        const totalCommands = commands.filter((command) => command.pattern).length;

        const categorized = commands.reduce((menu, gmd) => {
            if (gmd.pattern && !gmd.dontAddCommandList) {
                if (!menu[gmd.category]) menu[gmd.category] = [];
                menu[gmd.category].push(gmd.pattern);
            }
            return menu;
        }, {});
   
                let header = `
╭━━〔 *${monospace(botName)}* 〕━━╮
│ ✦ *Mᴏᴅᴇ* : ${monospace(botMode)}
│ ✦ *Pʀᴇғɪx* : [ ${monospace(prefix)} ]
│ ✦ *Usᴇʀ* : ${monospace(pushname)}
│ ✦ *Pʟᴜɢɪɴs* : ${monospace(totalCommands.toString())}
│ ✦ *Vᴇʀsɪᴏɴ* : ${monospace(version)}
│ ✦ *Uᴘᴛɪᴍᴇ* : ${monospace(uptime)}
│ ✦ *Tɪᴍᴇ Nᴏᴡ* : ${monospace(time)}
│ ✦ *Dᴀᴛᴇ Tᴏᴅᴀʏ* : ${monospace(date)}
│ ✦ *Tɪᴍᴇ Zᴏɴᴇ* : ${monospace(tz)}
│ ✦ *Sᴇʀᴠᴇʀ Rᴀᴍ* : ${monospace(ram)}
╰─────────────────╯${readmore}\n`;
        
        const formatCategory = (category, gmds) => {
    const title = `╭━━━✦❮ *${monospace(category.toUpperCase())}* ❯✦━⊷ \n`;
    const body = gmds.map(gmd => `┃✪  ${smallCaps(gmd)}`).join('\n');
    const footer = `╰━━━━━━━━━━━━━━━━━⊷\n`;
    return `${title}${body}\n${footer}`;
};

        let menu = header;
        for (const [category, gmds] of Object.entries(categorized)) {
            menu += formatCategory(category, gmds) + '\n';
        }
        
    const giftedMess = {
        image: { url: botPic },
        caption: menu.trim(),
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 5,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363322606369079@newsletter',
                        newsletterName: "PRINCE TECH",
            serverMessageId: 143
          }
        }
      };
      await Gifted.sendMessage(from, giftedMess, { quoted: mek });
      await m.react("✅");
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

gmd({
    pattern: "list",
    alias: ["listmenu"],
    desc: "Show All Commands and their Usage",
    react: "📜",
    category: "general",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, isCmd, command, args, q, isGroup, sender, pushname, reply }) => {
    try {
      let gift = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: `𝐏𝐑𝐈𝐍𝐂𝐄 𝐓𝐄𝐂𝐇`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:'GIFTED'\nitem1.TEL;waid=${
                        m.sender.split("@")[0]
                    }:${
                        m.sender.split("@")[0]
                    }\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            }
        };

        function formatUptime(seconds) {
            const days = Math.floor(seconds / (24 * 60 * 60));
            seconds %= 24 * 60 * 60;
            const hours = Math.floor(seconds / (60 * 60));
            seconds %= 60 * 60;
            const minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);
            return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }

        const now = new Date();
        const date = new Intl.DateTimeFormat('en-GB', {
            timeZone: tz,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(now);

        const time = new Intl.DateTimeFormat('en-GB', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }).format(now);

        const uptime = formatUptime(process.uptime());
        const totalCommands = commands.filter((command) => command.pattern).length;

        let list =  `
╭━━〔 *${monospace(botName)}* 〕━━╮
│ ✦ *Mᴏᴅᴇ* : ${monospace(botMode)}
│ ✦ *Pʀᴇғɪx* : [ ${monospace(prefix)} ]
│ ✦ *Usᴇʀ* : ${monospace(pushname)}
│ ✦ *Pʟᴜɢɪɴs* : ${monospace(totalCommands.toString())}
│ ✦ *Vᴇʀsɪᴏɴ* : ${monospace(version)}
│ ✦ *Uᴘᴛɪᴍᴇ* : ${monospace(uptime)}
│ ✦ *Tɪᴍᴇ Nᴏᴡ* : ${monospace(time)}
│ ✦ *Dᴀᴛᴇ Tᴏᴅᴀʏ* : ${monospace(date)}
│ ✦ *Tɪᴍᴇ Zᴏɴᴇ* : ${monospace(tz)}
│ ✦ *Sᴇʀᴠᴇʀ Rᴀᴍ* : ${monospace(ram)}
╰─────────────────╯${readmore}\n`;

        commands.forEach((gmd, index) => {
            if (gmd.pattern && gmd.desc) {
                list += `*${index + 1} ${monospace(gmd.pattern)}*\n  ${gmd.desc}\n`;
            }
        });

        const giftedMess = {
        image: { url: botPic },
        caption: list.trim(),
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 5,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363322606369079@newsletter',
                        newsletterName: "PRINCE TECH",
            serverMessageId: 143
          }
        }
      };
      await Gifted.sendMessage(from, giftedMess, { quoted: mek });
await m.react("✅");
    } catch (e) {
        console.error(e);
        reply(`${e}`);
    }
});


gmd({
    pattern: "menus",
    alias: ["allmenu", "listmenu"],
    desc: "Display Bot's Uptime, Date, Time, and Other Stats",
    react: "📜",
    category: "general",
    filename: __filename,
}, 
async (Gifted, mek, m, { from, quoted, sender, pushname, reply }) => {
    try {
      let gift = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: `𝐏𝐑𝐈𝐍𝐂𝐄 𝐓𝐄𝐂𝐇`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:'GIFTED'\nitem1.TEL;waid=${
                        m.sender.split("@")[0]
                    }:${
                        m.sender.split("@")[0]
                    }\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            }
        };
        
        function formatUptime(seconds) {
            const days = Math.floor(seconds / (24 * 60 * 60));
            seconds %= 24 * 60 * 60;
            const hours = Math.floor(seconds / (60 * 60));
            seconds %= 60 * 60;
            const minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);
            return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }

        const now = new Date();
        const date = new Intl.DateTimeFormat('en-GB', {
            timeZone: tz,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(now);

        const time = new Intl.DateTimeFormat('en-GB', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        }).format(now);

        const uptime = formatUptime(process.uptime());
        const memoryUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const memoryTotal = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2);

        let menus = `
*🦄 Uᴘᴛɪᴍᴇ :* ${monospace(uptime)}
*🍁 Dᴀᴛᴇ Tᴏᴅᴀʏ:* ${monospace(date)}
*🎗 Tɪᴍᴇ Nᴏᴡ:* ${monospace(time)}

➮Fᴏᴜɴᴅᴇʀ - Prince Tech
➮Usᴇʀ - ${monospace(pushname)}
➮Nᴜᴍ - ${monospace(waid)} 
➮Mᴇᴍᴏʀʏ - ${monospace(ram)}

*🧑‍💻 :* ${monospace(botName)} Iꜱ Aᴠᴀɪʟᴀʙʟᴇ

╭──❰ *ALL MENU* ❱
│🏮 Lɪꜱᴛ
│🏮 Cᴀᴛᴇɢᴏʀʏ
│🏮 Hᴇʟᴘ
│🏮 Aʟɪᴠᴇ
│🏮 Uᴘᴛɪᴍᴇ
│🏮 Wᴇᴀᴛʜᴇʀ
│🏮 Lɪɴᴋ
│🏮 Cᴘᴜ
│🏮 Rᴇᴘᴏꜱɪᴛᴏʀʏ
╰─────────────⦁`;

      const giftedMess = {
        image: { url: botPic },
        caption: menus.trim(),
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 5,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363322606369079@newsletter',
             newsletterName: "PRINCE TECH",
            serverMessageId: 143
          }
        }
      };
      await Gifted.sendMessage(from, giftedMess, { quoted: mek });
      await m.react("✅");
    } catch (e) {
        console.error(e);
        reply(`${e}`);
    }
});


gmd({
    pattern: "report",
    alias: ["request"],
    react: '💫',
    desc: "Request New Features.",
    category: "owner",
    use: '.request',
    filename: __filename
},
async(Gifted, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
const reportedMessages = {};
const devlopernumber = '237677224245';
try{
const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(sender);
  if (!isOwner) return reply("*Owner Only Command*");
  if (!q) return reply(`Example: ${prefix}request hi dev downloaders commands are not working`);
    const messageId = mek.key.id;
    if (reportedMessages[messageId]) {
        return reply("This report has already been forwarded to the owner. Please wait for a response.");
    }
    reportedMessages[messageId] = true;
    const textt = `*| REQUEST/REPORT |*`;
    const teks1 = `\n\n*User*: @${sender.split("@")[0]}\n*Request:* ${q}`;
    const teks2 = `\n\n*Hi ${pushname}, your request has been forwarded to my Owners.*\n*Please wait...*`;
    Gifted.sendMessage(devlopernumber + "@s.whatsapp.net", {
        text: textt + teks1,
        mentions: [m.sender],
    }, {
        quoted: mek,
    });
    reply("Tʜᴀɴᴋ ʏᴏᴜ ꜰᴏʀ ʏᴏᴜʀ ʀᴇᴘᴏʀᴛ. Iᴛ ʜᴀs ʙᴇᴇɴ ꜰᴏʀᴡᴀʀᴅᴇᴅ ᴛᴏ ᴛʜᴇ ᴏᴡɴᴇʀ. Pʟᴇᴀsᴇ ᴡᴀɪᴛ ꜰᴏʀ ᴀ ʀᴇsᴘᴏɴsᴇ.");
await m.react("✅"); 
} catch (e) {
reply(e)
console.log(e)
}
})


  gmd({
    pattern: "repo",
    alias: ["sc", "script", "botrepo"],
    desc: "Repo/Script of the Bot",
    category: "general",
    react: "🌟",
    filename: __filename
},

async(Gifted, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
const response = await axios.get(global.giftedApiRepo);
    const repoData = response.data;
    const { full_name, name, forks_count, stargazers_count, created_at, updated_at, owner } = repoData;
    const messageText = `Hey there👋,\nYou are chatting with *PRINCE MDX,* A powerful Whatsapp bot created by *Prince Tech,*\n Packed with smart features to elevate your WhatsApp experience like never before!\n\n*ʀᴇᴘᴏ ʟɪɴᴋ:* ${global.princeRepo}\n\n*❲❒❳ ɴᴀᴍᴇ:* ${name}\n*❲❒❳ sᴛᴀʀs:* ${stargazers_count}\n*❲❒❳ ғᴏʀᴋs:* ${forks_count}\n*❲❒❳ ᴄʀᴇᴀᴛᴇᴅ ᴏɴ:* ${new Date(created_at).toLocaleDateString()}\n*❲❒❳ ʟᴀsᴛ ᴜᴘᴅᴀᴛᴇᴅ:* ${new Date(updated_at).toLocaleDateString()}\n*❲❒❳ ᴏᴡɴᴇʀ:* 𝐏𝐫𝐢𝐧𝐜𝐞 𝐓𝐞𝐜𝐡 `;
    let gift = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: `𝐏𝐑𝐈𝐍𝐂𝐄 𝐓𝐄𝐂𝐇`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:'GIFTED'\nitem1.TEL;waid=${
                        m.sender.split("@")[0]
                    }:${
                        m.sender.split("@")[0]
                    }\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            }
        };
    const giftedMess = {
        image: { url: botPic },
        caption: messageText,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 5,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363322606369079@newsletter',
             newsletterName: "PRINCE TECH",
            serverMessageId: 143
          }
        }
      };
      await Gifted.sendMessage(from, giftedMess, { quoted: mek });
await m.react("✅");
}catch(e){
console.log(e)
reply(`${e}`)
}
})



gmd({
    pattern: "ping",
    alias: ["speed"],
    desc: "Check Bot's Response Speed.",
    category: "general",
    react: "⚡",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, isOwner, reply }) => {
    try {
        const startTime = Date.now() 
        const message = await Gifted.sendMessage(from, 
            { text: '*Checking Speed...*' }, 
            { quoted: mek });
        const endTime = Date.now()
        const ping = (endTime - startTime);
        const text = `*Pong: ${ping} ms*`;
        await Gifted.sendMessage(from, {
            text: text,
            edit: message.key }, 
            { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});


gmd({
    pattern: "ping2",
    alias: ["speed"],
    desc: "Check Bot's Response Speed.",
    category: "general",
    react: "⚡",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, isOwner, reply }) => {
    try {
        const startTime = Date.now() 
        const message = await Gifted.sendMessage(from, 
            { text: '*Checking Speed...*' }, 
            { quoted: mek });
        const endTime = Date.now()
        const ping = (endTime - startTime);
        await Gifted.sendMessage(from, {
          delete: message.key }, 
          { quoted: mek });
        // const text = `*Pong: ${ping} ms*`;
        // await Gifted.sendMessage(from, { text: text, edit: message.key },
       // { quoted: mek });
        await Gifted.sendMessage(from, {
          text: `*Pᴏɴɢ: ${ping} ᴍs*`,
          contextInfo: {
              mentionedJid: [m.sender], 
              groupMentions: [],
              forwardingScore: 1,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                  newsletterJid: '120363322606369079@newsletter',
                        newsletterName: "PRINCE TECH",
                  serverMessageId: 143
              }
          }
      }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});


gmd({
  pattern: "owner",
  desc: "Shows Owner the Bot",
  category: "owner",
  react: "👑",
  filename: __filename
},
async(Gifted, mek, m,{from, quoted, isOwner, reply}) => {
try{
if (!isOwner) return reply("*Owner Only Command*");
const vcard = 'BEGIN:VCARD\n'
          + 'VERSION:3.0\n' 
          + `FN:${config.OWNER_NAME}\n` 
          + 'ORG:GIFTED-TECH;\n' 
          + `TEL;type=CELL;type=VOICE;waid=${config.OWNER_NUMBER}:${config.OWNER_NUMBER}\n`
          + 'END:VCARD';
  await Gifted.sendMessage(
  from,
  { 
      contacts: { 
          displayName, 
          contacts: [{ vcard }] 
      }
  }, { quoted: mek }
);
await m.react("✅");
}catch(e){
console.log(e)
reply(`${e}`)
}
})


gmd({
    pattern: "test",
    desc: "Check Bot's Status",
    category: "general",
    react: "👓",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const audioUrls = [
        'https://files.catbox.moe/nfnb5k.mp3',
        'https://files.catbox.moe/u8mlc9.mp4',
        'https://files.catbox.moe/c0p5t8.mp3',
        'https://files.catbox.moe/s41x34.mp3',
        'https://files.catbox.moe/rys34d.mp3'
      ];
      const randomAudioUrl = audioUrls[Math.floor(Math.random() * audioUrls.length)];
        let gift = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: `𝐏𝐑𝐈𝐍𝐂𝐄 𝐓𝐄𝐂𝐇`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:'GIFTED'\nitem1.TEL;waid=${
                        m.sender.split("@")[0]
                    }:${
                        m.sender.split("@")[0]
                    }\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            }
        };
        const buffer = await getBuffer(randomAudioUrl);
        const giftedMess = {
        audio: buffer,
        mimetype: 'audio/mpeg',
        ptt: true,
        waveform: [1000, 0, 1000, 0, 1000, 0, 1000],
        contextInfo: {
        mentionedJid: [m.sender], 
          forwardingScore: 0,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
           newsletterJid: '120363322606369079@newsletter',
           newsletterName: "PRINCE TECH",
           serverMessageId: 143
           }, 
          externalAdReply: {
            title: "𝐏𝐑𝐈𝐍𝐂𝐄 𝐌𝐃𝐗 𝐈𝐒 𝐀𝐂𝐓𝐈𝐕𝐄",
            body: `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ `,
            thumbnailUrl: botPic,
            sourceUrl: `https://whatsapp.com/channel/0029Vb3hlgX5kg7nFggl0Y`,
            mediaType: 5,
            renderLargerThumbnail: false
          }
        }
      };
      await Gifted.sendMessage(from, giftedMess, { quoted: mek });
      await m.react("✅"); 
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})

gmd({
    pattern: "alive",
    desc: "Check Bot's Status.",
    category: "general",
    react: "⏱️",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (24 * 3600));
  const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);
    try {
        let gift = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: `𝐏𝐑𝐈𝐍𝐂𝐄 𝐓𝐄𝐂𝐇`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:'GIFTED'\nitem1.TEL;waid=${
                        m.sender.split("@")[0]
                    }:${
                        m.sender.split("@")[0]
                    }\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            }
        };
    const giftedMess = {
      image: { url: botPic },
      caption: `
*PRINCE MDX IS RUNNING!!*
*BOT UPTIME INFO:* ${readmore}
*╭═════════════════⊷*
*┃❍ ${days} Day(s)*
*┃❍ ${hours} Hour(s)*
*┃❍ ${minutes} Minute(s)*
*┃❍ ${seconds} Second(s)*
*╰═════════════════⊷*
      `,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363322606369079@newsletter',
          newsletterName: "PRINCE TECH",
          serverMessageId: 143
        }
      }
    };
    await Gifted.sendMessage(from, giftedMess, { quoted: mek }); 
    await m.react("✅"); 
} catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})

gmd({
    pattern: "runtime",
    alias: ["uptime"],
    desc: "Check Bot's Server Runtime.",
    category: "general",
    react: "⏱️",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (24 * 3600));
  const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);
    try {
    let gift = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: `𝐏𝐑𝐈𝐍𝐂𝐄 𝐓𝐄𝐂𝐇`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:'GIFTED'\nitem1.TEL;waid=${
                        m.sender.split("@")[0]
                    }:${
                        m.sender.split("@")[0]
                    }\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            }
        };
    const giftedMess = {
      text: `*Bot Has Been Up For: _${days}d ${hours}h ${minutes}m ${seconds}s_*`,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363322606369079@newsletter',
          newsletterName: "PRINCE TECH",
          serverMessageId: 143
        }
      }
    };
    await Gifted.sendMessage(from, giftedMess, { quoted: mek}); 
    await m.react("✅"); 
} catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})
 
gmd({
    pattern: "uptime2",
    alias: ["runtime2"],
    desc: "Check Bot's Server Runtime.",
    category: "general",
    react: "⚡",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const uptimeSeconds = process.uptime();
        const days = Math.floor(uptimeSeconds / (24 * 3600));
        const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeSeconds % 60);
        const message = await Gifted.sendMessage(from, 
            { text: '*Connecting Server...*' }, 
            { quoted: mek });
        const text =  `*Bot Has Been Up For: _${days}d ${hours}h ${minutes}m ${seconds}s_*`;
        await Gifted.sendMessage(from, {
            text: text,
            edit: message.key }, 
            { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
     
