// ==UserScript==
// @name        Steam Prices
// @namespace   blog.sylingd.com
// @author      ShuangYa
// @include     http://store.steampowered.com/app/*
// @require     https://cdn.bootcss.com/echarts/3.6.2/echarts.common.min.js
// @updateURL   https://github.com/FirefoxBar/userscript/raw/master/Steam_Prices/Steam_Prices.meta.js
// @downloadURL https://github.com/FirefoxBar/userscript/raw/master/Steam_Prices/Steam_Prices.user.js
// @grant       GM_xmlhttpRequest
// @connect     *
// @version     4
// ==/UserScript==

var id = unsafeWindow.location.href.match(/app\/(\d+)/)[1];
var callback = function(result) {
	var rsArea = document.getElementById('game_area_purchase');
	var rsBox = document.createElement('div');
	rsBox.id = 'sy_price';
	rsBox.style.width = '100%';
	rsArea.insertBefore(rsBox, rsArea.childNodes[0]);
	if (!result) {
		rsBox.innerHTML = '<p style="text-align:center">获取历史价格失败</p>';
		return;
	}
	//没有历史价格数据
	if (result.data.final.length === 0) {
		rsBox.innerHTML = '<p style="text-align:center">无历史价格数据</p>';
		return;
	}
	//以一天为间隔，生成时间
	var dateArr = [];
	var dataArr = [];
	var index = 0;
	var minPrice = result.data.final[0][1];
	var maxPrice = result.data.final[0][1];
	var hasZero = false;
	for (var now = result.data.final[0][0], end = new Date().getTime(); now <= end; now += 86400000) {
		dateArr.push(new Date(now).toLocaleString('zh-CN').replace(/^(\d+)\/(\d+)\/(\d+)(.*?)$/, '$1-$2-$3'));
		if (result.data.final[index + 1] !== undefined && now > result.data.final[index + 1][0]) {
			index++;
		}
		if (result.data.final[index][1] == 0) {
			hasZero = true;
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
	var cartBtnArea = document.querySelector('.game_purchase_action_bg');
	if (cartBtnArea.querySelector('.discount_final_price')) {
		var nowPrice = parseInt(cartBtnArea.querySelector('.discount_final_price').innerHTML.match(/(\d+)/)[0]);
	} else {
		var nowPrice = parseInt(cartBtnArea.querySelector('.game_purchase_price').innerHTML.match(/(\d+)/)[0]);
	}
	//附加“历史最低”标记
	var titleArea = cartBtnArea.parentElement.parentElement.querySelector('h1');
	if (minPrice >= nowPrice && maxPrice > nowPrice) {
		var lowest_in_history = document.createElement('span');
		lowest_in_history.setAttribute('style', 'background-color:rgb(117,150,0);color:#fff;font-size:12px;padding:5px;border-radius:3px;margin-left:6px;vertical-align:middle');
		lowest_in_history.setAttribute('title', '历史最低');
		lowest_in_history.innerHTML = '低';
		titleArea.appendChild(lowest_in_history);
	}
	if (hasZero) {
		var has_zero = document.createElement('span');
		has_zero.setAttribute('style', 'background-color:rgb(117,150,0);color:#fff;font-size:12px;padding:5px;border-radius:3px;margin-left:6px;vertical-align:middle');
		has_zero.setAttribute('title', '曾免费试玩');
		has_zero.innerHTML = '零';
		titleArea.appendChild(has_zero);
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
				dataView: {readOnly: false},
				magicType: {type: ['line']},
				restore: {},
				saveAsImage: {}
			},
			iconStyle: {
				normal: {
					color: '#7cb8e4'
				}
			}
		},
		xAxis:  {
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
		series: [
			{
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
			}
		],
		textStyle: {
			color: '#FFF'
		}
	};
	myChart.setOption(option);
};
var requestPrice = function(t) {
	if (t > 3) {
		callback('');
	} else {
		GM_xmlhttpRequest({
			"url": 'https://steamdb.info/api/GetPriceHistory/?appid=' + id + '&cc=cn',
			"method": 'GET',
			"timeout": 2000,
			"onload": function(response) {
				response = JSON.parse(response.responseText);
				if (!response) {
					requestPrice(t + 1);
				} else {
					callback(response);
				}
			},
			"ontimeout": function() {
				requestPrice(t + 1);
			}
		});
	}
};
requestPrice(0);