const fs = require('fs-extra');
if (fs.existsSync('.env'))
  require('dotenv').config({ path: __dirname + '/.env' });
const path = require("path");

module.exports = { 
    SESSION_ID: process.env.SESSION_ID || 'PRINCE-MD~H4sIAAAAAAAAA5VUXZOiOBT9L3nVGkVAlKqumgB+ISoqaOPWPAQIEPk0BBWm/O9T2N0zs1W7s708hSR17rnnnJvvIMtJiZe4BvJ3UFByRQy3S1YXGMhAqYIAU9AFPmIIyKCE6KRhO20u89dXqWLL4/7iIvvMq4P1iox3atnD9zFTR7zwAh5dUFRuQrw/AM4rGES7uxnUHVfqw8PYQ4KTa2EQJTOOxpdBZedCNdoIKnwBjxYREUqycFJEOMUUJUtcm4jQz9G3Z5ZvCNgdnTi93nqBtGRptoE535mdjvOMV3aC4SBYoenoc/TvaSDdJmIy3BSwH95WNJ3AaL4ITuxVrAg0tVRqznUZi5b9Rr8kYYb9hY8zRlj9ad075ng2966nwWGmYuPMCxevUgZUlw7Jmuh2lY5uJp3qBZs6nyMewbVDLsa5mduZ1jlcQ8dwrbDs1Wy6t4aGiY1er4+mwmH7N+Im/chK/H9072/QXtutl47kXpbW4ZgMEj6hxiGOzqdkMr6sOr7q8Vd7mXifo+/0HHFuQl1xR8klq6VN7B5OEytSuNjN99dxHm6OtR5dCfR+0Ueson9iKTZupQmbVeydyO3UURdO51ZZSaNs097GnUZVU8U9aiGl09QXKC16KVU2VK8b3Vum6VJUfMaGTc+93uvoYp/oVVSj8Pby7CjG9cIHMvfoAopDUjKKGMmzdq/fBci/7rFHMXuKC3q5dI5Izz0u+yir6I0qpuWpVslLxpDxnKgVaM54mggT+AK6oKC5h8sS+3NSspzWK1yWKMQlkP/61gUZvrM329piPNcFAaEls7OqSHLkf3j6cYg8L68ytq8zT20XmL4xfN/GjJEsLFsVqwxRLyJXrEaIlUAOUFLin/1hin0gM1rhnzOr5n4rO3QUE66MNeiC9GkH8YEMBrww5jheksQ+N5Klr+WXWwuLiuJLhhnoguR5TRDEvjDmJWnAjbm+LH1tt7sgQy0UWC7Ws1btd7YtuI8ZIkkJZKBurhbbr7YDXWX11nHgHsIlfCr40d1HSN5suK65RNcuh/XlcOfhyhtZdb9uVrFR7AsrOPO2GJrxsX+fxpN/AgEyOO1s7SoGdEiE3GkGTcav7gbdHu1gsY1Gr4PX18Qo+LuO5yuLcxwqiYVR9UtHJ4v7UJyW5x3C2PL35JzYCc9KeD8gpU1UF/j4Sjz8e7GxaObKXgsy4jE4tjSjF/eX9rnUqXZ0ahv72WA0czeBYE8bODHG7ghpR7aW7svb1ud8ZxF7+7PNAmmWkYhoRXZeONF7fJ/jk7w/W+QZrda39jcg+PkKvFvwnz6+EX8G/9H9DeP9XfmX2VTcxj/tt8PEQonn37S5ORmxVdno6tC+2G3NjaOJU7banRTweHzrgiJBLMhpCmSAMp/mz5zQvGrzu8iC/A/FVGgvYBgu2s4TVDL4ayYskuKSobQAMicNBUEQBqL0dsukeTFHZQRkkKW84rb5rmFR7BliHxMGYPvpEgGPHxk2dlV7BwAA',
    PREFIX: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "𝐏𝐑𝐈𝐍𝐂𝐄 𝐓𝐄𝐂𝐇",
    OWNER_NUMBER : process.env.OWNER_NUMBER || "237682698517", 
    SUDO_NUMBERS : process.env.SUDO_NUMBERS || "237682698517",
    BOT_NAME : process.env.BOT_NAME || '𝐏𝐑𝐈𝐍𝐂𝐄 𝐌𝐃𝐗',
    FOOTER : process.env.FOOTER || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ',
    CAPTION : process.env.CAPTION || '𝐏𝐑𝐈𝐍𝐂𝐄 𝐌𝐃𝐗',
    VERSION: process.env.VERSION || '4.0.0',
    BOT_PIC : process.env.BOT_PIC || 'https://raw.githubusercontent.com/Mayelprince/url/main/menun.jpg',            
    MODE: process.env.MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'false',
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    TIME_ZONE: process.env.TIME_ZONE || "Africa/Douala",
    DM_PRESENCE : process.env.DM_PRESENCE || 'online', // recording/typing/online/offline
    GC_PRESENCE : process.env.GC_PRESENCE || 'online', // recording/typing/online/offline
    CHATBOT : process.env.CHATBOT || 'false', // can be true/audio/false   
    CHATBOT_MODE : process.env.CHATBOT_MODE || 'inbox', // can be inbox/groups/allchats
    STARTING_MESSAGE : process.env.STARTING_MESSAGE || "true",
    ANTIDELETE : process.env.ANTIDELETE || 'indm', // inchat/indm/false
    GOODBYE_MESSAGE : process.env.GOODBYE_MESSAGE || 'false',
    ANTICALL : process.env.ANTICALL || 'false', // (decline/true)/block/false
    ANTICALL_MSG: process.env.ANTICALL_MSG || "*_📞 Auto Call Reject Mode Active. 📵 No Calls Allowed!_*",
    WELCOME_MESSAGE : process.env.WELCOME_MESSAGE || 'false',
    ANTILINK : process.env.ANTILINK || 'false', // or delete or kick or true
    AUTO_LIKE_STATUS : process.env.AUTO_LIKE_STATUS || 'true',
    AUTO_READ_STATUS : process.env.AUTO_READ_STATUS || 'true',
    STATUS_LIKE_EMOJIS : process.env.STATUS_LIKE_EMOJIS || "💛,❤️,💜,🤍,💙",
    AUTO_REPLY_STATUS: process.env.AUTO_REPLY_STATUS || "false",   
    STATUS_REPLY_TEXT: process.env.STATUS_REPLY_TEXT || "*ʏᴏᴜʀ sᴛᴀᴛᴜs ᴠɪᴇᴡᴇᴅ sᴜᴄᴄᴇssғᴜʟʟʏ ✅*",             
    AUTO_REACT : process.env.AUTO_REACT || 'false',
    AUTO_REPLY : process.env.AUTO_REPLY || 'false',
    AUTO_READ_MESSAGES : process.env.AUTO_READ_MESSAGES || 'false', // true/commands/false
    AUTO_BIO : process.env.AUTO_BIO || 'false',
    AUTO_BLOCK: process.env.AUTO_BLOCK || '212,233',
    YT: process.env.YT || 'youtube.com/@princetechn11',
    NEWSLETTER_JID: process.env.NEWSLETTER_JID || '120363408839929349@newsletter',
    NEWSLETTER_URL: process.env.NEWSLETTER_URL || 'https://whatsapp.com/channel/0029Vakd0RY35fLr1MUiwO3O',
    BOT_REPO: process.env.BOT_REPO || 'Mayelprince/PRINCE-MDXI',
    PACK_NAME: process.env.PACK_NAME || '𝐏𝐑𝐈𝐍𝐂𝐄 𝐌𝐃𝐗',
    PACK_AUTHOR: process.env.PACK_AUTHOR || '𝐏𝐑𝐈𝐍𝐂𝐄 𝐓𝐄𝐂𝐇'
};

let fileName = require.resolve(__filename);
fs.watchFile(fileName, () => {
    fs.unwatchFile(fileName);
    console.log(`Writing File: ${__filename}`);
    delete require.cache[fileName];
    require(fileName);
});
