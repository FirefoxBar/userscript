# 贴吧贴子屏蔽检测

检测自己发表的贴子是否被百度屏蔽为仅自己可见


## 安装

- [Install From GitHub](https://github.com/FirefoxBar/userscript/raw/master/Tieba_Blocked_Detect/Tieba_Blocked_Detect.user.js)
- [Install From GreasyFork](https://greasyfork.org/zh-CN/scripts/383981)

## 使用说明

无

如果要说些什么的话，想问问为什么你还在用贴吧呢？


## 注意事项

- 回复贴子（含楼中楼）时直接显示的回复没有包含 pid，所以此时无法检测回复是否被屏蔽

- 回复贴子（含楼中楼）后，至少在 5~10 秒内贴子不会被屏蔽，在此时间内刷新时的结果可能不可靠，且可能会被脚本缓存屏蔽状态

- 超过 1 页的楼中楼不会被检测，因为楼中楼翻页时不会显示被屏蔽的楼中楼

![](https://greasyfork.org/system/screenshots/screenshots/000/015/611/original/QQ%E6%88%AA%E5%9B%BE20190601001053.png?1559319741)  
_贴吧页被屏蔽贴子效果_

![](https://greasyfork.org/system/screenshots/screenshots/000/015/612/original/QQ%E6%88%AA%E5%9B%BE20190601001026.png?1559319741)  
_贴子页被屏蔽贴子效果_

![](https://greasyfork.org/system/screenshots/screenshots/000/015/613/original/QQ%E6%88%AA%E5%9B%BE20190601001012.png?1559319741)  
_贴子页被屏蔽回复与楼中楼效果_


## 脚本信息
- Author: 864907600cc (@ccloli)
- License: GPLv3