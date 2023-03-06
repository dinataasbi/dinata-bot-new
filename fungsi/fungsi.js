import moment from "moment-timezone";
import * as fs from "fs";

// stream to buffer
function streamToBuff(stream) {
  return (async (stream) => {
    let buff = Buffer.from([]);
    for await (let chunk of stream) buff = Buffer.concat([buff, chunk]);
    return buff;
  })(stream);
}

export async function fungsiPesan(msg, sock) {
  if (!msg.message) return;
  let type = Object.keys(msg.message)[0];
  let contextInfo = (await msg.message[type]).contextInfo
    ? (await msg.message[type]).contextInfo
    : false;
  let typeq = contextInfo.quotedMessage
    ? Object.keys(contextInfo.quotedMessage)[0]
    : false;
  let uhuy = msg.key.fromMe
    ? sock.type == "md"
      ? sock.user.id.split(":")[0] + makeWASocket.S_WHATSAPP_NET
      : sock.state.legacy.user.id
    : (await msg.key.remoteJid).endsWith("@g.us")
    ? msg.key.participant
    : msg.key.remoteJid;

  return {
    key: msg.key,
    from: msg.key.remoteJid,
    fromMe: msg.key.fromMe,
    pushname: msg.pushName,
    messageTimestamp: msg.messageTimestamp,
    id: msg.key.id,
    isGroup: (await msg.key.remoteJid).endsWith("@g.us"),
    me:
      sock.type == "md"
        ? sock.user.id.split(":")[0] + makeWASocket.S_WHATSAPP_NET
        : sock.state.legacy.user.id,
    sender: uhuy,
    text:
      type === "conversation" && msg.message.conversation
        ? msg.message.conversation
        : type == "imageMessage" && msg.message.imageMessage.caption
        ? msg.message.imageMessage.caption
        : type == "documentMessage" && msg.message.documentMessage.caption
        ? msg.message.documentMessage.caption
        : type == "videoMessage" && msg.message.videoMessage.caption
        ? msg.message.videoMessage.caption
        : type == "extendedTextMessage" && msg.message.extendedTextMessage.text
        ? msg.message.extendedTextMessage.text
        : type == "buttonsResponseMessage" &&
          msg.message.buttonsResponseMessage.selectedButtonId
        ? msg.message.buttonsResponseMessage.selectedButtonId
        : type == "templateButtonReplyMessage" &&
          msg.message.templateButtonReplyMessage.selectedId
        ? msg.message.templateButtonReplyMessage.selectedId
        : "",
    mentionedJid: msg.message[type].contextInfo?.mentionedJid,
    fakeObj: msg,
    isOwner: !!owner.find((o) => o == uhuy),
    type: type,
    download:
      type == "imageMessage" ||
      type == "videoMessage" ||
      type == "stickerMessage" ||
      type == "audioMessage"
        ? await streamToBuff(
            await makeWASocket.downloadContentFromMessage(
              msg.message[type],
              type.split("M")[0]
            )
          )
        : false,
    reply: function (text) {
      return sock.sendMessage(
        msg.key.remoteJid,
        {
          text: text,
          mentions: [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
            (v) => v[1] + "@s.whatsapp.net"
          ),
        },
        { quoted: msg }
      );
    },
    quoted: msg.message[type]?.contextInfo?.quotedMessage
      ? {
          key: {
            remoteJid: msg.key.remoteJid,
            fromMe:
              contextInfo.participant ==
              (sock.type == "md"
                ? sock.user.id.split(":")[0] + makeWASocket.S_WHATSAPP_NET
                : sock.state.legacy.user.id),
            id: contextInfo.stanzaId,
            participant: contextInfo.participant,
          },
          id: contextInfo.stanzaId,
          sender: contextInfo.participant,
          fromMe:
            contextInfo.participant ==
            (sock.type == "md"
              ? sock.user.id.split(":")[0] + makeWASocket.S_WHATSAPP_NET
              : sock.state.legacy.user.id),
          isOwner: !!owner.find((o) => o == contextInfo.participant),
          mentionedJid: contextInfo.mentionedJid,
          text:
            contextInfo.quotedMessage?.conversation ||
            contextInfo.quotedMessage?.extendedTextMessage ||
            "",
          type: typeq,
          fakeObj: contextInfo.quotedMessage,
          download:
            typeq == "imageMessage" ||
            typeq == "videoMessage" ||
            typeq == "stickerMessage" ||
            typeq == "audioMessage"
              ? await streamToBuff(
                  await makeWASocket.downloadContentFromMessage(
                    (
                      await contextInfo
                    ).quotedMessage[typeq],
                    typeq.split("M")[0]
                  )
                )
              : false,
          reply: function (text) {
            return sock.sendMessage(
              msg.key.remoteJid,
              {
                text: text,
                mentions: [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
                  (v) => v[1] + "@s.whatsapp.net"
                ),
              },
              {
                quoted: {
                  remoteJid: msg.key.remoteJid,
                  fromMe:
                    contextInfo.participant ==
                    (sock.type == "md"
                      ? sock.user.id.split(":")[0] + makeWASocket.S_WHATSAPP_NET
                      : sock.state.legacy.user.id),
                  id: contextInfo.stanzaId,
                  participant: contextInfo.participant,
                },
              }
            );
          },
        }
      : false,
    time: moment.tz("Asia/Jakarta").format("HH:mm:ss"),
    tanggal: new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
  };
}

// fungsi lainya
async function createCode(length) {
  var chars = "0123456789";
  let str = "";
  let lengt = length || 9;
  for (var i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * 10)];
  }
  return str;
}

function parseMention(text = "") {
  return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
    (v) => v[1] + "@s.whatsapp.net"
  );
}

function jsonFormat(teks) {
  return JSON.stringify(teks, undefined, 2);
}

function cekFileada(namafile) {
  try {
    fs.readFileSync(namafile);
    return true;
  } catch (err) {
    return false;
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function isArray(objk) {
  return objk.constructor == Array;
}

async function isObject(objk) {
  return objk.constructor == Object;
}

async function isString(params) {
  return params.constructor == String;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function returNumber(str) {
  return str.replace(/\D/g, "");
}

export const func = {
  createCode,
  parseMention,
  jsonFormat,
  cekFileada,
  sleep,
  isArray,
  isObject,
  isString,
  shuffleArray,
  pickRandom,
  returNumber,
};
