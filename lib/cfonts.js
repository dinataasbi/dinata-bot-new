import cfontss from "cfonts";

export function cfonts(text, warna, lokasi) {
  return cfontss.say(text, {
    font: "block",
    align: lokasi,
    colors: [warna.color, warna.background ? warna.background : "white"],
    background: "transparent",
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    env: "node",
  });
}
