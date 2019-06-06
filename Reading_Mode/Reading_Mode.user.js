// ==UserScript==
// @name            Reading Mode
// @namespace       blog.sylingd.com
// @description     阅读模式
// @author          ShuangYa
// @include         http://blog.csdn.net/*/article/details/*
// @include         https://blog.csdn.net/*/article/details/*
// @include         http://*.cnblogs.com/*/p/*
// @include         http://*.cnblogs.com/*/archive/*
// @include         http://*.cnblogs.com/*/articles/*
// @include         https://*.cnblogs.com/*/p/*
// @include         https://*.cnblogs.com/*/archive/*
// @include         https://*.cnblogs.com/*/articles/*
// @include         http://blog.sina.com.cn/s/blog_*.html
// @include         http://*.blog.163.com/blog/static/*
// @include         http://*.blog.sohu.com/*
// @include         https://juejin.im/entry/*
// @include         https://zhuanlan.zhihu.com/p/*
// @include         http://blog.tianya.cn/post-*
// @include         https://blog.tianya.cn/post-*
// @include         http://blog.sciencenet.cn/blog-*
// @include         http://blog.chinaunix.net/uid-*
// @grant           GM_setValue
// @grant           GM_getValue
// @run-at          document-end
// @updateURL       https://github.com/FirefoxBar/userscript/raw/master/Reading_Mode/Reading_Mode.meta.js
// @downloadURL     https://github.com/FirefoxBar/userscript/raw/master/Reading_Mode/Reading_Mode.user.js
// @version         13
// ==/UserScript==

