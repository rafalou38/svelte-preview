import { Warning } from "svelte/types/compiler/interfaces";

declare var acquireVsCodeApi: () => {
  getState: () => any;
  postMessage: (msg: any) => void;
  setState: (newState: any) => void;
};
interface IResult {
  startTime?: number;
  vars: string[];
  js: {
    [key: string]: string;
  };
  /** images, videos... */
  sources: {
    [key: string]: string;
  };
  css: string;
  err: (
    | Warning
    | {
        start: {
          line: any;
          column: any;
        };
        message: any;
      }
  )[];
  sourceMap: {
    [key: string]: string;
  };
}
