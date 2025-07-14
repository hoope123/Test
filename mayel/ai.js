const { gmd, config, commands, fetchJson } = require('../gift'),
    { PREFIX: prefix } = config, 
    fs = require('fs'), 
    axios = require('axios'); 

gmd({
    pattern: "sd",
    alias: ["stablediffusion"],
    react: '📸',
    desc: "Generate Image Using Stable Difussion Ai.",
    category: "ai",
    filename: __filename
},
async (Gifted, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("Provide a prompt to generate image!");
        const res = await axios.get(`${global.api}/ai/sd?apikey=${global.myName}&prompt=${encodeURIComponent(q)}`, {
            responseType: 'arraybuffer' 
        });
        await Gifted.sendMessage(from, { 
            image: Buffer.from(res.data),
            caption: `Here is your generated Image for ${q}\n> ${global.footer}`
        }, { quoted: mek });
        await m.react("✅");
    } catch (e) {
        console.error("Error occurred:", e);
        reply("❌ An error occurred while fetching data from Gifted-Api. Please try again later.");
    }
});


gmd({
    pattern: "imagine",
    alias: ["imagineai"],
    react: '📸',
    desc: "Generate Image Using Imagine Ai.",
    category: "ai",
    filename: __filename
},
async (Gifted, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("Provide a prompt to generate image!");
        const res = await axios.get(`${global.api}/ai/text2img?apikey=${global.myName}&prompt=${encodeURIComponent(q)}`, {
            responseType: 'arraybuffer' 
        });
        await Gifted.sendMessage(from, { 
            image: Buffer.from(res.data),
            caption: `Here is your generated Image for ${q}\n> ${global.footer}`
        }, { quoted: mek });
        await m.react("✅");
    } catch (e) {
        console.error("Error occurred:", e);
        reply("❌ An error occurred while fetching data from Gifted-Api. Please try again later.");
    }
});

gmd({
    pattern: "lumin",
    alias: ["luminai"],
    react: '🤖',
    desc: "Chat With Lumin Ai.",
    category: "ai",
    filename: __filename
},
async (Gifted, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("Provide a query!");
        const data = await fetchJson(`${global.api}/ai/luminai?apikey=${global.myName}&query=${encodeURIComponent(q)}`);
         const infoMess = {
                text: data.result,
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
            Gifted.sendMessage(from, infoMess, { quoted: mek });
        await m.react("✅");
    } catch (e) {
        console.error("Error occurred:", e);
        reply("❌ An error occurred while fetching data from Gifted-Api. Please try again later.");
    }
});

gmd({
    pattern: "wwdgpt",
    react: '🤖',
    desc: "Chat With Wwd Gpt Ai.",
    category: "ai",
    filename: __filename
},
async (Gifted, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("Provide a query!");
        const data = await fetchJson(`${global.api}/ai/wwdgpt?apikey=${global.myName}&prompt=${encodeURIComponent(q)}`);
         const infoMess = {
                text: data.result,
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
            Gifted.sendMessage(from, infoMess, { quoted: mek });
        await m.react("✅");
    } catch (e) {
        console.error("Error occurred:", e);
        reply("❌ An error occurred while fetching data from Gifted-Api. Please try again later.");
    }
});

gmd({
    pattern: "letme",
    alias: ["letmegpt"],
    react: '🤖',
    desc: "Chat With Letme Gpt Ai.",
    category: "ai",
    filename: __filename
},
async (Gifted, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("Provide a query!");
        const data = await fetchJson(`${global.api}/ai/letmegpt?apikey=${global.myName}&query=${encodeURIComponent(q)}`);
         const infoMess = {
                text: data.result,
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
            Gifted.sendMessage(from, infoMess, { quoted: mek });
        await m.react("✅");
    } catch (e) {
        console.error("Error occurred:", e);
        reply("❌ An error occurred while fetching data from Gifted-Api. Please try again later.");
    }
});

gmd({
    pattern: "simsimi",
    alias: ["aimaimiai"],
    react: '🤖',
    desc: "Chat With Simsimi Ai.",
    category: "ai",
    filename: __filename
},
async (Gifted, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("Provide a query!");
        const data = await fetchJson(`${global.api}/ai/simsimi?apikey=${global.myName}&query=${encodeURIComponent(q)}`);
         const infoMess = {
                text: data.result,
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
            Gifted.sendMessage(from, infoMess, { quoted: mek });
        await m.react("✅");
    } catch (e) {
        console.error("Error occurred:", e);
        reply("❌ An error occurred while fetching data from Gifted-Api. Please try again later.");
    }
});

gmd({
    pattern: "gpt4-o",
    react: '🤖',
    desc: "Chat With Chat Gpt4-o Ai.",
    category: "ai",
    filename: __filename
},
async (Gifted, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("Provide a query!");
        const data = await fetchJson(`${global.api}/ai/gpt4-o?apikey=${global.myName}&q=${encodeURIComponent(q)}`);
         const infoMess = {
                text: data.result,
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
            Gifted.sendMessage(from, infoMess, { quoted: mek });
        await m.react("✅");
    } catch (e) {
        console.error("Error occurred:", e);
        reply("❌ An error occurred while fetching data from Gifted-Api. Please try again later.");
    }
});


