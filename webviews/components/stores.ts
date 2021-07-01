import { writable } from "svelte/store";

export const vscode = writable<WebviewApi | null>(acquireVsCodeApi());

window.addEventListener("message", (event) => {
  if (event.origin !== "vscode-webview://webviewview-themeswitcher-sidebar") {
    return console.warn(event.origin, "is a bad origin");
  }
});
