import { build, context } from "esbuild";
import copy from "esbuild-plugin-copy";

const isWatch = process.argv.includes("--watch");

// function to get current timestamp
function getTimestamp() {
  const now = new Date();

  // Extract hours, minutes, and seconds
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // Combine into HH:MM:SS format
  const timeString = `${hours}:${minutes}:${seconds}`;
  return timeString;
}

const config = {
  entryPoints: ["source/ts/index.ts"],
  bundle: true,
  platform: "browser",
  target: "es2022",
  format: "esm",
  outfile: "docs/js/index.js",
  sourcemap: true,
  plugins: [
    copy({
      resolveFrom: "cwd",
      assets: [
        {
          from: ["source/index.html"],
          to: ["docs"]
        },
        {
          from: ["source/css/**/*"],
          to: ["docs/css"]
        },
        {
          from: ["source/assets/**/*"],
          to: ["docs/assets"]
        }
      ],
      watch: isWatch
    })
  ]
};

if (isWatch) {
  const ctx = await context(config);
  await ctx.watch();
  console.log(`Watching with copy plugin 🚀 [${getTimestamp()}]`);
} else {
  await build(config);
  console.log(`Build complete 🚀 [${getTimestamp()}]`);
}