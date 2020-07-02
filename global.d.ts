declare module '*.css' {
  const locals: any;
  export {
    locals
  };
}

declare function GM_addStyle(css: string): void;
declare function GM_xmlhttpRequest(details: GM.Request): void;

declare function GM_registerMenuCommand(caption: string, commandFunc: () => void, accessKey?: string): void;