const { gmd, config, commands, fetchJson, getBuffer, GiftedApkDl } = require('../gift'), 
      { PREFIX: prefix } = config, 
      axios = require('axios'),
      fs = require('fs'),
      ffmpeg = require('fluent-ffmpeg'),
      GIFTED_DLS = require('gifted-dls'), 
      gifted = new GIFTED_DLS();
      yts = require('yt-search');


/*
async function formatVideo(buffer) {
  return new Promise((resolve, reject) => {
    const tempInput = `temp_${Date.now()}.input`;
    const tempOutput = `temp_${Date.now()}.mp4`;

    fs.writeFileSync(tempInput, buffer);

    ffmpeg()
      .input(tempInput)
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions([
        '-preset fast',
        '-movflags faststart',
        '-pix_fmt yuv420p'
      ])
      .size('640x?')
      .toFormat('mp4')
      .on('error', (err) => {
        fs.unlinkSync(tempInput);
        if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
        reject(err);
      })
      .on('end', () => {
        const outputBuffer = fs.readFileSync(tempOutput);
        fs.unlinkSync(tempInput);
        fs.unlinkSync(tempOutput);
        resolve(outputBuffer);
      })
      .save(tempOutput);
  });
}
gmd({
  pattern: "video2",
  alias: ["ytmp4", "videodl", "videodoc", "ytmp4doc", "ytmp4dl"],
  desc: "Download Youtube Videos(mp4)",
  category: "downloader",
  react: "📽",
  filename: __filename
},
async (Gifted, mek, m, { from, q, reply }) => {
  try {
    if (!q) {
      return reply(`Please enter a search query or YouTube link. Usage example:\n*${prefix}video Spectre*`);
    }

    let downloadUrl;
    let buffer;
    let dataa;

    const apiList = ["ytv", "ytmp4", "mp4", "ytvideo"];
    const search = await fetchJson(`https://yts.giftedtech.web.id/?q=${encodeURIComponent(q)}`);
    if (!search || !Array.isArray(search.videos) || search.videos.length === 0) {
      return reply("❌ No results found.");
    }

    dataa = search.videos[0];
    const videoUrl = dataa.url;

    for (let endpoint of apiList) {
      try {
        const res = await fetchJson(`https://api.princetechn.com/api/download/${endpoint}?apikey=${global.myName}&url=${encodeURIComponent(videoUrl)}`);
        if (res?.result?.download_url) {
          downloadUrl = res.result.download_url;
          break;
        }
      } catch (err) {
        console.log(`[❌ ${endpoint} API failed]`, err.message);
      }
    }

    if (!downloadUrl) return reply("❌ Failed to get video download URL.");

    const rawBuffer = await getBuffer(downloadUrl);
    buffer = await formatVideo(rawBuffer);

    const infoMess = {
      image: { url: dataa.thumbnail },
      caption: `> *${config.BOT_NAME} 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*  
╭───────────────◆  
│⿻ *Title:* ${dataa.title}
│⿻ *Quality:* mp4
│⿻ *Duration:* ${dataa.timestamp}
│⿻ *Viewers:* ${dataa.views}
│⿻ *Uploaded:* ${dataa.ago}
│⿻ *Artist:* ${dataa.author.name}
╰────────────────◆  
⦿ *Direct Yt Link:* ${videoUrl}

Reply With:
*1* To Download Video 🎥
*2* To Download Video Document 📄

╭────────────────◆  
│ ${global.footer}
╰─────────────────◆`,
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

    const messageSent = await Gifted.sendMessage(from, infoMess, { quoted: mek });
    const messageId = messageSent.key.id;

    Gifted.ev.on("messages.upsert", async (event) => {
      const msg = event.messages[0];
      if (!msg?.message) return;

      const content = msg.message.conversation || msg.message.extendedTextMessage?.text;
      const isReply = msg.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;
      if (!isReply) return;

      await m.react("⬇️");

      switch (content.trim()) {
        case "1":
          await Gifted.sendMessage(from, {
            video: buffer,
            mimetype: "video/mp4"
          }, { quoted: msg });
          await m.react("✅");
          break;

        case "2":
          await Gifted.sendMessage(from, {
            document: buffer,
            mimetype: "video/mp4",
            fileName: `${dataa.title}.mp4`
          }, { quoted: msg });
          await m.react("✅");
          break;

        default:
          await Gifted.sendMessage(from, { text: "Invalid option. Reply with 1 or 2." });
      }
    });

  } catch (err) {
    console.error("❌ Error in video command:", err);
    reply("An error occurred. Please try again.");
  }
});

*/

