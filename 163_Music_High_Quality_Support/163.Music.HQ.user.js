// ==UserScript==
// @name         网易云音乐高音质支持
// @version      3.2.1@unrelease
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
        if (!parentKey) elem.mp3Url = getTrackURL(elem.hMusic ? elem.hMusic.dfsId : elem.mMusic ? elem.mMusic.dfsId : elem.lMusic.dfsId);
        else elem[parentKey].mp3Url = getTrackURL(elem[parentKey].hMusic ? elem.hMusic[parentKey].dfsId : elem[parentKey].mMusic ? elem.mMusic[parentKey].dfsId : elem.lMusic[parentKey].dfsId);
    });
    return data;
};

var cachedURL = {};
var qualityNode = null;

// 重新编写脚本，改用 hook xhr 的形式替换 URL 链接
var originalXMLHttpRequest = window.XMLHttpRequest;
var fakeXMLHttpRequest = function(){
    var __this__ = this;
    var xhr = new originalXMLHttpRequest();
    var xhrProto = xhr.constructor.prototype;

    Object.keys(xhrProto).forEach(function(elem){
    	if (elem in __this__) return;
        if (elem === 'responseText') return;

        if (typeof xhr[elem] === 'function') {
            if (elem === 'open') { // add requestURL support
                __this__[elem] = function(){
                    if (arguments[1].indexOf('/enhance/player/') >= 0) {
                        // 对新版 api 请求旧的 api 接口
                        __this__.ping = new fakeXMLHttpRequest();
                        __this__.ping.open('POST', 'http://music.163.com/api/v2/song/detail', false); // 不使用异步 xhr 以阻断原 xhr 请求
                        __this__.ping.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    }
                    xhr[elem].apply(xhr, arguments);
                    __this__.requestURL = arguments[1];
                };
            }
            else if (elem === 'send') { // add requestURL support
                __this__[elem] = function(){
                    // 在发起请求前使用客户端 Cookie 以破解版权验证
                    if (/album|song|playlist/.test(__this__.requestURL)) {
                        setCookies('os=pc');
                    }

                    if (__this__.requestURL.indexOf('/enhance/player/') >= 0 && __this__.ping) {
                        //__this__.ping.send(arguments[0]);
                        __this__.ping.sendData = arguments[0];
                    }
                    xhr[elem].apply(xhr, arguments);

                    // 在发起请求后移除客户端 Cookie 以修复部分页面显示异常的问题
                    setTimeout(function(){
                        revokeCookies('os=pc');
                    }, 0);
                };
            }
            else {
                __this__[elem] = function(){
                    xhr[elem].apply(xhr, arguments);
                };
            }
        }
        else {
            var property = {};
            var originalProperty = Object.getOwnPropertyDescriptor(xhrProto, elem);
            property.get = function(){ /*console.log(elem);*/ return xhr[elem]; };
            if (originalProperty.set) property.set = function(val){ return xhr[elem] = val; };
            Object.defineProperty(__this__, elem, property);
        }
    });

    Object.defineProperty(__this__, 'responseText', {
        get: function(){
            try {
                if (__this__.requestURL.indexOf('/weapi/') < 0 && __this__.requestURL.indexOf('/api/') < 0) {
                    return xhr.responseText;
                }
                var action = __this__.requestURL.split(/\/(?:we)?api\//)[1].split('?')[0].split('/');
                var res = JSON.parse(xhr.responseText);

                switch (action[0]) {
                    case 'album':
                        modifyURL(res.album.songs);
                        return JSON.stringify(res);
                        
                    case 'song':
                        if (action[1] !== 'detail') {
                            if (action[1] !== 'enhance' && action[2] !== 'player' && action[3] !== 'url') {
                                return xhr.responseText;
                            }

                            // 给黄易节省带宽，优先调用缓存的 URL
                            if (cachedURL[res.data[0].id] && new Date() < cachedURL[res.data[0].id].expires) {
                                res.data[0].url = cachedURL[res.data[0].id].url;
                                delete __this__.ping;
                                if (qualityNode) {
                                    qualityNode.textContent = cachedURL[res.data[0].id].quality / 1000 + 'K';
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
                                delete __this__.ping;
                                if (qualityNode) {
                                    qualityNode.textContent = (res.data[0].br) / 1000 + 'K';
                                }
                                return xhr.responseText;
                            }

                            if (!cachedURL[res.data[0].id]) { // 若未缓存，且新 API 没有音质再请求原始 api
                                __this__.ping.send('c=[{"id":"' + res.data[0].id + '","v":0}]');
                                // 因为使用了同步 xhr 所以请求会被阻塞，下面的代码相当于回调
                                // 其实获取到 pingRes 时已经是对本函数的一次执行了，qualityNode 不需要再更改
                                var pingRes = JSON.parse(__this__.ping.responseText);
                                cachedURL[res.data[0].id] = {
                                    url: pingRes.songs[0].mp3Url,
                                    quality: (res.songs[0].hMusic ? res.songs[0].hMusic.bitrate : res.songs[0].mMusic ? res.songs[0].mMusic.bitrate : res.songs[0].lMusic.bitrate),
                                    expires: Infinity // 旧版 API URL 永不超时
                                };
                            }
                            res.data[0].url = cachedURL[res.data[0].id];
                            return JSON.stringify(res);
                        }
                        
                        // 这里是处理旧版 API 的部分
                        modifyURL(res.songs);
                        if (qualityNode) {
                            qualityNode.textContent = (res.songs[0].hMusic ? res.songs[0].hMusic.bitrate : res.songs[0].mMusic ? res.songs[0].mMusic.bitrate : res.songs[0].lMusic.bitrate) / 1000 + 'K';
                        }
                        return JSON.stringify(res);
                        
                    case 'playlist':
                        if (action[1] !== 'detail') {
                            return xhr.responseText;
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
                        return xhr.responseText;

                    case 'radio':
                        if (action[1] === 'get') {
                            modifyURL(res.data);
                            return JSON.stringify(res);
                        }
                        return xhr.responseText;
                        
                    case 'v3':
                        switch (action[1]){
                            // http://music.163.com/weapi/v3/playlist/detail
                            case 'playlist':
                                if (action[2] !== 'detail') {
                                    return xhr.responseText;
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
                                        var q = res.playlist.tracks.h ? res.playlist.tracks.h.br : res.playlist.tracks.m ? res.playlist.tracks.m.br : res.playlist.tracks.l ? res.playlist.tracks.l.br : res.playlist.tracks.a ? res.playlist.tracks.a.br : 320000;
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
                                    return xhr.responseText;
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
                                return xhr.responseText;
                        }
                        break;
                    case 'v2':
                        switch (action[1]){
                            // http://music.163.com/api/v2/song/detail
                            // PC 端 API，破解版权，备用
                            case 'song':
                                if (action[2] !== 'detail') return xhr.responseText;
                                var res = JSON.parse(xhr.responseText);

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
                                    qualityNode.textContent = (res.songs[0].hMusic ? res.songs[0].hMusic.bitrate : res.songs[0].mMusic ? res.songs[0].mMusic.bitrate : res.songs[0].lMusic.bitrate) / 1000 + 'K';
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
                                return xhr.responseText;
                        }
                        break;
                    default:
                        return xhr.responseText;
                }
            }
            catch (error) {
                // 以防 api 转换失败也能正常返回数据
                console.error('转换出错！', error);
                return xhr.responseText;
            }
        }
    });

    // 轮询当前对象的 prototype，以解决无法获取更高原型链的属性的问题
    var curPrototype = xhrProto;
    while (curPrototype = Object.getPrototypeOf(curPrototype)) {
        Object.keys(curPrototype).forEach(function(elem){
            var property = {};
            var originalProperty = Object.getOwnPropertyDescriptor(curPrototype, elem);
            property.get = function(){ /*console.log(elem);*/ return xhr[elem]; };
            if (originalProperty.set) property.set = function(val){ return xhr[elem] = val; };
            Object.defineProperty(__this__, elem, property);
        });
    }
    
    this.originalXMLHttpRequest = xhr;
};
window.XMLHttpRequest = fakeXMLHttpRequest;

// 旧版 API 大部分曲目失效，故 hook 加密函数以获取新版 API 的高音质版本
var original_asrsea;
var fake_asrsea = function(){
    //console.log(arguments)
    var data = JSON.parse(arguments[0]);
    if (data.br && data.br === 128000) {
        data.br = 320000;
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