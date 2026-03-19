// ==UserScript==
// @name Bilibili No Autoplay
// @version 1
// @description 禁用B站视频播放完后自动下一集
// @include https://www.bilibili.com/*
// @author ShuangYa
// @namespace http://blog.sylingd.com
// @updateURL https://userscript.firefoxcn.net/js/Bilibili_No_Autoplay.meta.js
// @downloadURL https://userscript.firefoxcn.net/js/Bilibili_No_Autoplay.user.js
// ==/UserScript==
const m = new MutationObserver(() => {
  const e = document.querySelector('.bpx-player-ending-related-item-cancel');
  if (e && getComputedStyle(e).display !== 'none') {
    e.click();
  }
});

m.observe(document.body, { subtree: true, childList: true });