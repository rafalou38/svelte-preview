import { writable } from "svelte/store";
import type { CompileError } from "./types";

export const vscode = writable<WebviewApi | null>(acquireVsCodeApi());
export const code = writable<{
  js: {
    [key: string]: string;
  };
  css: string;
  err: CompileError[];
} | null>();

export const config = writable({
  center: false,
  activeBg: false,
  bg: "#fff0",
  zoom: "1",
});

window.addEventListener("message", (event) => {
  if (!event.origin.startsWith("vscode-webview://"))
    return console.warn("wrong origin: " + event.origin);

  switch (event.data.type) {
    case "codeUpdate":
      code.set(event.data.value);
      break;
    case "setConfig":
      config.set(event.data.value);
      break;

    default:
      break;
  }
});
