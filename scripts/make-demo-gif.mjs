import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Image, GIF, Frame } from "imagescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const framesDir = path.join(__dirname, "..", "readme-assets", "frames");
const output = path.join(__dirname, "..", "readme-assets", "battleship-demo.gif");

const files = (await readdir(framesDir))
  .filter((name) => name.startsWith("demo-frame-") && name.endsWith(".png"))
  .sort();

const frames = [];
for (const file of files) {
  const bytes = await readFile(path.join(framesDir, file));
  const image = await Image.decode(bytes);
  const resized = image.resize(900, Image.RESIZE_AUTO);
  frames.push(Frame.from(resized, 900));
}

const gif = new GIF(frames, 0);
const bytes = await gif.encode(90);
await writeFile(output, bytes);
console.log(`Wrote ${output} (${frames.length} frames)`);
