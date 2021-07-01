export interface CompileError {
  code: string;
  end: {
    line: number;
    column: number;
    character: number;
  };
  start: {
    line: number;
    column: number;
    character: number;
  };
  filename: string | undefined;
  message: string;
  pos: number;
}
