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
// @version     1
// ==/UserScript==

var id = unsafeWindow.location.href.match(/app\/(\d+)/)[1];
var callback = function(result) {
	var rsArea = document.getElementById('game_area_purchase');
	var rsBox = document.createElement('div');
	rsBox.id = 'sy_price';
	rsBox.style.width = '100%';
	rsArea.insertBefore(rsBox, rsArea.childNodes[0]);
	if (!result) {
		rsBox.innerHTML = '获取历史价格失败';
		return;
	}
	//以一天为间隔，生成时间
	var dateArr = [];
	var dataArr = [];
	var index = 0;
	for (var now = result.data.final[0][0], end = result.data.final[result.data.final.length - 1][0]; now < end; now += 86400000) {
		dateArr.push(new Date(now).toLocaleString('zh-CN').replace(/^(\d+)\/(\d+)\/(\d+)(.*?)$/, '$1-$2-$3'));
		if (now > result.data.final[index + 1][0]) {
			index++;
		}
		dataArr.push(result.data.final[index][1]);
	}
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
