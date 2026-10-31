// One-off: builds public/favicon-hk.png from the nav emblem on a cream rounded square,
// so the tab icon is visible in both light and dark browser themes.
import sharp from "sharp";

const SIZE = 256;
const PAD = 36;
const emblem = await sharp("public/reference/hk-emblem.webp")
  .resize(SIZE - PAD * 2, SIZE - PAD * 2, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

const bg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}"><rect width="${SIZE}" height="${SIZE}" rx="56" fill="#faf9f6"/></svg>`,
);

await sharp(bg)
  .composite([{ input: emblem, gravity: "center" }])
  .png()
  .toFile("public/favicon-hk.png");

console.log("Wrote public/favicon-hk.png");
