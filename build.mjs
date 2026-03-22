import { build, context } from "esbuild";
import copy from "esbuild-plugin-copy";

const isWatch = process.argv.includes("--watch");

function getTimestamp() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
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

  // ✅ ADD THIS PART
  await ctx.serve({
    servedir: "docs",
    port: 3000
  });

  console.log(`🚀 Server running at http://localhost:3000 [${getTimestamp()}]`);
} else {
  await build(config);
  console.log(`Build complete 🚀 [${getTimestamp()}]`);
}