// ==UserScript==
// @name Fxxk CSDN
// @version 4
// @description CSDN辅助工具
// @include https://blog.csdn.net/*
// @grant GM_addStyle
// @author ShuangYa
// @run-at document-end
// @namespace http://blog.sylingd.com
// @updateURL https://userscript.firefoxcn.net/js/Fxxk_CSDN.meta.js
// @downloadURL https://userscript.firefoxcn.net/js/Fxxk_CSDN.user.js
// ==/UserScript==
GM_addStyle([
  '#csdn-redpack, .toolbar-advert, #overTheScreen, .hljs-button.signin, #articleSearchTip',
  '{ display: none !important }',
  '#content_views pre, #content_views pre code {',
  '-webkit-touch-callout: default !important;',
  '-webkit-user-select: auto !important;',
  '-khtml-user-select: auto !important;',
  '-moz-user-select: auto !important;',
  '-ms-user-select: auto !important;',
  'user-select: auto !important;',
  '}'
].join(''));

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