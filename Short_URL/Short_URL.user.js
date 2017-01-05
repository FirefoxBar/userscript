// ==UserScript==
// @name              Short URL
// @namespace     blog.sylingd.com
// @description     短网址生成器
// @author             ShuangYa
// @include            http://*
// @include            https://*
// @grant               GM_xmlhttpRequest
// @grant               GM_addStyle
// @grant               GM_setClipboard
// @grant               GM_registerMenuCommand
// @run-at              document-end
// @updateURL      https://github.com/FirefoxBar/userscript/raw/master/Short_URL/Short_URL.meta.js
// @downloadURL https://github.com/FirefoxBar/userscript/raw/master/Short_URL/Short_URL.user.js
// @version     1
// ==/UserScript==

(function() {
	//API
	var apis = {
		"sina": function(url, rawParam, callback) {
			GM_xmlhttpRequest({
				"url": 'http://api.t.sina.com.cn/short_url/shorten.json?source=1681459862&url_long=' + encodeURIComponent(url),
				"method": 'GET',
				"onload": function(response) {
					response = JSON.parse(response.responseText);
					callback(rawParam, response[0].url_short);
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
				"onload": function(response) {
					response = JSON.parse(response.responseText);
					callback(rawParam, response.tinyurl);
				}
			});
		},
		"fourhn": function(url, rawParam, callback) {
			GM_xmlhttpRequest({
				"url": 'http://4.hn/?url=' + encodeURIComponent(url),
				"method": 'GET',
  			"headers": {
  			  "X-Requested-With": "XMLHttpRequest"
 				},
				"onload": function(response) {
					response = JSON.parse(response.responseText);
					callback(rawParam, response.url);
				}
			});
		}
	};
	var apiList = {'sina': '新浪', 'baidu': '百度', 'fourhn': '4HN'};
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
		width: 400px;\
		margin: -100px -200px;\
		box-shadow: 0 0 10px #CCC;\
		padding: 15px;\
		box-sizing: border-box;\
		display: none;\
	}\
	.sy_shorturl_main p {\
		margin-bottom: 10px;\
		font-size: 15px;\
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
		width: 260px;\
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
	var main = document.createElement('div');
	main.setAttribute('id', 'sy_shorturl_main');
	main.setAttribute('class', 'sy_shorturl_main');
	document.getElementsByTagName('body')[0].appendChild(main);
	//主要事件调用
	GM_registerMenuCommand('生成短网址', function() {
		var mainDiv = document.getElementById('sy_shorturl_main');
		if (main.getAttribute('data-url') === window.location.href) {
			mainDiv.style.display = "block";
			return;
		}
		mainDiv.innerHTML = '';
		var el = {};
		for (var i in apiList) {
			el[i] = document.createElement('p');
			el[i].setAttribute('class', 'sy_shorturl_p_' + i);
			el[i].innerHTML = apiList[i] + '<input type="text" class="input" placeholder="请稍候"><button type="button" class="sy_btn" disabled>复制</button>';
			mainDiv.appendChild(el[i]);
			apis[i](window.location.href, el[i], function(rawParam, result) {
				if (result === undefined || result === '') {
					rawParam.querySelector('input').value = "生成失败";
				} else {
					rawParam.querySelector('input').value = result;
					rawParam.querySelector('input').addEventListener('focus', function() {
						this.setSelectionRange(0, this.value.length);
					});
					rawParam.querySelector('button').removeAttribute('disabled');
					rawParam.querySelector('button').addEventListener('click', function() {
						GM_setClipboard(this.parentElement.querySelector('input').value);
					});
				}
			});
		}
		var close = document.createElement('p');
		close.innerHTML = '<button type="button" class="sy_btn sy_btn_block">关闭</button>';
		close.querySelector('button').addEventListener('click', function() {
			this.parentElement.parentElement.style.display = "none";
		});
		mainDiv.appendChild(close);
		mainDiv.setAttribute('data-url', window.location.href);
		mainDiv.style.display = "block";
	});
})();