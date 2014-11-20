// ==UserScript==
// @name         Post Del Robot
// @namespace    http://blog.sylingd.com
// @version      5
// @description  删帖机器人
// @author       ShuangYa
// @match        http://tieba.baidu.com/f?*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at		 document-end
// @require		 http://libs.baidu.com/jquery/1.11.1/jquery.min.js
// @updateURL 	 https://github.com/FirefoxBar/userscript/raw/master/Post_Del_Robot/PostDelRobot.meta.js
// @downloadURL  https://github.com/FirefoxBar/userscript/raw/master/Post_Del_Robot/PostDelRobot.user.js
// ==/UserScript==
(function() {
	//贴子列表
	var tielist = [],
	meinput = '',
	/*
	 * 检查一些运行脚本的必要条件
	 * @return boolean
	*/
	checkMe = function() {
		//检查是否在贴子列表页
		if (typeof(unsafeWindow.PageData) === 'undefined') {
			alert('PageData未定义，脚本无法运行');
			return false;
		}
		//检查是否为吧务，通过右侧“进入吧务后台”的按钮检查
		if ($('.tbAdminManage').length <= 0) {
			alert('您不是本吧吧务');
			return false;
		}
		return true;
	},
	/*
	 * 添加到删帖列表
	 * @param string text 搜索结果页的HTML
	 * @return boolean
	*/
	addToList = function(text) {
		//楼中楼部分
		//回贴部分
		var reply = text.match(/\/p\/(\d+)\?pid=(\d+)/gi);
		if (reply === null) reply = [];
		//替换已匹配内容，避免重复匹配
		text = text.replace(/\/p\/(\d+)\?pid=(\d+)/gi, '');
		var leng = reply.length - 1,
		i, one;
		for (i = 0; i <= leng; i++) {
			one = reply[i].match(/\/p\/(\d+)\?pid=(\d+)/i);
			tielist.push({
				"type": 1,
				"tid": one[1],
				"pid": one[2]
			});
		}
		//主题部分
		var post = text.match(/\/p\/(\d+)/gi);
		if (post === null) post = [];
		leng = post.length - 1;
		for (i = 0; i <= leng; i++) {
			one = post[i].match(/\/p\/(\d+)/i);
			tielist.push({
				"type": 2,
				"tid": one[1]
			});
		}
		//返回是否继续抓取下一页
		return (reply.length > 0 || post.length > 0);
	},
	/*
	 * 通过用户ID进行删帖
	 * @param string user 用户ID
	 * @param int page 页码
	*/
	delByUser = function(user, page) {
		logResult('正在获取贴子列表（第' + page + '页）');
		GM_xmlhttpRequest({
			"method": 'GET',
			"url": 'http://tieba.baidu.com/f/search/ures?kw=' + unsafeWindow.PageData.forum.name_url + '&qw=&rn=10&un=' + encodeURIComponent(user) + '&sm=1&pn=' + page,
			"onload": function(response) {
				//匹配出搜索结果的所有贴子
				var result = response.responseText;
				if (addToList(result) && page < 5) { //防止因为数量过大造成的卡顿
					delByUser(user, page + 1); //自调用，继续获取
				} else { //获取完毕，开始删帖
					logResult('获取贴子列表完成！');
					if (tielist.length > 0) {
						delByList(0);
					} else {
						logResult('没有任何贴子！');
						Stop();
					}
				}
			}
		});
	},
	/*
	 * 通过关键字进行删帖
	 * @param string keyword 关键字
	 * @param int page 页码
	*/
	delByKeyword = function(keyword, page) {
		logResult('正在获取贴子列表（第' + page + '页）');
		GM_xmlhttpRequest({
			"method": 'GET',
			"url": 'http://tieba.baidu.com/f/search/res?kw=' + unsafeWindow.PageData.forum.name_url + '&qw=' + encodeURIComponent(keyword) + '&rn=10&un=&sm=1&pn=' + page,
			"onload": function(response) {
				//匹配出搜索结果的所有贴子
				var result = response.responseText;
				if (addToList(result) && page < 5) { //防止因为数量过大造成的卡顿
					delByKeyword(keyword, page + 1); //自调用，继续获取
				} else { //获取完毕，开始删帖
					logResult('获取贴子列表完成！');
					if (tielist.length > 0) {
						delByList(0);
					} else {
						logResult('没有任何贴子！');
						Stop();
					}
				}
			}
		});
	},
	/*
	 * 按已建立的列表删帖
	 * @param int num 对应列表中的Key
	*/
	delByList = function(num) {
		var fid = unsafeWindow.PageData.forum.forum_id,
		kw = unsafeWindow.PageData.forum.name,
		leng = tielist.length - 1,
		me = tielist[num],
		postdata = {
			"commit_fr": "pb",
			"ie": "utf-8",
			"kw": kw,
			"fid": fid,
			"tid": me.tid,
			"tbs": unsafeWindow.PageData.tbs
		}
		if (me.type == 1) { //回贴
			postdata.pid = me.pid;
		} else if (me.type == 2) { //主题
		} else if (me.type == 3) { //楼中楼
		}
		//GM的ajax不知道为什么不能用，就用jQuery的吧
		$.ajax({
			"type": 'POST',
			"data": postdata,
			"url": '/f/commit/post/delete',
			"success": function(response) {
				// 确认删帖结果
				result = eval('(' + response + ')');
				if (result.err_code == 0) {
					logResult('删除贴子成功！主题ID：' + me.tid);
					if (num != leng) { //调用自身
						delByList(num + 1);
					}
				} else {
					console.log(postdata);
					console.log(result);
					logResult('删除贴子失败！主题ID：' + me.tid);
					if (result.err_code == '224011') {
						logResult('触发验证码，停止删帖（解决办法：刷新当前网页）');
						GM_setClipboard(meinput);
						logResult('提示：本次用户ID/关键词已经复制到剪贴板');
						Stop();
						$('#sy_del_reload').show();
					} else {
						if (num != leng) { //调用自身
							delByList(num + 1);
						} else {
							Stop();
						}
					}
				}

			}
		});
	},
	/*
	 * 记录结果
	 * @param string info 信息
	*/
	logResult = function(info) {
		var e = $('#sy_del_info');
		e.append('<p>' + info + '</p>');
	},
	/*
	 * 结束函数
	*/
	Stop = function() {
		var btn = $('#sy_del_close');
		btn.bind('click',
		function() {
			$('#sy_del_dialog').hide();
			$('#sy_del_full').hide();
		});
		btn.find('em').html('关闭');
		tielist = [];
		logResult('已结束运行');
	},
	/*
	 * 初始函数
	 * @param int type 类型，1为按用户ID
	*/
	Start = function(type) {
		var input;
		if (!checkMe()) return;
		//显示输入框
		if (type == 1) input = window.prompt('请输入用户ID');
		else if (type == 2) input = window.prompt('请输入关键词（不支持通配符、正则表达式）');
		else return;
		if (input) {
			//霸屏
			$('#sy_del_close').unbind('click');
			$('#sy_del_close').find('em').html('请稍候');
			$('#sy_del_reload').hide();
			$('#sy_del_dialog').show();
			$('#sy_del_full').show();
			meinput = input;
			if (type == 1) delByUser(input, 1);
			else if (type == 2) delByKeyword(input, 1);
			else return;
		}
	},
	Start_user = function() {
		Start(1);
	},
	Start_keyword = function() {
		Start(2);
	};
	//注册菜单
	if (window.location.href.match(/f\?(.*?)kw=/) !== null) { //确认是在贴子列表页
		GM_addStyle('#sy_del_full{position:fixed;background:rgba(0,0,0,0.6);width:100%;height:100%;top:0;left:0;color:white;z-index:99998;}#sy_del_dialog{position:fixed;z-index:99999;width:460px;height:400px;top:10px;left:50%;margin-left:-200px;}#sy_del_info{height:295px;padding:10px;}');
		$('body').append('<div id="sy_del_full"></div><div id="sy_del_dialog" class="dialogJ dialogJfix dialogJshadow ui-draggable m_dialog"><div class="uiDialogWrapper"><div style="-moz-user-select: none;" class="dialogJtitle"><span class="dialogJtxt">删帖机器人</span></div><div class="dialogJcontent"><div class="dialogJbody"><div id="sy_del_info"></div><div class="m_dialog_container j_m_dialog_container"><div class="m_button_panel clearfix"><a id="sy_del_close" class="ui_btn ui_btn_sub_m j_m_btn_cancel m_btn_cancel"><span><em>关闭</em></span></a><a id="sy_del_reload" class="ui_btn ui_btn_m j_m_btn_insert m_btn_insert" onclick="window.location.reload();"><span><em>立即刷新</em></span></a></div></div></div></div></div></div>');
		$('#sy_del_dialog').hide();
		$('#sy_del_full').hide();
		GM_registerMenuCommand('批量删帖（按用户ID）', Start_user);
		GM_registerMenuCommand('批量删帖（按关键词）', Start_keyword);
	}
})();