import * as fs from "fs";
import makeWASocket from "@adiwajshing/baileys";

import { fungsiPesan, func } from "../fungsi/fungsi.js";
import { logg } from "../fungsi/console.js";
import { setting, menuBot } from "../setelan.js";
import { sendEmailTo } from "../lib/nodemailer.js";

const { jsonFormat, parseMention, createCode, cekFileada } = func;

export async function messages(sock, store, message, isMulti) {
  // log
  const log = await logg(isMulti);

  // mencoba
  try {
    // hanya memperbolehkan jika ada pesan
    if (!message.messages[0]) return;
    const msg = message.messages[0];

    //   memperbolehkan jika ada fungsi pesan
    if (!msg.message) return;

    //   fariabel pesan
    const m = await fungsiPesan(msg, sock);

    //   fungsi lainya
    const chats = (await m).text;
    const metadata = (await m).isGroup
      ? await sock.groupMetadata((await m).from)
      : "";
    const groupName = metadata.subject;
    const groupAll = await sock.groupFetchAllParticipating();

    //   fungsi command & prefix
    const body =
      msg.message?.conversation ||
      msg.message?.imageMessage?.caption ||
      msg.message?.videoMessage?.caption ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
      msg.message?.buttonsResponseMessage?.selectedButtonId ||
      msg.message?.templateButtonReplyMessage?.selectedId ||
      "";
    const args = body.trim().split(/ +/).slice(1);
    const q = args.join(" ");
    const command = body.trim().split(/ +/).shift().toLowerCase();
    var prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#%^&.+-,\/\\©^]/.test(command)
      ? command.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#%^&.+-,\/\\©^]/gi)
      : "#";

    // ------------------- Tidak bisa untuk self ---------------------------

    if (m.fromMe) return;

    // ------------------- CONSOLE LOG ---------------------------
    if (!m.fromMe && !m.isGroup && command) {
      log.text(
        "COMMAND PRIBADI",
        jsonFormat({ Dari: m.pushname, Perintah: command, Id: m.sender })
      );
    }
    if (!m.fromMe && m.isGroup && command) {
      log.text(
        "COMMAND GROUP",
        jsonFormat({
          Dari: groupName,
          Nama: m.pushname,
          Perintah: command,
          Id: m.sender,
        })
      );
    }

    // ------------------- REGISTER ---------------------------

    // if regist kode
    if (command) {
      if (await memory.register.isUser(await m.sender)) {
        var data = await memory.register.search(await m.sender);
        if (
          !data.isVertify &&
          data.kode.length <= 2 &&
          data.kode[0] == command
        ) {
          memory.register.codeV.add(m.sender);
          memory.register.set(m.sender, "isVertify", true);
          memory.register.set(m.sender, "tanggal", m.tanggal);
          return m.reply(
            `Registrasi berhasil anda dapat menggunakan bot kembali\n\nApabila anda ingin melihat biodata akun anda ketik ${prefix}profile`
          );
        }
      }
    }
    // regist
    if (command == prefix + "register") {
      if (await memory.register.isUser(await m.sender))
        return m.reply(
          `Anda telah melakukan pendaftaran sebelumnya pada: ` +
            (await memory.register.search(m.sender)).tanggal
        );
      if (q.includes("@")) {
        memory.register.add(m.sender, m.pushname, q);

        var codeOtp = await func.createCode(9);
        sendEmailTo(
          q,
          "CODE VERTIFIKASI BOT",
          "Kode Vertifikasi Bot: " +
            codeOtp +
            "\n\nNote: Jangan berikan kode rahasia ini kepada siapapun termasuk pihak yang mengaku " +
            setting.botName
        );
        memory.register.codeV.add(m.sender, codeOtp);
        m.reply(
          "Kami telah mengirimkan kode vertifikasi ke akun gmail anda, silahkan salin kode lalu kirim kembali di sini untuk menyelesaikan registrasi."
        );
      }
    } else if (command == prefix + "unregister") {
      if (!(await memory.register.isUser(await m.sender)))
        return m.reply(`Sebelumya anda belum pernah melakukan registrasi.`);

      memory.register.remove(m.sender);
      await m.reply("Sukses menghapus data akun anda.");
    }

    if (!m.isGroup && command && !(await memory.register.isUser(m.sender)))
      return m.reply(
        `Sepertinya anda belum melakukan registrasi, silahkan ketik *${prefix}register arsmdinata@gmail* dengan di tambahkan alamat email anda.`
      );
    if (!m.isGroup && !(await memory.register.search(await m.sender)).isVertify)
      return m.reply("lanjutkan registrasi terlebih dahulu");

    // ------------------- COMMAND ---------------------------

    switch (command) {
      // ------------------- DEFAULT | EVAL | EXEC ---------------------------

      default: {
        (await import("../fungsi/eval.js")).uhuy(
          message,
          sock,
          store,
          m,
          chats,
          msg,
          args,
          log
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
}
