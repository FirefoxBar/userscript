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