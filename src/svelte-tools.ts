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

export async function compile(
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

    let compiled = svelte.compile(preprocessed.toString?.() || "");
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
