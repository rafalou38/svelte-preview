declare module "svelte-json-tree";

declare interface WebviewApi {
  getState: () => any;
  postMessage: (
    message: {
      type: string | "onInfo" | "onError";
      value: any;
    },
    transfer?: any
  ) => any;
  setState: (newState: any) => any;
}

declare function acquireVsCodeApi(): WebviewApi;

declare module "*.svg";
