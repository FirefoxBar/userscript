// ==UserScript==
// @name              Reading Mode
// @namespace         blog.sylingd.com
// @description       阅读模式
// @author            ShuangYa
// @include           http://blog.csdn.net/*/article/details/*
// @include      	  http://*.cnblogs.com/*/p/*
// @include     	  http://*.cnblogs.com/*/archive/*
// @include      	  http://*.cnblogs.com/*/articles/*
// @include      	  http://blog.sina.com.cn/s/blog_*.html
// @include      	  http://*.blog.163.com/blog/static/*
// @include      	  http://*.blog.sohu.com/*
// @include      	  http://blog.tianya.cn/post-*
// @include      	  http://blog.sciencenet.cn/blog-*
// @include      	  http://blog.chinaunix.net/uid-*
// @grant			  GM_setValue
// @grant			  GM_getValue
// @run-at            document-end
// @updateURL         https://github.com/FirefoxBar/userscript/raw/master/Reading_Mode/Reading_Mode.meta.js
// @downloadURL       https://github.com/FirefoxBar/userscript/raw/master/Reading_Mode/Reading_Mode.user.js
// @version           6
// ==/UserScript==

(function() {
    'use strict';
	let trimNewLines = (s) => {
		return s.replace(/^[\s\n]+/, "").replace(/[\s\n]+$/, "");
	};
	let removeAllStyle = (el) => {
		[].forEach.call(el.children, (child) => {
			removeAllStyle(child);
		});
		el.removeAttribute('color');
		el.removeAttribute('class');
		el.removeAttribute('style');
	};
	let rules = {
		'blog.csdn.net': {
			'title': () => {
				let c = document.querySelector(".article_title h1");
				if (c) {
					if (c.querySelector('a')) {
						return trimNewLines(c.querySelector('a').innerHTML);
					} else {
						return trimNewLines(c.children[0].innerHTML);
					}
				} else {
					 return trimNewLines(document.querySelector(".csdn_top").innerHTML);
				}
			},
			'content': () => {
				let c = (document.querySelector('.article_content') || document.querySelector('markdown_views')).cloneNode(true);
				removeAllStyle(c);
				return trimNewLines(c.innerHTML);
			}
		},
		'www.cnblogs.com': {
			'title': () => {
				return (document.querySelector(".postTitle a") || document.getElementById('cb_post_title_url')).innerHTML;
			},
			'content': "#cnblogs_post_body"
		},
		'blog.sina.com.cn': {
			'title': ".articalTitle .titName",
			'content': ".articalContent"
		},
		'blog.163.com': {
			'title': ".title .tcnt",
			'content': ".nbw-blog"
		},
		'blog.sohu.com': {
			'title': ".newBlog-title h2 span",
			'content': "#main-content"
		},
		'blog.tianya.cn': {
			'title': ".article a",
			'content': ".articletext"
		},
		'blog.sciencenet.cn': {
			'title': ".vw h1",
			'content': "#blog_article"
		},
		'blog.chinaunix.net': {
			'title': ".Blog_tit4 a",
			'content': ".Blog_wz1"
		}
	};

    let hostName = '';
	if (typeof(rules[window.location.host]) !== 'undefined') {
		hostName = window.location.host;
	} else {
		Object.keys(rules).forEach((h) => {
			if (window.location.host.includes(h)) {
				hostName = h;
			}
		});
	}

	let css = document.createElement('style');
	document.head.appendChild(css);
	let cssContent = '\
		body.show-reading {\
			overflow: hidden;\
		}\
		#sy_rm_show {\
			position: fixed;\
			bottom: 0;\
			left: 50%;\
			height: 46px;\
			width: 190px;\
			margin-left: -90px;\
			z-index: 99999998;\
			background-color: #FFF;\
			padding: 5px;\
			box-sizing: border-box;\
			box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);\
		}\
		#sy_rm_show button,\
		#sy_rm_box .option button {\
			background: 0 0;\
			border: none;\
			border-radius: 2px;\
			color: rgb(0, 0, 0);\
			position: relative;\
			height: 36px;\
			margin: 0;\
			min-width: 64px;\
			padding: 0 16px;\
			display: inline-block;\
			font-size: 14px;\
			font-weight: 500;\
			letter-spacing: 0;\
			overflow: hidden;\
			outline: none;\
			cursor: pointer;\
			text-align: center;\
			line-height: 36px;\
			transition: background-color .2s cubic-bezier(.4,0,.2,1);\
		}\
		#sy_rm_show button:hover,\
		#sy_rm_box .option button:hover {\
			background-color: rgba(158,158,158,.2);\
		}\
		#sy_rm_show button:active,\
		#sy_rm_box .option button:active {\
			background-color: rgba(158,158,158,.4);\
		}\
		#sy_rm_box {\
			position: fixed;\
			top: 0;\
			left: 0;\
			height: 100%;\
			width: 100%;\
			z-index: 99999999;\
			background-color: {READER_BG};\
			overflow: auto;\
			padding: 15px {READER_PADDING};\
			box-sizing: border-box;\
			font-family: "Microsoft YaHei", "PingFang SC", "Lantinghei SC", "WenQuanYi Zen Hei", sans-serif !important;\
			text-align: left !important;\
		}\
		#sy_rm_box .option {\
			margin-bottom: 20px;\
		}\
		#sy_rm_box .option * {\
			vertical-align: middle;\
			margin-right: 10px;\
		}\
		#sy_rm_box .option input[type="color"] {\
			padding: 0;\
			border: 0;\
			outline: none;\
			cursor: pointer;\
		}\
		#sy_rm_box .title {\
			font-size: {READER_TITLE_FONT_SIZE} !important;\
			padding-bottom: 20px;\
			border-bottom: 1px solid #000;\
			margin-bottom: 20px;\
			color: #000 !important;\
		}\
		#sy_rm_box .content {\
			font-size: {READER_CONTENT_FONT_SIZE} !important;\
			line-height: {READER_LINE_HEIGHT};\
			color: {READER_TEXT_COLOR} !important;\
			font-weight: {READER_TEXT_WEIGHT} !important;\
		}\
		';
	let box_bg = GM_getValue('box_bg') || '#ffffff';
	let text_color = GM_getValue('text_color') || '#000000';
	let content_font = GM_getValue('font_size') || 18;
	let box_padding = GM_getValue('box_padding') || 30;
	let box_line_height = GM_getValue('box_line_height') || 100;
	let font_weight = GM_getValue('font_weight') || 'normal';

	function openRM() {
		if (document.getElementById('sy_rm_box')) {
			document.getElementById('sy_rm_box').remove();
		}
		let rm = document.createElement('div');
		rm.id = "sy_rm_box";
		//选项
		let options = document.createElement('div');
		options.classList.add('option');
		rm.appendChild(options);
		//字体
		let font_incr = document.createElement('button');
		font_incr.addEventListener('click', () => {
			GM_setValue('font_size', ++content_font);
			applySetting();
		});
		font_incr.innerHTML = '增大字体';
		options.appendChild(font_incr);
		let font_less = document.createElement('button');
		font_less.addEventListener('click', () => {
			GM_setValue('font_size', --content_font);
			applySetting();
		});
		font_less.innerHTML = '减小字体';
		options.appendChild(font_less);
		//边距
		let padding_incr = document.createElement('button');
		padding_incr.addEventListener('click', () => {
			box_padding += 10;
			GM_setValue('box_padding', box_padding);
			applySetting();
		});
		padding_incr.innerHTML = '增大边距';
		options.appendChild(padding_incr);
		let padding_less = document.createElement('button');
		padding_less.addEventListener('click', () => {
			box_padding -= 10;
			GM_setValue('box_padding', box_padding);
			applySetting();
		});
		padding_less.innerHTML = '减小边距';
		options.appendChild(padding_less);
		//行距
		let line_height_incr = document.createElement('button');
		line_height_incr.addEventListener('click', () => {
			box_line_height += 25;
			GM_setValue('box_line_height', box_line_height);
			applySetting();
		});
		line_height_incr.innerHTML = '增大行距';
		options.appendChild(line_height_incr);
		let box_line_less = document.createElement('button');
		box_line_less.addEventListener('click', () => {
			box_line_height -= 25;
			GM_setValue('box_line_height', box_line_height);
			applySetting();
		});
		box_line_less.innerHTML = '减小行距';
		options.appendChild(box_line_less);
		//文字粗细
		let weight_select = document.createElement('select');
		[['lighter', '细体'], ['normal', '常规'], ['bold', '粗体']].forEach(function(e) {
			let a = document.createElement('option');
			a.value = e[0];
			a.innerHTML = e[1];
			weight_select.appendChild(a);
		});
		weight_select.querySelector('option[value="' + font_weight + '"]').selected = true;
		weight_select.addEventListener('change', () => {
			font_weight = weight_select.querySelector('option:checked').value;
			GM_setValue('font_weight', font_weight);
			applySetting();
		});
		options.appendChild(weight_select);
		//背景色
		let change_bg = document.createElement('label');
		change_bg.appendChild(document.createTextNode('背景颜色'));
		let change_bg_input = document.createElement('input');
		change_bg_input.value = box_bg;
		change_bg_input.type = 'color';
		change_bg.appendChild(change_bg_input);
		change_bg_input.addEventListener('change', () => {
			box_bg = change_bg_input.value;
			GM_setValue('box_bg', box_bg);
			applySetting();
		});
		options.appendChild(change_bg);
		//文字颜色
		let change_text_color = document.createElement('label');
		change_text_color.appendChild(document.createTextNode('文字颜色'));
		let change_text_color_input = document.createElement('input');
		change_text_color_input.value = text_color;
		change_text_color_input.type = 'color';
		change_text_color.appendChild(change_text_color_input);
		change_text_color_input.addEventListener('change', () => {
			text_color = change_text_color_input.value;
			GM_setValue('text_color', text_color);
			applySetting();
		});
		options.appendChild(change_text_color);
		//退出
		let exit_btn = document.createElement('button');
		exit_btn.addEventListener('click', () => {
			document.body.classList.remove('show-reading');
			rm.remove();
		});
		exit_btn.innerHTML = '退出阅读模式';
		options.appendChild(exit_btn);
		//标题
		let title = typeof(rules[hostName].title) === 'string' ? trimNewLines(document.querySelector(rules[hostName].title).innerHTML) : rules[hostName].title();
		let titleEl = document.createElement('div');
		titleEl.classList.add('title');
		titleEl.innerHTML = title;
		rm.appendChild(titleEl);
		//内容
		let content = '';
		if (typeof(rules[hostName].content) === 'string') {
			let c = document.querySelector(rules[hostName].content).cloneNode(true);
			removeAllStyle(c);
			content = trimNewLines(c.innerHTML);
		} else {
			content = rules[hostName].content();
		}
		let contentEl = document.createElement('div');
		contentEl.classList.add('content');
		contentEl.innerHTML = content;
		rm.appendChild(contentEl);
		//添加一点样式
		document.body.classList.add('show-reading');
		document.body.appendChild(rm);
	}
	function applySetting() {
		css.innerHTML = cssContent.replace('{READER_BG}', box_bg)
		.replace('{READER_PADDING}', box_padding.toString() + 'px')
		.replace('{READER_TITLE_FONT_SIZE}', (content_font * 1.6).toString() + 'px')
		.replace('{READER_CONTENT_FONT_SIZE}', content_font.toString() + 'px')
		.replace('{READER_TEXT_COLOR}', text_color)
		.replace('{READER_TEXT_WEIGHT}', font_weight)
		.replace('{READER_LINE_HEIGHT}', box_line_height.toString() + '%');
	}
	applySetting();
	let rmTips = document.createElement('div');
	rmTips.id = 'sy_rm_show';
	let rmTipsEnter = document.createElement('button');
	rmTipsEnter.innerHTML = '进入阅读模式';
	rmTipsEnter.addEventListener('click', openRM);
	rmTips.appendChild(rmTipsEnter);
	let rmTipsClose = document.createElement('button');
	rmTipsClose.innerHTML = '关闭';
	rmTipsClose.addEventListener('click', () => {
		rmTips.remove();
	});
	rmTips.appendChild(rmTipsClose);
	document.body.appendChild(rmTips);
})();