import { existsSync, statSync } from "fs";
import * as path from "path";

export function locateNodeModules(file: string) {
  for (let index = 0; index < 10; index++) {
    let possiblePath = path.resolve(
      path.dirname(file),
      "../".repeat(index),
      "node_modules"
    );
    if (existsSync(possiblePath)) {
      return possiblePath;
    }
  }
  return path.resolve(path.dirname(__filename), "..", "node_modules");
}

export function statSyncIfExists(path: string) {
  if (existsSync(path)) {
    return statSync(path);
  }
}
