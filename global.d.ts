declare module '*.css' {
  const locals: any;
  export {
    locals
  };
}

declare const GM_info: {
  script: {
    name: string;
    namespace?: string;
    description: string;
    'run-at': 'document-start' | 'document.end';
    version?: string;
    includes: string[];
    excludes: string[];
    matches: string[];
    /* 包含所有资源和其对应的地址的对象 (自 GM 1.2)。 */
    resources: any[];
    unwrap: boolean;
  }
  scriptMetaStr: string;
  scriptWillUpdate: boolean;
  version: string;
  scriptHandler?: string;
}

/**
 * 插入样式
 * 该函数用于插入一段 CSS 到当前页面
 * @param {string} css CSS样式
 */
declare function GM_addStyle(css: string): void;
/**
 * XHR请求
 * 该函数主要用于实现跨域传输信息调用，如从 www.example.com 请求 upload.example.com 的内容
 * @param {GM.Request} details 请求详情
 */
declare function GM_xmlhttpRequest(details: GM.Request): void;

/**
 * 注册菜单
 * @param {string} caption 标题
 * @param {() => void} commandFunc 回调
 * @param {string} accessKey 菜单界面的热键；一个单子节符号，一般为项目标题中的一个字
 */
declare function GM_registerMenuCommand(caption: string, commandFunc: () => void, accessKey?: string): void;

/**
 * 读取数据
 * 该函数用于获取脚本之前使用 GM_setValue 赋值储存的数据，可以为 String、Boolean 等类型
 * @param {string} name 名称
 * @param {string | boolean | number} defaultValue 默认值
 */
declare function GM_getValue<T = string | boolean | number>(name: string, defaultValue?: T): T;
/**
 * 写入数据
 * 该函数用于写入一些数据并储存，可使用 GM_getValue 获取储存的数据。String、Boolean 等类型
 * @param {string} name 名称
 * @param {string | boolean | number} value 内容
 */
declare function GM_setValue(name: string, value: string | boolean | number);
/**
 * 删除数据
 * @param {string} name 名称
 */
declare function GM_deleteValue(name: string);
/**
 * 获取所有已写入数据的名称
 * @returns string[]
 */
declare function GM_listValues(): string[];

/**
 * 获取资源（文本）
 * 该函数用于获取定义的 @resource 的元属性值
 * @param {string} resourceName 资源名称
 */
declare function GM_getResourceText(resourceName: string): string;
/**
 * 获取资源（文本）
 * 该函数用于获取定义的 @resource 所指向的内容
 * @param {string} resourceName 资源名称
 */
declare function GM_getResourceURL(resourceName: string): string;


/**
 * 打开新标签页
 * @param {string} url 在新标签页开启的地址
 * @param {boolean} loadInBackground 是否后台开启目标标签页; 默认为 true，即后台开启
 */
declare function GM_openInTab(url: string, loadInBackground?: boolean): Window;

/**
 * 设置剪贴板
 * @param {string} text 任意文本
 */
declare function GM_setClipboard(text: string);
