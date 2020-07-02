declare module '*.css' {
  const content: any;
  export default content;
}

declare function GM_addStyle(css: string): void;
declare function GM_xmlhttpRequest(details: GM.Request): void;

declare function GM_registerMenuCommand(caption: string, commandFunc: () => void, accessKey?: string): void;