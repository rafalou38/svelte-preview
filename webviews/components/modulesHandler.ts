export function transformModulesToBlobURLS(js: { [key: string]: string }) {
  const mainModule = js[""];
  return parse(mainModule, js, "");
}

function parse(code: string, js: { [key: string]: string }, walkUri: string) {
  const regex = /^[^\s*\/]+[\w\s*{},:]+?from\s?["'](.+)["']/gm;
  while (1) {
    let match = regex.exec(code);
    if (match === null) break;

    const imported = js[walkUri + ">" + match[1]];
    if (imported) {
      const uri = parse(imported, js, walkUri + ">" + match[1]);

      code = code.replace(match[1], uri);
    }
  }
  return globify(code);
}

function globify(str: string) {
  return URL.createObjectURL(
    new Blob([str], { type: "application/javascript" })
  );
}
