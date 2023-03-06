import { func } from "./fungsi.js";
import makeWASocket from "@adiwajshing/baileys";

export async function sockPlus(sock) {
  // send contact
  sock.sendContact = async (jid, option, quoted) => {
    let number = option.number ? option.number.replace(/[^0-9]/g, "") : "";
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${option.name}\nORG:;\nTEL;type=CELL;type=VOICE;waid=${number}:+${number}\nEND:VCARD`;

    let anu = await sock.sendMessage(
      jid,
      {
        contacts: {
          displayName: option.name,
          contacts: [{ vcard }],
        },
      },
      quoted
    );
    if (option.reply2) {
      await sock.sendMessage(
        jid,
        {
          text: option.reply2,
          mentions: await func.parseMention(option.reply2),
        },
        { quoted: anu }
      );
    }
  };
}
