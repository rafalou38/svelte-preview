import { existsSync, readFileSync } from "fs";
import type { ExternalElement } from "./ambient";

export async function fetchExternal(
  items: ExternalElement[]
) {
  // Load content if it is a local file.
  let content = "";
  for (const item of items) {
    if (!item.enabled) continue;
    else if (item.link.startsWith("http")) {
      try {
        const url = item.link;
        const response = await fetch(url);
        content += await response.text();
      } catch (error) {
      }
    }
    else if (existsSync(item.link)) {
      content += readFileSync(item.link).toString();
    }
  }
  return content;
}
