import { Site } from "./var";
import csdn from "./csdn";
import cnblogs from "./cnblogs";
import sina from "./sina";
import netease from "./netease";
import sohu from "./sohu";
import tianya from "./tianya";
import sciencenet from "./sciencenet";
import chinaunix from "./chinaunix";
import juejin from "./juejin";
import zhihu from "./zhihu";

const sites: { [x: string]: Site } = {
  'blog.csdn.net': csdn,
  'www.cnblogs.com': cnblogs,
  'blog.sina.com.cn': sina,
  'blog.163.com': netease,
  'blog.sohu.com': sohu,
  'blog.tianya.cn': tianya,
  'blog.sciencenet.cn': sciencenet,
  'blog.chinaunix.net': chinaunix,
  'juejin.im': juejin,
  'zhuanlan.zhihu.com': zhihu
}

function getHost() {
  const hostname = window.location.hostname;
  if (typeof sites[hostname] !== 'undefined') {
    return hostname;
  }
  const domains = Object.values(sites);
  for (const it in domains) {
    if (hostname.includes(it)) {
      return it;
    }
  }
  return '';
}

const host = getHost();

export function has() {
  return typeof sites[host] !== 'undefined';
}

export function get() {
  const domain = host;
  const result = {
    title: '',
    content: ''
  };
  if (has()) {
    result.title = sites[domain].getTitle();
    result.content = sites[domain].getContent();
  }
  return result;
}