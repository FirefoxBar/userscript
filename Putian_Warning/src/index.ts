import styles from './index.css';

const list: { [x: string]: [] } = require('./list.json');

const domain = unsafeWindow.location.hostname;


if (unsafeWindow.location.href !== '' && typeof list[domain] !== 'undefined') {
	//顶部banner
	const banner = document.createElement('div');
	banner.className = styles.banner;
	const banner_btn = document.createElement('button');
	banner_btn.innerHTML = '查看详情';
	const banner_text = document.createElement('span');
	banner_text.innerHTML = '此网站可能为莆田系医院';
	banner.appendChild(banner_text);
	banner.appendChild(banner_btn);
	document.body.appendChild(banner);
	//事件
	banner_btn.addEventListener('click', () => {
		info.style.display = 'block';
	});

	//详情框
	const info = document.createElement('div');
	info.className = styles.info;
	for (const k in list[domain]) {
		const childEle = document.createElement('p');
		childEle.innerText = list[domain][k];
		info.appendChild(childEle);
	}
	//详情框的一些按钮
	const info_text = document.createElement('p');
	info_text.innerHTML = '信息来自<a href="https://github.com/open-power-workgroup/Hospital" target="_blank">Hospital项目</a>，您可以<a href="https://github.com/open-power-workgroup/Hospital/blob/master/guide.md" target="_blank">参与</a>或者<a href="https://github.com/open-power-workgroup/Hospital/issues/new" target="_blank">提出异议</a>';
	info.appendChild(info_text);
	const info_close = document.createElement('p');
	const info_close_btn = document.createElement('button');
	info_close_btn.innerHTML = '关闭';
	info_close.appendChild(info_close_btn);
	info.appendChild(info_close);
	document.body.appendChild(info);
	//事件
	info_close_btn.addEventListener('click', () => {
		info.style.display = 'none';
	});
}