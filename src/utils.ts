import { existsSync } from "fs";
import * as path from "path";

export function locateNodeModules(file: string) {
  for (let index = 0; index < 5; index++) {
    let possiblePath = path.resolve(
      path.dirname(file),
      "../".repeat(index),
      "node_modules"
    );
    if (existsSync(possiblePath)) {
      return possiblePath;
    }
  }
}
