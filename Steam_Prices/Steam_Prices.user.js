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
// @version     3
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
	for (var now = result.data.final[0][0], end = new Date().getTime(); now <= end; now += 86400000) {
		dateArr.push(new Date(now).toLocaleString('zh-CN').replace(/^(\d+)\/(\d+)\/(\d+)(.*?)$/, '$1-$2-$3'));
		if (result.data.final[index + 1] !== undefined && now > result.data.final[index + 1][0]) {
			index++;
		}
		if (minPrice > result.data.final[index][1]) {
			minPrice = result.data.final[index][1];
		}
		dataArr.push(result.data.final[index][1]);
	}
	//获取当前价格并与历史价格对比
	var cartBtnArea = document.querySelector('.game_purchase_action_bg');
	if (cartBtnArea.querySelector('.discount_final_price')) {
		var nowPrice = parseInt(cartBtnArea.querySelector('.discount_final_price').innerHTML.match(/(\d+)/)[0]);
		if (nowPrice <= minPrice) {
			cartBtnArea.querySelector('.discount_final_price').innerHTML += '(历史最低)';
		}
	} else {
		var nowPrice = parseInt(cartBtnArea.querySelector('.game_purchase_price').innerHTML.match(/(\d+)/)[0]);
		if (nowPrice <= minPrice) {
			cartBtnArea.querySelector('.game_purchase_price').innerHTML += '(历史最低)';
		}
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
GM_xmlhttpRequest({
	"url": 'https://steamdb.info/api/GetPriceHistory/?appid=' + id + '&cc=cn',
	"method": 'GET',
	"timeout": 2000,
	"onload": function(response) {
		response = JSON.parse(response.responseText);
		callback(response);
	},
	"ontimeout": function() {
		callback('');
	}
});
