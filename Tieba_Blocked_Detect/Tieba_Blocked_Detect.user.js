// ==UserScript==
// @name 贴吧贴子屏蔽检测
// @version 1.1.2
// @description 贴吧都快凉了，过去的痕迹都没了，你为什么还在刷贴吧呢？你们建个群不好吗？
// @match *://tieba.baidu.com/*
// @include *://tieba.baidu.com/*
// @grant none
// @author 864907600cc
// @icon https://secure.gravatar.com/avatar/147834caf9ccb0a66b2505c753747867
// @namespace http://ext.ccloli.com
// @license GPL-3.0
// @updateURL https://userscript.firefoxcn.net/js/Tieba_Blocked_Detect.meta.js
// @downloadURL https://userscript.firefoxcn.net/js/Tieba_Blocked_Detect.user.js
// ==/UserScript==
'use strict';

let threadCache = {};
let replyCache = {};

/**
 * 精简封装 fetch 请求，自带请求 + 通用配置 + 自动 .text()
 *
 * @param {string} url - 请求 URL
 * @param {object} [options={}] - fetch Request 配置
 * @returns {Promise<string>} fetch 请求
 */
const request = (url, options = {}) => fetch(url, Object.assign({
	credentials: 'omit',
	// 部分贴吧（如 firefox 吧）会强制跳转回 http
	redirect: 'follow',
	// 阻止浏览器发出 CORS 检测的 HEAD 请求头
	mode: 'same-origin',
	headers: {
		'X-Requested-With': 'XMLHttpRequest'
	}
}, options)).then(res => res.text());

/**
 * 延迟执行
 *
 * @param {number} time - 延迟毫秒数
 */
const sleep = time => new Promise(resolve => setTimeout(resolve, time));

/**
 * 获取当前用户是否登录
 * 
 * @returns {number|boolean} 是否登录，若已登录，贴吧页为 1，贴子页为 true
 */
const getIsLogin = () => window.PageData.user.is_login;

/**
 * 获取当前用户的用户名
 *
 * @returns {string} 用户名
 */
const getUsername = () => window.PageData.user.name || window.PageData.user.user_name;

/**
 * 获取当前用户的 portrait（适用于无用户名）
 *
 * @returns {string} portrait
 */
const getPortrait = () => window.PageData.user.portrait.split('?').shift();

/**
 * 获取 \u 形式的 unicode 字符串
 *
 * @param {string} str - 需要转码的字符串
 * @returns {string} 转码后的字符串
 */
const getEscapeString = str => escape(str).replace(/%/g, '\\').toLowerCase();

/**
 * 获取主题贴的移动端地址
 *
 * @param {number} tid - 贴子 id
 * @returns {string} URL
 */
const getThreadMoUrl = tid => `//tieba.baidu.com/mo/q-----1-1-0----/m?kz=${tid}`;

/**
 * 获取回复贴的移动端地址
 *
 * @param {number} tid - 贴子 id
 * @param {number} pid - 回复 id
 * @param {number} [pn=0] - 页码
 * @returns {string} URL
 */
const getReplyMoUrl = (tid, pid, pn = 0) => `//tieba.baidu.com/mo/q-----1-1-0----/flr?pid=${pid}&kz=${tid}&pn=${pn}`;

/**
 * 获取回复贴的 ajax 地址
 *
 * @param {number} tid - 贴子 id
 * @param {number} pid - 主回复 id
 * @param {number} spid - 楼中楼回复 id
 * @param {number} [pn=0] - 页码
 * @returns {string} URL
 */
const getReplyUrl = (tid, pid, pn = 0) => `//tieba.baidu.com/p/comment?tid=${tid}&pid=${pid}&pn=${pn}&t=${Date.now()}`;

/**
 * 从页面内容判断贴子是否直接消失
 *
 * @param {string} res - 页面内容
 * @returns {boolean} 是否被屏蔽
 */
const threadIsNotExist = res => res.indexOf('您要浏览的贴子不存在') >= 0 || res.indexOf('(共0贴)') >= 0;

