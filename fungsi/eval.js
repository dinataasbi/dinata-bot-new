import util from "util";
import cp from "child_process";
import * as fs from "fs";
import makeWASocket from "@adiwajshing/baileys";
import ms from "ms";

import { sendEmailTo } from "../lib/nodemailer.js";
import { cfonts } from "../lib/cfonts.js";

export async function uhuy(message, sock, store, m, chats, msg, args, log) {
  if (chats.startsWith("=> ") && m.isOwner) {
    try {
      var text = util.format(
        await eval(`(async() => { return ${args.join(" ")} })()`)
      );
      sock.sendMessage(
        m.from,
        {
          text,
        },
        {
          quoted: msg,
        }
      );
    } catch (e) {
      sock.sendMessage(
        m.from,
        {
          text: util.format(e),
        },
        {
          quoted: msg,
        }
      );
    }
    log.text("EVAL 1", "dari owner ku");
  } else if (chats.startsWith("> ") && m.isOwner) {
    try {
      var text = util.format(
        await eval(
          `(async()=>{\ntry{\n${args.join(
            " "
          )} }catch(e){\nawait sock.sendMessage(m.from, {text: util.format(e) })\n}\n})()`
        )
      );
      sock.sendMessage(
        m.from,
        {
          text,
        },
        {
          quoted: msg,
        }
      );
    } catch (e) {
      sock.sendMessage(
        m.from,
        {
          text: util.format(e),
        },
        {
          quoted: msg,
        }
      );
    }
    log.text("EVAL 2", "dari owner ku");
  } else if (chats.startsWith("$ ") && m.isOwner) {
    try {
      cp.exec(args.join(" "), function (er, st) {
        if (er)
          sock.sendMessage(
            m.from,
            {
              text: util.format(
                er
                  .toString()
                  .replace(
                    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
                    ""
                  )
              ),
            },
            {
              quoted: msg,
            }
          );
        if (st)
          sock.sendMessage(
            m.from,
            {
              text: util.format(
                st
                  .toString()
                  .replace(
                    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
                    ""
                  )
              ),
            },
            {
              quoted: msg,
            }
          );
      });
    } catch (e) {
      console.warn(e);
    }
    log.text("EXEC", "dari owner ku");
  }
}