(function () {
	'use strict';

	function trimNewLines(s) {
		return s.replace(/^[\s\n]+/, "").replace(/[\s\n]+$/, "");
	};

	function removeAllStyle(el) {
		Array.prototype.forEach.call(el.children, child => removeAllStyle(child));
		//部分网站有防抓取的代码
		if (el.style.display === 'none' || el.style.fontSize === '0px' || el.style.visibility === 'hidden') {
			el.remove();
		} else {
			el.removeAttribute('color');
			el.removeAttribute('class');
			el.removeAttribute('style');
		}
	};
	const rules = {
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
					return trimNewLines((document.querySelector(".csdn_top") || document.querySelector(".title-article")).innerHTML);
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
		},
		'juejin.im': {
			'title': '.entry-content-box > h1',
			'content': () => {
				const it = document.querySelector('.article-content').innerHTML;
				return it.replace(/data\-src="(.*?)"(.*?)src="(.*?)"/g, 'data-src="$1"$2src="$1"');
			}
		},
		'zhuanlan.zhihu.com': {
			'title': '.Post-Title',
			'content': '.Post-RichTextContainer'
		}
	};

	const hostName = (() => {
		if (typeof (rules[window.location.host]) !== 'undefined') {
			return window.location.host;
		} else {
			for (const it of Object.keys(rules)) {
				if (window.location.host.includes(it)) {
					return it;
				}
			}
		}
	})();

	const css = document.createElement('style');
	document.head.appendChild(css);
	const settings = {
		box_bg: GM_getValue('box_bg') || '#ffffff',
		text_color: GM_getValue('text_color') || '#000000',
		font_size: GM_getValue('font_size') || 18,
		box_padding: GM_getValue('box_padding') || 30,
		box_line_height: GM_getValue('box_line_height') || 100,
		font_weight: GM_getValue('font_weight') || 'normal',
		preset: JSON.parse(GM_getValue('preset') || '[]'),
	};

	function updateStyle() {
		const title_font_size = Math.ceil(settings.font_size * 1.6);
		let cssContent = `
		body.show-reading {
			overflow: hidden;
		}
		#sy_rm_show {
			position: fixed;
			bottom: 0;
			left: 50%;
			height: 46px;
			width: 190px;
			margin-left: -90px;
			z-index: 99999998;
			background-color: #FFF;
			padding: 5px;
			box-sizing: border-box;
			box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
		}
		#sy_rm_show button,
		#sy_rm_box .option button {
			background: 0 0;
			border: none;
			border-radius: 2px;
			color: #000;
			position: relative;
			height: 36px;
			margin: 0;
			min-width: 64px;
			padding: 0 16px;
			display: inline-block;
			font-size: 14px;
			font-weight: 500;
			letter-spacing: 0;
			overflow: hidden;
			outline: none;
			cursor: pointer;
			text-align: center;
			line-height: 36px;
			transition: background-color .2s cubic-bezier(.4,0,.2,1);
		}
		#sy_rm_box .option button {
			color: ${settings.text_color};
		}
		#sy_rm_show button:hover,
		#sy_rm_box .option button:hover {
			background-color: rgba(158,158,158,.2);
		}
		#sy_rm_show button:active,
		#sy_rm_box .option button:active {
			background-color: rgba(158,158,158,.4);
		}
		#sy_rm_box {
			position: fixed;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			z-index: 99999999;
			background-color: ${settings.box_bg};
			overflow: auto;
			padding: 15px ${settings.box_padding}px;
			box-sizing: border-box;
			font-family: "Microsoft YaHei", "PingFang SC", "Lantinghei SC", "WenQuanYi Zen Hei", sans-serif !important;
			text-align: left !important;
		}
		#sy_rm_box .option {
			margin-bottom: 20px;
		}
		#sy_rm_box .option * {
			vertical-align: middle;
			margin-right: 10px;
			color: ${settings.text_color};
		}
		#sy_rm_box .option input[type="color"] {
			padding: 0;
			border: 0;
			outline: none;
			cursor: pointer;
		}
		#sy_rm_box .title {
			font-size: ${title_font_size}px !important;
			padding-bottom: 20px;
			border-bottom: 1px solid ${settings.text_color};
			margin-bottom: 20px;
			color: ${settings.text_color} !important;
		}
		#sy_rm_box .content {
			font-size: ${settings.font_size}px !important;
			line-height: ${settings.box_line_height}%;
			color: ${settings.text_color} !important;
			font-weight: ${settings.font_weight} !important;
		}
		#sy_rm_box h1,
		#sy_rm_box h2,
		#sy_rm_box h3,
		#sy_rm_box h4,
		#sy_rm_box h5,
		#sy_rm_box h6 {
			font-weight: ${settings.font_weight} !important;
		}`;
		//添加h1-h6的字号
		for (let i = 6; i >= 1; i--) {
			cssContent += "#sy_rm_box h" + i + " { font-size: " + (settings.font_size + (7 - i) * 2) + "px; }";
		}
		css.innerHTML = cssContent;
	}

	function updateSetting(name, value) {
		settings[name] = value;
		GM_setValue(name, value);
		updateStyle();
	}

	function createButton(title, callback) {
		const btn = document.createElement('button');
		btn.addEventListener('click', callback);
		btn.innerHTML = title;
		return btn;
	}

	function createColor(title, defaultColor, callback) {
		const label = document.createElement('label');
		label.appendChild(document.createTextNode(title));
		let input = document.createElement('input');
		input.value = defaultColor;
		input.type = 'color';
		label.appendChild(input);
		input.addEventListener('change', callback);
		return label;
	}

	function createSelect(title, options, render, callback) {
		const label = document.createElement('label');
		label.appendChild(document.createTextNode(title));
		const el = document.createElement('select');
		options.forEach((it, idx) => el.appendChild(render(it, idx)));
		el.addEventListener('change', callback);
		label.appendChild(el);
		return label;
	}

	let preset = null;

	function updatePreset() {
		const set = createSelect('预设', settings.preset, (it, idx) => {
			const option = document.createElement('option');
			option.value = idx;
			option.appendChild(document.createTextNode(it.name));
			return option;
		}, e => {
			const index = parseInt(e.currentTarget.value);
			for (const it in settings.preset[index]) {
				settings[it] = settings.preset[index][it];
			}
			updateStyle();
		});
		if (preset !== null) {
			preset.parentElement.insertBefore(set, preset);
			preset.parentElement.removeChild(preset);
		}
		preset = set;
		return set;
	}

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
		options.appendChild(createButton('增大字体', () => updateSetting('font_size', settings.font_size + 1)));
		options.appendChild(createButton('减小字体', () => updateSetting('font_size', settings.font_size - 1)));
		//边距
		options.appendChild(createButton('增大边距', () => updateSetting('box_padding', settings.box_padding + 10)));
		options.appendChild(createButton('减小边距', () => updateSetting('box_padding', settings.box_padding - 10)));
		//行距
		options.appendChild(createButton('增大行距', () => updateSetting('box_line_height', settings.box_line_height + 25)));
		options.appendChild(createButton('减小行距', () => updateSetting('box_line_height', settings.box_line_height - 25)));
		//文字粗细
		options.appendChild(createSelect('粗细', [
			['lighter', '细体'],
			['normal', '常规'],
			['bold', '粗体']
		], it => {
			const option = document.createElement('option');
			option.value = it[0];
			option.innerHTML = it[1];
			option.selected = it[0] === settings.font_weight;
			return option;
		}, e => updateSetting('font_weight', e.currentTarget.value)));
		//颜色
		options.appendChild(createColor('背景色', settings.box_bg, e => updateSetting('box_bg', e.currentTarget.value)));
		options.appendChild(createColor('文字颜色', settings.text_color, e => updateSetting('text_color', e.currentTarget.value)));
		//预设
		options.appendChild(createButton('保存为预设', () => {
			const name = window.prompt('请输入预设名称');
			if (name) {
				const currentSetting = Object.assign({}, settings);
				delete currentSetting["preset"];
				currentSetting.name = name;
				settings.preset.push(currentSetting);
				GM_setValue("preset", JSON.stringify(settings.preset));
				updatePreset();
			}
		}))
		options.appendChild(updatePreset());
		//退出
		options.appendChild(createButton('退出阅读模式', () => {
			document.body.classList.remove('show-reading');
			rm.remove();
		}));
		//标题
		let title = typeof (rules[hostName].title) === 'string' ? trimNewLines(document.querySelector(rules[hostName].title).innerHTML) : rules[hostName].title();
		let titleEl = document.createElement('div');
		titleEl.classList.add('title');
		titleEl.innerHTML = title;
		rm.appendChild(titleEl);
		//内容
		let content = '';
		if (typeof (rules[hostName].content) === 'string') {
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
	updateStyle();
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