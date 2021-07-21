declare var acquireVsCodeApi: () => {
  getState: () => any;
  postMessage: (msg: any) => void;
  setState: (newState: any) => void;
};
declare module "rollup-plugin-css-only";
interface IResult {
  startTime?: number;
  js: {
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
}
