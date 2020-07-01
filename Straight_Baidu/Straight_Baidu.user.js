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