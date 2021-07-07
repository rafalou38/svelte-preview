export function transformModulesToBlobURLS(js: { [key: string]: string }) {
  const mainModule = js[""];
  return parse(mainModule, js);
}

function parse(code: string, js: { [key: string]: string }) {
  const regex = /(?<=from\s*").+?(?=")/g;
  while (1) {
    let match = regex.exec(code);
    if (match === null) break;

    const imported = js[match[0]];
    if (imported) {
      const uri = parse(imported, js);
      code = code.replace(match[0], uri);
    }
  }
  return globify(code);
}

function globify(str: string) {
  return URL.createObjectURL(
    new Blob([str], { type: "application/javascript" })
  );
}
