// ==UserScript==
// @name Copy all links
// @version 1
// @description 复制所有链接
// @include http://*/*
// @include https://*/*
// @author ShuangYa
// @run-at document-end
// @grant GM_setClipboard
// @grant GM_registerMenuCommand
// @namespace http://blog.sylingd.com
// @updateURL https://userscript.firefoxcn.net/js/Copy_all_links.meta.js
// @downloadURL https://userscript.firefoxcn.net/js/Copy_all_links.user.js
// ==/UserScript==
GM_registerMenuCommand('复制所有链接', function() {
	let result = '';
	Array.prototype.forEach.call(document.querySelectorAll('a'), function(it) {
		if (typeof(it.href) === "string" && it.href != "" && !it.href.startsWith('#')) {
			result += it.href + "\n";
		}
	});
	GM_setClipboard(result, 'text');
	alert('已复制');
});