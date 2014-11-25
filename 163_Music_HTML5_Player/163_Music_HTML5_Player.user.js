// ==UserScript==
// @name        163 Music HTML5 Player
// @namespace   http://firefoxbar.github.io/#userscripts
// @include     http://music.163.com/*
// @updateURL   https://github.com/FirefoxBar/userscript/raw/master/163_Music_HTML5_Player/163_Music_HTML5_Player.meta.js
// @downloadURL https://github.com/FirefoxBar/userscript/raw/master/163_Music_HTML5_Player/163_Music_HTML5_Player.user.js
// @run-at      document-start
// @author      Palatoo Simple
// @grant       none
// @version     1
// ==/UserScript==

(function () {
    window.NEJ = window.NEJ || {};
    NEJ.P = function (kU) {
        if (!kU || !kU.length) return null;       
        var rD = window;
        for (var a = kU.split('.'), l = a.length, i = a[0] == 'window' ? 1 : 0; i < l; rD = rD[a[i]] = rD[a[i]] || {
        }, i++);
        return rD;
    };
    Object.defineProperty(NEJ.P('nm.x'), "Qx", { 
        get: function() { return function(){ return {supported:false,version:""}} ; }
    });
}) ();