gmd({
  pattern: "video2",
  alias: ["ytmp42", "videodl2", "videodoc2", "ytmp4doc2", "ytmp4dl2"],
  desc: "Download Youtube Videos(mp4)",
  category: "downloader",
  react: "📽",
  filename: __filename
},
async (Gifted, mek, m, { from, q, isOwner, reply }) => {
  try {
    if (!q) return reply(`Please provide a YouTube video URL!\n\nExample:\n${prefix}video https://youtu.be/abc123`);

    if (!q.startsWith("https://youtu")) return reply("❌ Please provide a valid YouTube link.");

    const downloadData = await fetchJson(`${global.api}/download/ytmp4?apikey=${global.myName}&url=${encodeURIComponent(q)}`);
    if (!downloadData || !downloadData.result || !downloadData.result.download_url) {
      return reply("❌ Failed to fetch the video. Try a different link.");
    }

    const buffer = await getBuffer(downloadData.result.download_url);
    const infoMess = {
      image: { url: downloadData.result.thumbnail },
      caption: `> *${config.BOT_NAME} 𝐘𝐎𝐔𝐓𝐔𝐁𝐄 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*  
╭───────────────◆  
│🎬 *Title:* ${downloadData.result.title}
│📦 *Quality:* ${downloadData.result.quality || "mp4"}
│⏳ *Duration:* ${downloadData.result.duration || "Unknown"}
╰────────────────◆  
> ${global.footer}`,
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

    await Gifted.sendMessage(from, infoMess, { disappearingMessagesInChat: true, ephemeralExpiration: 100 }, { quoted: mek });

    await Gifted.sendMessage(from, {
      video: buffer,
      fileName: `${downloadData.result.title}.mp4`,
      mimetype: 'video/mp4',
      contextInfo: {
        externalAdReply: {
          title: downloadData.result.title,
          body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ',
          thumbnailUrl: downloadData.result.thumbnail,
          sourceUrl: 'https://whatsapp.com/channel/0029Vakd0RY35fLr1MUiwO3O',
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: mek });

    await m.react("✅");

  } catch (e) {
    console.error("Error occurred in video command:", e);
    reply("❌ An error occurred while processing the video. Try again later.");
  }
});
            

gmd({
    pattern: "gitclone",
    desc: "Clone/Download GitHub Repositories",
    category: "downloader",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) {
            return reply(`Please provide a GitHub repository URL, e.g.,\n${prefix}gitclone https://github.com/Mayelprince/PRINCE-MD`);
        }

        const gitlink = q.trim();
        if (!gitlink.includes('github.com')) {
            return reply(`Is that a valid GitHub repo link?!`);
        }

        // Improved regex to extract username and repository name
        let regex1 = /(?:https:\/\/|git@)github\.com[\/:]([^\/:]+)\/([^\/:\.]+)(?:\.git)?/i;
        let match = gitlink.match(regex1);

        if (!match) {
            return reply(`The provided URL does not appear to be a valid GitHub repository link.`);
        }

        let [, user3, repo] = match;

        // Construct the API URL for the zipball
        let url = `https://api.github.com/repos/${user3}/${repo}/zipball`;

        // Fetch the filename from the response headers
        let response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) {
            return reply(`Failed to fetch repository details. Make sure the URL is correct and the repository is public.`);
        }

        let contentDisposition = response.headers.get('content-disposition');
        let filename = contentDisposition 
            ? contentDisposition.match(/attachment; filename=(.*)/)[1]
            : `${repo}.zip`;

        // Send the zip file
        await Gifted.sendMessage(from, {
            document: { url: url },
            mimetype: "application/zip",
            fileName: filename
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply(`An error occurred: ${e.message}`);
    }
});

 
gmd({
  pattern: "spotify",
  alias: ["spotifydl"],
  react: "🎶", 
  desc: "Download Songs from Spotify.",
  category: "downloader",
  filename: __filename
},
async (Gifted, mek, m, { from, q, isOwner, reply }) => {
  try {
    if (!q) return reply(`Please provide a search term or a spotify audio URL!\nusage: ${prefix}spotify <search_term> or ${prefix}spotify <audio_url>`);
    if (q.startsWith("https://open.spotify.com")) {
      const downloadData = await gifted.spotifydl(q);
      if (!downloadData || !downloadData.success) {
        return reply("❌ Failed to fetch the download link. Please try again later.");
      }
      const buffer = await getBuffer(`${downloadData.download_url}`);
      const infoMess = {
            image: { url: downloadData.thumbnail },
            caption: `> *${config.BOT_NAME} 𝐒𝐏𝐎𝐓𝐈𝐅𝐘 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*  
╭───────────────◆  
│⏱️ *Duration:* ${downloadData.duration}
│🔑 *Quality:* 128kbps
│🎶 *Title:* ${downloadData.title}
╰────────────────◆  
> ${global.footer}`,
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
       await Gifted.sendMessage(from, infoMess, { disappearingMessagesInChat: true, ephemeralExpiration: 100 }, { quoted: mek });
       await Gifted.sendMessage(from, {
            document: buffer,
            fileName: `${downloadData.title}.mp3`,
            mimetype: 'audio/mpeg',
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: false,
                    title: downloadData.title,
                    body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ',
                    thumbnailUrl: downloadData.thumbnail,
                    sourceUrl: 'https://whatsapp.com/channel/0029Vakd0RY35fLr1MUiwO3O',
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });
      await m.react("✅");
    } else {
      const searchData = await gifted.spotifysearch(q);
if (!searchData || searchData.length === 0) {
  return reply("❌ No results found for the given search term.");
}
const audioUrl = searchData[0].url; 
if (!audioUrl) {
  return reply("❌ No valid video link found.");
}
      const downloadData = await gifted.spotifydl(audioUrl);
      if (!downloadData || !downloadData.success) {
        return reply("❌ Failed to fetch the download link. Please try again later.");
      }
       const buffer = await getBuffer(`${downloadData.download_url}`);
       const infoMess = {
            image: { url: downloadData.thumbnail },
            caption: `> *${config.BOT_NAME} 𝐒𝐏𝐎𝐓𝐈𝐅𝐘 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*  
╭───────────────◆  
│⏱️ *Duration:* ${downloadData.duration}
│🔑 *Quality:* 128kbps
│🎶 *Title:* ${downloadData.title}
╰────────────────◆  
> ${global.footer}`,
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
       await Gifted.sendMessage(from, infoMess, { disappearingMessagesInChat: true, ephemeralExpiration: 100 }, { quoted: mek });
       await Gifted.sendMessage(from, {
            document: buffer,
            fileName: `${downloadData.title}.mp3`,
            mimetype: 'audio/mpeg',
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: false,
                    title: downloadData.title,
                    body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ',
                    thumbnailUrl: downloadData.thumbnail,
                    sourceUrl: 'https://whatsapp.com/channel/0029Vakd0RY35fLr1MUiwO3O',
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });
      await m.react("✅");
    }
  } catch (e) {
    console.error("Error occurred:", e);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});


gmd({
  pattern: "xvideos",
  alias: ["xvideosdl", "xvideo", "xvideodl"],
  react: "🍑", 
  desc: "Download Videos from XVideos.",
  category: "downloader",
  filename: __filename
},
async (Gifted, mek, m, { from, q, isOwner, reply }) => {
  try {
    if (!isOwner) return reply("Owner Only Command!");
    if (!q) return reply(`Please provide a search term or a direct video URL!\nusage: ${prefix}xvideo <search_term> or ${prefix}xvideo <video_url>`);
    if (q.startsWith("https://www.xvideos")) {
      const downloadData = await fetchJson(`${global.api}/download/xvideosdl?apikey=${global.myName}&url=${encodeURIComponent(q)}`);
      if (!downloadData || !downloadData.success) {
        return reply("❌ Failed to fetch the download link. Please try again later.");
      }
      const buffer = await getBuffer(`${downloadData.result.download_url}`);
      const infoMess = {
            image: { url: downloadData.result.thumbnail },
            caption: `> *${config.BOT_NAME} 𝐗𝐕𝐈𝐃𝐄𝐎𝐒 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*  
╭───────────────◆  
│🎬 *Title:* ${downloadData.result.title}
│👁️‍🗨️ *Views:* ${downloadData.result.views}
│👍 *Likes:* ${downloadData.result.likes}
│👎 *Dislikes:* ${downloadData.result.dislikes}
│🔑 *Size:* ${downloadData.result.sizeReadable}
╰────────────────◆  
> ${global.footer}`,
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
       await Gifted.sendMessage(from, infoMess, { disappearingMessagesInChat: true, ephemeralExpiration: 100 }, { quoted: mek });
       await Gifted.sendMessage(from, {
            video: buffer,
            fileName: `${downloadData.result.title}.mp4`,
            mimetype: 'video/mp4',
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: false,
                    title: downloadData.result.title,
                    body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ',
                    thumbnailUrl: downloadData.result.thumbnail,
                    sourceUrl: 'https://whatsapp.com/channel/0029Vakd0RY35fLr1MUiwO3O',
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });
      await m.react("✅");
    } else {
      const searchData = await fetchJson(`${global.api}/search/xvideossearch?apikey=${global.myName}&query=${encodeURIComponent(q)}`);
      if (!searchData || !searchData.success || !searchData.results || searchData.results.length === 0) {
        return reply("❌ No results found for the given search term.");
      }
      const videoUrl = searchData.results[0].url;
      const downloadData = await fetchJson(`${global.api}/download/xvideosdl?apikey=${global.myName}&url=${encodeURIComponent(videoUrl)}`);
      if (!downloadData || !downloadData.success) {
        return reply("❌ Failed to fetch the download link. Please try again later.");
      }
      const buffer = await getBuffer(`${downloadData.result.download_url}`);
       const infoMess = {
            image: { url: downloadData.result.thumbnail },
            caption: `> *${config.BOT_NAME} 𝐗𝐕𝐈𝐃𝐄𝐎𝐒 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*  
╭───────────────◆  
│🎬 *Title:* ${downloadData.result.title}
│👁️‍🗨️ *Views:* ${downloadData.result.views}
│👍 *Likes:* ${downloadData.result.likes}
│👎 *Dislikes:* ${downloadData.result.dislikes}
│🔑 *Size:* ${downloadData.result.sizeReadable}
╰────────────────◆  
> ${global.footer}`,
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
       await Gifted.sendMessage(from, infoMess, { disappearingMessagesInChat: true, ephemeralExpiration: 100 }, { quoted: mek });
       await Gifted.sendMessage(from, {
            video: buffer,
            fileName: `${downloadData.result.title}.mp4`,
            mimetype: 'video/mp4',
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: false,
                    title: downloadData.result.title,
                    body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ',
                    thumbnailUrl: downloadData.result.thumbnail,
                    sourceUrl: 'https://whatsapp.com/channel/0029Vakd0RY35fLr1MUiwO3O',
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });
      await m.react("✅");
    }
  } catch (e) {
    console.error("Error occurred:", e);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});

gmd({
  pattern: "xnxx",
  alias: ["xnxxdl"],
  react: "🍑", 
  desc: "Download Videos from Xnxx.",
  category: "downloader",
  filename: __filename
},
async (Gifted, mek, m, { from, q, isOwner, reply }) => {
  try {
    if (!isOwner) return reply("Owner Only Command!");
    if (!q) return reply(`Please provide a search term or a direct video URL!\nusage: ${prefix}xnxx <search_term> or ${prefix}xnxx <video_url>`);
    if (q.startsWith("https://www.xnxx")) {
      const downloadData = await fetchJson(`${global.api}/download/xnxxdl?apikey=${global.myName}&url=${encodeURIComponent(q)}`);
      if (!downloadData || !downloadData.success) {
        return reply("❌ Failed to fetch the download link. Please try again later.");
      }
      const buffer = await getBuffer(`${downloadData.result.files.high}`);
      const infoMess = {
            image: { url: downloadData.result.image },
            caption: `> *${config.BOT_NAME} 𝐗𝐍𝐗𝐗 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*  
╭───────────────◆  
│🎬 *Title:* ${downloadData.result.title}
│🔑 *Duration:* ${downloadData.result.duration} Seconds
╰────────────────◆  
> ${global.footer}`,
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
       await Gifted.sendMessage(from, infoMess, { disappearingMessagesInChat: true, ephemeralExpiration: 100 }, { quoted: mek });
       await Gifted.sendMessage(from, {
            video: buffer,
            fileName: `${downloadData.result.title}.mp4`,
            mimetype: 'video/mp4',
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: false,
                    title: downloadData.result.title,
                    body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ',
                    thumbnailUrl: downloadData.result.image,
                    sourceUrl: 'https://whatsapp.com/channel/0029Vakd0RY35fLr1MUiwO3O',
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });
      await m.react("✅");
    } else {
      const searchData = await fetchJson(`${global.api}/search/xnxxsearch?apikey=${global.myName}&query=${encodeURIComponent(q)}`);
      if (!searchData || !searchData.success || !searchData.results || searchData.results.length === 0) {
        return reply("❌ No results found for the given search term.");
      }
      const videoUrl = searchData.results[0].link;
       if (!videoUrl) {
      return reply("❌ No valid video link found.");
      }
      const downloadData = await fetchJson(`${global.api}/download/xnxxdl?apikey=${global.myName}&url=${encodeURIComponent(videoUrl)}`);
      if (!downloadData || !downloadData.success) {
        return reply("❌ Failed to fetch the download link. Please try again later.");
      }
       const buffer = await getBuffer(`${downloadData.result.files.high}`);
       const infoMess = {
            image: { url: downloadData.result.image },
            caption: `> *${config.BOT_NAME} 𝐗𝐍𝐗𝐗 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*  
╭───────────────◆  
│🎬 *Title:* ${downloadData.result.title}
│🔑 *Duration:* ${downloadData.result.duration} Seconds
╰────────────────◆  
> ${global.footer}`,
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
       await Gifted.sendMessage(from, infoMess, { disappearingMessagesInChat: true, ephemeralExpiration: 100 }, { quoted: mek });
       await Gifted.sendMessage(from, {
            video: buffer,
            fileName: `${downloadData.result.title}.mp4`,
            mimetype: 'video/mp4',
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: false,
                    title: downloadData.result.title,
                    body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ',
                    thumbnailUrl: downloadData.result.image,
                    sourceUrl: 'https://whatsapp.com/channel/0029Vakd0RY35fLr1MUiwO3O',
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });
      await m.react("✅");
    }
  } catch (e) {
    console.error("Error occurred:", e);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});

gmd({
  pattern: "apk",
  alias: ["app", "apkdl"],
  desc: "Download Android Apps",
  use: ".apk <app_name>",
  react: "📥",
  category: "downloader",
  filename: __filename
}, async (Gifted, mek, m, { from, quoted, body, q, reply }) => {
  const appName = q.trim();

  if (!appName) {
    return reply("Please provide an app name for the link ❗");
  }
  reply(`_Downloading ${appName}_`);
  try {
    const appData = await GiftedApkDl(appName);
    const apkBuffer = await getBuffer(appData.link);

    if (!apkBuffer || !appData.appname) {
     await m.react("❌"); 
    }
    await Gifted.sendMessage(from, {
      document: apkBuffer,
      caption: `Quoted is Your App\n> ${global.footer}`,
      mimetype: "application/vnd.android.package-archive",
      fileName: `${appData.appname}.apk`
    }, { quoted: mek });
    await m.react("✅"); 
  } catch (error) {
    console.log(error);
    await m.react("❌"); 
    reply("Error: " + error.message);
  }
});


gmd({
    pattern: "fb",
    alias: ["facebook", "fbdl"],
    desc: "download Facebook Videos",
    category: "downloader",
    react: "⬇️",
    filename: __filename
},
async(Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q || !q.startsWith("https://")) {
        return reply("Please provide a valid Faceboot URL.");
        }
        let data = await gifted.facebook(q);
        const sdUrl = data.result.sd_video
        const hdUrl = data.result.hd_video
        const sdbuffer = await getBuffer(sdUrl);
        const hdbuffer = await getBuffer(hdUrl);
        const infoMess = {
          image: { url: data.result.thumbnail || config.BOT_PIC },
            caption: `> *${config.BOT_NAME} 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*  
Duration: ${data.result.duration}

Reply With:

*1* To Download Sd Video 
*2* To Download Hd Video 

╭────────────────◆  
│ ${global.footer}
╰─────────────────◆`,
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

        const messageSent = await Gifted.sendMessage(from, infoMess, { quoted: mek });
        const messageId = messageSent.key.id;
        Gifted.ev.on("messages.upsert", async (event) => {
            const messageData = event.messages[0];
            if (!messageData.message) return;
            const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
            const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

            if (isReplyToDownloadPrompt) {
                await m.react("⬇️");
                switch (messageContent) {
                    case "1": 
                        await Gifted.sendMessage(from, {
                            video: sdbuffer,
                            mimetype: "video/mp4"
                        }, { quoted: messageData });
                        break;

                    case "2": 
                        await Gifted.sendMessage(from, {
                            video: hdbuffer,
                            mimetype: "video/mp4"
                        }, { quoted: messageData });
                        break;

                    default:
                  await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1 or 2)." });
                }
            }
        }); 
      await m.react("✅");
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})


gmd({
    pattern: "tiktok",
    alias: ["tt", "tiktokdl", "ttdl"],
    desc: "Download TikTok Videos and Audios",
    category: "downloader",
    react: "⬇️",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q || !q.startsWith("https://")) {
            return reply("Please provide a valid TikTok URL.");
        }
        const tikTokData = await gifted.tiktok(q);
        let hdVideoUrl = tikTokData.result.hd_video;
        let sdVideoUrl = tikTokData.result.sd_video;
        let audioUrl = tikTokData.result.audio;
        const audioBuffer = await getBuffer(audioUrl);
        const hdVideoBuffer = await getBuffer(hdVideoUrl);
        const sdVideoBuffer = await getBuffer(sdVideoUrl);
        const infoMess = {
            image: { url: tikTokData.result.thumbnail || config.BOT_PIC },
            caption: `> *${config.BOT_NAME} 𝐓𝐈𝐊𝐓𝐎𝐊 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*  

Duration: ${tikTokData.result.duration}

Reply With:

*1* To Download Audio 🎶
*2* To Download Sd Video 🎥
*3* To Download Hd Video 🎥

╭────────────────◆  
│ ${global.footer}
╰─────────────────◆`,
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

        const messageSent = await Gifted.sendMessage(from, infoMess, { quoted: mek });
        const messageId = messageSent.key.id;
        Gifted.ev.on("messages.upsert", async (event) => {
            const messageData = event.messages[0];
            if (!messageData.message) return;
            const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
            const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

            if (isReplyToDownloadPrompt) {
                await m.react("⬇️");
                switch (messageContent) {
                    case "1": 
                        await Gifted.sendMessage(from, {
                            audio: audioBuffer,
                            mimetype: "audio/mpeg"
                        }, { quoted: messageData });
                        break;

                        case "2": 
                        await Gifted.sendMessage(from, {
                            video: sdVideoBuffer,
                            mimetype: "video/mp4"
                        }, { quoted: messageData });
                        break;

                        case "3": 
                        await Gifted.sendMessage(from, {
                            video: hdVideoBuffer,
                            mimetype: "video/mp4"
                        }, { quoted: messageData });
                        break;

                    default:
                  await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1, 2 or 3)." });
                }
            }
        }); 
    } catch (e) {
        console.error("Error downloading TikTok video and audio:", e);
        reply("An error occurred while processing your request. Please try again.");
    }
});


gmd({
    pattern: "twitter",
    alias: ["twdl", "x", "xdl", "twitterdl"],
    desc: "Download Twitter Videos",
    category: "downloader",
    react: "⬇️",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q || !q.startsWith("https://")) {
            return reply("Please provide a valid Twitter URL.");
        }
        const data = await gifted.twitter(q);
        const audioUrl = data.result.audio; 
        const sdVideoUrl = data.result.sd_video;
        const hdVideoUrl = data.result.hd_video;
        const audioBuffer = await getBuffer(audioUrl);
        const sdVideoBuffer = await getBuffer(sdVideoUrl);
        const hdVideoBuffer = await getBuffer(hdVideoUrl);
        const infoMess = {
          image: { url: tikTokData.result.thumbnail || config.BOT_PIC },
          caption: `> *${config.BOT_NAME} 𝐓𝐖𝐈𝐓𝐓𝐄𝐑(𝐗) 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*  

Reply With:

*1* To Download Audio 🎶
*2* To Download Sd Video 🎥
*3* To Download Hd Video 🎥

╭────────────────◆  
│ ${global.footer}
╰─────────────────◆`,
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

      const messageSent = await Gifted.sendMessage(from, infoMess, { quoted: mek });
      const messageId = messageSent.key.id;
      Gifted.ev.on("messages.upsert", async (event) => {
          const messageData = event.messages[0];
          if (!messageData.message) return;
          const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
          const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

          if (isReplyToDownloadPrompt) {
              await m.react("⬇️");
              switch (messageContent) {
                  case "1": 
                      await Gifted.sendMessage(from, {
                          audio: audioBuffer,
                          mimetype: "audio/mpeg"
                      }, { quoted: messageData });
                      break;

                      case "2": 
                      await Gifted.sendMessage(from, {
                          video: sdVideoBuffer,
                          mimetype: "video/mp4"
                      }, { quoted: messageData });
                      break;

                      case "3": 
                      await Gifted.sendMessage(from, {
                          video: hdVideoBuffer,
                          mimetype: "video/mp4"
                      }, { quoted: messageData });
                      break;

                  default:
                await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1, 2 or 3)." });
              }
          }
      });
    } catch (e) {
        console.error("Error in Twitter download command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});


gmd({
    pattern: "gdrive",
    alias: ["googledrive", "gdrivedl"],
    desc: "download Gdrive Files",
    category: "downloader",
    react: "⬇️",
    filename: __filename
},
async(Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q && !q.startsWith("https://")) return reply("Provide me gdrive url")
        let data = await gifted.googledrive(q);
        const buffer = await getBuffer(`${data.result.download_url}`);
const { fileTypeFromBuffer } = await import('file-type');

// Default MIME type and extension (fallback if detection fails)
let mimeType = 'application/octet-stream'; // Fallback MIME type
let ext = 'bin'; // Fallback extension

try {
    const detectedType = await fileTypeFromBuffer(buffer);
    if (detectedType) {
        mimeType = detectedType.mime;
        ext = detectedType.ext;
    }
} catch (error) {
    console.error('Failed to detect file type:', error);
}
const fileName = data.result.name.includes('.') 
    ? data.result.name 
    : `${data.result.name}.${ext}`;

await Gifted.sendMessage(
    from, 
    { 
        document: buffer, 
        fileName: fileName, 
        mimetype: mimeType, 
        caption: `> ${global.footer}` 
    }, 
    { quoted: mek }
);
        await m.react("✅"); 
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})


gmd({
    pattern: "insta",
    alias: ["igdl", "ig", "instadl", "instagram"],
    desc: "Download Instagram Videos",
    category: "downloader",
    react: "⬇️",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q || !q.startsWith("https://")) {
            return reply("🔗 *Please provide a valid Instagram URL.*");
        }

        // Call your custom API
        const apiUrl = `${global.api}/download/instadl?apikey=${global.myName}&url=${encodeURIComponent(q)}`;
        const res = await fetchJson(apiUrl);

        if (!res.result?.download_url) {
            return reply("⚠️ Failed to fetch Instagram media. Please check the link or try again.");
        }

        const videoBuffer = await getBuffer(res.result.download_url);

        await Gifted.sendMessage(from, {
            video: videoBuffer,
            mimetype: "video/mp4",
            caption: `> *${config.BOT_NAME}  𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*`,
        }, { quoted: mek });

        await m.react("✅");

    } catch (e) {
        console.error("❌ Instagram Download Error:", e);
        reply("⚠️ An error occurred while processing your request. Try again later.");
    }
});


gmd({
    pattern: "mediafire",
    alias: ["mfire", "mediafiredl", "mfiredl"],
    desc: "Download Mediafire Files",
    category: "downloader",
    react: "⬇️",
    filename: __filename
},
async (Gifted, mek, m, {
    from, q, reply
}) => {
    try {
        if (!q || !q.startsWith("https://")) {
            return reply("📎 Please provide a valid Mediafire URL.");
        }

        const apiUrl = `${global.api}/download/mediafire?apikey=${global.myName}&url=${encodeURIComponent(q)}`;
        const res = await fetchJson(apiUrl);

        if (!res.result || !res.result.downloadUrl) {
            return reply("⚠️ Failed to retrieve download link. Please check the URL.");
        }

        const fileBuffer = await getBuffer(res.result.downloadUrl);

        await Gifted.sendMessage(from, {
            document: fileBuffer,
            mimetype: res.result.mimeType || 'application/octet-stream',
            fileName: res.result.fileName || 'downloaded_file',
            caption: `📁 *${res.result.fileName}*\n\n📦 Size: ${res.result.fileSize}\n🗓️ Uploaded: ${res.result.uploadedOn}\n🌍 From: ${res.result.uploadedFrom}\n\n> ${global.footer || "PrinceTech"}`
        }, { quoted: mek });

        await m.react("✅");

    } catch (e) {
        console.error("❌ Mediafire Download Error:", e);
        reply("⚠️ Error downloading file. Please try again later.");
    }
});


gmd({
  pattern: "play",
  alias: ["music", "ytmp3", "ytmp3doc", "song", "audiodoc", "audio"],
  desc: "Download Youtube Songs(mp3)",
  category: "downloader",
  react: "🎶",
  filename: __filename
}, 
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  try {
      if (!q) {
          return reply(`Please enter a search query or YouTube link. Usage example:
*${prefix}play Spectre*
*${prefix}play https://youtu.be/aGjXa18XCRY?si=-rNZHD-trThO1x4Y*`);
      }

      let downloadUrl;
      let buffer;
      let dataa;

      if (q.startsWith("https://youtu")) {
          try {
                const down = await fetchJson(`${global.api}/download/yta?apikey=${global.myName}&url=${encodeURIComponent(q)}`);
                downloadUrl = down.result.download_url;
                const searchs = await fetchJson(`${global.api}/search/yts?apikey=${global.myName}&query=${encodeURIComponent(q)}`);
                dataa = searchs.results[0];
            } catch (err) {
                console.error("First download path failed:", err);
                try {
                const down = await fetchJson(`${global.api}/download/ytmp3?apikey=${global.myName}&url=${encodeURIComponent(q)}`);
                downloadUrl = down.result.download_url;
                const searchs = await fetchJson(`${global.api}/search/yts?apikey=${global.myName}&query=${encodeURIComponent(q)}`);
                dataa = searchs.results[0];
                } catch (fallbackErr) {
                    console.error("All Download Paths failedL:", fallbackErr);
                    return reply("❌ Unable to fetch download URL. Please try again later.");
                }
            }
          buffer = await getBuffer(downloadUrl);
           const infoMess = {
          image: { url: dataa.thumbnail },
          caption: `> *${config.BOT_NAME} 𝐒𝐎𝐍𝐆 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*  
╭───────────────◆  
│⿻ *Title:* ${dataa.title}
│⿻ *Quality:* mp3 (128kbps)
│⿻ *Duration:* ${dataa.timestamp}
│⿻ *Viewers:* ${dataa.views}
│⿻ *Uploaded:* ${dataa.ago}
│⿻ *Artist:* ${dataa.author.name}
╰────────────────◆  
⦿ *Direct Yt Link:* ${dataa.url}

Reply With:
*1* To Download Audio 🎶 
*2* To Download Audio Document 📄

╭────────────────◆  
│ ${global.footer}
╰─────────────────◆`,
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

      const messageSent = await Gifted.sendMessage(from, infoMess, { quoted: mek });
      const messageId = messageSent.key.id;
      Gifted.ev.on("messages.upsert", async (event) => {
          const messageData = event.messages[0];
          if (!messageData.message) return;
          const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
          const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

          if (isReplyToDownloadPrompt) {
              await m.react("⬇️");
              switch (messageContent) {
                  case "1": 
                      await Gifted.sendMessage(from, {
                          audio: buffer,
                          mimetype: "audio/mpeg",
                          contextInfo: {
                              externalAdReply: {
                                  title: dataa.title,
                                  body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ',
                                  mediaType: 1,
                                  sourceUrl: 'https://whatsapp.com/channel/0029Vakd0RY35fLr1MUiwO3O',
                                  thumbnailUrl: dataa.thumbnail,
                              }
                          }
                      }, { quoted: messageData });
                      await m.react("✅");
                      break;

                  case "2": 
                      await Gifted.sendMessage(from, {
                          document: buffer,
                          mimetype: "audio/mpeg",
                          fileName: `${dataa.title}.mp3`,
                          contextInfo: {
                              externalAdReply: {
                                  title: dataa.title,
                                  body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ',
                                  mediaType: 1,
                                  sourceUrl: 'https://whatsapp.com/channel/0029Vakd0RY35fLr1MUiwO3O',
                                  thumbnailUrl: dataa.thumbnail,
                              }
                          }
                      }, { quoted: messageData });
                      await m.react("✅");
                      break;

                  default:
                await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1 or 2)." });
              }
          }
      });
          return;
      }

      const search = await yts(q);
      const datas = search.videos[0];
      const videoUrl = datas.url;

      try {
            const down = await fetchJson(`${global.api}/download/yta?apikey=${global.myName}&url=${encodeURIComponent(videoUrl)}`);
            downloadUrl = down.result.download_url;
        } catch (err) {
            console.error("First download path failed for search query:", err);
            try {
                const down = await fetchJson(`${global.api}/download/ytmp3?apikey=${global.myName}&url=${encodeURIComponent(videoUrl)}`);
                downloadUrl = down.result.download_url;
            } catch (err) {
                console.error("Second download path failed for search query:", err);
                try {
                    const down = await fetchJson(`${global.api}/download/ytmusic?apikey=${global.myName}&url=${encodeURIComponent(videoUrl)}`);
                    downloadUrl = down.result.download_url;
                } catch (fallbackErr) {
                    console.error("All download paths failed for search query:", fallbackErr);
                    return reply("❌ Unable to fetch download URL. Please try again later.");
                }
            }
        }

      buffer = await getBuffer(downloadUrl);
      const infoMess = {
          image: { url: datas.thumbnail },
          caption: `> *${config.BOT_NAME} 𝐒𝐎𝐍𝐆 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*  
╭───────────────◆  
│⿻ *Title:* ${datas.title}
│⿻ *Quality:* mp3 (128kbps)
│⿻ *Duration:* ${datas.timestamp}
│⿻ *Viewers:* ${datas.views}
│⿻ *Uploaded:* ${datas.ago}
│⿻ *Artist:* ${datas.author.name}
╰────────────────◆  
⦿ *Direct Yt Link:* ${videoUrl}

Reply With:
*1* To Download Audio 🎶 
*2* To Download Audio Document 📄

╭────────────────◆  
│ ${global.footer}
╰─────────────────◆`,
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

      const messageSent = await Gifted.sendMessage(from, infoMess, { quoted: mek });
      const messageId = messageSent.key.id;
      Gifted.ev.on("messages.upsert", async (event) => {
          const messageData = event.messages[0];
          if (!messageData.message) return;
          const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
          const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

          if (isReplyToDownloadPrompt) {
              await m.react("⬇️");
              switch (messageContent) {
                  case "1": 
                      await Gifted.sendMessage(from, {
                          audio: buffer,
                          mimetype: "audio/mpeg",
                          contextInfo: {
                              externalAdReply: {
                                  title: datas.title,
                                  body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ',
                                  mediaType: 1,
                                  sourceUrl: 'https://whatsapp.com/channel/0029Vakd0RY35fLr1MUiwO3O',
                                  thumbnailUrl: datas.thumbnail,
                              }
                          }
                      }, { quoted: messageData });
                      await m.react("✅");
                      break;

                  case "2": 
                      await Gifted.sendMessage(from, {
                          document: buffer,
                          mimetype: "audio/mpeg",
                          fileName: `${datas.title}.mp3`,
                          contextInfo: {
                              externalAdReply: {
                                  title: datas.title,
                                  body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ',
                                  mediaType: 1,
                                  sourceUrl: 'https://whatsapp.com/channel/0029Vakd0RY35fLr1MUiwO3O',
                                  thumbnailUrl: datas.thumbnail,
                              }
                          }
                      }, { quoted: messageData });
                      await m.react("✅");
                      break;

                  default:
                await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1 or 2)." });
              }
          }
      });
  } catch (err) {
      console.error("Error:", err);
      reply(`❌ Error: ${err.message}`);
  }
});


gmd({
    pattern: "video",
    alias: ["ytmp4", "videodl", "videodoc", "ytmp4doc", "ytmp4dl"],
    desc: "Download Youtube Videos(mp4)",
    category: "downloader",
    react: "📽",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) {
            return reply(`Please enter a search query or YouTube link. Usage example:
*${prefix}video Spectre*
*${prefix}video https://youtu.be/aGjXa18XCRY?si=-rNZHD-trThO1x4Y*`);
        }

        let downloadUrl;
        let buffer;
        let dataa;

        if (q.startsWith("https://youtu")) {
            try {
                const down = await fetchJson(`${global.api}/download/ytv?apikey=${global.myName}&url=${encodeURIComponent(q)}`);
                downloadUrl = down.result.download_url;
                const searchs = await fetchJson(`${global.api}/search/yts?apikey=${global.myName}&query=${encodeURIComponent(q)}`);
                dataa = searchs.results[0];
            } catch (err) {
                console.error("First download path failed:", err);
                try {
                const down = await fetchJson(`${global.api}/download/ytmp4?apikey=${global.myName}&url=${encodeURIComponent(q)}`);
                downloadUrl = down.result.download_url;
                const searchs = await fetchJson(`${global.api}/search/yts?apikey=${global.myName}&query=${encodeURIComponent(q)}`);
                dataa = searchs.results[0];
                } catch (fallbackErr) {
                    console.error("All Download Paths failedL:", fallbackErr);
                    return reply("❌ Unable to fetch download URL. Please try again later.");
                }
            }
            buffer = await getBuffer(downloadUrl);
             const infoMess = {
            image: { url: dataa.thumbnail },
            caption: `> *${config.BOT_NAME} 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*  
╭───────────────◆  
│⿻ *Title:* ${dataa.title}
│⿻ *Quality:* mp4 (720p)
│⿻ *Duration:* ${dataa.timestamp}
│⿻ *Viewers:* ${dataa.views}
│⿻ *Uploaded:* ${dataa.ago}
│⿻ *Artist:* ${dataa.author.name}
╰────────────────◆  
⦿ *Direct Yt Link:* ${dataa.url}

Reply With:
*1* To Download Video 🎥 
*2* To Download Video Document 📄

╭────────────────◆  
│ ${global.footer}
╰─────────────────◆`,
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

        const messageSent = await Gifted.sendMessage(from, infoMess, { quoted: mek });
        const messageId = messageSent.key.id;
        Gifted.ev.on("messages.upsert", async (event) => {
            const messageData = event.messages[0];
            if (!messageData.message) return;
            const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
            const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

            if (isReplyToDownloadPrompt) {
                await m.react("⬇️");
                switch (messageContent) {
                    case "1": 
                        await Gifted.sendMessage(from, {
                            video: buffer,
                            mimetype: "video/mp4",
                            contextInfo: {
                                externalAdReply: {
                                    title: dataa.title,
                                    body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ',
                                    mediaType: 1,
                                    sourceUrl: 'https://whatsapp.com/channel/0029Vakd0RY35fLr1MUiwO3O',
                                    thumbnailUrl: dataa.thumbnail,
                                }
                            }
                        }, { quoted: messageData });
                        await m.react("✅");
                        break;

                    case "2": 
                        await Gifted.sendMessage(from, {
                            document: buffer,
                            mimetype: "video/mp4",
                            fileName: `${dataa.title}.mp4`,
                            contextInfo: {
                                externalAdReply: {
                                    title: dataa.title,
                                    body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ',
                                    mediaType: 1,
                                    sourceUrl: 'https://whatsapp.com/channel/0029Vakd0RY35fLr1MUiwO3O',
                                    thumbnailUrl: dataa.thumbnail,
                                }
                            }
                        }, { quoted: messageData });
                        await m.react("✅");
                        break;
                            
                    default:
                  await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1 or 2)." });
                }
            }
        });
            return;
        }

        const search = await yts(q);
        const datas = search.videos[0];
        const videoUrl = datas.url;

        try {
            const down = await fetchJson(`${global.api}/download/ytv?apikey=${global.myName}&url=${encodeURIComponent(videoUrl)}`);
            downloadUrl = down.result.download_url;
        } catch (err) {
            console.error("First download path failed for search query:", err);
            try {
                const down = await fetchJson(`${global.api}/download/ytmp4?apikey=${global.myName}&url=${encodeURIComponent(videoUrl)}`);
                downloadUrl = down.result.download_url;
            } catch (err) {
                console.error("Second download path failed for search query:", err);
                try {
                    const down = await fetchJson(`${global.api}/download/ytvideo?apikey=${global.myName}&url=${encodeURIComponent(videoUrl)}`);
                    downloadUrl = down.result.download_url;
                } catch (fallbackErr) {
                    console.error("All download paths failed for search query:", fallbackErr);
                    return reply("❌ Unable to fetch download URL. Please try again later.");
                }
            }
        }

        buffer = await getBuffer(downloadUrl);
        const infoMess = {
            image: { url: datas.thumbnail },
            caption: `> *${config.BOT_NAME} 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*  
╭───────────────◆  
│⿻ *Title:* ${datas.title}
│⿻ *Quality:* mp4 (720p)
│⿻ *Duration:* ${datas.timestamp}
│⿻ *Viewers:* ${datas.views}
│⿻ *Uploaded:* ${datas.ago}
│⿻ *Artist:* ${datas.author.name}
╰────────────────◆  
⦿ *Direct Yt Link:* ${videoUrl}

Reply With:
*1* To Download Video 🎥
*2* To Download Video Document 📄

╭────────────────◆  
│ ${global.footer}
╰─────────────────◆`,
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

        const messageSent = await Gifted.sendMessage(from, infoMess, { quoted: mek });
        const messageId = messageSent.key.id;
        Gifted.ev.on("messages.upsert", async (event) => {
            const messageData = event.messages[0];
            if (!messageData.message) return;
            const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
            const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

            if (isReplyToDownloadPrompt) {
                await m.react("⬇️");
                switch (messageContent) {
                    case "1": 
                        await Gifted.sendMessage(from, {
                            video: buffer,
                            mimetype: "video/mp4",
                            contextInfo: {
                                externalAdReply: {
                                    title: datas.title,
                                    body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ',
                                    mediaType: 1,
                                    sourceUrl: 'https://whatsapp.com/channel/0029Vakd0RY35fLr1MUiwO3O',
                                    thumbnailUrl: datas.thumbnail,
                                }
                            }
                        }, { quoted: messageData });
                        await m.react("✅");
                        break;

                    case "2": 
                        await Gifted.sendMessage(from, {
                            document: buffer,
                            mimetype: "video/mp4",
                            fileName: `${datas.title}.mp4`,
                            contextInfo: {
                                externalAdReply: {
                                    title: datas.title,
                                    body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ',
                                    mediaType: 1,
                                    sourceUrl: 'https://whatsapp.com/channel/0029Vakd0RY35fLr1MUiwO3O',
                                    thumbnailUrl: datas.thumbnail,
                                }
                            }
                        }, { quoted: messageData });
                        await m.react("✅");
                        break;

                    default:
                  await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1 or 2)." });
                }
            }
        });
    } catch (err) {
        console.error("Error:", err);
        reply(`❌ Error: ${err.message}`);
    }
});


gmd({
  pattern: "ytv",
  desc: "Download Youtube Videos.",
  category: "downloader",
  react: "📽",
  filename: __filename
}, async (Gifted, mek, m, { from, isOwner, q, reply }) => {
  try {
      if (!q) return reply("Please provide a YouTube URL!");
      if (q.startsWith("https://youtu")) {
          return reply("Please provide a YouTube URL!");
      }
      const searchs = await fetchJson(`${global.api}/search/yts?apikey=${global.myName}&query=${encodeURIComponent(q)}`);
      dataa = searchs.results[0];

      const infoMess = {
          image: { url: dataa.thumbnail || config.BOT_PIC },
          caption: `> *${config.BOT_NAME} 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*  

╭───────────────◆  
│⿻ *Title:* ${datas.title}
│⿻ *Duration:* ${datas.timestamp}
│⿻ *Viewers:* ${datas.views}
│⿻ *Uploaded:* ${datas.ago}
│⿻ *Artist:* ${datas.author.name}
╰────────────────◆  
⦿ *Direct Yt Link:* ${videoUrl}

Reply With:
*1.* To Download 360p
*2.* To Download 720p
*3.* To Download 1080p

╭────────────────◆  
│ ${global.footer}
╰─────────────────◆`,
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

      const messageSent = await Gifted.sendMessage(from, infoMess);
      const messageId = messageSent.key.id;
      Gifted.ev.on("messages.upsert", async (event) => {
          const messageData = event.messages[0];
          if (!messageData.message) return;
          const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
          const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

          if (isReplyToDownloadPrompt) {
              await m.react("⬇️");
              switch (messageContent) {
                  case "1": 
                      const down1 = await gifted.ytmp4(q, 360);
                      const downloadUrl1 = down1.result.download_url;
                      const buffer1 = await getBuffer(downloadUrl1);
                      await Gifted.sendMessage(from, {
                          audio: buffer1,
                          mimetype: "video/mp4",
                          contextInfo: {
                              externalAdReply: {
                                  title: datas.title,
                                  body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ',
                                  mediaType: 1,
                                  sourceUrl: 'https://whatsapp.com/channel/0029Vakd0RY35fLr1MUiwO3O',
                                  thumbnailUrl: datas.thumbnail,
                              }
                          }
                      }, { quoted: messageData });
                      await m.react("✅");
                      break;

                      case "2": 
                      const down2 = await gifted.ytmp4(q, 720);
                      const downloadUrl2 = down2.result.download_url;
                      const buffer2 = await getBuffer(downloadUrl2);
                      await Gifted.sendMessage(from, {
                          audio: buffer2,
                          mimetype: "video/mp4",
                          contextInfo: {
                              externalAdReply: {
                                  title: datas.title,
                                  body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ',
                                  mediaType: 1,
                                  sourceUrl: 'https://whatsapp.com/channel/0029Vakd0RY35fLr1MUiwO3O',
                                  thumbnailUrl: datas.thumbnail,
                              }
                          }
                      }, { quoted: messageData });
                      await m.react("✅");
                      break;

                      case "3": 
                      const down3 = await gifted.ytv(q, 1080);
                      const downloadUrl3 = down3.result.download_url;
                      const buffer3 = await getBuffer(downloadUrl3);
                      await Gifted.sendMessage(from, {
                          audio: buffer3,
                          mimetype: "audio/mpeg",
                          contextInfo: {
                              externalAdReply: {
                                  title: datas.title,
                                  body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ',
                                  mediaType: 1,
                                  sourceUrl: 'https://whatsapp.com/channel/0029Vakd0RY35fLr1MUiwO3O',
                                  thumbnailUrl: datas.thumbnail,
                              }
                          }
                      }, { quoted: messageData });
                      await m.react("✅");
                      break;

                  default:
                await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1 or 2)." });
              }
          }
      });
  } catch (err) {
      console.error("Error:", err);
      reply(`❌ Error: ${err.message}`);
  }
});


/* gmd({
    pattern: "ytv",
    desc: "Download Youtube Videos.",
    category: "downloader",
    react: "📽",
    filename: __filename
}, async (Gifted, mek, m, { from, isOwner, q, reply }) => {
    try {
        if (!q) return reply("Please provide a YouTube URL!");
        if (q.startsWith("https://youtu")) {
            return reply("Please provide a YouTube URL!");
        }
        const searchs = await fetchJson(`${global.api}/search/yts?apikey=${global.myName}&query=${encodeURIComponent(q)}`);
        dataa = searchs.results[0];

        const infoMess = {
            image: { url: dataa.thumbnail || config.BOT_PIC },
            caption: `> *${config.BOT_NAME} 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*  

╭───────────────◆  
│⿻ *Title:* ${datas.title}
│⿻ *Duration:* ${datas.timestamp}
│⿻ *Viewers:* ${datas.views}
│⿻ *Uploaded:* ${datas.ago}
│⿻ *Artist:* ${datas.author.name}
╰────────────────◆  
⦿ *Direct Yt Link:* ${videoUrl}

Reply With:
*1.* To Download 360p
*2.* To Download 720p
*3.* To Download 1080p

╭────────────────◆  
│ ${global.footer}
╰─────────────────◆`,
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

        const messageSent = await Gifted.sendMessage(from, infoMess);
        const messageId = messageSent.key.id;
        Gifted.ev.on("messages.upsert", async (event) => {
            const messageData = event.messages[0];
            if (!messageData.message) return;
            const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
            const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

            if (isReplyToDownloadPrompt) {
                await m.react("⬇️");
                switch (messageContent) {
                    case "1": 
                        const down1 = await gifted.ytmp4(q, 360);
                        const downloadUrl1 = down1.result.download_url;
                        const buffer1 = await getBuffer(downloadUrl1);
                        await Gifted.sendMessage(from, {
                            audio: buffer1,
                            mimetype: "video/mp4",
                            contextInfo: {
                                externalAdReply: {
                                    title: datas.title,
                                    body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ',
                                    mediaType: 1,
                                    sourceUrl: 'https://whatsapp.com/channel/0029Vakd0RY35fLr1MUiwO3O',
                                    thumbnailUrl: datas.thumbnail,
                                }
                            }
                        }, { quoted: messageData });
                        await m.react("✅");
                        break;

                        case "2": 
                        const down2 = await gifted.ytmp4(q, 720);
                        const downloadUrl2 = down2.result.download_url;
                        const buffer2 = await getBuffer(downloadUrl2);
                        await Gifted.sendMessage(from, {
                            audio: buffer2,
                            mimetype: "video/mp4",
                            contextInfo: {
                                externalAdReply: {
                                    title: datas.title,
                                    body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ',
                                    mediaType: 1,
                                    sourceUrl: 'https://whatsapp.com/channel/0029Vakd0RY35fLr1MUiwO3O',
                                    thumbnailUrl: datas.thumbnail,
                                }
                            }
                        }, { quoted: messageData });
                        await m.react("✅");
                        break;

                        case "3": 
                        const down3 = await gifted.ytv(q, 1080);
                        const downloadUrl3 = down3.result.download_url;
                        const buffer3 = await getBuffer(downloadUrl3);
                        await Gifted.sendMessage(from, {
                            audio: buffer3,
                            mimetype: "video/mp4",
                            contextInfo: {
                                externalAdReply: {
                                    title: datas.title,
                                    body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ',
                                    mediaType: 1,
                                    sourceUrl: 'https://whatsapp.com/channel/0029Vakd0RY35fLr1MUiwO3O',
                                    thumbnailUrl: datas.thumbnail,
                                }
                            }
                        }, { quoted: messageData });
                        await m.react("✅");
                        break;

                    default:
                  await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1, 2 or 3)." });
                }
            }
        });
    } catch (err) {
        console.error("Error:", err);
        reply(`❌ Error: ${err.message}`);
    }
});*/
