# 163 Music MediaMetadata

在网易云音乐 Web 版上启用 MediaSession 支持

![](https://user-images.githubusercontent.com/8115912/72663337-81ddf300-3a2c-11ea-9299-6106bb75d3e0.png)


## 安装

- [Install From GitHub](https://github.com/FirefoxBar/userscript/raw/master/163_Music_Media_Metadata/163_Music_Media_Metadata.user.js)
- [Install From GreasyFork](https://greasyfork.org/zh-CN/scripts/395376)


## 功能

- 在支持的浏览器和系统的播放控件上展示播放状态

- 支持切换上一曲与下一曲播放


## 使用说明

无


## 注意事项

- 目前可能仅 Chrome 浏览器支持

- 据 MDN 兼容性列表，Firefox 浏览器理论上是支持的，但是在 Windows 上似乎不起作用，即便在 `about:config` 上开启 `dom.media.mediasession.enabled` 也不会调用系统 API，建议关注 [bugzilla](https://bugzilla.mozilla.org/show_bug.cgi?id=1112032) 了解支持进度

- 若在多个页面切换播放，在 Chrome 浏览器上可能会显示多个播放状态


## 脚本信息
- Author: 864907600cc (@ccloli)
- License: GPLv3
