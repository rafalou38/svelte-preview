let sourceMap: {
  [key: string]: string;
} = {};

export async function transformModulesToBlobURLS(
  js: { [key: string]: string },
  sources: { [key: string]: string }
) {
  sourceMap = {};
  const mainModule = js[""];
  const mainModuleURI = await parse(mainModule, js, sources, "");
  sourceMap[mainModuleURI] = "";
  return {
    mainModuleURI,
    sourceMap,
  };
}

async function parse(
  code: string,
  js: { [key: string]: string },
  sources: { [key: string]: string },
  walkUri: string
) {
  const regex =
    /(?=\s*)(?!\/)(?<=from "|import "|src_value = ")(?<= ").*?(?=")/gm;
  while (1) {
    let match = regex.exec(code);
    if (match === null) break;
    const moduleURI = walkUri + ">" + match[0];
    const imported = js[moduleURI];
    const fileURL = sources[moduleURI];
    if (imported) {
      const globURI = await parse(
        imported,
        js,
        sources,
        walkUri + ">" + match[0]
      );
      sourceMap[globURI] = walkUri + ">" + match[0];
      code = regexReplace(code, match, globURI);
      code.slice();
    } else if (fileURL) {
      const blobURL = await globifyURL(fileURL);
      code = regexReplace(code, match, blobURL);
    }
  }
  return globify(code);
}

function globify(str: string) {
  return URL.createObjectURL(
    new Blob([str], { type: "application/javascript" })
  );
}

async function globifyURL(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

function regexReplace(text: string, match: RegExpExecArray, content: string) {
  return (
    text.slice(0, match.index) +
    content +
    text.slice(match.index + match[0].length)
  );
}
