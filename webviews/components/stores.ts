import { writable } from "svelte/store";
import type { CompileError, ExternalElement } from "./types";

export const vscode = writable<WebviewApi | null>(acquireVsCodeApi());
export const code = writable<{
  js: {
    [key: string]: string;
  };
  /** images, videos... */
  sources: {
    [key: string]: string;
  };
  css: string;
  err: CompileError[];
  startTime?: number;
} | null>();

export const InternalsourceMap = writable<{
  [key: string]: string;
}>({});
export const sourceMap = writable<{
  [key: string]: string;
}>({});
let sourceMapValue: {
  [key: string]: string;
};

export const CURRENT_VERSION = "2.7.3";
export const panelFullHide = writable(false);
export const config = writable({
  center: false,
  activeBg: false,
  bg: "#fff0",
  zoom: "1",
  rollup: false,
  saveReload: false,
  currentVersion: "0",
  externalElements: [] as ExternalElement[],
});

export const locked = writable(true);

export const preservelog = writable(false);
export const log = writable<
  {
    message: any[];
    level: "info" | "warn" | "error" | "debug" | "trace";
    count: number;
    caller?: string;
  }[]
>([]);

window.addEventListener("message", (event) => {
  if (!event.origin.includes("vscode-webview"))
    console.warn("wrong origin: " + event.origin);

  switch (event.data.type) {
    case "codeUpdate":
      code.set(event.data.value);
      sourceMap.set(event.data.value.sourceMap);
      sourceMapValue = event.data.value.sourceMap;
      break;
    case "setConfig":
      config.set(event.data.value);
      break;
    case "hide-panel-completely":
      panelFullHide.set(event.data.value);
      break;
    case "setLock":
      locked.set(event.data.value);
      break;
    case "iframeLog":
      log.update((oldLog) => {
        if (
          oldLog[oldLog.length - 1]?.message.toString?.() ===
          event.data.message.toString?.()
        ) {
          oldLog[oldLog.length - 1].count += 1;
          return oldLog;
        }
        if (event.data.level === "error") {
          event.data.message[4].stack = applySourceMap(
            event.data.message[4].stack
          );
        }

        return [
          ...oldLog,
          {
            message: event.data.message,
            level: event.data.level,
            count: 1,
            caller: event.data.caller && applySourceMap(event.data.caller),
          },
        ];
      });
      break;

    default:
      break;
  }
});

function applySourceMap(caller: string) {
  try {
    let internalsourceMap: {
      [key: string]: string;
    } = {};
    InternalsourceMap.update((s) => {
      internalsourceMap = s;
      return s;
    });
    const regex = /blob:vscode-webview:.*?(?=:)/;
    while (1) {
      const match = regex.exec(caller);
      if (!match) break;
      const baseUri = match[0] || "";
      let uri = internalsourceMap[baseUri];
      uri = sourceMapValue[uri || ""];
      caller = caller.replace(baseUri, uri);
    }
  } catch (error) { }
  return caller;
}
