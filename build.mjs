import { build, context } from "esbuild";
import copy from "esbuild-plugin-copy";

const isWatch = process.argv.includes("--watch");

const config = {
  entryPoints: ["source/ts/index.ts"],
  bundle: true,
  platform: "browser",
  target: "es2022",
  format: "esm",
  outfile: "public/js/index.js",
  sourcemap: false,
  plugins: [
    copy({
      resolveFrom: "cwd", // 👈 important
      assets: [
        {
          from: ["source/index.html"],
          to: ["public"]
        },
        {
          from: ["source/css/**/*"],
          to: ["public/css"]
        },
        {
          from: ["source/assets/**/*"],
          to: ["public/assets"]
        }
      ],
      watch: isWatch
    })
  ]
};

if (isWatch) {
  const ctx = await context(config);
  await ctx.watch();
  console.log("Watching with copy plugin 🚀");
} else {
  await build(config);
  console.log("Build complete 🚀");
}