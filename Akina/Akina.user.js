// ==UserScript==
// @name        Akina
// @namespace   http://tieba.baidu.com/f?kw=firefox
// @updateURL   https://github.com/FirefoxBar/userscript/raw/master/Akina/Akina.meta.js
// @downloadURL https://github.com/FirefoxBar/userscript/raw/master/Akina/Akina.user.js
// @include     /https?:\/\/tieba\.baidu\.com\/p.*/
// @include     /https?:\/\/tieba\.baidu\.com\/f.*/
// @version     2.0.3
// @grant       GM_xmlhttpRequest
// @author      Paltoo Young
// ==/UserScript==

(function(cssText,dialogHtml){    
       
    var style = document.createElement('style');
    style.innerHTML = cssText;
    document.head.appendChild(style);
    
    var postList = document.querySelector('#j_p_postlist');
    postList.addEventListener('click',function(e){
        var target = e.target;
        'l_badge' === target.className && depart(e,'disk');
        'p_badge' === target.className && depart(e,'album');
    });
    
    var pageData = {
        un: '',
        jump: 'http://yun.baidu.com/share/home?uk=',
        apiUrl: 'http://pan.baidu.com/api/user/search?user_list=[%22$un%22]',
        oldDriver: {},
        timeOut: 0
    }
    
    function depart(e,r){
        if(document.querySelector('#akina-pop')) return;
        if(r === 'disk'){
            var parentNode = e.target.parentNode;
        }
        if(r === 'album'){
            var parentNode = e.target.parentNode.parentNode;
            pageData.jump = 'http://xiangce.baidu.com/u/';
        }
        pageData.un = JSON.parse(parentNode.querySelector('.p_author_name').dataset.field).un;
        pageData.oldDriver = parentNode.querySelector('.p_author_face img');
        
        driving();    
    }
    
    function driving(){
        GM_xmlhttpRequest({
            method: 'GET',
            url: pageData.apiUrl.replace('$un',pageData.un),
            onload: function(res){
                getUK(res,pageData.oldDriver);
            }
        });           
    }
    
    function dialog(callback){
        
        var dialog = document.createElement('div');
        
        dialog.className = 'dialogJ dialogJfix dialogJshadow';
        
        dialog.style.cssText = 'z-index:5000;width:500px;left:' +
        (document.documentElement.clientWidth / 2 - 250) + 'px;top:' +
        (document.documentElement.clientHeight / 2 - 272) + 'px';
        
        dialog.innerHTML = dialogHtml;
        document.body.appendChild(dialog);
        
        callback.call(this,dialog);        
    }

    function getUK(res,oldDriver) {
        var res = JSON.parse(res.response);
        console.dir(res);
        if( 0 === res.errno){
            return location.href = pageData.jump + res.records[0].uk;
        }
        dialog(function(dialog){           
            var ticket = res.img;
            var akinaCode = dialog.querySelector('#akina-code');
            akinaCode.setAttribute('src',ticket);
            var vcode = res.vcode;
            dialog.querySelector('#old-driver').src = oldDriver.src;
            
            var changeCode = dialog.querySelector('#akina-change'); 
            var tip = dialog.querySelector('#driver-tip');
            var vcodeTxt = dialog.querySelector('#akina-text');
            vcodeTxt.focus();
            
            var submitBtn = dialog.querySelector('#akina-submit');  
            
            dialog.querySelector('.dialogJclose').addEventListener('click',function(e){
                document.body.removeChild(dialog);
            },false);
            
            dialog.querySelector('.ui_btn_disable').addEventListener('click',function(e){
                document.body.removeChild(dialog);
            },false);
            
            changeCode.addEventListener('click',function(){
                akinaCode.src = ticket + "&" + Date.now();
            },false);
            
            submitBtn.addEventListener('click',function(){
                
                var vcodeText = dialog.querySelector('#akina-text').value;
                var url = 'http://pan.baidu.com/api/user/search?user_list=[%22$un%22]';
                
                if(vcodeText === ''){
                    return tip.textContent = '你不输入车票的话，我是不会发车的哦。';
                }
                if(vcodeText.length < 4){
                    return tip.textContent = '车票码长度是四位数哦。';                                    
                }
                
                GM_xmlhttpRequest ({
                    method: 'GET',
                    url: pageData.apiUrl.replace('$un',pageData.un) +"&input=" +vcodeText+ "&vcode=" + vcode,
                    onload:function(res){
                        var res = JSON.parse(res.response);
                        if( 0 === res.errno){
                            tip.textContent = '检票成功，准备发车，请坐好扶稳。';
                            location.href = pageData.jump + res.records[0].uk;
                        }
                        else{
                            vcode = res.vcode;
                            ticket = res.img;
                            akinaCode.setAttribute("src",ticket);                                    
                            if(2157 === res.errno_captcha){
                                return tip.textContent = '车票不正确哦~';
                            }
                            tip.textContent = '好像出错了，请重新输入车票~';
                        }
                    }
                });
            },false);

            if(-6 === res.errno){
                pageData.timeOut++;
                tip.textContent = '司机正在上车，请稍等……';
                dialog.querySelector("#akina-wrap").style.display = "none";
                dialog.querySelector("#akina-btns").style.display = "none";
                if(pageData.timeOut >= 2){
                    return tip.textContent = '车辆检修，无法发车（可能是你未登陆）';
                }
                var iframe = document.createElement("iframe");
                iframe.src = "http://pan.baidu.com/disk/home#list/path=%2F";
                iframe.width = 0;
                iframe.height = 0;
                iframe.onload = function(){
                   document.body.removeChild(iframe);
                   document.body.removeChild(dialog);
                   driving();
                }
                document.body.appendChild(iframe);
            }
            
            if(-80 === res.errno){
                tip.textContent = '今天不发车了，明天再来吧。';
                dialog.querySelector("#akina-wrap").style.display = "none";
                dialog.querySelector("#akina-btns").style.display = "none";
            }
        });
    }
    
})('.l_badge::before,.p_badge::before {\
    background: rgba(0, 0, 0, 0) url(\"http://pan.baidu.com/box-static/disk-system/images/favicon.ico") no-repeat scroll center 2px / 15px auto;\
    color: #b0b0b0;\
    content: "";\
    position: absolute;\
    top: 35px;\
    left: 20px;\
    cursor: pointer;\
    display: inline-block;\
    height: 15px;\
    padding-left: 5px;\
    width: 15px;\
    }\
    .p_badge::before {\
        background: rgba(0, 0, 0, 0) url("http://tb2.bdstatic.com/xiangce/webroot/static/common/widget/global_user_nav/images/spr_ext_ico_533cd59.png") no-repeat scroll 0 0;\
        left: 43px;\
    }\
    #akina-text{\
        width: 100px;\
        height: 30px;\
        text-indent: 5px;\
    }\
    #driver-tip{\
        font-size: 20px;\
    }\
    #akina-change{\
        cursor: pointer;\
    }\
    #old-driver{\
        width: 80px;\
        height: 80px;\
        border-radius: 50%;\
    }\
    #old-driver,#akina-code{\
        vertical-align: middle;\
        padding-right: 10px;\
    }','<div id="akina-pop" class="uiDialogWrapper"><div class="dialogJcontent">\
    <div id="dialogJbody" class="dialogJbody" style="height: 330px;">\
    <div class="post_setting_wrap"><a title="关闭本窗口" class="dialogJclose">&nbsp;</a>\
    <div class="post_setting_title clearfix j_post_setting_title">\
<a class="post_setting_tab j_post_setting_tab post_setting_tab_select j_post_setting_tab_select" attr-type="bubble">同学，请检票上车</a>\
</div>\
    <div class="post_setting_body j_post_setting_body" style="height:250px;padding: 20px;">\
        <p><img id="old-driver"><span id="driver-tip">要上我的车，先检票哦~</span></p>\
        <p id="akina-wrap" style="margin: 50px;"><input id="akina-text" type="text" maxlength="4"  placeholder="这里输入车票"><img id="akina-code"><a id="akina-change">换一张</a>\
        </p>\
        <div id="akina-btns"><a id="akina-submit" style="margin-left: 90px;" class="ui_btn ui_btn_m post_setting_submit j_post_setting_submit">\
        <span><em>滴~学生卡~</em></span></a><a class="ui_btn_disable ui_btn_m_disable j_post_setting_cancel">\
        <span><em>不上车了</em></span></a></div>\
    </div>\
    </div></div></div></div></div>');