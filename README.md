# 用户脚本列表

* [【点击安装】](https://userscript.firefoxcn.net/js/Tieba_Client.user.js) [Tieba Client](https://github.com/FirefoxBar/userscript/tree/main/Tieba_Client)

* [【点击安装】](https://userscript.firefoxcn.net/js/Tieba_Quick_Reply.user.js) [Tieba Quick Reply](https://github.com/FirefoxBar/userscript/tree/main/Tieba_Quick_Reply)

* [【点击安装】](https://userscript.firefoxcn.net/js/Tieba_Private.user.js) [Tieba Private](https://github.com/FirefoxBar/userscript/tree/main/Tieba_Private)

* [【点击安装】](https://userscript.firefoxcn.net/js/Automatically_Pause_Video.user.js) [Automatically Pause Video](https://github.com/FirefoxBar/userscript/tree/main/Automatically_Pause_Video)

* [【点击安装】](https://userscript.firefoxcn.net/js/Tieba_Kuso.user.js) [Tieba Kuso](https://github.com/FirefoxBar/userscript/tree/main/Tieba_Kuso)

* [【点击安装】](https://userscript.firefoxcn.net/js/PostDelRobot.user.js) [Post Del Robot](https://github.com/FirefoxBar/userscript/tree/main/Post_Del_Robot)

* [【点击安装】](https://userscript.firefoxcn.net/js/163_Music_HTML5_Player.user.js) [163 Music HTML5 Player](https://github.com/FirefoxBar/userscript/tree/main/163_Music_HTML5_Player)

* [【点击安装】](https://userscript.firefoxcn.net/js/Cache_Manager_for_Tieba_Ueditor.user.js) [Cache Manager for Tieba Ueditor](https://github.com/FirefoxBar/userscript/tree/main/Cache_Manager_for_Tieba_Ueditor)
* [【点击安装】](https://userscript.firefoxcn.net/js/Straight_Baidu.user.js) [Straight Baidu](https://github.com/FirefoxBar/userscript/tree/main/Straight_Baidu)

* [【点击安装】](https://userscript.firefoxcn.net/js/Akina.js) [Akina](https://github.com/FirefoxBar/userscript/tree/main/Akina)

* [【点击安装】](https://userscript.firefoxcn.net/js/163.Music.HQ.user.js) [163 Music High Quality Support](https://github.com/FirefoxBar/userscript/tree/main/163_Music_High_Quality_Support)

* [【点击安装】](https://userscript.firefoxcn.net/js/Short_URL.user.js) [Short URL](https://github.com/FirefoxBar/userscript/tree/main/Short_URL)

* [【点击安装】](https://userscript.firefoxcn.net/js/Reading_Mode.user.js) [阅读模式](https://github.com/FirefoxBar/userscript/tree/main/Reading_Mode)

* [【点击安装】](https://userscript.firefoxcn.net/js/Fxxk_CSDN.user.js) [Fxxk CSDN](https://github.com/FirefoxBar/userscript/tree/main/Fxxk_CSDN)

* [【点击安装】](https://userscript.firefoxcn.net/js/Copy_all_links.user.js) [Copy all links](https://github.com/FirefoxBar/userscript/tree/main/Copy_all_links)

* [【点击安装】](https://userscript.firefoxcn.net/js/Tieba_Blocked_Detect.user.js) [Tieba Blocked Detect](https://github.com/FirefoxBar/userscript/tree/main/Tieba_Blocked_Detect)


## 开发说明

* 代码修改请在main分支上进行。
* GM头信息请写在各个脚本下的meta.yml文件中。Yaml语法可参考[这里](https://www.ruanyifeng.com/blog/2016/07/yaml.html)
* 可以使用[这个工具](https://userscript.firefoxcn.net/)将原有的GM头信息转为Yaml格式。
* 提交后CI会自动build并发布。

## 使用NPM开发

### 基本说明
* 进入你的脚本目录，使用npm初始化。各类参数可自由指定。
* 如果需要，可以在脚本目录下进一步安装npm依赖。
* 新建入口文件，在其中编写脚本代码。
  * 如果你想要使用TypeScript，则新建`src/index.ts`。
  * 如果你想要使用普通JS，则新建`src/index.js`。
* 编写过程中，运行`npm run dev 你的目录名称`，例如`npm run dev Putian_Warning`，即可启动自动编译，在你的目录下生成脚本代码，并会随着你的修改自动重新编译。
* 编写完成后，运行编译命令，即可在你的目录下生成脚本代码。
  * 如果需要未经压缩的，请运行`npm run build-dev 你的目录名称`，例如`npm run build-dev Putian_Warning`
  * 如果需要优化后的，请运行`npm run build 你的目录名称`，例如`npm run build Putian_Warning`。这个版本会进行[tree shaking](https://www.webpackjs.com/guides/tree-shaking/)，减小脚本体积。

### 使用样式
编译工具内置了CSS Module支持。因此，你可以直接编写CSS文件，并且不需要担心样式冲突的问题。但注意在meta.yml中申请GM_addStyle权限。

首先新建一个CSS，例如`src/index.css`，写入以下内容：
```css
.my-button {
  color: red;
}
```

在你的脚本中，可以这样使用：
```js
import { locals } from './index.css';

const button = document.createElement('button');
button.className = locals['my-button'];
```
