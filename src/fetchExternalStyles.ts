import { existsSync, readFileSync } from "fs";

export function fetchExternalStyles(
  styles: {
    enabled: boolean;
    link: string;
  }[]
) {
  let css = "";
  for (const style of styles) {
    if (style.link.startsWith("http")) continue;
    if (existsSync(style.link)) {
      css += readFileSync(style.link).toString();
    }
  }
  return css;
}
