import { writable } from "svelte/store";
import type { CompileError } from "./types";

export const vscode = writable<WebviewApi | null>(acquireVsCodeApi());
export const code = writable<{
  js: {
    [key: string]: string;
  };
  css: string;
  err: CompileError[];
  startTime?: number;
} | null>();

export const config = writable({
  center: false,
  activeBg: false,
  bg: "#fff0",
  zoom: "1",
  rollup: false,
});

export const log = writable<
  {
    message: any[];
    level: "info" | "warn" | "error" | "debug" | "trace";
    count: number;
    caller?: string;
  }[]
>([]);

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
    case "iframeLog":
      log.update((oldLog) => {
        if (oldLog[oldLog.length - 1]?.message === event.data.message) {
          oldLog[oldLog.length - 1].count += 1;
          return oldLog;
        }

        return [
          ...oldLog,
          {
            message: event.data.message,
            level: event.data.level,
            count: 1,
            caller: event.data.caller,
          },
        ];
      });
      break;

    default:
      break;
  }
});
