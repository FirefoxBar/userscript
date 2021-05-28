// ==UserScript==
// @name         网易云音乐高音质支持
// @version      4.0@unrelease
// @description  去除网页版网易云音乐仅可播放低音质（96Kbps）的限制，强制播放高音质版本
// @match        *://music.163.com/*
// @include      *://music.163.com/*
// @author       864907600cc
// @icon         https://secure.gravatar.com/avatar/147834caf9ccb0a66b2505c753747867
// @updateURL    https://github.com/FirefoxBar/userscript/raw/163HQ%40unrelease/163_Music_High_Quality_Support/163.Music.HQ.meta.js
// @downloadURL  https://github.com/FirefoxBar/userscript/raw/163HQ%40unrelease/163_Music_High_Quality_Support/163.Music.HQ.user.js
// @run-at       document-start
// @grant        none
// @namespace    http://ext.ccloli.com
// ==/UserScript==

// getTrackURL 源码来自 Chrome 扩展程序 网易云音乐增强器(Netease Music Enhancement) by wanmingtom@gmail.com
// 菊苣这个加密算法你是怎么知道的 _(:3
var getTrackURL = function getTrackURL (dfsId) {
    var byte1 = '3' + 'g' + 'o' + '8' + '&' + '$' + '8' + '*' + '3' +
                '*' + '3' + 'h' + '0' + 'k' + '(' + '2' + ')' + '2';
    var byte1Length = byte1.length;
    var byte2 = dfsId + '';
    var byte2Length = byte2.length;
    var byte3 = [];
    for (var i = 0; i < byte2Length; i++) {
        byte3[i] = byte2.charCodeAt(i) ^ byte1.charCodeAt(i % byte1Length);
    }

    byte3 = byte3.map(function(i) {
        return String.fromCharCode(i);
    }).join('');

    results = CryptoJS.MD5(byte3).toString(CryptoJS.enc.Base64);
    results = results.replace(/\//g, '_').replace(/\+/g, '-');

    // 如果需要修改使用的 cdn，请修改下面的地址
    // 可用的服务器有 ['m1', 'm2', 'p1', 'p2']
    // 使用 p1 或 p2 的 cdn 可解决境外用户无法播放的问题
    var url = 'http://m1.music.126.net/' + results + '/' + byte2 + '.mp3';
    return url;
};

var modifyURL = function modifyURL(data, parentKey) {
    console.log('API 返回了 ' + data.length + ' 首曲目');
    console.log('施放魔法！变变变！');
    data.forEach(function(elem){
        // 部分音乐没有高音质
        if (!parentKey) elem.mp3Url = getTrackURL((elem.hMusic || elem.mMusic || elem.lMusic).dfsId);
        else elem[parentKey].mp3Url = getTrackURL((elem[parentKey].hMusic || elem[parentKey].mMusic || elem.lMusic[parentKey]).dfsId);
    });
    return data;
};

var cachedURL = {};
var qualityNode = null;

// 重新编写脚本，改用 hook super 的形式替换 URL 链接
var originalXMLHttpRequest = window.XMLHttpRequest;

class FakeXMLHttpRequest extends XMLHttpRequest {
    open(...args) { // add requestURL support
        if (args[1].indexOf('/enhance/player/') >= 0) {
            // 对新版 api 请求旧的 api 接口
            this.ping = new FakeXMLHttpRequest();
            this.ping.open('POST', '//music.163.com/api/v2/song/detail', false); // 不使用异步 super 以阻断原 super 请求
            this.ping.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        super.open(...args);
        this.requestURL = args[1];
    }

    send(...args) {
        // 在发起请求前使用客户端 Cookie 以破解版权验证
        if (/album|song|playlist/.test(this.requestURL)) {
            setCookies('os=pc');
        }

        if (this.requestURL.indexOf('/enhance/player/') >= 0 && this.ping) {
            //this.ping.send(arguments[0]);
            this.ping.sendData = args[0];
        }
        super.send(...args);

        // 在发起请求后移除客户端 Cookie 以修复部分页面显示异常的问题
        setTimeout(function(){
            revokeCookies('os=pc');
        }, 0);
    }

    get responseText() {
		try {
			if (this.requestURL.indexOf('/weapi/') < 0 && this.requestURL.indexOf('/api/') < 0) {
				return super.responseText;
			}
			var action = this.requestURL.split(/\/(?:we)?api\//)[1].split('?')[0].split('/');
			var res = JSON.parse(super.responseText);

			switch (action[0]) {
				case 'album':
					modifyURL(res.album.songs);
					return JSON.stringify(res);

				case 'song':
					if (action[1] !== 'detail') {
						if (action[1] !== 'enhance' && action[2] !== 'player' && action[3] !== 'url') {
							return super.responseText;
						}

						var type = res.data[0].encodeType || res.data[0].type;
						// 跟踪了下调用栈，云音乐前端的代码只处理了 mp3 和 m4a 两种情况，并没有考虑 flac，
						// 而其实各大浏览器都是支持 flac 的，但是没处理也很正常，毕竟……正常情况下不可能会有 flac 的
						// 把 API 返回的文件类型改为 m4a 绕过前端验证
						if (res.data[0].type === 'flac') {
							res.data[0].type = 'm4a';
						}

						// 给黄易节省带宽，优先调用缓存的 URL
						if (cachedURL[res.data[0].id] && new Date() < cachedURL[res.data[0].id].expires) {
							res.data[0].url = cachedURL[res.data[0].id].url;
							delete this.ping;
							if (qualityNode) {
								qualityNode.textContent = Math.round(cachedURL[res.data[0].id].quality / 1000) + 'K ' + (type || '').toUpperCase();
							}
							return JSON.stringify(res);
						}

						// 缓存超时了再用新的 URL
						// 其实实际 CDN 超时实践并不是那个 `expi`，而是 URL 的 path 的第一个字段
						// 不过不知道后期会不会改变，以及这个 path 的时间戳可能是基于 GMT+8
						// 为了减少复杂度，就用 `expi` 了，不过实际上真正的可用时间是远高于 `expi` 的

						// 因为新版 API 已经返回的是高音质版本，所以不需要再请求旧的 API
						// 如果返回地址为 null 再尝试获取旧版 API
						if (res.data[0].url) {
							cachedURL[res.data[0].id] = {
								url: res.data[0].url,
								quality: res.data[0].br,
								expires: res.data[0].expi * 1000 + new Date().getTime()
							};
							delete this.ping;
							if (qualityNode) {
								qualityNode.textContent = Math.round((res.data[0].br) / 1000) + 'K ' + (type || '').toUpperCase();
							}
							return JSON.stringify(res);
						}

						if (!cachedURL[res.data[0].id]) { // 若未缓存，且新 API 没有音质再请求原始 api
							console.log('新版 API 未返回 URL，fallback 至旧版 API');
							this.ping.send('c=[{"id":"' + res.data[0].id + '","v":0}]');
							// 因为使用了同步 super 所以请求会被阻塞，下面的代码相当于回调
							// 其实获取到 pingRes 时已经是对本函数的一次执行了，qualityNode 不需要再更改
							var pingRes = JSON.parse(this.ping.responseText);
							var pingResSong = pingRes.songs[0];
							cachedURL[res.data[0].id] = {
								url: pingRes.songs[0].mp3Url,
								quality: (pingResSong.hMusic || pingResSong.h || pingResSong.mMusic || pingResSong.m || pingResSong.lMusic || pingResSong.l).bitrate,
								expires: Infinity // 旧版 API URL 永不超时
							};
						}
						res.data[0].url = cachedURL[res.data[0].id].url;
						return JSON.stringify(res);
					}

					// 这里是处理旧版 API 的部分
					modifyURL(res.songs);
					if (qualityNode) {
						qualityNode.textContent = (res.songs[0].hMusic || res.songs[0].h || res.songs[0].mMusic || res.songs[0].m || res.songs[0].lMusic || res.songs[0].l).bitrate / 1000 + 'K MP3';
					}
					return JSON.stringify(res);

				case 'playlist':
					if (action[1] !== 'detail') {
						return super.responseText;
					}

					modifyURL(res.result.tracks);
					return JSON.stringify(res);

				case 'dj':
					if (action[2] === 'byradio') {
						modifyURL(res.programs, 'mainSong');
						return JSON.stringify(res);
					}
					if (action[2] === 'detail') {
						res.program = modifyURL([res.program], 'mainSong')[0];
						return JSON.stringify(res);
					}
					return super.responseText;

				case 'radio':
					if (action[1] === 'get') {
						modifyURL(res.data);
						return JSON.stringify(res);
					}
					return super.responseText;

				case 'v3':
					switch (action[1]){
						// http://music.163.com/weapi/v3/playlist/detail
						case 'playlist':
							if (action[2] !== 'detail') {
								return super.responseText;
							}

							res.privileges.forEach(function(elem){
								var q = elem.pl || elem.dl || elem.fl || Math.min(elem.maxbr, 320000) || 320000;
								elem.cp = 1;
								elem.st = 0;
								elem.pl = q;
								elem.dl = q;
								elem.fl = q;
							});
							if (res.privileges.length < res.playlist.trackIds.length && res.playlist.trackIds.length === res.playlist.tracks.length) {
								// 对超过 1000 的播放列表补充播放信息（需魔改 core.js）
								for (var i = res.privileges.length; i < res.playlist.trackIds.length; i++) {
									var q = (res.playlist.tracks.h || res.playlist.tracks.m || res.playlist.tracks.l || res.playlist.tracks.a).br || 320000;
									res.privileges.push({
										cp: 1,
										cs: false,
										dl: q,
										fee: 0,
										fl: q,
										id: res.playlist.trackIds[i].id,
										maxbr: q,
										payed: 0,
										pl: q,
										sp: 7,
										st: 0,
										subp: 1
									});
								}
							}
							return JSON.stringify(res);

						case 'song':
							if (action[2] !== 'detail') {
								return super.responseText;
							}

							res.privileges.forEach(function(elem){
								var q = elem.pl || elem.dl || elem.fl || Math.min(elem.maxbr, 320000) || 320000;
								elem.st = 0;
								elem.pl = q;
								elem.dl = q;
								elem.fl = q;
							});
							return JSON.stringify(res);

						default:
							return super.responseText;
					}
					break;
				case 'v2':
					switch (action[1]){
						// http://music.163.com/api/v2/song/detail
						// PC 端 API，破解版权，备用
						case 'song':
							if (action[2] !== 'detail') return super.responseText;
							var res = JSON.parse(super.responseText);

							console.log(res);

							res.songs.forEach(function(elem){
								if (elem.h) {
									elem.hMusic = {
										bitrate: elem.h.br,
										dfsId: elem.h.fid,
										size: elem.h.size
									}
								}
								if (elem.m) {
									elem.mMusic = {
										bitrate: elem.m.br,
										dfsId: elem.m.fid,
										size: elem.m.size
									}
								}
								if (elem.l) {
									elem.lMusic = {
										bitrate: elem.l.br,
										dfsId: elem.l.fid,
										size: elem.l.size
									}
								}
								if (elem.a) {
									elem.audition = {
										bitrate: elem.a.br,
										dfsId: elem.a.fid,
										size: elem.a.size
									}
								}
							});
							modifyURL(res.songs);

							if (qualityNode) {
								qualityNode.textContent = (res.songs[0].hMusic || res.songs[0].mMusic || res.songs[0].lMusic).bitrate / 1000 + 'K MP3';
							}
							// res.songs.forEach(function(elem){
							//     delete elem.hMusic;
							//     delete elem.mMusic;
							//     delete elem.lMusic;
							//     delete elem.audition;
							//     delete elem.mp3URL;
							// });

							return JSON.stringify(res);
						default:
							return super.responseText;
					}
					break;
				default:
					return super.responseText;
			}
		}
		catch (error) {
			// 以防 api 转换失败也能正常返回数据
			console.error('转换出错！', error);
			return super.responseText;
		}
	}
}

window.XMLHttpRequest = FakeXMLHttpRequest;

// 旧版 API 大部分曲目失效，故 hook 加密函数以获取新版 API 的高音质版本
var original_asrsea;
var fake_asrsea = function(){
    var data = JSON.parse(arguments[0]);
    if (data.br && data.br === 128000) {
        data.br = 320000;
        arguments[0] = JSON.stringify(data);
    }
    if (data.level === 'standard') {
        data.level = 'exhigh'; // 'lossless';
        arguments[0] = JSON.stringify(data);
    }
    //console.log(arguments);
    return original_asrsea.apply(window, arguments);
};
if (window.asrsea) {
    original_asrsea = window.asrsea;
    window.asrsea = fake_asrsea;
}
else {
    Object.defineProperty(window, 'asrsea', {
        get: function(){
            return fake_asrsea;
        },
        set: function(val) {
            original_asrsea = val;
        }
    });
}


var quailtyInsertHandler = function() {
    var target = document.querySelector('.m-pbar');
    if (target) {
        qualityNode = document.createElement('span');
        qualityNode.style.cssText = 'color: #797979; position: absolute; top: 0px; right: 31px; text-shadow: 0 1px 0 #171717; line-height: 28px;';
        target.parentElement.insertBefore(qualityNode, target);
    }

    document.removeEventListener('DOMContentLoaded', quailtyInsertHandler, false);
};

document.addEventListener('DOMContentLoaded', quailtyInsertHandler, false);

// 使用客户端 Cookie 破解版权限制

var setCookies = function(cookies) {
    var cookieList = cookies.split(/;\s*?/);
    if (cookieList.length < 1) return;
    for (var i = 0; i < cookieList.length; i++) {
        document.cookie = cookieList[i];
    }
};

var revokeCookies = function(cookies) {
    var cookieList = cookies.split(/;\s*?/);
    if (cookieList.length < 1) return;
    for (var i = 0; i < cookieList.length; i++) {
        document.cookie = cookieList[i] + '; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    }
};

//setCookies('os=pc; osver=Microsoft-Windows-10-Professional-build-10586-64bit; appver=2.0.3.131777; channel=netease')