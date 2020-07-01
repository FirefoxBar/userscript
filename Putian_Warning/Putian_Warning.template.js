(function() {
	var list = 'Put list here';
	var domain = unsafeWindow.location.hostname;
	if (unsafeWindow.location.href === '') {
		return;
	}
	//不在列表中
	if (typeof(list[domain]) === 'undefined') {
		return;
	}
	//生成随机ID
	var randStr = function (len) {
	　	var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';
	　	var maxPos = chars.length;
		var result = '';
		for (var i = 0; i < len; i++) {
			result += chars.charAt(Math.floor(Math.random() * maxPos));
		}
		return result;
	}
	var randomId = randStr(10) + '_sypt';
	console.log('RandomId is ' + randomId);
	//基本样式
	GM_addStyle('\
	#' + randomId + '_t {\
		display: block !important;\
		width: 100%;\
		height: 100px;\
		line-height: 100px;\
		position: fixed;\
		top: 0;\
		left: 0;\
		z-index: 99999;\
		font-size: 50px;\
		text-align: center;\
		color: white;\
		background: red;\
	}\
	#' + randomId + '_t > * {\
		vertical-align: middle;\
	}\
	#' + randomId + '_t > button {\
		font-size: 30px;\
	}\
	#' + randomId + '_i {\
		width: 400px;\
		position: fixed;\
		display: none;\
		top: 150px;\
		left: 50%;\
		z-index: 99999;\
		font-size: 15px;\
		margin: 0 -200px;\
		background: #FFF;\
		color: #000;\
		border: 1px solid #000;\
		padding: 20px;\
	}\
	#' + randomId + '_i p {\
		margin-bottom: 5px;\
	}\
	#' + randomId + '_i a {\
		color: #337ab7;\
		text-decoration: underline;\
	}');
	console.log('Create Style finished');
	//顶部
	var t = document.createElement('div');
	t.id = randomId + '_t';
	var t_btn = document.createElement('button');
	t_btn.innerHTML = '查看详情';
	var t_text = document.createElement('span');
	t_text.innerHTML = '此网站可能为莆田系医院';
	t.appendChild(t_text);
	t.appendChild(t_btn);
	console.log('Create Top finished');
	//详情框
	var info = document.createElement('div');
	info.id = randomId + '_i';
	var childEle;
	for (var k in list[domain]) {
		childEle = document.createElement('p');
		childEle.innerHTML = '<b>' + k + ':</b>&nbsp;';
		if (typeof(list[domain][k]) === 'string') {
			childEle.innerHTML += list[domain][k];
		} else {
			for (var kk in list[domain][k]) {
				childEle.innerHTML += list[domain][k][kk] + '&nbsp;';
			}
		}
		info.appendChild(childEle);
	}
	//详情框的一些按钮
	var info_text = document.createElement('p');
	info_text.innerHTML = '信息来自<a href="https://github.com/open-power-workgroup/Hospital" target="_blank">Hospital项目</a>，您可以<a href="https://github.com/open-power-workgroup/Hospital/blob/master/guide.md" target="_blank">参与</a>或者<a href="https://github.com/open-power-workgroup/Hospital/issues/new" target="_blank">提出异议</a>';
	info.appendChild(info_text);
	console.log('Create Info finished');
	var info_close = document.createElement('p');
	var info_close_btn = document.createElement('button');
	info_close_btn.innerHTML = '关闭';
	info_close.appendChild(info_close_btn);
	info.appendChild(info_close);
	//事件
	t_btn.addEventListener('click', function() {
		info.style.display = 'block';
	});
	info_close_btn.addEventListener('click', function() {
		info.style.display = 'none';
	});
	//加入body
	console.log('Append to body');
	var body = unsafeWindow.document.getElementsByTagName('body')[0];
	body.appendChild(t);
	body.appendChild(info);
})();