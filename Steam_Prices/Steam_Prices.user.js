// ==UserScript==
// @name        Steam Prices
// @namespace   blog.sylingd.com
// @author      ShuangYa
// @include     http://store.steampowered.com/app/*
// @include     https://store.steampowered.com/app/*
// @require     https://cdn.bootcss.com/echarts/3.6.2/echarts.common.min.js
// @updateURL   https://github.com/FirefoxBar/userscript/raw/master/Steam_Prices/Steam_Prices.meta.js
// @downloadURL https://github.com/FirefoxBar/userscript/raw/master/Steam_Prices/Steam_Prices.user.js
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @connect     *
// @version     8
// ==/UserScript==

const id = unsafeWindow.location.href.match(/app\/(\d+)/)[1];

const rsArea = document.getElementById('game_area_purchase');
if (!rsArea) {
	return;
}

const rsBox = document.createElement('div');
rsBox.id = 'sy_price';
rsArea.insertBefore(rsBox, rsArea.childNodes[0]);
GM_addStyle("#sy_price { width: 100%; padding-bottom: 10px; }");
let retry = 0;

function request() {
	if (retry > 3) {
		rsBox.innerHTML = '<p style="text-align:center">获取历史价格失败，<a id="sy_price_retry" href="#">重试</a></p>';
		document.getElementById('sy_price_retry').addEventListener('click', request);
		return;
	}
	GM_xmlhttpRequest({
		"url": 'https://steamdb.info/api/GetPriceHistory/?appid=' + id + '&cc=cn',
		"method": 'GET',
		"timeout": 2000,
		"onload": (response) => {
			const text = response.responseText;
			let result = null;
			try {
				result = JSON.parse(text);
			} catch (e) {
				if (text.includes('chk_jschl')) {
					rsBox.innerHTML = '<p style="text-align:center">请<a href="https://steamdb.info" target="_blank">验证</a>后<a id="sy_price_retry" href="#">重试</a></p>';
					document.getElementById('sy_price_retry').addEventListener('click', request);
				}
				return;
			}
			if (!result) {
				retry++;
				request();
			} else {
				//没有历史价格数据
				if (result.data.final.length === 0) {
					rsBox.innerHTML = '<p style="text-align:center">无历史价格数据</p>';
					return;
				}
				//以一天为间隔，生成时间
				const dateArr = [];
				const dataArr = [];
				let index = 0;
				let minPrice = result.data.final[0][1];
				let maxPrice = result.data.final[0][1];
				for (let now = result.data.final[0][0], end = new Date().getTime(); now <= end; now += 86400000) {
					dateArr.push(new Date(now).toLocaleString('zh-CN').replace(/^(\d+)\/(\d+)\/(\d+)(.*?)$/, '$1-$2-$3'));
					if (result.data.final[index + 1] !== undefined && now > result.data.final[index + 1][0]) {
						index++;
					}
					if (minPrice > result.data.final[index][1] && result.data.final[index][1] > 0) {
						minPrice = result.data.final[index][1];
					}
					if (maxPrice < result.data.final[index][1]) {
						maxPrice = result.data.final[index][1];
					}
					dataArr.push(result.data.final[index][1]);
				}
				//获取当前价格并与历史价格对比
				let cartBtnAreas = document.querySelectorAll('.game_purchase_action_bg');
				let cartBtnArea = null;
				let i = 0;
				do {
					cartBtnArea = cartBtnAreas[i];
					i++;
				} while (!(cartBtnArea.querySelector('.game_purchase_price')) && !(cartBtnArea.querySelector('.discount_final_price')));
				let nowPrice = 0;
				if (cartBtnArea.querySelector('.discount_final_price')) {
					nowPrice = parseInt(cartBtnArea.querySelector('.discount_final_price').innerHTML.match(/(\d+)/)[0]);
				} else {
					nowPrice = parseInt(cartBtnArea.querySelector('.game_purchase_price').innerHTML.match(/(\d+)/)[0]);
				}
				//附加“历史最低”标记
				let titleArea = cartBtnArea.parentElement.parentElement.querySelector('h1');
				if (minPrice >= nowPrice && maxPrice > nowPrice) {
					let lowest_in_history = document.createElement('span');
					lowest_in_history.setAttribute('style', 'background-color:rgb(117,150,0);color:#fff;font-size:12px;padding:5px;border-radius:3px;margin-left:6px;vertical-align:middle');
					lowest_in_history.setAttribute('title', '历史最低');
					lowest_in_history.innerHTML = '低';
					titleArea.appendChild(lowest_in_history);
				}
				//最后把当天价格加进去
				dataArr[dataArr.length - 1] = nowPrice;
				//建立折线图
				rsBox.style.height = '240px';
				var myChart = echarts.init(rsBox);
				var option = {
					tooltip: {
						trigger: 'axis'
					},
					grid: {
						left: 50,
						right: 20
					},
					toolbox: {
						show: true,
						feature: {
							dataZoom: {
								yAxisIndex: 'none'
							},
							dataView: {
								readOnly: false
							},
							magicType: {
								type: ['line']
							},
							restore: {},
							saveAsImage: {}
						},
						iconStyle: {
							normal: {
								color: '#7cb8e4'
							}
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: dateArr
					},
					yAxis: {
						type: 'value',
						axisLabel: {
							formatter: '￥{value}'
						}
					},
					series: [{
						name: '价格',
						type: 'line',
						step: 'end',
						smooth: true,
						symbol: 'none',
						sampling: 'average',
						data: dataArr,
						itemStyle: {
							normal: {
								color: '#7cb8e4'
							}
						}
					}],
					textStyle: {
						color: '#FFF'
					}
				};
				myChart.setOption(option);
			}
		},
		"ontimeout": () => {
			retry++;
			request();
		}
	});
}
request();