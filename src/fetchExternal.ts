import { existsSync, readFileSync } from "fs";
import { ExternalElement } from "./ambient";

export function fetchExternal(
  items: ExternalElement[]
) {
  // Load content if it is a local file.
  let content = "";
  for (const item of items) {
    if (!item.enabled || item.link.startsWith("http")) continue;
    if (existsSync(item.link)) {
      content += readFileSync(item.link).toString();
    }
  }
  return content;
}
