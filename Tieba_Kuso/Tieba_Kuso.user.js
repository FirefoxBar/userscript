(function(config){
   
    var canvas,ctx,avatar,userName,postNo,tip,postTip,render,selected;
    var editor = document.querySelector('#ueditor_replace'),
        fName = document.head.querySelectorAll('meta')[1].getAttribute('fname'),
        cssText = '.d_name:after{color: #b0b0b0;content: "\u2764";\
        cursor: pointer;display: inline-block;padding-left: 5px;}\
        #canvas-wrap{background:#e2e2e2;float:right;width:533px;height:410px;position:relative;}\
        #ks-tip{text-align:center;line-height:30px;}\
        #canvas{position:absolute;margin:auto;left:0;right:0;top:0;bottom:0;}\
        #kuso-cate{float:left;max-width:364px;}\
        #kuso-cate-hd a{display:inline-block;text-align:center;}\
        #kuso-cate-hd .cu{font-weight:bold;background-color:#ededed;color:#000000;}\
        #kuso-cate-bd {height:380px;overflow-y:auto;}\
        #kuso-cate-bd>div{display:none;}\
        #kuso-cate-bd>div:first-child{display:block;}\
        #kuso-cate-bd li{float:left;margin:10px;}\
        #kuso-cate-bd img{max-height:150px;max-width:140px;}\
        #kuso-cate a{line-height:30px;padding:0 10px;}\
        #kuso-cate-bd li a{display:inline-block;}\
        #kuso-cate-bd li a:hover img {box-shadow: 2px 2px 2px #999999;}\
        .dialogJshadow a{cursor:pointer;}',
        html = '<div class="uiDialogWrapper"><div class="dialogJcontent">\
        <div id="dialogJbody" class="dialogJbody" style="height: 510px;">\
        <div class="post_setting_wrap"><a title="关闭本窗口" class="dialogJclose">&nbsp;</a>\
        <div class="post_setting_title clearfix j_post_setting_title">\
        <a class="post_setting_tab j_post_setting_tab post_setting_tab_select j_post_setting_tab_select" attr-type="bubble">请点击选择要使用的效果</a></div>\
        <div class="post_setting_body j_post_setting_body" style="height:410px;">\
        <div id="kuso-cate"><div id="kuso-cate-bd"></div>\
        <div id="kuso-cate-hd"></div></div><div id="canvas-wrap">\
        <p id="ks-tip"></p>\
        <canvas id="canvas"></canvas></div>\
        </div><div class="post_setting_operation j_post_setting_operation">\
        <a class="ui_btn ui_btn_m post_setting_submit j_post_setting_submit">\
        <span><em>确 定</em></span></a><a class="ui_btn_disable ui_btn_m_disable j_post_setting_cancel">\
        <span><em>取 消</em></span></a><p id="kuso-tip"></p></div></div></div></div></div>';
    var  style = document.createElement('style');
    style.innerHTML = cssText;  

    var _ = {
        subStr: function(s,i){
            return s.replace(/[^\x00-\xff]/gi, '--').length > i
            ? s.substr(0,i/2-1)+"…" : s;
        },
        setCvsSize: function(w,h){
            canvas.width = w;
            canvas.height = h;
            canvas.style.width  = w + 'px';
            canvas.style.height = h + 'px';
        },
        preDraw: function(src,callback){
            var img = new Image();
            img.src = src;
            if(img.complete){
                return callback.call(img);
            }
            img.onload = function(){
                callback.call(img);
            }
        },
        ajax: function (method,url,callback){
            var xhr = new XMLHttpRequest;
            xhr.open(method || 'GET',url);
            xhr.send();
            xhr.onreadystatechange = function(e){
                if (xhr.readyState === 4){
                    callback(e);
                }
            }    
        },   
        dataUrlToBlob: function (dataURL) {
            var mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
            var byteString = atob(dataURL.split(',')[1]);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], { type: mimeString });
        },
        getDataURL: function (imgUrl,callback){
            GM_xmlhttpRequest ( {
                method:'GET',
                url:imgUrl,
                onload:function (respDetails) {
                    var binResp = _.customBase64Encode (respDetails.responseText);
                    dataURL = 'data:image/png;base64,'+ binResp;
//                    console.log(dataURL);
                    callback.call(dataURL);
                },
                overrideMimeType: 'text/plain; charset=x-user-defined'
            } );
        },
        customBase64Encode: function (inputStr) {
            var
                bbLen = 3,
                enCharLen = 4,
                inpLen = inputStr.length,
                inx = 0,
                jnx,
                keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
                    + '0123456789+/=',
                output = '',
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
    };
    
    /* Callback Hell */
    
    var effect = {
        wanted : function(img){
            _.setCvsSize(216,313);         
            _.getDataURL(img.base,function(){
                _.preDraw(this,function(){
                    ctx.drawImage(this,0,0);
                    _.getDataURL(avatar,function(){
                        _.preDraw(this,function(){
                            ctx.drawImage(this,53,76,110,110);
                            _.getDataURL(img.compound[0],function(){
                                _.preDraw(this,function(){
                                    ctx.drawImage(this,25,50);
                                    ctx.textAlign = 'center'
                                    ctx.font = '20px 微软雅黑';
                                    ctx.fillStyle = '#3b2c27';
                                    ctx.fillText(_.subStr(userName,18),108,246);
                                    ctx.font = '15px 微软雅黑';    
                                    ctx.fillText(_.subStr(fName,20)+'吧',108,270);                                        
                                });
                            });
                        });
                    });
                });
            })    
        },
        pork: function(img){
            _.setCvsSize(189,288);          
            _.getDataURL(img.base,function(){
                _.preDraw(this,function(){
                    ctx.drawImage(this,0,0);
                    _.getDataURL(avatar,function(){
                        _.preDraw(this,function(){
                            ctx.drawImage(this,40,78,110,110);
                            ctx.font = '15px 微软雅黑';
                            ctx.fillStyle = '#3b2c27';
                            //ctx.fillText("性别："+"男",40,225);    
                            ctx.textAlign = 'center'
                            ctx.fillText(_.subStr(userName,18),95,208); 
                            
                            _.getDataURL(img.compound[0],function(){
                                _.preDraw(this,function(){
                                    ctx.drawImage(this,0,0);                            
                                });
                            });
                        });
                    });
                });
            });        
        },
        game : function(img){
            _.setCvsSize(154,219);
            _.getDataURL(img.base,function(){
                _.preDraw(this,function(){
                    ctx.drawImage(this,0,0);
                    _.getDataURL(avatar,function(){
                        _.preDraw(this,function(){
                            ctx.drawImage(this,22,47,110,110);
                            ctx.font = '15px 楷体';
                            ctx.fillStyle = '#3b2c27';
                            ctx.fillText(_.subStr(userName,18),15,27);
                            ctx.font = '11px 宋体';    
                            ctx.fillText('【大水笔·效果】',14,180);     
                            ctx.fillText('经验：+233',18,195);
                        });
                    });
                });
            })                
        },
        hs : function(img){
            _.setCvsSize(190,255);           
            _.getDataURL(avatar,function(){
                _.preDraw(this,function(){
                    ctx.drawImage(this,40,16,110,110);
                    _.getDataURL(img.base,function(){
                        _.preDraw(this,function(){
                            ctx.drawImage(this,0,0);
                        });
                    });
                });
            })
        },
        hentai: function(img){
            _.setCvsSize(315,405);
            _.getDataURL(img.base,function(){
                _.preDraw(this,function(){
                    ctx.drawImage(this,0,0);
                    _.getDataURL(avatar,function(){
                        _.preDraw(this,function(){
                            ctx.drawImage(this,105,236,110,110);                            
                            _.getDataURL(img.compound[0],function(){
                                _.preDraw(this,function(){
                                    ctx.drawImage(this,0,0);
                                    ctx.font = '15px 微软雅黑';
                                    ctx.fillStyle = '#3b2c27';
                                    ctx.textAlign = 'center'
                                    ctx.fillText('变态',155,365);                                    
                                });
                            });
                        });
                    });
                });
            })                    
        },
        police : function(img){
            _.setCvsSize(533,300);           
            _.getDataURL(img.base,function(){
                _.preDraw(this,function(){
                    ctx.drawImage(this,0,0);
                    _.getDataURL(avatar,function(){
                        _.preDraw(this,function(){
                            ctx.rotate(Math.PI / 100 * 3);
                            ctx.drawImage(this,264,148,48,48);
                            _.getDataURL(img.compound[0],function(){
                                ctx.rotate(-Math.PI / 100 * 3);
                                _.preDraw(this,function(){
                                    ctx.drawImage(this,0,0);
                                        ctx.textAlign = 'center'
                                        ctx.font = 'bold 25px 微软雅黑';
                                        ctx.fillStyle = '#ffffff';
                                        ctx.strokeStyle = '#000000';
                                        ctx.strokeText('警察叔叔，就是 @'+userName+' 这个人！',266,287);
                                        ctx.fillText('警察叔叔，就是 @'+userName+' 这个人！',266,287);
                                });
                            });
                        });
                    });
                });
            })
        }        
    }
   
    document.head.appendChild(style);
    
    var postList = document.querySelector('#j_p_postlist');
    postList.addEventListener('click',function(e){
        var target = e.target;
        'd_name' === target.className && (function(){
        
            render = effect.wanted;
            selected = config.wanted;
            
            var face = target.parentNode.querySelector('.p_author_face>IMG');
            //头像中图
            avatar = face.src.replace('portrait','portraitm');    
            var d = target.parentNode.parentNode.parentNode,
                field = JSON.parse(d.dataset.field);
            postNo = field.content.post_no,
            userName = field.author.user_name;
            var dialog = document.createElement('div');
            dialog.className = 'dialogJ dialogJfix dialogJshadow';
            dialog.style.zIndex = '50000';
            dialog.style.width = '900px';
            dialog.style.left = (document.documentElement.clientWidth <= 900 
            ? 0 : document.documentElement.clientWidth / 2 - 450) + 'px';
            dialog.style.top = (document.documentElement.clientHeight <= 544
            ? 0 : document.documentElement.clientHeight / 2 - 272) + 'px';
            dialog.innerHTML = html;
            document.body.appendChild(dialog);
            
            dialog.addEventListener('click',function(e){
                var target = e.target;
                if(target.className === 'dialogJclose'){
                    document.body.removeChild(this);
                }
                if(target.className === 'kuso-draw'){
                    postTip.innerHTML = selected.description.replace('$1',postNo).replace('$2',userName);
                    render({
                        'base' : target.src,
                        'compound' : selected.compound
                    });
                }
            },false);
            
            dialog.querySelector('.j_post_setting_submit').addEventListener('click',function(){
                _.ajax('GET','http://tieba.baidu.com/dc/common/imgtbs?t=' + new Date().getTime(),function(e){
                    var json = JSON.parse(e.target.responseText);
                    upload(json.data.tbs);
                });        
            },false);
            dialog.querySelector('.ui_btn_disable').addEventListener('click',function(){
                document.body.removeChild(dialog);
            });
            
            var cateHd = '',
            cateBd = '',
            count = 1;
            
            for (var i in config){
                var h = "";
                config[i].base.forEach(function(i,j){
                    h += '<li><a><img class="kuso-draw" src="'+i+'" data-i="' +j+ '"></a></li>';
                });     
                cateHd += '<a data-c="' +(count++)+ '" data-e="' +i+ '">' +config[i].name+ '</a>';
                cateBd += '<div data-c="' +(count-1)+ '"><ul>' +h+ '</ul></div>';
            } 
            
            dialog.querySelector('#kuso-cate-bd').innerHTML = cateBd;
            var tab = dialog.querySelectorAll('#kuso-cate-bd >div');
            var hd = dialog.querySelector('#kuso-cate-hd');
            hd.innerHTML = '<ul>' +cateHd + '</ul>';
            var a = hd.querySelectorAll("a");
            a[0].className = 'cu';
            
            hd.addEventListener('click',function(e){
                var target = e.target;
                if(target.nodeName === 'A'){
                    var dataSet = target.dataset.e;
                    render = effect[dataSet];
                    selected = config[dataSet];
                    Array.prototype.forEach.call(a,function(i){
                        i.classList.contains('cu') &&
                        i.classList.remove('cu');
                    });
                    if(!target.classList.contains('cu')){
                        target.classList.add('cu');
                    }
                    var c = target.dataset.c;
                    Array.prototype.forEach.call(tab,function(i){
                        i.style.display = 'none';
                        if(i.dataset.c === c){
                            i.style.display = 'block';
                        }
                    });
                }
            });
            
            canvas = document.getElementById('canvas');
            ctx = canvas.getContext('2d');
            ctx.globalCompositeOperation = 'source-over';    
            tip = document.querySelector('#kuso-tip');
            postTip = document.querySelector('#ks-tip');
            
        })();
    },false);
    
    function upload(tbs) {
        var dataURL = canvas.toDataURL()
        var blob = _.dataUrlToBlob(dataURL);
        
        var data = new FormData();
        data.append('file', blob);
        data.append('tbs', tbs);
                    
        var fileXHR = new XMLHttpRequest();    
        fileXHR.withCredentials = true;
        fileXHR.upload.onprogress = progressHandler;
        fileXHR.onload = onloadHandler;
        fileXHR.open('post','http://upload.tieba.baidu.com/upload/pic',true);
        fileXHR.send(data);    
    }  

    function onloadHandler (r) {
        try{ 
            var
                r = JSON.parse(r.target.responseText),
                fullWidth = r.info.fullpic_width,
                fullHeight = r.info.fullpic_height,
                picId = r.info.pic_id_encode;
                pic = 'http://imgsrc.baidu.com/forum/pic/item/' +picId+ '.jpg';
            document.body.removeChild(document.querySelector('.dialogJshadow'));
            window.scrollTo(0,2333333);
            var at = document.createElement('p');
            at.innerHTML = selected.description.replace('$1',postNo).replace('$2',userName);
            var p = document.createElement('p');
            p.innerHTML = '<img class="BDE_Image" width="'+fullWidth+'" height="'+fullHeight+'" src="'+pic+'">';
            setTimeout(function(){
                editor.appendChild(at);
                editor.appendChild(p);
            },500);
        }
        catch(e){
            tip.innerHTML = '<b style="color:red">上传出现异常，请重试。</b>';
        } 
    }

    function progressHandler(e){
        if(e.lengthComputable){
            var howmuch = (e.loaded / e.total) * 100;
            tip.innerHTML = '正在上传: ' +Math.ceil(howmuch)+ '%';    
        }
    }
    
})({
    wanted : {
        name : "海贼王",
        description : "活捉 $1 楼 @$2 大水笔<br>",
        base : ["http://imgsrc.baidu.com/forum/pic/item/c657f1899e510fb350bf99f8da33c895d0430c51.jpg"],
        compound : ["http://imgsrc.baidu.com/forum/pic/item/5b1314510fb30f24223c026ccb95d143ac4b0351.jpg"],
    },
    pork : {
        name : "扑克牌",
        description : "对 $1 楼 @$2 使用：<br>",
        base : [
            "http://imgsrc.baidu.com/forum/pic/item/1432d4df8db1cb132a129943de54564e93584b85.jpg",
            "http://imgsrc.baidu.com/forum/pic/item/7e4507b1cb1349546d654d34554e9258d0094a85.jpg",
            "http://imgsrc.baidu.com/forum/pic/item/05b75e2a2834349b1b7dcbd5caea15ce37d3be85.jpg",
            "http://imgsrc.baidu.com/forum/pic/item/a2bc45fc1e178a826d2ec8f1f503738da877e8e8.jpg",
            "http://imgsrc.baidu.com/forum/pic/item/81110dd6277f9e2fedf7a9591c30e924b999f338.jpg",
            "http://imgsrc.baidu.com/forum/pic/item/f189f9f082025aaf663ec99af8edab64024f1ae9.jpg"
        ],
        compound : ["http://imgsrc.baidu.com/forum/pic/item/6b6171edab64034fc1b66756acc379310b551d85.jpg"]
    },
    game : {
        name : "游戏王",
        description : "对 $1 楼 @$2 使用：<br>",
        base :["http://imgsrc.baidu.com/forum/pic/item/bfa772dcd100baa14472fdeb4410b912c9fc2e9a.jpg"],
        compound : []
    },
    hs : {
        name : "炉石传说",
        description : "对 $1 楼 @$2 使用：<br>",
        base: [
            "http://imgsrc.baidu.com/forum/pic/item/a2bc45fc1e178a827f2edaf0f503738da877e8ef.jpg",
            "http://imgsrc.baidu.com/forum/pic/item/f4a50d94a4c27d1e44349e9418d5ad6edcc438ee.jpg",
            "http://imgsrc.baidu.com/forum/pic/item/23a1d1b5c9ea15ce2a944559b5003af33b87b286.jpg",
            "http://imgsrc.baidu.com/forum/pic/item/2860db3d269759ee3ef9d19ab1fb43166c22df54.jpg"
        ],
        compound : []
    },
    hentai : {
        name : "变态",
        description : "$1 楼 @$2 你个大变态！<br>",
        base : ["http://imgsrc.baidu.com/forum/pic/item/a2112c1ea8d3fd1f3672076a334e251f94ca5f85.jpg"],
        compound: ["http://imgsrc.baidu.com/forum/pic/item/8849771f4134970a4961b57f96cad1c8a6865dee.jpg"]
    },
    police : {
        name: "警察叔叔",
        description : "警察叔叔，就是 $1 楼 @$2 这个人<br>",
        base : [
            "http://imgsrc.baidu.com/forum/pic/item/05851fcad1c8a78663e71b5f6409c93d71cf5028.jpg",
            "http://imgsrc.baidu.com/forum/pic/item/b075fcc6a7efce1be35d9e9bac51f3deb58f6583.jpg",
            "http://imgsrc.baidu.com/forum/pic/item/bbcac5c2d56285356065b17093ef76c6a6ef6370.jpg"
        ],
        compound: ["http://imgsrc.baidu.com/forum/pic/item/5b6e80d162d9f2d34b0f4fbeaaec8a136227ccdb.jpg"]        
    }
});