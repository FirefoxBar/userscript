document.getElementById('input_currency').type = "text";
document.getElementById('input_amount').type = "text";
document.getElementById('input_amount').value = "3000";
var el = document.createElement('input');
el.type = "submit";
el.value = "充值（单位为分）";
document.getElementById('form_addfunds').appendChild(el);