import * as path from "path";
import * as svelte from "svelte/compiler";
import {
  scss,
  babel,
  coffeescript,
  less,
  sass,
  stylus,
  typescript,
} from "svelte-preprocess";
import { existsSync, readFileSync } from "fs";
import { Warning } from "svelte/types/compiler/interfaces";
import { ExtensionContext } from "vscode";

let svelteCode = "";

const preprocessorList = [
  scss({}),
  typescript({}),
  babel({}),
  coffeescript({}),
  less({}),
  sass({}),
  stylus({}),
];

interface IFinal {
  js: {
    [key: string]: string;
  };
  css: string;
  err: (
    | Warning
    | {
        start: {
          line: any;
          column: any;
        };
        message: any;
      }
  )[];
}

let final: IFinal;
export async function generate(
  code: string,
  filename: string,
  nodeModules?: string,
  removeImports = false,
  autoInsert = false,
  target = "body"
) {
  final = {
    js: {},
    css: "",
    err: [],
  };

  const result = await compile(
    code,
    filename,
    removeImports,
    autoInsert,
    target
  );

  if (result.err.length !== 0) return { js: {}, css: "", err: result.err };

  final.js[""] = result.js;
  final.js[">svelte/internal"] = svelteCode;
  final.css += result.css || "";

  // Find Node modules
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
  const uri = "";
  await walk(result.js, filename, nodeModules, uri, transformModule);

  return final;
}

async function transformModule(
  content: string,
  name: string,
  modulePath: string,
  uri: string,
  isNodeModule: boolean
) {
  if (modulePath.endsWith(".svelte")) {
    const result = await compile(content, modulePath, false, false);

    final.err = [...final.err, ...result.err];
    final.js[name] = result.js;
    final.css += result.css || "";
    return result.js;
  } else if (modulePath.endsWith(".js") || modulePath.endsWith(".mjs")) {
    final.js[uri] = content;
    return content;
  }
}

async function walk(
  content: string,
  filePath: string,
  nodeModule: string,
  uri: string,
  cb: (
    content: string,
    name: string,
    path: string,
    uri: string,
    isNodeModule: boolean
  ) => Promise<string | undefined>
) {
  const regex = /^[^\s*\/]+[\w\s*{},:]+?from\s?["'](.+)["']/gm;

  while (1) {
    let isNodeModule = false;
    let match = regex.exec(content);
    if (match === null) break;

    const depName = match?.[1];
    if (depName !== undefined) {
      // ==> RESOLVE ABSOLUTE PATH OF THE MODULE
      let depPath = "";
      if (depName.startsWith(".")) {
        depPath = path.resolve(path.dirname(filePath), depName);
        if (!depPath.match(/\.\w+$/)) {
          if (existsSync(depPath + ".js")) {
            depPath += ".js";
          }
          if (existsSync(depPath + ".mjs")) {
            depPath += ".mjs";
          }
        }
      } else {
        if (!depPath.match(/\.\w+$/)) {
          depPath = path.resolve(nodeModule, depName);
          isNodeModule = true;
        }

        if (!depPath.includes(".")) {
          if (existsSync(depPath + ".js")) {
            depPath += ".js";
          } else if (existsSync(depPath + ".mjs")) {
            depPath += ".mjs";
          } else {
            const packageJsonPath = path.resolve(depPath, "package.json");
            const packageJson = JSON.parse(
              readFileSync(packageJsonPath).toString()
            );
            depPath = path.resolve(depPath, packageJson.module);
          }
        }
      }

      let depContent = readFileSync(depPath).toString();
      depContent =
        (await cb(
          depContent,
          depName,
          depPath,
          uri + ">" + depName,
          isNodeModule
        )) || depContent;
      await walk(depContent, depPath, nodeModule, uri + ">" + depName, cb);
    }
  }
}

function locateNodeModules(file: string) {
  for (let index = 0; index < 5; index++) {
    let possiblePath = path.resolve(
      path.dirname(file),
      "../".repeat(index),
      "node_modules"
    );
    if (existsSync(possiblePath)) {
      return possiblePath;
    }
  }
}

export function loadSvelteCode(context: ExtensionContext) {
  const filepath = path.join(
    context?.extensionPath || "",
    "media",
    "svelte.js"
  );
  const file = readFileSync(filepath);
  svelteCode = file.toString();
}
async function compile(
  code: string,
  filename: string,
  removeImports = false,
  autoInsert = false,
  target = "body"
) {
  try {
    let preprocessed = await svelte.preprocess(code, preprocessorList, {
      filename,
    });
    if (!preprocessed) {
      return {
        js: "",
        css: "",
        err: [
          {
            start: {
              line: -1,
              column: -1,
            },
            message: "failed to preprocess",
          },
        ],
      };
    }

    let compiled = svelte.compile(preprocessed.toString?.() || "", {});
    let err = compiled.warnings;

    let js: string = compiled.js.code; // convert js imports to browser imports

    if (removeImports) {
      js = js.replace(/import[\w\W]+?";/, "");
    }

    if (autoInsert) {
      // convert component export to global variable
      js = js.replace(
        /\nexport default .+/,
        `
				new Component({
					target: document.querySelector("${target}")
				})
			`
      );
    }
    // get css from compilation
    let css: string = compiled.css.code;
    return { js, css, err };
  } catch (e) {
    return {
      js: "",
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
    };
  }
}
