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
import { readFileSync } from "fs";
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
  err:
    | Warning[]
    | {
        start: {
          line: any;
          column: any;
        };
        message: any;
      }[];
}

export async function generate(
  code: string,
  filename: string,
  removeImports = false,
  autoInsert = false,
  target = "body"
) {
  const final: IFinal = {
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
  final.js["svelte/internal"] = svelteCode;
  final.css += result.css || "";

  const regex = /(?:from.*?)"(.+\.svelte)"/g;
  const absFilename = path.isAbsolute(filename)
    ? filename
    : path.resolve(__dirname, filename);

  let match = regex.exec(final.js[""]);

  do {
    const depName = match?.[1];
    if (depName !== undefined) {
      const depPath = path.resolve(path.dirname(absFilename), depName);
      const depResult = await generate(
        readFileSync(depPath).toString(),
        depPath
      );
      if (depResult.err.length !== 0)
        return { js: {}, css: "", err: result.err };

      final.js[depName] = depResult.js[""];
      final.css += depResult.css || "";
    }
  } while ((match = regex.exec(final.js[""])) !== null);

  return final;
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