/**
 * 获取主题贴是否被屏蔽
 *
 * @param {number} tid - 贴子 id
 * @returns {Promise<boolean>} 是否被屏蔽
 */
const getThreadBlocked = tid => request(getThreadMoUrl(tid))
	.then(threadIsNotExist);

/**
 * 获取回复贴是否被屏蔽
 *
 * @param {number} tid - 贴子 id
 * @param {number} pid - 回复 id
 * @returns {Promise<boolean>} 是否被屏蔽
 */
const getReplyBlocked = (tid, pid) => request(getReplyMoUrl(tid, pid))
	.then(res => threadIsNotExist(res) || res.indexOf('刷新</a><div>楼.&#160;<br/>') >= 0);

/**
 * 获取楼中楼是否被屏蔽
 *
 * @param {number} tid - 贴子 id
 * @param {number} pid - 主回复 id
 * @param {number} spid - 楼中楼回复 id
 * @returns {Promise<boolean>} 是否被屏蔽
 */
const getLzlBlocked = (tid, pid, spid) => request(getReplyUrl(tid, pid))
	// 楼中楼 ajax 翻页后被屏蔽的楼中楼不会展示，所以不需要考虑 pn，同理不需要考虑不在第一页的楼中楼
	.then(res => threadIsNotExist(res) || res.indexOf(`<a rel="noopener" name="${spid}">`) < 0);

/**
 * 获取触发 CSS 样式
 *
 * @param {string} username - 用户名
 * @returns {string} 样式表
 */
const getTriggerStyle = ({ username, portrait }) => {
	const escapedUsername = getEscapeString(username).replace(/\\/g, '\\\\');

	return `
		/* 使用 animation 监测 DOM 变化 */
		@-webkit-keyframes __tieba_blocked_detect__ {}
		@-moz-keyframes __tieba_blocked_detect__ {}
		@keyframes __tieba_blocked_detect__ {}

		/* 主题贴 */
		#thread_list .j_thread_list[data-field*='"author_name":"${escapedUsername}"'],
		#thread_list .j_thread_list[data-field*='"author_portrait":"${portrait}"'],
		/* 回复贴 */
		#j_p_postlist .l_post[data-field*='"user_name":"${escapedUsername}"'],
		#j_p_postlist .l_post[data-field*='"portrait":"${portrait}"'],
		/* 楼中楼 */
		.j_lzl_m_w .lzl_single_post[data-field*="'user_name':'${username}'"],
		.j_lzl_m_w .lzl_single_post[data-field*="'portrait':'${portrait}'"] {
			-webkit-animation: __tieba_blocked_detect__;
			-moz-animation: __tieba_blocked_detect__;
			animation: __tieba_blocked_detect__;
		}

		/* 被屏蔽样式 */
		.__tieba_blocked__,
		.__tieba_blocked__ .d_post_content_main {
			background: rgba(255, 0, 0, 0.05);
			position: relative;
		}
		.__tieba_blocked__.core_title {
			background: #fae2e3;
		}
		.__tieba_blocked__::before {
			background: #f22737;
			position: absolute;
			padding: 5px 10px;
			color: #ffffff;
			font-size: 14px;
			line-height: 1.5em;
			z-index: 399;
		}
		.__tieba_blocked__.lzl_single_post {
			margin-left: -15px;
			margin-right: -15px;
			margin-bottom: -6px;
			padding-left: 15px;
			padding-right: 15px;
			padding-bottom: 6px;
		}

		.__tieba_blocked__.j_thread_list::before,
		.__tieba_blocked__.core_title::before {
			content: '该贴已被屏蔽';
			right: 0;
			top: 0;
		}
		.__tieba_blocked__.l_post::before {
			content: '该楼层已被屏蔽';
			right: 0;
			top: 0;
		}
		.__tieba_blocked__.lzl_single_post::before {
			content: '该楼中楼已被屏蔽';
			left: 0;
			bottom: 0;
		}
	`;
};

/**
 * 检测贴子/回复屏蔽回调函数
 *
 * @param {AnimationEvent} event - 触发的事件对象
 */
