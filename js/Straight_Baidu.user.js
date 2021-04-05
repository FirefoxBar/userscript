// ==UserScript==
// @name Straight Baidu
// @namespace http://firefoxbar.github.io/#userscripts
// @include https://www.baidu.com/*
// @description 去掉百度搜索结果重定向
// @version 1
// @grant GM_xmlhttpRequest
// @author Paltoo Young
// @updateURL https://userscript.firefoxcn.net/js/Straight_Baidu.meta.js
// @downloadURL https://userscript.firefoxcn.net/js/Straight_Baidu.user.js
// ==/UserScript==
;(function(selector, MutationObserver){
    
    function replaceUrl(){
        Array.prototype.forEach.call(
            document.querySelectorAll(selector),
            function(i){
                GM_xmlhttpRequest({
                    method: "GET",
                    url: i.href,
                    onload: function(r){i.href = r.finalUrl;}
                });
            });
    }
    
    new MutationObserver(function(m) {
        m.forEach(function(i){
            (i.addedNodes.length === 2) 
            && replaceUrl();
        });
    }).observe(document.body, {childList: true});
    
    replaceUrl();
    
})(".t a,.c-abstract a,.c-offset a", 
 MutationObserver || WebKitMutationObserver || MozMutationObserver);