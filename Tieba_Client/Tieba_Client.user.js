// ==UserScript==
// @name Tieba Client
// @namespace http://tieba.baidu.com
// @include http://tieba.baidu.com/*
// @updateURL https://firefoxbar.github.io/userscripts/Tieba_Client/Tieba_Client.meta.js
// @downloadURL https://firefoxbar.github.io/userscripts/Tieba_Client/Tieba_Client.user.js
// @icon http://imgsrc.baidu.com/forum/pic/item/8a65d04bd11373f0075bca22a60f4bfbfaed04c9.jpg
// @require http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant GM_xmlhttpRequest
// @author 网络中二行客
// @version 0.9.2
// ==/UserScript==

//MD5函数
var hexcase=0;var b64pad="";function hex_md5(s){return rstr2hex(rstr_md5(str2rstr_utf8(s)));}function b64_md5(s){return rstr2b64(rstr_md5(str2rstr_utf8(s)));}function any_md5(s,e){return rstr2any(rstr_md5(str2rstr_utf8(s)),e);}function hex_hmac_md5(k,d){return rstr2hex(rstr_hmac_md5(str2rstr_utf8(k),str2rstr_utf8(d)));}function b64_hmac_md5(k,d){return rstr2b64(rstr_hmac_md5(str2rstr_utf8(k),str2rstr_utf8(d)));}function any_hmac_md5(k,d,e){return rstr2any(rstr_hmac_md5(str2rstr_utf8(k),str2rstr_utf8(d)),e);}function md5_vm_test(){return hex_md5("abc").toLowerCase()=="900150983cd24fb0d6963f7d28e17f72";}function rstr_md5(s){return binl2rstr(binl_md5(rstr2binl(s),s.length*8));}function rstr_hmac_md5(key,data){var bkey=rstr2binl(key);if(bkey.length>16)bkey=binl_md5(bkey,key.length*8);var ipad=Array(16),opad=Array(16);for(var i=0;i<16;i++){ipad[i]=bkey[i]^0x36363636;opad[i]=bkey[i]^0x5C5C5C5C;}var hash=binl_md5(ipad.concat(rstr2binl(data)),512+data.length*8);return binl2rstr(binl_md5(opad.concat(hash),512+128));}function rstr2hex(input){try{hexcase}catch(e){hexcase=0;}var hex_tab=hexcase?"0123456789ABCDEF":"0123456789abcdef";var output="";var x;for(var i=0;i<input.length;i++){x=input.charCodeAt(i);output+=hex_tab.charAt((x>>>4)&0x0F)+hex_tab.charAt(x&0x0F);}return output;}function rstr2b64(input){try{b64pad}catch(e){b64pad='';}var tab="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var output="";var len=input.length;for(var i=0;i<len;i+=3){var triplet=(input.charCodeAt(i)<<16)|(i+1<len?input.charCodeAt(i+1)<<8:0)|(i+2<len?input.charCodeAt(i+2):0);for(var j=0;j<4;j++){if(i*8+j*6>input.length*8)output+=b64pad;else output+=tab.charAt((triplet>>>6*(3-j))&0x3F);}}return output;}function rstr2any(input,encoding){var divisor=encoding.length;var i,j,q,x,quotient;var dividend=Array(Math.ceil(input.length/2));for(i=0;i<dividend.length;i++){dividend[i]=(input.charCodeAt(i*2)<<8)|input.charCodeAt(i*2+1);}var full_length=Math.ceil(input.length*8/(Math.log(encoding.length)/Math.log(2)));var remainders=Array(full_length);for(j=0;j<full_length;j++){quotient=Array();x=0;for(i=0;i<dividend.length;i++){x=(x<<16)+dividend[i];q=Math.floor(x/divisor);x-=q*divisor;if(quotient.length>0||q>0)quotient[quotient.length]=q;}remainders[j]=x;dividend=quotient;}var output="";for(i=remainders.length-1;i>=0;i--)output+=encoding.charAt(remainders[i]);return output;}function str2rstr_utf8(input){var output="";var i=-1;var x,y;while(++i<input.length){x=input.charCodeAt(i);y=i+1<input.length?input.charCodeAt(i+1):0;if(0xD800<=x&&x<=0xDBFF&&0xDC00<=y&&y<=0xDFFF){x=0x10000+((x&0x03FF)<<10)+(y&0x03FF);i++;}if(x<=0x7F)output+=String.fromCharCode(x);else if(x<=0x7FF)output+=String.fromCharCode(0xC0|((x>>>6)&0x1F),0x80|(x&0x3F));else if(x<=0xFFFF)output+=String.fromCharCode(0xE0|((x>>>12)&0x0F),0x80|((x>>>6)&0x3F),0x80|(x&0x3F));else if(x<=0x1FFFFF)output+=String.fromCharCode(0xF0|((x>>>18)&0x07),0x80|((x>>>12)&0x3F),0x80|((x>>>6)&0x3F),0x80|(x&0x3F));}return output;}function str2rstr_utf16le(input){var output="";for(var i=0;i<input.length;i++)output+=String.fromCharCode(input.charCodeAt(i)&0xFF,(input.charCodeAt(i)>>>8)&0xFF);return output;}function str2rstr_utf16be(input){var output="";for(var i=0;i<input.length;i++)output+=String.fromCharCode((input.charCodeAt(i)>>>8)&0xFF,input.charCodeAt(i)&0xFF);return output;}function rstr2binl(input){var output=Array(input.length>>2);for(var i=0;i<output.length;i++)output[i]=0;for(var i=0;i<input.length*8;i+=8)output[i>>5]|=(input.charCodeAt(i/8)&0xFF)<<(i%32);return output;}function binl2rstr(input){var output="";for(var i=0;i<input.length*32;i+=8)output+=String.fromCharCode((input[i>>5]>>>(i%32))&0xFF);return output;}function binl_md5(x,len){x[len>>5]|=0x80<<((len)%32);x[(((len+64)>>>9)<<4)+14]=len;var a=1732584193;var b=-271733879;var c=-1732584194;var d=271733878;for(var i=0;i<x.length;i+=16){var olda=a;var oldb=b;var oldc=c;var oldd=d;a=md5_ff(a,b,c,d,x[i+0],7,-680876936);d=md5_ff(d,a,b,c,x[i+1],12,-389564586);c=md5_ff(c,d,a,b,x[i+2],17,606105819);b=md5_ff(b,c,d,a,x[i+3],22,-1044525330);a=md5_ff(a,b,c,d,x[i+4],7,-176418897);d=md5_ff(d,a,b,c,x[i+5],12,1200080426);c=md5_ff(c,d,a,b,x[i+6],17,-1473231341);b=md5_ff(b,c,d,a,x[i+7],22,-45705983);a=md5_ff(a,b,c,d,x[i+8],7,1770035416);d=md5_ff(d,a,b,c,x[i+9],12,-1958414417);c=md5_ff(c,d,a,b,x[i+10],17,-42063);b=md5_ff(b,c,d,a,x[i+11],22,-1990404162);a=md5_ff(a,b,c,d,x[i+12],7,1804603682);d=md5_ff(d,a,b,c,x[i+13],12,-40341101);c=md5_ff(c,d,a,b,x[i+14],17,-1502002290);b=md5_ff(b,c,d,a,x[i+15],22,1236535329);a=md5_gg(a,b,c,d,x[i+1],5,-165796510);d=md5_gg(d,a,b,c,x[i+6],9,-1069501632);c=md5_gg(c,d,a,b,x[i+11],14,643717713);b=md5_gg(b,c,d,a,x[i+0],20,-373897302);a=md5_gg(a,b,c,d,x[i+5],5,-701558691);d=md5_gg(d,a,b,c,x[i+10],9,38016083);c=md5_gg(c,d,a,b,x[i+15],14,-660478335);b=md5_gg(b,c,d,a,x[i+4],20,-405537848);a=md5_gg(a,b,c,d,x[i+9],5,568446438);d=md5_gg(d,a,b,c,x[i+14],9,-1019803690);c=md5_gg(c,d,a,b,x[i+3],14,-187363961);b=md5_gg(b,c,d,a,x[i+8],20,1163531501);a=md5_gg(a,b,c,d,x[i+13],5,-1444681467);d=md5_gg(d,a,b,c,x[i+2],9,-51403784);c=md5_gg(c,d,a,b,x[i+7],14,1735328473);b=md5_gg(b,c,d,a,x[i+12],20,-1926607734);a=md5_hh(a,b,c,d,x[i+5],4,-378558);d=md5_hh(d,a,b,c,x[i+8],11,-2022574463);c=md5_hh(c,d,a,b,x[i+11],16,1839030562);b=md5_hh(b,c,d,a,x[i+14],23,-35309556);a=md5_hh(a,b,c,d,x[i+1],4,-1530992060);d=md5_hh(d,a,b,c,x[i+4],11,1272893353);c=md5_hh(c,d,a,b,x[i+7],16,-155497632);b=md5_hh(b,c,d,a,x[i+10],23,-1094730640);a=md5_hh(a,b,c,d,x[i+13],4,681279174);d=md5_hh(d,a,b,c,x[i+0],11,-358537222);c=md5_hh(c,d,a,b,x[i+3],16,-722521979);b=md5_hh(b,c,d,a,x[i+6],23,76029189);a=md5_hh(a,b,c,d,x[i+9],4,-640364487);d=md5_hh(d,a,b,c,x[i+12],11,-421815835);c=md5_hh(c,d,a,b,x[i+15],16,530742520);b=md5_hh(b,c,d,a,x[i+2],23,-995338651);a=md5_ii(a,b,c,d,x[i+0],6,-198630844);d=md5_ii(d,a,b,c,x[i+7],10,1126891415);c=md5_ii(c,d,a,b,x[i+14],15,-1416354905);b=md5_ii(b,c,d,a,x[i+5],21,-57434055);a=md5_ii(a,b,c,d,x[i+12],6,1700485571);d=md5_ii(d,a,b,c,x[i+3],10,-1894986606);c=md5_ii(c,d,a,b,x[i+10],15,-1051523);b=md5_ii(b,c,d,a,x[i+1],21,-2054922799);a=md5_ii(a,b,c,d,x[i+8],6,1873313359);d=md5_ii(d,a,b,c,x[i+15],10,-30611744);c=md5_ii(c,d,a,b,x[i+6],15,-1560198380);b=md5_ii(b,c,d,a,x[i+13],21,1309151649);a=md5_ii(a,b,c,d,x[i+4],6,-145523070);d=md5_ii(d,a,b,c,x[i+11],10,-1120210379);c=md5_ii(c,d,a,b,x[i+2],15,718787259);b=md5_ii(b,c,d,a,x[i+9],21,-343485551);a=safe_add(a,olda);b=safe_add(b,oldb);c=safe_add(c,oldc);d=safe_add(d,oldd);}return Array(a,b,c,d);}function md5_cmn(q,a,b,x,s,t){return safe_add(bit_rol(safe_add(safe_add(a,q),safe_add(x,t)),s),b);}function md5_ff(a,b,c,d,x,s,t){return md5_cmn((b&c)|((~b)&d),a,b,x,s,t);}function md5_gg(a,b,c,d,x,s,t){return md5_cmn((b&d)|(c&(~d)),a,b,x,s,t);}function md5_hh(a,b,c,d,x,s,t){return md5_cmn(b^c^d,a,b,x,s,t);}function md5_ii(a,b,c,d,x,s,t){return md5_cmn(c^(b|(~d)),a,b,x,s,t);}function safe_add(x,y){var lsw=(x&0xFFFF)+(y&0xFFFF);var msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&0xFFFF);}function bit_rol(num,cnt){return(num<<cnt)|(num>>>(32-cnt));}

;(function($,UW){
    //如果无法发帖，请在下面双引号内输入您的BDUSS
    const
        BDUSS = "",
        SIGN_KEY = "tiebaclient!!!",
        pd = UW.PageData;
        kw = pd.forum.forum_name,
        fid = pd.forum.forum_id,
        tbs = pd.tbs,
        tid = pd.hasOwnProperty("thread") ? pd.thread.thread_id : "",
        fontFamily = ["微软雅黑","黑体","宋体","楷体","仿宋"],
        threadURL = "http://c.tieba.baidu.com/c/c/thread/add",
        postURL = "http://c.tieba.baidu.com/c/c/post/add";
        
    var
        dataURL,
        tail_content,
		offY = 0,
        colorFlag = 0,
        isHome = tid ? 1 : 0,
        typeface = fontFamily[0];
    
    const smiley = {
        "i_f01.png":"#(呵呵)","i_f02.png":"#(哈哈)","i_f03.png":"#(吐舌)","i_f04.png":"#(啊)","i_f05.png":"#(酷)",
        "i_f06.png":"#(怒)","i_f07.png":"#(开心)","i_f08.png":"#(汗)","i_f09.png":"#(泪)","i_f10.png":"#(黑线)",
        "i_f11.png":"#(鄙视)","i_f12.png":"#(不高兴)","i_f13.png":"#(真棒)","i_f14.png":"#(钱)","i_f15.png":"#(疑问)",
        "i_f16.png":"#(阴险)","i_f17.png":"#(吐)","i_f18.png":"#(咦)","i_f19.png":"#(委屈)","i_f20.png":"#(花心)",
        "i_f21.png":"#(呼~)","i_f22.png":"#(笑眼)","i_f23.png":"#(冷)","i_f24.png":"#(太开心)","i_f25.png":"#(滑稽)",
        "i_f26.png":"#(勉强)","i_f27.png":"#(狂汗)","i_f28.png":"#(乖)","i_f29.png":"#(睡觉)","i_f30.png":"#(惊哭)",
        "i_f31.png":"#(升起)","i_f32.png":"#(惊讶)","i_f33.png":"#(喷)","i_f34.png":"#(爱心)","i_f35.png":"#(心碎)",
        "i_f36.png":"#(玫瑰)","i_f37.png":"#(礼物)","i_f38.png":"#(彩虹)","i_f39.png":"#(星星月亮)","i_f40.png":"#(太阳)",
        "i_f41.png":"#(钱币)","i_f42.png":"#(灯泡)","i_f43.png":"#(茶杯)","i_f44.png":"#(蛋糕)","i_f45.png":"#(音乐)",
        "i_f46.png":"#(haha)","i_f47.png":"#(胜利)","i_f48.png":"#(大拇指)","i_f49.png":"#(弱)","i_f50.png":"#(OK)"
    }
        
    function gui(){
        var osSelect = "";
        const OS = ["iPhone","Android","WindowsPhone","Windows 8"];
        
        $("#tb_rich_poster .poster_submit:first")
        .before("<select id='os_slt'></select>\
			<a id='client_btn' class='ui_btn ui_btn_m j_submit poster_submit'>\
			<span class='poster_submit'><em>客户端</em></span></a>\
			<a id='hug_btn' class='ui_btn ui_btn_m j_submit poster_submit'>\
			<span class='poster_submit'><em>抱抱</em></span></a>");
                
        OS.map(function(os,i){
            osSelect += "<option value='"+i+"'>"+os+"</option>";
        });
        
        $("#os_slt").append(osSelect)
        .nextAll("#hug_btn")
        .click(dialog);

        isHome ? (
            $("#os_slt").change(replyPost)
            .next("#client_btn").click(replyPost),
            lzl()
        ) : (
            $("#os_slt").change(threadPost)
            .next("#client_btn").click(threadPost)
        )
    }
    
    //编辑框观察者
    
    function init(){
        var flashJS = "http://static.tieba.baidu.com/tb/static-frs/component/sign_shai/flash_image_loader.js";
        (!UW.FlashImageLoader) && $.getScript(flashJS);
        if($("#tb_rich_poster .poster_submit").length){
            gui();
        }
        else{
            var target = document.querySelector("#tb_rich_poster_container");
            var MutationObserver = window.MutationObserver ||
                window.WebKitMutationObserver || window.MozMutationObserver;
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function() {
                    if(!$("#os_slt").length){
                        observer.disconnect();
                        return gui();
                    }
                });
            });
            var config = { attributes: true, childList: true, characterData: true };
            observer.observe(target, config);
        }
    }
    
    function decodeURI(postData){
        var s = "";
        var data = "";
        
        for (var i in postData){
            s += i + "=" + postData[i];
        }
        var sign = hex_md5(decodeURIComponent(s)+SIGN_KEY);
        for (var i in postData){
            data += "&" +i+ "=" + postData[i];
        }
        data += "&sign=" + sign;
        return data.replace("&","");
    }
    
    function format(content){
        content = content.replace(/<\/p>/g, "\n")
          .replace(/<br>/g, "\n")
          .replace(/\+/g, "%2B")
          .replace(/&nbsp;/g, " ")
          .replace(/([^/]+?)\.png/ig,function($1) { //表情
              if (smiley[$1]){
                  return ">" + smiley[$1] + "<";
              }
          })
          .replace(/<.*?>/g,"");
        return content;
    }
    
    function imgFormat(){
        $("#ueditor_replace .BDE_Image").each(function(){
            var src = $(this).attr("src");
            var type = src.slice(-3);
            if (type === "jpg"){
                if (src.match(/\/(\w+)\.jpg/i)){
                    var width = $(this).width();
                    var height = $(this).height();
                    src = src.match(/\/(\w+)\.jpg/i)[1];
                    if(src.length != 40) return; // 过滤网络图片
                    pic = "#(pic," +src+ ","+width+"," +height+ ")";
                    $(this).replaceWith(pic);
                }
            }
        })
    }
 
    function checkContent(){
        var editor = $("#ueditor_replace");
        if(editor.html() === "<p><br></p>" || editor.html() === ""){
            errorMsg("回复内容不能为空");
            return false;
        }
        imgFormat();
        var content = editor.html();
        content = format(content);
        var os = document.querySelector("#os_slt");
        var client_type = parseInt(os.options[os.selectedIndex].value)+1;
        return {
            content:content,
            client_type:client_type
        }
    }
    
    function clientPost(url,data,callback){
        GM_xmlhttpRequest({
            method:"POST",
            url:url,
            data:data,
            headers:{
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: callback
        });
    }
        
    function postCallback(response){
        var msg = JSON.parse(response.responseText);
        if(msg.error_code === "0"){
            $("#ueditor_replace").empty();
            $(".poster_draft_delete").click();
            return location.reload();
        }
        errorMsg(msg.error_msg);
    }

    function lzlCallback(response) {
        var msg = JSON.parse(response.responseText);
        if(msg.error_code === "0"){
            UW.LzlPostor._appendNew();
            return $("#j_editor_for_container").empty();
        }
        errorMsg(msg.error_msg);
    }
    
    function hugCallback(response){
        var msg = JSON.parse(response.responseText);
        var html = "";
        
        msg.picList.picUrl.forEach(function(i){
            html += '<li><a><img src="'+i+'"></a></li>';
        });
        
        $("#tc_baobao_wrap").replaceWith('<canvas id="hug_canvas" width="600" height="600">您的浏览器不支持canvas。</canvas>');
        $(".ui_tc_next").removeClass("ui_tc_next").addClass("ui_tc_done").find("em").text("完成")
        .parents(".i_layer_bottom").append('<div class="i_change_btn"><a href="javascript:void(0);" class="ui_btn ui_btn_m ui_btn_change"><span><em>换图</em></span></a>\
			<a href="javascript:void(0);" class="ui_btn ui_btn_m ui_btn_font"><span><em>字效</em></span></a>\
			<a href="javascript:void(0);" class="ui_btn ui_btn_m ui_btn_anew"><span><em>重来</em></span></a></div>\
		')
        .find(".ui_btn_change").click(function(){
            $(document.body).append('<div id="tc_change_wrap"><a id="close_wrap">关闭</a><ul>'+html+'</ul></div>')
            .find("#tc_change_wrap li").css("width",100/msg.picList.picUrl.length+"%").children("a")
			.append('<div class="cut"></div>')
			.mousemove(function(e){
				var t = $(this).height() + e.clientY - $(window).height();
				if ($(this).height() - (t + $(this).width()) >= 0){
					$(this).children(".cut").css("top", t);
				}
			})
			.mouseover(function(){
			$(this).children(".cut").height($(this).width());
			});
        }).end().find(".ui_btn_font")
        .click(function(){
            if(!colorFlag){
                drawCanvas("hug_canvas", 60, 24, tail_content, dataURL,{font:typeface,fill:"#000",stroke:"#fff"},offY);
                return colorFlag = 1;
            }
            typeface = ( fontFamily.indexOf(typeface) >= fontFamily.lenth - 1) ?
            fontFamily[0] : fontFamily[fontFamily.indexOf(typeface)+1];
            drawCanvas("hug_canvas", 60, 24, tail_content, dataURL,{font:typeface,fill:"#fff",stroke:"#000"},offY);
            colorFlag = 0;
        })
        .next(".ui_btn_anew").click(function(){
            $('.dialogJmodal,.dialogJ,#tc_change_wrap').remove();
            dialog();
        });
        getDataURL(msg.picList.picUrl[0],0);
    }
    
    function threadPost(){
        if(!checkContent()){
            return;
        }
        var postPrm = checkContent();
        var title = $(".editor_title").val();
        var postData = {
            BDUSS:BDUSS,
            _client_id:"wappc_1405161478936_888",
            _client_type:postPrm.client_type,
            _client_version:"6.2.1",
            _phone_imei:"355136154558888",
            anonymous:0,
            content:postPrm.content,
            fid:fid,
            kw:kw,
            new_vcode:1,
            tbs:tbs,
            title:title,
            vcode_tag:11
        }
        var data = decodeURI(postData);
        clientPost(threadURL,data,postCallback);
    }
    
    function hugPost(){
        if(!checkContent()){
            return;
        }
        var postPrm = checkContent();
        var title = $(".editor_title").val();
        var postData = {
            BDUSS:BDUSS,
            _client_id:"wappc_1405161478936_888",
            _client_type:2,
            _client_version:"6.2.1",
            _phone_imei:"355136154558888",
            anonymous:0,
            content:postPrm.content,
            fid:fid,
            kw:kw,
            new_vcode:1,
            tail_content:tail_content,
            tail_type:1,
            tbs:tbs,
            title:title,
            vcode_tag:11
        }
        var data = decodeURI(postData);
        clientPost(threadURL,data,postCallback);
    }
        
    function replyPost(){
        if(!checkContent()){
            return;
        }
        var postPrm = checkContent();
        var addData = {
            BDUSS:BDUSS,
            _client_id:"wappc_1405161478936_888",
            _client_type:postPrm.client_type,
            _client_version:"6.2.1",
            _phone_imei:"355136154558888",
            anonymous:1,
            content:postPrm.content,
            fid:fid,
            kw:kw,
            tbs:tbs,
            tid:tid,
            title:""
        }
        var data = decodeURI(addData);
        clientPost(postURL,data,postCallback);
    }

    function hug(){
        if(!checkContent()){
            return;
        }
        var postPrm = checkContent();
        var addData = {
            BDUSS:BDUSS,
            _client_id:"wappc_1405161478936_888",
            _client_type:2,
            _client_version:"6.2.1",
            _phone_imei:"355136154558888",
            anonymous:1,
            content:postPrm.content,
            fid:fid,
            kw:kw,
            tail_content:tail_content,
            tail_type:1,
            tbs:tbs,
            tid:tid,
        }
        var data = decodeURI(addData);
        clientPost(postURL,data,postCallback);
    }
    
    function lzl(){
        $("#j_p_postlist").on("click",".lzl_link_unfold,.j_lzl_p,.lzl_s_r",function(){
            if(!$(this).parents(".d_post_content_main").find("#lzl_cliend").length){
                var lzlWrapper = $(this).parents('.core_reply.j_lzl_wrapper').find(".j_lzl_container.core_reply_wrapper");
                lzlWrapper.find(".core_reply_border_bottom").before('<span id="lzl_cliend" class="lzl_panel_submit j_lzl_p_sb">客户端</span>');
                var field = eval('('+lzlWrapper.data("field")+')');
                var floor_num = field.floor_num;
                var quote_id = field.pid;
                $("#lzl_cliend").on("click",function(){lzlPost(floor_num,quote_id)});
            }
        });
    }
    
    function lzlPost(floor_num,quote_id){
        var content = $("#j_editor_for_container").html();
        content = format(content);
        
        var addData = {
            BDUSS:BDUSS,
            _client_id:"wappc_1405161478936_888",
            _client_type:1,
            _client_version:"6.2.1",
            _phone_imei:"355136154558888",
            anonymous:1,
            content:content,
            fid:fid,
            floor_num:floor_num,
            kw:kw,
            quote_id:quote_id,
            tbs:tbs,
            tid:tid,
            title:""
        }
        var data = decodeURI(addData);
        setTimeout(function(){clientPost(postURL,data,lzlCallback);}, 0);
    }
    
    function errorMsg(msg){
        $('.poster_error').text(msg);
    }
    
    function getHug(s){
        var addData = {
            content: s,
            from:"sdktbandroid"
        }
        var myHugURL = "http://api.myhug.cn/se/pic";
        var data = decodeURI(addData);
        setTimeout(function(){clientPost(myHugURL,data,hugCallback);}, 0);
    }
    
    
    function dialog(){
        var w = $(window).width();
        var h = $(window).height();
        typeface = fontFamily[0];
        
        $(document.body).append("<div class='dialogJ dialogJfix dialogJshadow ui-draggable'></div>\
			<div class='dialogJmodal'></div>").children(".dialogJmodal")
        .css({
            "z-index":"50000",
            "width":$(document).width()+"px",
            "height":$(document).height()+"px"
        })
        .prev(".dialogJ").css({
            "width":"620px",
            "z-index":"50001",
            "left":"300px",
            "top": h <= 683 ? 0 : (h - 683) / 2,
            "left": w <= 620 ? 0 : (w - 620) / 2
        })
        .append('<div class="uiDialogWrapper"><div class="dialogJtitle">\
			<span class="dialogJtxt">抱抱</span><a class="dialogJclose ui_tc_close" title="关闭本窗口" href="javascript:void(0);"></a></div>\
			<div class="dialogJcontent">\
			<div id="dialogJbody" class="dialogJbody" style="height: 600px !important;">\
			<div id="tc_baobao_wrap"><textarea id="tc_baobao" placeholder="输入内容，抱抱为您配图喵~<(￣︶￣)> "></textarea></div>\
			<div class="i_layer_bottom" style="width: 618px;">\
			<div id="tc_status">正在加载……</div>\
			<div class="i_layer_btn"><a class="ui_btn ui_btn_m ui_tc_next" href="javascript:void(0);"><span><em>下一步</em></span></a>\
			<a class="ui_btn ui_btn_sub_m ui_tc_close" style="float:left" href="javascript:void(0);"><span><em>取 消</em></span></a></div></div>\
			</div></div></div>')
        .find("#tc_baobao")
        .keydown(checkText)
        .keyup(checkText)
        .focus();
        
        function checkText(e){
            var text = $(e.target).val();
            var length = text.length;
            var $next = $(".ui_tc_next");
            if(length > 88){
                return $(e.target).val(text.substr(0,88));
            }
            text.length ? $next.show() : $next.hide();
        }
    }
    
    $(document.body).on("click",".ui_tc_close",function(){
        $(".dialogJmodal,.dialogJ,#tc_change_wrap").remove();
    })
    .on("click",".ui_tc_next",function(){
        tail_content = $("#tc_baobao").val();
        if(tail_content){
            $("#tc_status").show();
            getHug($("#tc_baobao").val());
        }
    })
    .on("click","#tc_change_wrap li a",function(){
        $("#tc_status").show().text("正在绘制图片……");
		var h = parseInt($(this).children(".cut").css("top"));
		offY = h * 600 / $(this).children("img").width();
        getDataURL($(this).children("img").attr("src"),offY);
    })
    .on("click","#close_wrap",function(){
        $(this).parent().remove();
    })
    .on("click",".ui_tc_done",function(){
		$(".i_change_btn").hide();
        $("#tc_status").show().text("正在上传抱抱……");
        var dataURL = $("#hug_canvas")[0].toDataURL();
        uploader(dataURL);
    });
    
    function drawCanvas(cns, lh, rw, text,src,style,y){
        var cns = document.getElementById(cns);
        var ctx = cns.getContext("2d");
        var lineheight = lh;
        var text = text;

        ctx.width = cns.width;
        ctx.height = cns.height;

        ctx.clearRect(0, 0, ctx.width, ctx.height);
        preDraw(src,function(){
            var imgHeight = this.height * (600 / this.width);
            ctx.drawImage(this,0,-y,600,imgHeight);
            ctx.globalCompositeOperation = "source-over";
            ctx.font = "bold 45px "+style.font;
            ctx.fillStyle = style.fill;
            ctx.strokeStyle = style.stroke;

            var rowCout = text;
            for(var j = 0; getTrueLength(rowCout) > 0; j++){
                var tl = cutString(rowCout, rw);
                rowCout = rowCout.substr(tl);
            }
            
            /* Canvas 绘制文字 居中 */
            
            var h = ctx.height/2 - j*lineheight/2-30;
            var offLeft = (j === 1) ? ctx.height/2 - (getTrueLength(text) * 20)/2 : 50;
            h = (h <= 0) ? 0 : h;
            
            for(var i = 1; getTrueLength(text) > 0; i++){
                var tl = cutString(text, rw);
                ctx.fillText(text.substr(0, tl).replace(/^\s+|\s+$/, ""), offLeft, i * lineheight + h);
                ctx.strokeText(text.substr(0, tl).replace(/^\s+|\s+$/, ""), offLeft, i * lineheight + h);
                text = text.substr(tl);
            }
            $("#tc_status").hide();
        });
                    
        function preDraw(src,callback){
            var img = new Image();
            img.src = src;
            
            if(img.complete){
                return callback.call(img);
            }
            
            img.onload = function(){
                callback.call(img);
            }
        }
        
        function getTrueLength(str){
            var len = str.length, truelen = 0;
            for(var x = 0; x < len; x++){
                if(str.charCodeAt(x) > 128){
                    truelen += 2;
                }else{
                    truelen += 1;
                }
            }
            return truelen;
        }
        function cutString(str, leng){
            var len = str.length, tlen = len, nlen = 0;
            for(var x = 0; x < len; x++){
                if(str.charCodeAt(x) > 128){
                    if(nlen + 2 < leng){
                        nlen += 2;
                    }else{
                        tlen = x;
                        break;
                    }
                }else{
                    if(nlen + 1 < leng){
                        nlen += 1;
                    }else{
                        tlen = x;
                        break;
                    }
                }
            }
            return tlen;
        }
    }
    
    function getDataURL(imgUrl,y){
        GM_xmlhttpRequest ( {
            method:'GET',
            url:imgUrl,
            onload:function (respDetails) {
                var binResp = customBase64Encode (respDetails.responseText);
                dataURL = 'data:image/png;base64,'+ binResp;
                var style = colorFlag ? {font:typeface,fill:"#000",stroke:"#fff"} :
                {font:typeface,fill:"#fff",stroke:"#000"}
                drawCanvas("hug_canvas", 60, 24, tail_content, dataURL, style, y);
            },
            overrideMimeType: 'text/plain; charset=x-user-defined'
        } );

        function customBase64Encode (inputStr) {
            var
                bbLen = 3,
                enCharLen = 4,
                inpLen = inputStr.length,
                inx = 0,
                jnx,
                keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
                    + "0123456789+/=",
                output = "",
                paddingBytes = 0;
            var
                bytebuffer = new Array (bbLen),
                encodedCharIndexes = new Array (enCharLen);

            while (inx < inpLen) {
                for (jnx = 0; jnx < bbLen; ++jnx) {
                    if (inx < inpLen) {
                        bytebuffer[jnx] = inputStr.charCodeAt (inx++) & 0xff;
                    }
                    else {
                        bytebuffer[jnx] = 0;
                    }
                }

                encodedCharIndexes[0] = bytebuffer[0] >> 2;
                encodedCharIndexes[1] = ( (bytebuffer[0] & 0x3) << 4) | (bytebuffer[1] >> 4);
                encodedCharIndexes[2] = ( (bytebuffer[1] & 0x0f) << 2) | (bytebuffer[2] >> 6);
                encodedCharIndexes[3] = bytebuffer[2] & 0x3f;

                paddingBytes = inx - (inpLen - 1);
                switch (paddingBytes) {
                    case 1:
                        encodedCharIndexes[3] = 64;
                        break;
                    case 2:
                        encodedCharIndexes[3] = 64;
                        encodedCharIndexes[2] = 64;
                        break;
                    default:
                        break;
                }

                for (jnx = 0; jnx < enCharLen; ++jnx)
                    output += keyStr.charAt ( encodedCharIndexes[jnx] );
            }
            return output;
        }
    }
    
    function uploader(dataURL) {
        $.getJSON('http://tieba.baidu.com/dc/common/imgtbs?t=' + new Date().getTime())
        .done(function(r){
            var tbs = r.data.tbs;
            upload(tbs);
        });
        function upload(tbs) {
            var blob = dataUrlToBlob(dataURL);
            
            var data = new FormData();
            data.append('Filename', 'tieba_client.png');
            data.append('fid', pd.forum.id);
            data.append('file', blob);
            data.append('tbs', tbs);
			data.append('is_wm',1);
						
			var fileXHR = new XMLHttpRequest();	
			fileXHR.withCredentials = true;
			fileXHR.upload.onprogress = progressHandler;
			fileXHR.onload = onloadHandler;
			fileXHR.open("post",'http://upload.tieba.baidu.com/upload/pic',true);
			fileXHR.send(data);	
        }

        function onloadHandler (r) {
			try{
				var
					r = JSON.parse(r.target.responseText),
					fullWidth = r.info.fullpic_width,
					fullHeight = r.info.fullpic_height,
					picId = r.info.pic_id_encode;
					pic = '#(pic,' +picId+ ',' +fullWidth+ ',' +fullHeight+ ')';

				$('#ueditor_replace').append(pic);
				$('.dialogJmodal,.dialogJ,#tc_change_wrap') .remove();
				isHome ? hug() : hugPost();
			}
			catch(e){
				$("#tc_status").html('<b style="color:red">上传出现异常，请重试。</b>');
			}
        }

		function progressHandler(e){
			if(e.lengthComputable){
				var howmuch = (e.loaded / e.total) * 100;
				$("#tc_status").text("正在上传: "+Math.ceil(howmuch)+"%");	
			}
		}

        function dataUrlToBlob(dataURL) {
            var mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
            var byteString = atob(dataURL.split(',')[1]);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], { type: mimeString });
        }
    }
    
    var cssText = '#os_slt{float:left;height:27.5px;width:110px;font-size:17px;}\
		#client_btn{margin:0 10px;}\
		#hug_btn{margin:0 10px 0 0}\
		#tc_change_wrap{z-index:50002;position:fixed;bottom:0;left:0;background:rgba(0, 0, 0, 0.5)}\
		#tc_change_wrap li{float:left;text-align:center;padding-top:5px;}\
		#tc_change_wrap li .cut{position:absolute;width:100%;display:none;\
		background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA61pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcFJpZ2h0czpNYXJrZWQ9IkZhbHNlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InV1aWQ6QUUzRjQ2MDg4Rjg5REUxMUE4NjA5OUYxMjFBMjA0MjkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTQ5NUYzOEFCNUVGMTFFMEJBQTNCQkU0RDdCMTM1MUQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTQ5NUYzODlCNUVGMTFFMEJBQTNCQkU0RDdCMTM1MUQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzJFQjk0NERFRkI1RTAxMTlBQjRBRkQ5MDM5RjM1RUIiIHN0UmVmOmRvY3VtZW50SUQ9InV1aWQ6QUUzRjQ2MDg4Rjg5REUxMUE4NjA5OUYxMjFBMjA0MjkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5t6jRVAAADjUlEQVR42sSWf0gUQRTH927vROHCPDgKBKG/Di4MqZCEi6QILOpCIhRBKKqLoP4KpL9Ew0CKQDCMijCUIomIflhHERQJgRAIh0IQSf4VRKZ1oO7tj96c37XX3Jxne3848NnZfTM78+bNm/fG5ziOtp7Fr61zCRRq6Hr0sZKqs0RvCeN3E1e7ju7IeLFAlOgh4h4nbyI6iWpPW0CeESF04h4RdpZla2UzMYT3iDcFyDlBDTHIvouhEw+JCL7LPClg23aG0ECCOMe+V6ObiLPveU9OaDvOtCS6RowRE6uMt5e4KMk+e1PAdmaomiXCEAlTPiB2EiqvFv2GCJ3JxCLmPW2BReYjUqhdosSAJHMZJKolWe5/jz7gCEZQc9oBlyWJhKLvsKg9bQE0HyWmiJjUPECME5/Q1qcY4gMoSQGL6CCeS80h+MNu1BWKITpKCsWWtWI6YYURokXqUkdMEjWK36/jxGilWsAtZzBhlMluwTKHiCSTi625UHIykhSYh7lfQRENkz/De5KdeaGQUboCVt7x+U7sw8QNmEhjtVj5EfQrPR0bpqkSi8D0FAokJdPfJ779b8r0uTei0y9mi3b+OTnWEKqJjWVmpvwwfwIKHSa5TfLaqq3xqWLj3D4YXpMCcbAgVpdd+L09WLEhJRqWfv3Q5r6kfW7HTXWNOSVyW2cs7tLLyoO4D4iQ/U6OB1yBAMt+7qs404PSsevzB8sNt08wVOUzTItnzgSuApQJAu/pOygtRmzPKSxGHYqROnXiCdEip1lH85Xx76xl5Uh1Hvu3n6MFFSm6DePqtpQbApLXC6faD5EIJMNEG7GH+414vOlulU/MRmJOigd3ieNEPcYV498ooICl4xIpymviAEKxUOKr9vdqFcZpYArktkOXTksjTH6HeIuT04MAZuUpYFpWPZvkEuu0gAATQUDK81ZzWYFZtFfiHuDut4HxXkL5eu6U3AKxAreYEMuGo+qgtbKgFJw3hv8y7GLilhhXwM9XwWhi71eISrz3unLZAlJ7BdFfYDy1ExpGNs3kN3G/i8JkGhwqrYyaRtZ9ncCRa4PzNeCfZtY9rVRgcckYR2Mt7n/trN9jnGNloX/55wnEkmYsICpNPq5UYMnIDdKKZLPF3V548XnuuXLBvxpzOjFOP3GSnY5pyNVbYC4nHxHHt+Hch+AsM8Viu5mfuAzcIS5jG9yQnCmYjNar/BFgAKopo/z149RnAAAAAElFTkSuQmCC") no-repeat scroll center center rgba(0, 0, 0, 0.5);}\
		#tc_change_wrap li:hover{background:rgba(255,255,255,.5);}\
		#tc_change_wrap li img{width:95%}\
		.i_change_btn{position:absolute;left:20px;top:10px;}\
		.ui_btn_change,.ui_btn_font,.ui_btn_anew{float:left;margin-right:10px;}\
		.ui_tc_next{float:left;margin-right:10px;display:none;}\
		.ui_tc_done{float:left;margin-right:10px;}\
		#tc_change_wrap > ul{clear:both;}\
		#tc_change_wrap li a{cursor:pointer;position:relative;display:block;overflow:hidden;}\
		#tc_change_wrap li a:hover .cut{display:block;}\
		#close_wrap{float:right;padding-right: 5px;font: bold 20px/30px 微软雅黑;color:#fff;cursor:pointer;}\
		#tc_baobao_wrap{text-align:center;}\
		#tc_baobao{font-family:微软雅黑;font-size:20px;width:575px;text-align:center;padding:10px;height:162px;margin-top:100px;}\
		#tc_status{position:absolute;left:242px;top:11px;text-indent:30px;\
		line-height: 24px;height:24px;display:none;\
		background:url("data:image/gif;base64,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") no-repeat scroll 0 center;}\
		';
    $(document.head).append('<style>'+cssText+'</style>');
    
    init();
    
})(jQuery,unsafeWindow,undefined);
