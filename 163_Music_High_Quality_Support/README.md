# 网易云音乐高音质支持

**WARNING: 此脚本已经不再维护，且本脚本对标记为【128K免费】的曲目可能没有效果**

## 安装
- [Install From GitHub](https://github.com/FirefoxBar/userscript/raw/master/163_Music_HTML5_Player/163_Music_HTML5_Player.user.js)
- [Install From GreasyFork](https://greasyfork.org/zh-CN/scripts/10582/)

## 功能
去除网页版网易云音乐仅可播放低音质（96/128Kbps）的限制，强制播放高音质版本

## 使用说明
安装脚本后无需进行设置，播放任意歌曲，即可自动转换为高音质版本

\* 自 2.0 起不再需要对播放列表作出更改即可切换至高音质版本

\* 由于旧版 API 大部分曲目失效，自 3.0 起使用新版 API 返回高音质版本（注意：新版 API 曲目重复播放时可能会重复缓冲，虽然 3.2 自行增强了缓存机制，可是网宿 CDN 自己又改了 URL 不读缓存，这就不能怪我了）

\* 此脚本使用了 Chrome 扩展程序 网易云音乐增强器(Netease Music Enhancement) by Tom Wan 的源码

\* 如果不出意外，3.2 将是本脚本的最后一个版本

![Preview](https://i.minus.com/iGjRe2lrYTQWl.png)

## 脚本信息
- Author: 864907600cc (@ccloli)
- License: GPLv3