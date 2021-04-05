// ==UserScript==
// @name Cache Manager for Tieba Ueditor
// @version 0.7
// @description 基於貼吧內建之文字備份系統的管理器
// @include http://tieba.baidu.com/*
// @author Shyangs
// @grant none
// @require http://cdn.jsdelivr.net/localforage/1.2.0/localforage.min.js
// @icon http://tb.himg.baidu.com/sys/portrait/item/4daf736879616e6773fc03
// @namespace https://github.com/shyangs#cm4tu
// @license GPLv3; http://opensource.org/licenses/gpl-3.0.html
// @updateURL https://userscript.firefoxcn.net/js/Cache_Manager_for_Tieba_Ueditor.meta.js
// @downloadURL https://userscript.firefoxcn.net/js/Cache_Manager_for_Tieba_Ueditor.user.js
// ==/UserScript==
// localStorage_key: localStorage_value
// draft-66891597-635137-0: 1449481471315|<p><br></p>
// draft-{{user_id}}-{{forum_id}}-{{thread_id}}: {{備份時間，1969年1月1日00:00:00起算的毫秒數}}|{{備份內容}}

;(function(w, $, _, reg){


if(w.top !== w.self)return;
// Not in a frame

var opacity = 0.85;
var opacityImg = 0.4;
var previewTextLength = 36;

var bBgImg;
var fOption = function(){
	var arr = [['', Number.MAX_VALUE+'|<p>(请选择一个备份)</p>']];
	var str = '';
	var key;
	for(key in localStorage){
		reg.test(key) && arr.push([key, localStorage.getItem(key)]);
	}
	arr.sort(function(a, b){
		return Number(b[1].split('|')[0]) - Number(a[1].split('|')[0]);
	});
	arr.forEach(function(item){
		str += '<option value="'+ item[0] +'">'+
			_.escape(item[1].split('|')[1].substr(0, previewTextLength+7).slice(3, -4)) +
			'</option>';
	});
	return str;
};
var fCurrentDraftKey = function(){
	var el = $('#cm4tu-ui-select')[0];
	return el.getElementsByTagName('option')[el.selectedIndex].value;	
};
var fInsertBackupText = function(selector){
	var key = fCurrentDraftKey();
	var sHTML = key?localStorage.getItem(key).split('|')[1]:'';
	$(selector).html(sHTML);
};
var fUIupdate = function(){
	$('#cm4tu-ui-select').replaceWith('<select style="width: 100%" id="cm4tu-ui-select">'+fOption()+'</select>');
	$("#cm4tu-ui-select").change(function(){fInsertBackupText('#cm4tu-ui-textarea');});
	fInsertBackupText('#cm4tu-ui-textarea');
};
var fMain = function($toolbar){
	$('<div id="cm4tu-tbbtn" class="edui-btn edui-btn-name-list"><div>▤ 暂存</div></div>')
		.css({
			'cursor': 'pointer',
			'margin': '0 0 0 8px',
			'color': '#3163B6'})
		.appendTo($toolbar)
		.click(function(){
			var $ui = $('#cm4tu-ui');
			if($ui.length === 0){
				$('<div id="cm4tu-ui" '+(bBgImg?'class="cm4tu-ui-bgImg"':'')+'>'+
				'<div id="cm4tu-ui-title" style="text-align: center; text-decoration: underline;">Cache Manager for Tieba Ueditor<a id="cm4tu-ui-close" href="###" style="background-color: rgba(242, 217, 227, .8); float: right;">ｘ</a></div>'+
				'<div><select style="width: 100%" id="cm4tu-ui-select">'+fOption()+'</select></div>'+
				'<div style="padding-top: 10px;"><div style="width: 100%; height: 250px; outline: gray solid thin; overflow:auto;" id="cm4tu-ui-textarea"  contenteditable="false"></div></div>'+
				'<div id="cm4tu-ui-bottom"><div id="cm4tu-btn-insert" class="div-inline cm4tu-btn">插入</div><div id="cm4tu-btn-delete" class="div-inline cm4tu-btn">删除此笔</div><div id="cm4tu-btn-clear" class="div-inline cm4tu-btn">全部删除</div><div class="div-inline"><input id="cm4tu-checkbox-bgImg" type="checkbox" '+(bBgImg?'checked':'')+'/>背景图片(<a href="http://tieba.baidu.com/f?kw=%E5%A4%8F%E8%AF%AD%E9%81%A5&ie=utf-8">夏語遙</a>)</div><div class="div-inline"><a href="http://tieba.baidu.com/f?kw=firefox">Firefox吧</a><a href="http://firefoxbar.github.io/">项目组</a></div>出品</div>'+
				'</div>')
				.css({
					'z-index': 60006,
					'cursor': 'move',
					'bottom': '500px',
					'left': '10%',
					'width': '650px',
					'height': '300px',
					'padding': '15px 25px 35px 25px',
					'background': 'rgba(156, 214, 174, '+opacity+')'})
				.appendTo(document.body)
				.draggable({
					// 讓可能有捲軸的#cm4tu-ui-textarea元素不可拖動，使捲軸正常工作
					start: function(e, ui){
						if ($(e.originalEvent.target).is('#cm4tu-ui-textarea'))
						e.preventDefault();
					}
				});
				$('#cm4tu-ui-select').change(function(){fInsertBackupText('#cm4tu-ui-textarea');});
				$('#cm4tu-checkbox-bgImg').click(function(){
					localforage.setItem('bBgImg', this.checked, function(value){
						$('#cm4tu-ui').toggleClass('cm4tu-ui-bgImg');
						bBgImg = value;
					});
				});
				fInsertBackupText('#cm4tu-ui-textarea');
				$('#cm4tu-btn-insert').click(function(){
					fInsertBackupText('#ueditor_replace');
					$('#cm4tu-ui').hide();
				});
				$('#cm4tu-btn-delete').click(function(){
					if(fCurrentDraftKey()==='')return;
					localStorage.removeItem(fCurrentDraftKey());
					fUIupdate();
				});
				$('#cm4tu-btn-clear').click(function(){
					var key;
					for(key in localStorage){
						reg.test(key) && localStorage.removeItem(key);
					}
					fUIupdate();
					$('#cm4tu-ui').hide();
				});
				$('#cm4tu-ui-close').click(function(){
					$('#cm4tu-ui').hide();
					return false;
				});
			}else{
				fUIupdate();
				$ui.show();
			}
		});
};


$('head').append($('<style>\
#cm4tu-ui *{\
opacity: '+opacity+';\
}\
.cm4tu-ui-bgImg:after{\
background: url(http://imgsrc.baidu.com/forum/pic/item/db8e083df8dcd100995fea6a718b4710b8122f07.jpg);\
opacity: '+opacityImg+';\
width: 700px;\
height: 350px;\
bottom: 0;\
right: 0;\
position: absolute;\
z-index: -1;\
content: "";\
}\
#cm4tu-ui-textarea{\
cursor: not-allowed;\
}\
.cm4tu-btn{\
background: rgb(1, 152, 88);\
cursor: pointer;\
}\
.div-inline{\
margin-left: 15px;\
padding: 2px;\
display: inline;\
}\
#cm4tu-ui a{\
color: blue !important;\
}\
</style>'));

localforage.getItem('bBgImg', function(err, value){
	if(null === value){
		bBgImg = true;
		localforage.setItem('bBgImg', bBgImg);
	}else{
		bBgImg = value;
	}
});

var observer = new MutationObserver(function(mutations){
	mutations.forEach(function(mutation){
		if($('#cm4tu-tbbtn').length !== 0)return;
		var addedNodes = mutation.addedNodes;
		var ii = addedNodes.length;
		while(ii--){
			var $toolbar = $(addedNodes[ii]).find('.edui-btn-toolbar');
			if($toolbar.length === 0)continue;
			observer.disconnect();
			fMain($toolbar);
			break;
		}
	});
});
observer.observe($('#tb_rich_poster_container')[0], {childList: true, subtree: true});

var $toolbar = $('.edui-btn-toolbar');
if($('#cm4tu-tbbtn').length === 0 && $toolbar.length !== 0){
	fMain($toolbar);
}


})(window, window.$, window._, /^draft/);