import { compile as sveltecompile } from "svelte/compiler";

let svelteCode = "";

export async function compile(
  code: string,
  removeImports = false,
  autoInsert = false,
  target = "body"
) {
  try {
    let compiled = sveltecompile(code);
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
      err: [{ ...e, message: e.name }],
    };
  }
}
