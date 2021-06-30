import { compile as sveltecompile } from "svelte/compiler";
import * as path from "path";
import { ExtensionContext } from "vscode";
import { readFileSync } from "fs";

export interface CompileError {
  code: string;
  end: {
    line: number;
    column: number;
    character: number;
  };
  start: {
    line: number;
    column: number;
    character: number;
  };
  filename: string | undefined;
  message: string;
  pos: number;
}

let svelteCode = "";

export async function compile(
  code: string,
  remove_imports = false,
  autoInsert = false,
  target = "body"
) {
  try {
    let compiled = sveltecompile(code);
    let err = compiled.warnings as CompileError[];
    // get js from compilation

    let js: string = compiled.js.code; // convert js imports to browser imports

    if (remove_imports) {
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
      err: [],
    };
  }
}
