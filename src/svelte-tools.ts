import * as vscode from "vscode";
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
import { existsSync, readFileSync, writeFileSync } from "fs";
import { locateNodeModules, statSyncIfExists } from "./utils";
import { IResult } from "./ambient";
import ts from "typescript";
import JSON5 from "json5";
import acorn from "acorn";
import * as astWalk from "acorn-walk";
const globToRegExp = require("glob-to-regexp");

let svelteCodePath = "";

const preprocessorList = [
  scss({}),
  typescript({
    reportDiagnostics: false,
  }),
  babel({}),
  coffeescript({}),
  less({}),
  sass({}),
  stylus({}),
];

let final: IResult;
let modulesCache: Map<string, string>;

export async function generate(
  webview: vscode.Webview,
  code: string,
  filename: string,
  nodeModules?: string,
  removeImports = false,
  autoInsert = false,
  target = "body"
): Promise<IResult> {
  modulesCache = new Map();
  final = {
    js: {},
    css: "",
    err: [],
    sourceMap: {},
    sources: {},
  };

  const result = await compile(
    code,
    filename,
    removeImports,
    autoInsert,
    target
  );

  // if (result.err.length !== 0)
  //   return { js: {}, css: "", err: result.err, sourceMap: {}, sources: {} };

  final.sourceMap[""] = filename;
  final.js[""] = result.js;
  final.err.push(...result.err);
  // final.sourceMap[">svelte/internal"] = "svelte/internal";
  // final.js[">svelte/internal"] = svelteCode;
  final.css += result.css || "";

  if (result.js) {
    // Find Node modules
    nodeModules = locateNodeModules(filename);
    const uri = "";
    let error = await walk(
      result.js,
      filename,
      nodeModules,
      uri,
      transformModule.bind(webview)
    );
    if (error && error.code === "MODULE_NOT_FOUND") {
      return {
        js: {},
        sources: {},
        css: "",
        err: [
          {
            message: `module not found: ${error.value}`,
            start: {
              line: 0,
              column: 0,
            },
          },
        ],
        sourceMap: {},
      };
    }
  }

  return final;
}

