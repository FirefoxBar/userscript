// ==UserScript==
// @name Fxxk CSDN
// @version 3
// @description CSDN自动展开
// @include https://blog.csdn.net/*
// @grant GM_addStyle
// @author ShuangYa
// @run-at document-end
// @namespace http://blog.sylingd.com
// @updateURL https://userscript.firefoxcn.net/js/Fxxk_CSDN.meta.js
// @downloadURL https://userscript.firefoxcn.net/js/Fxxk_CSDN.user.js
// ==/UserScript==
GM_addStyle('#csdn-redpack, .toolbar-advert { display: none !important; }');

const hide = document.querySelector('.hide-article-box');
if (hide) {
  Array.prototype.forEach.call(document.querySelectorAll('.article_content'), it => it.style.height = "auto");
  hide.remove();
}

const observer = new MutationObserver(() => {
  const loginBox = document.querySelector('.passport-login-container');
  if (loginBox) {
    loginBox.remove();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});