# 用户脚本列表

* [点击查看](https://team.firefoxcn.net/#userscripts)

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
