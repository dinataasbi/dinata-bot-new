import makeWASocket from "@adiwajshing/baileys";
import { func } from "./fungsi/fungsi.js";

export const setting = {
  owner: [
    "6281252463994" + makeWASocket.S_WHATSAPP_NET,
    "6281259121031" + makeWASocket.S_WHATSAPP_NET,
  ],
  author: "rezadinata",
  sessionn: [{ sesi: "session", store: "session_strore.json" }],
  botName: "Dinata-Bot",
  level: "silent",
  database: "./database/database.json",
};

export async function menuBot(prefix) {
  return `List Menu ${setting.botName}`;
}
