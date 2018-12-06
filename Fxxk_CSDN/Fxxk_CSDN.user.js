// ==UserScript==
// @name Fxxk CSDN
// @namespace http://blog.sylingd.com
// @version 1
// @description CSDN自动展开
// @author ShuangYa
// @include https://blog.csdn.net/*
// @run-at document-end
// @updateURL https://github.com/FirefoxBar/userscript/raw/master/Fxxk_CSDN/Fxxk_CSDN.meta.js
// @downloadURL https://github.com/FirefoxBar/userscript/raw/master/Fxxk_CSDN/Fxxk_CSDN.user.js
// ==/UserScript==

if (!document.querySelector('.hide-article-box')) {
	return;
}
document.getElementById('article_content').style.height = "auto";
document.querySelector('.hide-article-box').remove();