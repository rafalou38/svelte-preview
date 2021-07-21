import { rollup } from "rollup";
import * as svelte from "rollup-plugin-svelte";
import * as css from "rollup-plugin-css-only";
import * as resolve from "@rollup/plugin-node-resolve";
import * as commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { locateNodeModules } from "./utils";
const outputOptions = {};

export async function generate(
  code: string,
  filename: string,
  nodeModules?: string,
  removeImports = false,
  autoInsert = false,
  target = "body"
): Promise<IResult> {
  // Find Node modules
  const result: IResult = {
    js: {},
    css: "",
    err: [],
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
      };
    }
  }

  const inputOptions = {
    input: filename,
    plugins: [
      // @ts-ignore
      svelte(),
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
}