gmd({
    pattern: "ai",
    alias: ["aichat", "chatai"],
    desc: "Chat With Random Ai",
    react: "🤖",
    category: "ai",
    filename: __filename
}, async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("Provide a prompt");

        let data;
        const tryFetch = async (url) => {
            try {
                const res = await fetchJson(url);
                if (res && res.result) return res.result;
            } catch (err) {
                console.log(`API failed or no valid response: ${url}`, err);
            }
            return null;
        };

        const urls = [
            `${global.api}/ai/gpt4?apikey=${global.myName}&q=${encodeURIComponent(q)}`,
            `${global.api}/ai/gpt4-o?apikey=${global.myName}&q=${encodeURIComponent(q)}`,
            `${global.api}/ai/gpt-turbo?apikey=${global.myName}&q=${encodeURIComponent(q)}`
        ];

        let resultText = null;
        for (const url of urls) {
            resultText = await tryFetch(url);
            if (resultText) break;
        }

        if (!resultText) return reply("Sorry, I couldn't generate a response. Please try again later.");

        const infoMess = {
            text: resultText,
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

        // Try sending with quoted, fallback to without quoted if it fails
        try {
            await Gifted.sendMessage(from, infoMess, { quoted: mek });
        } catch (err) {
            console.log("Send with quoted failed, retrying without quoted:", err);
            try {
                await Gifted.sendMessage(from, infoMess);
            } catch (err2) {
                console.log("Send without quoted also failed:", err2);
                return reply("❌ Failed to send the AI response.");
            }
        }
        await m.react('✅');

    } catch (e) {
        console.log(e);
        reply(`${e.message || e}`);
    }
});

gmd({
    pattern: "gemini",
    alias: ["geminiai", "geminiaichat", "geminichat"],
    desc: "Chat With Gemini Ai",
    react: "🤖",
    category: "ai",
    filename: __filename
},
async(Gifted, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if (!q) return reply("Provide a prompt")
let data = await fetchJson(`${global.api}/ai/geminiai?apikey=${global.myName}&q=${encodeURIComponent(q)}`)
    const infoMess = {
        text: data.result,
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
      await Gifted.sendMessage(from, infoMess, { quoted: mek });
      await m.react('✅');
}catch(e){
console.log(e)
reply(`${e}`)
}
})

gmd({
    pattern: "blackbox",
    alias: ["blackboxai", "blackboxaichat", "blackboxchat"],
    desc: "Chat Wth BlackBox Ai",
    react: "🤖",
    category: "ai",
    filename: __filename
},
async(Gifted, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    try {
        let data = await fetchJson(`${global.api}/ai/blackbox?apikey=${global.myName}&q=${encodeURIComponent(q)}`);
        if (!data || !data.result) return reply("Error: No response from the AI.");
        if (data && data.result && !data.result.includes("Generated by BLACKBOX.AI, try unlimited chat https://www.blackbox.ai")) {
        const infoMess = {
            text: data.result,
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
        await Gifted.sendMessage(from, infoMess, { quoted: mek });
        await m.react('✅');
    }
    } catch (e) {
        console.log(e);
        reply(`${e.message || e}`);
    }
});

gmd({
    pattern: "gpt",
    alias: ["gpt4", "chatgpt", "chatgpt4", "gptai", "chatgptai"],
    desc: "Chat with Chat Gpt4 Ai",
    react: "🤖",
    category: "ai",
    filename: __filename
}, async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let data;
        try {
            data = await fetchJson(`${global.api}/ai/gpt4?apikey=${global.myName}&q=${encodeURIComponent(q)}`);
            if (data && data.result) {
                return sendResponse(data.result);
            }
        } catch (e) {
            console.log('Gemini API failed or no valid response:', e);
        }
        try {
            data = await fetchJson(`${global.api}/ai/gpt4-o?apikey=${global.myName}&q=${encodeURIComponent(q)}`);
            if (data && data.result) {
                return sendResponse(data.result);
            }
        } catch (e) {
            console.log('Gemini API failed or no valid response:', e);
        }
        try {
            data = await fetchJson(`${global.api}/ai/gpt?apikey=${global.myName}&q=${encodeURIComponent(q)}`);
            if (data && data.result) {
                return sendResponse(data.result);
            }
        } catch (e) {
            console.log('BlackBox API failed or no valid response:', e);
        }
        try {
            data = await fetchJson(`${global.api}/ai/gpt-turbo?apikey=${global.myName}&q=${encodeURIComponent(q)}`);
            if (data && data.result) {
                return sendResponse(data.result);
            }
        } catch (e) {
            console.log('GPT-3 Turbo API failed or no valid response:', e);
        }
        try {
            data = await fetchJson(`${global.api}/ai/geminiai?apikey=${global.myName}&q=${encodeURIComponent(q)}`);
            if (data && data.result) {
                return sendResponse(data.result);
            }
        } catch (e) {
            console.log('Default GPT API failed or no valid response:', e);
        }
        return reply("Sorry, I couldn't generate a response. Please try again later.");
        function sendResponse(resultText) {
            const infoMess = {
                text: resultText,
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
            Gifted.sendMessage(from, infoMess, { quoted: mek });
            m.react('✅');
        }
    } catch (e) {
        console.log(e);
        reply(`${e.message || e}`);
    }
});
