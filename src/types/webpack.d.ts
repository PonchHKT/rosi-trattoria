declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module NodeJS {
  interface Require {
    context(path: string, deep?: boolean, filter?: RegExp): {
      keys(): string[];
      <T>(id: string): T;
      (id: string): any;
      resolve(id: string): string;
      id: string;
    };
  }
}
