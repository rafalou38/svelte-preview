declare var acquireVsCodeApi: () => {
  getState: () => any;
  postMessage: (msg: any) => void;
  setState: (newState: any) => void;
};
declare module "rollup-plugin-css-only";
interface IResult {
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
