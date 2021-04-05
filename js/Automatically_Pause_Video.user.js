// ==UserScript==
// @name Automatically Pause Video
// @version 0.2
// @description 视频自动播放/暂停
// @include http://www.tudou.com/*
// @include http://www.iqiyi.com/*
// @include http://v.qq.com/*
// @include http://www.letv.com/*
// @include http://v.youku.com/*
// @include http://tv.sohu.com/*
// @include http://vod.xunlei.com/*
// @include http://vod.kankan.com/*
// @include http://pan.baidu.com/play/*
// @include http://www.56.com/*
// @include http://www.bilibili.com/*
// @author 网络中二行客
// @grant none
// @namespace http://tieba.baidu.com/f?kw=firefox
// @updateURL https://userscript.firefoxcn.net/js/Automatically_Pause_Video.meta.js
// @downloadURL https://userscript.firefoxcn.net/js/Automatically_Pause_Video.user.js
// ==/UserScript==
;(function(UW){
	var sites = {
		tudou : function(h){
			h ? UW.playerEx.pause() : 
			UW.playerEx.play();
		},
		bilibili : function(h){
			h ? UW.bilibili-player.pause() : 
			UW.bilibili-player.play();
		},
		iqiyi : function(h){
			h ? UW._player.pause() : 
			UW._player.resume();
		},
		qq : function(h){
			h ? UW.txv.playdata.player.pause() : 
			UW.txv.playdata.player.play();
		},
		letv : function(h){
			h ? UW.__PLAYER__.pause() :
			UW.__PLAYER__.play();
		},
		youku : function(h){
			h ? UW.PlayerPause(1) : 
			UW.PlayerPause(0);
		},
		sohu : function(h){
			h ? UW.sohuHD.getElem('player').pauseVideo() : 
			UW.sohuHD.getElem('player').playVideo();
		},
		xunlei : function(h){
			h ? UW.G_PLAYER_INSTANCE.pause() :
			UW.G_PLAYER_INSTANCE.play();
		},
		kankan : function(h){
			h ? UW.G_PLAYER_INSTANCE.pause() :
			UW.G_PLAYER_INSTANCE.play();
		},
		baidu : function(h){
			h ? UW.disk.ui.VideoPlayer.myFlashPlayer.pause() :
			UW.disk.ui.VideoPlayer.myFlashPlayer.play();
		},
		"56" : function(h){
			h ? UW.video_player.j2s_setVideoPauseAll() :
			UW.video_player.j2s_setVideoResumeAll();
		}
	},
	current,
	url = window.location.host,
	autoPause = {
		handleEvent: function(){
			sites[current](document.mozHidden || document.webkitHidden);
		},
		init: function(){
			for(var i in sites){
				(url.search(i) !== -1) && (current = i);
			}
			var change = typeof document.mozHidden !== "undefined" ?
			"mozvisibilitychange" : "webkitvisibilitychange";	
			current && document.addEventListener(change,this,false);
		}
	};	
	autoPause.init();
})(unsafeWindow);
