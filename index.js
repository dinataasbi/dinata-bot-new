import makeWASocket from "@adiwajshing/baileys";
import chalk from "chalk";
import P from "pino";
import * as fs from "fs";
import { Boom } from "@hapi/boom";

import { messages } from "./message/pesan.js";
import { logg } from "./fungsi/console.js";
import { sockPlus } from "./fungsi/socket.js";
import { cfonts } from "./lib/cfonts.js";
import { func } from "./fungsi/fungsi.js";
import { Database } from "./fungsi/database.js";

// Database / storage / penyimpanan
global.memory = {
  data: {},
};

await Database();

// module @adiwajshing/baileys
global.makeWASocket = makeWASocket;

// setting
const setting = (await import("./setelan.js")).setting;
const { owner, sessionn } = setting;

global.setting = setting;

global.owner = owner;

// log
const log = await logg(false);

// ---- fungsi menyambungkan ke baileys ----
global.connectToWhatsApp = async (session) => {
  log.coneksi("KONEKSI", "Mengkoneksikan ke program baileys");
  // penyimpanan store
  const store = await makeWASocket.makeInMemoryStore({
    logger: P({ level: setting.level }).child({
      level: setting.level,
      stream: "store",
    }),
  });
  store.readFromFile(session.store);

  // otomatis menegdit dalam 10 detik
  setInterval(() => {
    store?.writeToFile(session.store);
  }, 10_000);

  // Koneksi whatsapp
  const { state, saveCreds } = await makeWASocket.useMultiFileAuthState(
    session.sesi
  );

  const { version } = await makeWASocket.fetchLatestBaileysVersion();

  // perantaranya
  const sock = await makeWASocket.default({
    version,
    logger: P({ level: setting.level }).child({ level: setting.level }),
    printQRInTerminal: true, // qr create otomatis
    auth: {
      // setting session di sini
      creds: state.creds,
      keys: await makeWASocket.makeCacheableSignalKeyStore(
        state.keys,
        P({ level: setting.level }).child({ level: setting.level })
      ),
    },
    browser: ["Reza Dinata", "safari", "1.0.0"],
    generateHighQualityLinkPreview: true,
    syncFullHistory: true,
  });

  await sockPlus(sock);
  store.bind(sock.ev);

  // // Nomer saya
  // if (sock.type == "md") {
  //   global.me =
  //     (await sock.user.id.split(":")[0]) + makeWASocket.S_WHATSAPP_NET;
  // }

  // event baileys
  sock.ev.on("creds.update", saveCreds);

  // event konektifitas
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      log.coneksi("QRCODE", qr);
    }

    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect.error == Boom)?.output?.statusCode !==
        makeWASocket.DisconnectReason.loggedOut;
      console.log(
        chalk.red("connection closed due to "),
        lastDisconnect.error,
        chalk.yellow(", reconnecting "),
        shouldReconnect
      );
      // reconnect if not logged out
      if (shouldReconnect) {
        for (let a of sessionn) {
          connectToWhatsApp(a);
        }
      }
    } else if (connection === "open") {
      log.coneksi("KONEKSI", "Berhasil tersambung ke session\n");
    }
  });

  // kontak update
  sock.ev.on("contacts.update", (kontak) => {
    for (let contact of kontak) {
      let id = contact.id;
      let name = contact.notify;
      if (store && store.contacts)
        store.contacts[id] = {
          id,
          name,
        };
    }
  });

  // event pesan message/pesan.js
  sock.ev.on("messages.upsert", async (message) => {
    await messages(sock, store, message);
  });
};

(async () => {
  // log intro
  cfonts(setting.botName, { color: "blue", background: "yellow" }, "left");
  console.log(
    chalk.bgRed(" " + setting.author + "@admin.bot ") +
      "\n-------------------------\n"
  );
  console.log(
    `author           : ${setting.author}\nusername-bot     : ${setting.botName}\n\n-------------------------\n`
  );

  await func.sleep(3000);

  for (let a of sessionn) {
    await connectToWhatsApp(a);
  }
})();
