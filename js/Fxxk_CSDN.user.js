// ==UserScript==
// @name Fxxk CSDN
// @version 2
// @description CSDN自动展开
// @include https://blog.csdn.net/*
// @author ShuangYa
// @run-at document-end
// @namespace http://blog.sylingd.com
// @updateURL https://userscript.firefoxcn.net/js/Fxxk_CSDN.meta.js
// @downloadURL https://userscript.firefoxcn.net/js/Fxxk_CSDN.user.js
// ==/UserScript==
if (!document.querySelector('.hide-article-box')) {
	return;
}
document.querySelectorAll('.article_content').forEach(it => it.style.height = "auto");
document.querySelector('.hide-article-box').remove();