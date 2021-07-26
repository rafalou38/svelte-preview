import { rollup } from "rollup";
import svelte from "rollup-plugin-svelte";
const css = require("rollup-plugin-css-only");
import * as resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
const sveltePreprocess = require("svelte-preprocess");
import { locateNodeModules } from "./utils";
import { IResult } from "./ambient";
const outputOptions = {};

export async function generate(
  code: string,
  filename: string,
  nodeModules?: string,
  removeImports = false,
  autoInsert = false,
  target = "body"
): Promise<IResult> {
  try {
    // Find Node modules
    const result: IResult = {
      js: {},
      css: "",
      err: [],
      sourceMap: {},
    };
    if (!nodeModules) {
      nodeModules = locateNodeModules(filename);
      if (!nodeModules) {
        return {
          js: {},
          css: "",
          err: [
            {
              start: {
                line: 0,
                column: 0, //TODO show real position
              },
              message: "node modules not found",
            },
          ],
          sourceMap: {}, //TODO
        };
      }
    }

    const inputOptions = {
      input: filename,
      plugins: [
        // @ts-ignore
        svelte({
          preprocess: sveltePreprocess(),
        }),
        css(),
        resolve.default({
          browser: true,
          dedupe: ["svelte"],
          moduleDirectories: [nodeModules],
        }),
        // @ts-ignore
        commonjs(),
      ],
    };
    const bundle = await rollup(inputOptions);

    const { output } = await bundle.generate(outputOptions);

    for (const chunkOrAsset of output) {
      if (chunkOrAsset.type === "asset") {
        result.css = chunkOrAsset.source.toString();
      } else {
        result.js[">./bundle.js"] = chunkOrAsset.code;
      }
    }

    if (autoInsert) {
      // convert component export to global variable
      result.js[""] = `
import App from "./bundle.js";

new App({
	target: document.querySelector("${target}")
})
		`;
    }

    await bundle.close();

    return result;
  } catch (e) {
    return {
      js: {},
      css: "",
      err: [
        {
          start: {
            line: e.start?.line || e.line || 0,
            column: e.start?.column || e.column || 0,
          },
          message: e.message,
        },
      ],
      sourceMap: {},
    };
  }
}
