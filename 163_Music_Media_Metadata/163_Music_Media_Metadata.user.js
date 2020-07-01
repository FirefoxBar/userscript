'use strict';

/* globals CryptoJS, MediaMetadata */

(() => {
	if (!navigator.mediaSession || typeof MediaMetadata === 'undefined') {
		console.log('The browser doesn\'t support MediaSession');
		return;
	}

	/**
	 * document.querySelector
	 *
	 * @param {string} selector - 选择器
	 * @returns {Node|null} 节点
	 */
	const $ = (selector) => document.querySelector(selector);

	/**
	 * 获取缩放后的图片 URL
	 *
	 * @param {string} url - 图片 URL
	 * @param {number} [size] - 图片缩放尺寸
	 * @returns {string} 缩放后的图片 URL
	 */
	const getResizedPicUrl = (url, size) => {
		return `${url}${size ? `?param=${size}y${size}` : ''}`;
	};

	/**
	 * 获取图片完整 URL
	 *
	 * @param {number|string} id - 文件 ID
	 * @returns {string} 图片 URL
	 */
	const getPicUrl = (id) => {
		const key = '3go8&$8*3*3h0k(2)2';
		const idStr = `${id}`;
		const idStrLen = idStr.length;
		const token = idStr.split('').map((e, i) => {
			return String.fromCharCode(e.charCodeAt(0) ^ key.charCodeAt(i % idStrLen));
		}).join('');
		const result = CryptoJS.MD5(token).toString(CryptoJS.enc.Base64)
			.replace(/\/|\+/g, match => ({
				'/': '_',
				'+': '-'
			})[match]);
		return `https://p1.music.126.net/${result}/${idStr}.jpg`;
	};

	/**
	 * 从播放列表中生成对应曲目的 metadata
	 *
	 * @param {number} id - 歌曲 ID
	 * @returns {object} metadata 数据内容
	 */
	const getSongMetadata = (id) => {
		let result;
		try {
			const playlist = JSON.parse(localStorage.getItem('track-queue'));
			const item = playlist.find(e => e.id === +id);
			if (item) {
				const album = item.album || {};
				result = {
					title: item.name,
					artist: (item.artists || []).map(e => e.name).join('/'),
					album: album.name,
					artwork: [{
						src: getResizedPicUrl(album.picUrl || getPicUrl(album.pic_str || album.pic), 160),
						sizes: '160x160',
						type: 'image/jpeg'
					}, {
						src: getResizedPicUrl(album.picUrl || getPicUrl(album.pic_str || album.pic), 320),
						sizes: '320x320',
						type: 'image/jpeg'
					}, {
						src: getResizedPicUrl(album.picUrl || getPicUrl(album.pic_str || album.pic), 480),
						sizes: '480x480',
						type: 'image/jpeg'
					}]
				};
			}
		} catch (err) {
			console.log(err);
		}

		return result;
	};

	/**
	 * 从页面内 DOM 生成 metadata（不含专辑名）
	 *
	 * @returns {object} metadata 数据内容
	 */
	const generateCurrentMetadata = () => {
		const coverUrl = $('.m-playbar .head > img').getAttribute('src').split('?').shift();
		return {
			title: $('.m-playbar .words .name').getAttribute('title'),
			artist: $('.m-playbar .words .by > span').getAttribute('title'),
			artwork: [{
				src: getResizedPicUrl(coverUrl),
				sizes: '160x160',
				type: 'image/jpeg'
			}, {
				src: getResizedPicUrl(coverUrl),
				sizes: '320x320',
				type: 'image/jpeg'
			}, {
				src: getResizedPicUrl(coverUrl),
				sizes: '480x480',
				type: 'image/jpeg'
			}]
		};
	};

	/**
	 * 设置 metadata 到 mediaSession 上
	 *
	 * @param {object} [data] - metadata 数据
	 */
	const setMetadata = (data) => {
		if (data) {
			navigator.mediaSession.metadata = new MediaMetadata(data);
		}
		else {
			navigator.mediaSession.metadata = null;
		}
	};

	/**
	 * 更新当前曲目的 media metadata
	 *
	 */
	const updateCurrent = () => {
		const id = ($('.m-playbar .words .name').getAttribute('href').match(/\?id=(\d+)/) || [])[1];
		if (id) {
			const data = getSongMetadata(id) || generateCurrentMetadata();
			setMetadata(data);
		}
	};

	/**
	 * 处理客户端播放面板操作回调
	 *
	 */
	const setActionHandler = () => {
		navigator.mediaSession.setActionHandler('previoustrack', () => {
			$('.m-playbar .btns .prv').click();
		});
		navigator.mediaSession.setActionHandler('nexttrack', () => {
			$('.m-playbar .btns .nxt').click();
		});
	};

	/**
	 * 初始化函数
	 *
	 */
	const init = () => {
		if ($('.m-playbar')) {
			// 使用 animation 事件监听可能会覆盖其他使用相同方法处理的脚本，改用 MutationObserver
			const observer = new MutationObserver((mutations) => {
				if (mutations && mutations[0]) {
					updateCurrent();
				}
			});

			observer.observe($('.m-playbar .words'), {
				attributes: true, childList: true, subtree: true
			});

			setActionHandler();
			updateCurrent();
		}
	};

	init();
})();
