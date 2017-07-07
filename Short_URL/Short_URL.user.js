// ==UserScript==
// @name              Short URL
// @namespace         blog.sylingd.com
// @description       短网址生成器
// @author            ShuangYa
// @include           http://*
// @include           https://*
// @grant             GM_xmlhttpRequest
// @grant             GM_addStyle
// @grant             GM_setClipboard
// @grant             GM_registerMenuCommand
// @connect           *
// @run-at            document-end
// @updateURL         https://github.com/FirefoxBar/userscript/raw/master/Short_URL/Short_URL.meta.js
// @downloadURL       https://github.com/FirefoxBar/userscript/raw/master/Short_URL/Short_URL.user.js
// @version           12
// ==/UserScript==

(function() {
	//forEach兼容
	if (!NodeList.prototype.forEach) {
		NodeList.prototype.forEach = function(callback, thisArg) {
			[].forEach.call(this, callback);
		};
	}
	//API
	var apis = {
		"sina": function(url, rawParam, callback) {
			GM_xmlhttpRequest({
				"url": 'http://api.t.sina.com.cn/short_url/shorten.json?source=1681459862&url_long=' + encodeURIComponent(url),
				"method": 'GET',
				"timeout": 2000,
				"onload": function(response) {
					response = JSON.parse(response.responseText);
					callback(rawParam, response[0].url_short);
				},
				"ontimeout": function() {
					callback(rawParam, '');
				}
			});
		},
		"baidu": function(url, rawParam, callback) {
			GM_xmlhttpRequest({
				"url": 'http://dwz.cn/create.php',
				"method": 'POST',
				"data": 'url=' + encodeURIComponent(url),
  				"headers": {
  			  		"Content-Type": "application/x-www-form-urlencoded"
 				},
				"timeout": 2000,
				"onload": function(response) {
					response = JSON.parse(response.responseText);
					callback(rawParam, response.tinyurl);
				},
				"ontimeout": function() {
					callback(rawParam, '');
				}
			});
		},
		"ni2": function(url, rawParam, callback) {
			GM_xmlhttpRequest({
				"url": 'http://ni2.org/api/create.json',
				"method": 'POST',
				"data": 'url=' + encodeURIComponent(url),
  				"headers": {
  			  		"Content-Type": "application/x-www-form-urlencoded"
 				},
				"timeout": 2000,
				"onload": function(response) {
					response = JSON.parse(response.responseText);
					callback(rawParam, response.url);
				},
				"ontimeout": function() {
					callback(rawParam, '');
				}
			});
		},
		"suoim": function(url, rawParam, callback) {
			GM_xmlhttpRequest({
				"url": 'http://suo.im/api.php?format=json&url=' + encodeURIComponent(url),
				"method": 'GET',
				"timeout": 2000,
				"onload": function(response) {
					response = JSON.parse(response.responseText);
					callback(rawParam, response.url);
				},
				"ontimeout": function() {
					callback(rawParam, '');
				}
			});
		},
		"fiftyr": function(url, rawParam, callback) {
			GM_xmlhttpRequest({
				"url": 'http://50r.cn/urls/add.json?url=' + encodeURIComponent(url),
				"method": 'GET',
				"timeout": 2000,
				"onload": function(response) {
					response = JSON.parse(response.responseText);
					callback(rawParam, response.url);
				},
				"ontimeout": function() {
					callback(rawParam, '');
				}
			});
		},
		"sixdu": function(url, rawParam, callback) {
			GM_xmlhttpRequest({
				"url": 'http://6du.in/?is_api=1&lurl=' + encodeURIComponent(url),
				"method": 'GET',
				"timeout": 2000,
				"onload": function(response) {
					callback(rawParam, response.responseText);
				},
				"ontimeout": function() {
					callback(rawParam, '');
				}
			});
		}
	};
	var apiList = {'sina': '新浪', 'baidu': '百度', 'ni2': 'NI2', 'suoim': '缩我', 'fiftyr': '50r', 'sixdu': '六度'};
	//界面
	var css = '\
	.sy_shorturl_main {\
		position: fixed;\
		top: 50%;\
		left: 50%;\
		background-color: #FFF;\
		border: 1px solid #CCC;\
		border-radius: 5px;\
		height: 200px;\
		width: 660px;\
		margin: -100px -330px;\
		box-shadow: 0 0 10px #CCC;\
		padding: 15px;\
		box-sizing: border-box;\
		display: none;\
		z-index: 9999;\
		color: #000;\
	}\
	.sy_shorturl_main .sy_item {\
		width: 314px;\
		margin-bottom: 10px;\
		font-size: 15px;\
		display: inline-block;\
	}\
	.sy_shorturl_main .sy_name {\
		display: inline-block;\
		width: 40px;\
	}\
	.sy_shorturl_main .sy_btn {\
		display:inline-block;\
		padding:6px 12px;\
		font-size:14px;\
		vertical-align:middle;\
		touch-action:manipulation;\
		cursor:pointer;\
		user-select:none;\
		border:1px solid transparent;\
		border-radius:4px;\
		color:#fff;\
		background-color:#428bca;\
		border-color:#357ebd;\
		text-align: center;\
		background-image: none;\
		box-sizing: border-box;\
	}\
	.sy_shorturl_main .sy_btn:hover,\
	.sy_shorturl_main .sy_btn:active {\
		color:#fff;\
		background-color:#3071a9;\
		border-color:#285e8e;\
	}\
	.sy_shorturl_main .sy_btn:active {\
		box-shadow:inset 0 3px 5px rgba(0,0,0,.125)\
	}\
	.sy_shorturl_main .sy_btn[disabled],\
	.sy_shorturl_main .sy_btn[disabled]:hover,\
	.sy_shorturl_main .sy_btn[disabled].active {\
		background-color:#428bca;\
		border-color:#357ebd;\
		pointer-events:none;\
		cursor:not-allowed;\
		box-shadow:none;\
		opacity:.65;\
	}\
	.sy_btn_block {\
		display: block;\
		width: 100%;\
	}\
	.sy_shorturl_main .input {\
		display: inline-block;\
		width: 200px;\
		height:34px;\
		padding:6px 12px;\
		font-size:14px;\
		line-height:1.42857143;\
		color:#555;\
		background-color:#fff;\
		background-image:none;\
		border:1px solid #ccc;\
		border-radius:4px;\
		box-shadow:inset 0 1px 1px rgba(0,0,0,.075);\
		transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;\
		box-sizing: border-box;\
		vertical-align:middle;\
		margin-left: 5px;\
		margin-right: 5px;\
	}\
	.sy_shorturl_main .input:focus {\
		border-color:#66afe9;\
		outline:0;\
		box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)\
	}';
	GM_addStyle(css);
	var body = document.getElementsByTagName('body')[0];
	var main = document.createElement('div');
	main.setAttribute('id', 'sy_shorturl_main');
	main.setAttribute('class', 'sy_shorturl_main');
	body.appendChild(main);
	//主要事件调用
	var createUrl = function(url) {
		if (typeof(url) !== 'string') {
			url = window.location.href;
		}
		var mainDiv = document.getElementById('sy_shorturl_main');
		if (main.getAttribute('data-url') === url) {
			mainDiv.style.display = "block";
			return;
		}
		mainDiv.innerHTML = '';
		var el = {};
		for (var i in apiList) {
			el[i] = document.createElement('div');
			el[i].setAttribute('class', 'sy_item');
			el[i].innerHTML = '<span class="sy_name">' + apiList[i] + '</span><input type="text" class="input" placeholder="请稍候"><button type="button" class="sy_btn" disabled>复制</button>';
			mainDiv.appendChild(el[i]);
			apis[i](url, el[i], function(rawParam, result) {
				if (result === undefined || result === '') {
					rawParam.querySelector('input').value = "生成失败";
				} else {
					rawParam.querySelector('input').value = result;
					rawParam.querySelector('input').addEventListener('focus', function() {
						this.setSelectionRange(0, this.value.length);
					}, false);
					rawParam.querySelector('button').removeAttribute('disabled');
					rawParam.querySelector('button').addEventListener('click', function() {
						GM_setClipboard(this.parentElement.querySelector('input').value);
					}, false);
				}
			});
		}
		var close = document.createElement('div');
		close.innerHTML = '<button type="button" class="sy_btn sy_btn_block">关闭</button>';
		close.querySelector('button').addEventListener('click', function() {
			this.parentElement.parentElement.style.display = "none";
		});
		mainDiv.appendChild(close);
		mainDiv.setAttribute('data-url', url);
		mainDiv.style.display = "block";
	};
	//绑定按钮啥的
	GM_registerMenuCommand('生成短网址', createUrl);
	//HTML5添加网页右键菜单
	//检查浏览器是否支持HTML5右键菜单，目前只有Firefox支持此属性
	var support_rclick = function() {
		if (!/Firefox\/(\d+)/.test(navigator.userAgent)) {
			return false;
		}
		return parseInt(navigator.userAgent.match(/Firefox\/(\d+)/)[1]) > 9;
	};
	if (window.top === window.self && window.location.href !== '' && support_rclick()) {
		var rclickMenu;
		if (body.getAttribute('contextmenu') === null) {
			body.setAttribute('contextmenu','popup-menu');
			rclickMenu = document.createElement('menu');
			rclickMenu.setAttribute('type','context');
			rclickMenu.setAttribute('id', 'popup-menu');
			body.appendChild(rclickMenu);
		} else {
			rclickMenu = document.getElementById(body.getAttribute('contextmenu'));
		}
		var imenu = document.createElement('menuitem');
		imenu.setAttribute("id", 'sy_shorturl');
		imenu.setAttribute('label', '生成短网址');
		imenu.innerHTML = '生成短网址';
		rclickMenu.appendChild(imenu);
		imenu.addEventListener("click", createUrl, false);
		//为a标签添加快速生成的功能
		var aRclickMenu = document.createElement('menu');
		aRclickMenu.setAttribute('type','context');
		aRclickMenu.setAttribute('id', 'a-popup-menu');
		body.appendChild(aRclickMenu);
		var aImenu = document.createElement('menuitem');
		aImenu.setAttribute("id", 'sy_shorturl_a');
		aImenu.setAttribute('label', '为此链接生成短网址');
		aImenu.innerHTML = '为此链接生成短网址';
		aRclickMenu.appendChild(aImenu);
		aImenu.addEventListener("click", function(){
			var url = this.getAttribute('data-url');
			//对于相对路径，先拼接完整路径
			if (url.indexOf('/') === 0) {
				url = window.location.href.match(/(.*?):\/\/(.*?)\//)[0] + url.substr(1);
			} else {
				url = [window.location.protocol, '//', window.location.hostname, window.location.pathname.match(/(.*)\//)[0], url].join('');
			}
			createUrl(url);
		}, false);
		document.querySelectorAll('a').forEach(function(element) {
			var url = element.getAttribute('href');
			if (url === null) {
				return;
			}
			if (/^(.*?):/.test(url)) {
				//部分特殊链接（例如磁力链接、应用链接等）不进行生成
				if (url.substr(0, 7) !== 'http://' && url.substr(0, 8) !== 'https://' && url.substr(0, 6) !== 'ftp://') {
					return;
				}
			}
			element.setAttribute('contextmenu','a-popup-menu');
			element.addEventListener('contextmenu', function() {
				aImenu.setAttribute('data-url', this.getAttribute('href'));
			}, false);
		});
	}
})();