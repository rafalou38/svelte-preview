declare interface WebviewApi {
  getState: () => any;
  postMessage: (message: any, transfer?: any) => any;
  setState: (newState: any) => any;
}

declare function acquireVsCodeApi(): WebviewApi;

declare module "*.svg";
