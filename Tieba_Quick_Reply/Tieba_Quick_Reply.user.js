;(function($,PageData){
    const
        kw = PageData.forum.name,
        fid = PageData.forum.id,
        url = "http://tieba.baidu.com/f/commit/post/add",
        tbs = PageData.tbs,
        replyContent = ["文科大法好！"],
        cssText ="#home_reply li a{display:block;padding-left:10px;\
        cursor:pointer;line-height:30px;font-size:15px;}\
		#home_reply{max-height:380px;overflow-y:auto;}\
		#home_reply li{border-bottom:1px dashed #e2e2e2;}\
        #home_reply li a:hover{background:#e2e2e2;}\
        #home_reply li a:hover span{display:inline-block;}\
        .dialogJtxt b{color:red;}\
        #home_reply li span{float:right;display:none;\
		background:url('http://tb2.bdstatic.com/tb/static-common/img/tb_ui/tb_dialog_close_3478e87.png');\
		width:14px;height:13px;margin:8px;}\
		#home_reply li span:hover{background-position:0 13px;}\
        .threadlist_rep_num{cursor:pointer}\
        #add_reply{background:#e2e2e2;color: #fff;display: block;cursor:pointer;\
        font-size: 20px;line-height: 30px;text-align: center;}\
        #add_reply:hover{background:#e6e6e6;}\
        .reply_text{width:550px;line-height:30px;border:1px solid #e2e2e2;}\
		#reply_btn{margin-right: 20px;cursor:pointer;}\
        ";
    
    var tid,
        replyStorage = {
            set handler(ls){
                return localStorage["quickreply"] = JSON.stringify(ls);
            },
            setStorage : function(value){
                var reply = quickReply.reply;
                reply.push(value);
                this.handler = quickReply;        
            },
            delStorage : function(key){
                quickReply.reply.splice(key, 1);
                this.handler = quickReply;        
            }
        },
		quickReply = localStorage["quickreply"] ?
			JSON.parse(localStorage["quickreply"]) :
			{"reply":replyContent};  
		
    function reply(content){
        var postData = {
            __type__ : "reply",
            content : content,
            fid : fid,
            files : "[]",
            floor_num : 16,
            ie : "utf-8",
            kw : kw,
            rich_text : 1,
            tbs : tbs,
            tid : tid,
            vcode_md5 : ""    
        }
        
        $.post(url,postData,function(r){
            r = JSON.parse(r);
            !(r.err_code) ? ($("#home_reply").html("回复成功"),
                setTimeout(function(){$(".dialogJclose").click()},1000))
            : $(".dialogJtxt").html("<b>回复失败!!</b>");
        });
    }
    
    $("#content_leftList").on("click",".threadlist_rep_num",function(e){
        tid = $(e.target).parents(".j_thread_list").data("field").id;
        var html = "";
        quickReply["reply"].forEach(function(i){
            html += "<li><a>"+i+"<span></span></a></li>";
        });
        
        $.tb.alert({
            title: '快捷回复',
            message: "",
            buttons:[{text: '关闭'}]
        });
        var w = $(window).width();
        var h = $(window).height();
        $(".dialogJ").css({
            "width":"600px",
            "top": h <= 555 ? 0 : (h - 555) / 2,
            "left": w <= 600 ? 0 : (w - 600) / 2
        })
        .find(".tb_alert_wrapper")
        .before("<div id='home_reply'><ul>"+html+"</ul></div>")
        .parents(".dialogJcontent")
        .find(".tb_alert_message")
        .before("<a id='add_reply'>+</a><input id='reply_text' class='reply_text' placeholder='回复内容'>")
		.next()
		.prepend('<a id="reply_btn" class="btn_default btn_middle"><span><em>发表</em></span></a>');
    });
    
    $(document.body).on("click","#home_reply li a",function(e){
        if(e.target.nodeName === "SPAN"){            
            var index = $(e.target).parent().parent().index();
            replyStorage.delStorage(index);
            return $(e.target).parent().parent().remove();
        }
        reply($(e.target).text());
    }).on("click","#add_reply",function(){
        $(this).before("<input class='reply_text' placeholder='新增回复列表'>")
        .prev().focus().blur(function(){
            $(this).remove();
            if ($(this).val() === "") return;
            replyStorage.setStorage($(this).val());
            $("#home_reply ul").append("<li><a>"+$(this).val()+"<span></span></a></li>");
        });
    }).on("click","#reply_btn",function(){
		var text = $("#reply_text").val();
		text !== "" && reply(text);
	});
	
    $(document.head).append("<style>"+cssText+"</style>");
})(unsafeWindow.$,unsafeWindow.PageData,undefined);