const detectBlocked = (event) => {
	if (event.animationName !== '__tieba_blocked_detect__') {
		return;
	}

	const { target } = event;
	const { classList } = target;
	let checker;

	if (classList.contains('j_thread_list')) {
		const tid = target.dataset.tid;
		if (threadCache[tid] !== undefined) {
			checker = threadCache[tid];
		}
		else {
			checker = getThreadBlocked(tid).then(result => {
				threadCache[tid] = result;
				// saveCache('thread');

				return result;
			});
		}
	}
	else if (classList.contains('l_post')) {
		const tid = window.PageData.thread.thread_id;
		const pid = target.dataset.pid || '';
		if (!pid) {
			// 新回复可能没有 pid
			return;
		}

		if (replyCache[pid] !== undefined) {
			checker = replyCache[pid];
		}
		else {
			// 回复时直接取值结果不准确，延迟 5 秒后请求
			checker = sleep(5000).then(() => getReplyBlocked(tid, pid).then(result => {
				replyCache[pid] = result;
				// saveCache('reply');
				try {
					if (result && JSON.parse(target.dataset.field).content.post_no === 1) {
						document.querySelector('.core_title').classList.add('__tieba_blocked__');
					}
				}
				catch (err) {
					// pass through
				}

				return result;
			}));
		}
	}
	else if (classList.contains('lzl_single_post')) {
		const field = target.dataset.field || '';
		const parent = target.parentElement;
		const pageNumber = parent.querySelector('.tP');
		if (pageNumber && pageNumber.textContent.trim() !== '1') {
			// 翻页后的楼中楼不会显示屏蔽的楼中楼，所以命中的楼中楼一定是不会屏蔽的，不需要处理
			return;
		}

		const tid = window.PageData.thread.thread_id;
		const pid = (field.match(/'pid':'?(\d+)'?/) || [])[1];
		const spid = (field.match(/'spid':'?(\d+)'?/) || [])[1];
		if (!spid) {
			// 新回复没有 spid
			return;
		}

		if (replyCache[spid] !== undefined) {
			checker = replyCache[spid];
		}
		else {
			checker = getLzlBlocked(tid, pid, spid).then(result => {
				replyCache[spid] = result;
				// saveCache('reply');

				return result;
			});
		}
	}

	if (checker) {
		Promise.resolve(checker).then(result => {
			if (result) {
				classList.add('__tieba_blocked__');
			}
		});
	}
};

/**
 * 初始化样式
 *
 * @param {object} param - 用户参数
 */
const initStyle = (param) => {
	const style = document.createElement('style');
	style.textContent = getTriggerStyle(param);
	document.head.appendChild(style);
};

/**
 * 初始化事件监听
 *
 */
const initListener = () => {
	document.addEventListener('webkitAnimationStart', detectBlocked, false);
	document.addEventListener('MSAnimationStart', detectBlocked, false);
	document.addEventListener('animationstart', detectBlocked, false);
};

/**
 * 加载并没有什么卵用的缓存
 *
 */
const loadCache = () => {
	const thread = sessionStorage.getItem('tieba-blocked-cache-thread');
	const reply = sessionStorage.getItem('tieba-blocked-cache-reply');
	if (thread) {
		try {
			threadCache = JSON.parse(thread);
		}
		catch (error) {
			// pass through
		}
	}
	if (reply) {
		try {
			replyCache = JSON.parse(reply);
		}
		catch (error) {
			// pass through
		}
	}
};

/**
 * 保存并没有什么卵用的缓存
 *
 * @param {string} key - 缓存 key
 */
const saveCache = (key) => {
	if (key === 'thread') {
		sessionStorage.setItem('tieba-blocked-cache-thread', JSON.stringify(threadCache));
	}
	else if (key === 'reply') {
		sessionStorage.setItem('tieba-blocked-cache-reply', JSON.stringify(replyCache));
	}
};

/**
 * 初始化执行
 *
 */
const init = () => {
	if (getIsLogin()) {
		const username = getUsername();
		const portrait = getPortrait();
		// loadCache();
		initListener();
		initStyle({ username, portrait });
	}
};

init();