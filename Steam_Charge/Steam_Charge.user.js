// ==UserScript==
// @name Steam自定义充值
// @namespace https://blog.sylingd.com
// @description 自行输入一次性往Steam充值多少
// @author ShuangYa
// @version 1.0.0
// @match https://store.steampowered.com/steamaccount/addfunds*
// @updateURL https://userscript.firefoxcn.net/js/Steam_Charge.meta.js
// @downloadURL https://userscript.firefoxcn.net/js/Steam_Charge.user.js
// ==/UserScript==
document.getElementById('input_currency').type = "text";
document.getElementById('input_amount').type = "text";
document.getElementById('input_amount').value = "3000";
var el = document.createElement('input');
el.type = "submit";
el.value = "充值（单位为分）";
document.getElementById('form_addfunds').appendChild(el);