async function transformModule(
  this: vscode.Webview,
  content: string,
  name: string,
  modulePath: string,
  uri: string,
  isNodeModule: boolean
) {
  final.sourceMap[uri] = modulePath;
  // Check if module is already included
  const cached = modulesCache.get(modulePath);
  if (cached) {
    final.js[uri] = cached;
    return;
  } else {
    modulesCache.set(modulePath, uri);
  }

  if (modulePath.endsWith(".svelte")) {
    // Svelte module
    const result = await compile(content, modulePath, false, false);

    final.err = [...final.err, ...result.err];
    final.js[uri] = result.js;
    final.css += result.css || "";
    return result.js;
  } else if (modulePath.endsWith(".js") || modulePath.endsWith(".mjs")) {
    // JS module
    final.js[uri] = content;
    return content;
  } else if (modulePath.endsWith(".ts")) {
    // TS module
    const js = ts.transpileModule(content, {
      compilerOptions: { module: 6, target: 1, strict: false },
    });
    final.js[uri] = js.outputText;
    return js.outputText;
  } else {
    // I think this is for assets, I don't remember xD
    const moduleURI = this.asWebviewUri(vscode.Uri.file(modulePath));
    final.sources[uri] = moduleURI.toString();
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
): Promise<{
  code: string;
  value: string;
} | void> {
  const ast = acorn.parse(content, {
    ecmaVersion: "latest",
    sourceType: "module",
    allowImportExportEverywhere: true,
  });

  const imports: string[] = [];
  astWalk.simple(ast, {
    ImportDeclaration(node: any) {
      imports.push(node.source.value);
    },
    CallExpression(node: any) {
      if (node.callee.name === "require") {
        imports.push(node.arguments[0].value);
      }
    },
    ExportNamedDeclaration(node: any) {
      if (node.source) {
        imports.push(node.source.value);
      }
    },
    ExportAllDeclaration(node: any) {
      if (node.source) {
        imports.push(node.source.value);
      }
    },
    ExportSpecifier(node: any) {
      if (node.source) {
        imports.push(node.source.value);
      }
    },
  });
  for (const depName of imports) {
    let isNodeModule = false;
    let isSource = false;

    let depPath = "";

    // ==> RESOLVE ABSOLUTE PATH OF THE MODULE
    if (depName === "svelte/internal") {
      depPath = svelteCodePath;
    } else if (depName.startsWith(".")) {
      // depName is a relative import, search it
      depPath = path.resolve(path.dirname(filePath), depName);
      const packageJsonPath = path.resolve(depPath, "package.json");
      // If depPath has no extension
      if (!depPath.match(/\.\w+$/)) {
        if (existsSync(depPath + ".js")) {
          depPath += ".js";
        } else if (existsSync(depPath + ".mjs")) {
          depPath += ".mjs";
        } else if (existsSync(depPath + ".ts")) {
          depPath += ".ts";
        } else if (existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(
            readFileSync(packageJsonPath).toString()
          );
          depPath = path.resolve(depPath, packageJson.module);
        } else if (existsSync(path.resolve(depPath, "index.js"))) {
          depPath = path.resolve(depPath, "index.js");
        } else if (existsSync(path.resolve(depPath, "index.ts"))) {
          depPath = path.resolve(depPath, "index.ts");
        } else {
          return {
            code: "NOT_FOUND",
            value: depName,
          };
        }
      }
    } else {
      // Not a relative import
      const alias = check_aliases(depName, filePath);
      if (alias) {
        depPath = alias;
      } else {
        if (!depPath.match(/\.\w+$/)) {
          depPath = path.resolve(nodeModule, depName);
          isNodeModule = true;
        }
      }

      const parentPackage = path.resolve(nodeModule, depName.split("/")[0], "package.json");

      if (existsSync(depPath + ".js")) {
        depPath += ".js";
      } else if (existsSync(depPath + ".ts")) {
        depPath += ".ts";
      } else if (existsSync(path.resolve(depPath, "package.json"))) {
        const packageJsonPath = path.resolve(depPath, "package.json");
        const packageJson = JSON.parse(
          readFileSync(packageJsonPath).toString()
        );
        depPath = path.resolve(
          depPath,
          packageJson.module || packageJson.svelte
        );
      } else if (existsSync(depPath + ".mjs")) {
        depPath += ".mjs";
      } else if (existsSync(path.resolve(depPath, "index.js"))) {
        depPath = path.resolve(depPath, "index.js");
      } else if (existsSync(path.resolve(depPath, "index.ts"))) {
        depPath = path.resolve(depPath, "index.ts");
      } else if (existsSync(parentPackage)) {
        const packageJson = JSON.parse(
          readFileSync(parentPackage).toString()
        );

        if (packageJson.exports) {
          const match = packageJson.exports[depName.replace(/\w+\//, "./")];
          if (match) {
            if (typeof match === 'string') {
              depPath = path.resolve(parentPackage, "..", match);
            } else if (match.default || match.module || match.import || match.require) {
              depPath = path.resolve(parentPackage, "..", match.default || match.module || match.import || match.require);
            }
          }
        }
      }
    }

    const openDoc = vscode.workspace.textDocuments.find(
      (doc) => doc.fileName === depPath
    );
    let depContent = "";
    if (openDoc) {
      depContent = openDoc.getText();
    } else if (statSyncIfExists(depPath)?.isFile()) {
      depContent = readFileSync(depPath).toString();
    } else if (!isSource) {
      return {
        code: "MODULE_NOT_FOUND",
        value: `\u001b[1;91m${depName}\u001b[0m \n(imported by \u001b[1m${filePath.replace(path.resolve(nodeModule, ".."), "")}\u001b[0m)`,
      };
    }
    depContent =
      (await cb(
        depContent,
        depName,
        depPath,
        uri + ">" + depName,
        isNodeModule
      )) || "";

    if (!depContent) {
      return;
    }

    let error = await walk(
      depContent,
      depPath,
      nodeModule,
      uri + ">" + depName,
      cb
    );
    if (error) {
      return error;
    }
  }
}
function removeComments(code: string) {
  return code.replace(/(\/\/.+)|(\/\*[\w\W]*?\*\/)/gm, "");
}
function check_aliases(alias: string, modulePath: string) {
  const nodeModules = locateNodeModules(modulePath);
  if (!nodeModules) return;

  const tsconfigPath = path.join(path.dirname(nodeModules), "tsconfig.json");
  if (!existsSync(tsconfigPath)) {
    if (alias.startsWith("$lib")) {
      const libPath = alias.replace(
        "$lib",
        path.join(path.dirname(nodeModules), "src", "lib")
      );

      if (existsSync(libPath)) return libPath;
    }
    return;
  }

  const tsconfig = JSON5.parse(readFileSync(tsconfigPath).toString());
  const aliases = (tsconfig?.compilerOptions?.paths || {}) as {
    [key: string]: string[];
  };
  let final = "";
  Object.entries(aliases).forEach(([pattern, paths]) => {
    if (alias.match(globToRegExp(pattern))) {
      const importPatern = pattern;
      paths.forEach((e) => {
        let resultPath = alias.replace(
          importPatern.replace("*", ""),
          e.replace("*", "")
        );
        resultPath = path.resolve(
          path.dirname(tsconfigPath),
          tsconfig.baseUrl || ".",
          resultPath
        );
        if (existsSync(resultPath)) {
          final = resultPath;
        } else if (existsSync(resultPath + ".js")) {
          final = resultPath + ".js";
        } else if (existsSync(resultPath + ".cjs")) {
          final = resultPath + ".cjs";
        } else if (existsSync(resultPath + ".ts")) {
          final = resultPath + ".ts";
        } else if (existsSync(resultPath + ".svelte")) {
          final = resultPath + ".svelte";
        }
      });
    }
  });
  return final;
}

export function loadSvelteCode(context: vscode.ExtensionContext) {
  svelteCodePath = path.join(
    context?.extensionPath || "",
    "media",
    "svelte.js"
  );
  // const file = readFileSync(svelteCodePath);
  // svelteCode = file.toString();
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
    let err = compiled.warnings.filter((e) => e.code !== "css-unused-selector");

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
  } catch (e: any) {
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
