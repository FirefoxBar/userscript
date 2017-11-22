<?php
/**
 * 一键更新医院列表
 * 数据来自https://github.com/open-power-workgroup/Hospital/
 * 
 * @author ShuangYa
 */

/****************************/
/*         基本设置         */
/****************************/
define('URL', 'https://raw.githubusercontent.com/open-power-workgroup/Hospital/master/resource/API_resource/hospital_list.json');
/****************************/
/*       一些基本函数       */
/****************************/
/*
 * 使用curl抓取远程内容
 * @param string $url 地址
 * @param array $data 附加属性
 * @param array $data[header] 发送的HTTP头信息
 * @param array $data[cookie] 发送的Cookie
 * @param array $data[post] POST方式提交的数据
 * @return string
*/
function curl_get ($url, $data = []) {
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_TIMEOUT, 20); //20秒超时时间
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
	if (substr(strtolower($url), 0, 5) === 'https') {
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
	}
	if (isset($data['header'])) {
		curl_setopt($ch, CURLOPT_HTTPHEADER, $data['header']);
	}
	if (isset($data['cookie'])) {
		curl_setopt($ch, CURLOPT_COOKIE, $data['cookie']);
	}
	if (isset($data['post'])) {
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data['post']);
	}
	$result = curl_exec($ch);
	@curl_close($ch);
	return $result;
}
/****************************/
/*         实际逻辑         */
/****************************/
echo "Fetching lists\n";
$list = json_decode(curl_get(URL), 1);
if (!is_array($list)) {
	echo "Fetch fail\n";
	exit;
}
$domain_list = [];
foreach ($list as $k => $v) { //省=>列表
	foreach ($v as $kk => $vv) { //医院=>详情
		if (!isset($vv['网址'])) { //没有网址
			continue;
		}
		foreach ($vv['网址'] as $url) {
			$host = parse_url($url, PHP_URL_HOST);
			$domain_list[$host] = array_merge(['名称' => $kk], $vv);
		}
	}
}
file_put_contents('Putian_Warning.user.js', str_replace("'Put list here'", json_encode($domain_list, JSON_UNESCAPED_UNICODE), file_get_contents('Putian_Warning.template.js')));
echo "OK\n";