const { existsSync, readdirSync, mkdirSync, statSync, writeFileSync } = require('fs');
const { copySync, removeSync } = require('fs-extra');
const { resolve } = require('path');
const buildOne = require('./utils/build-one');
const copyOne = require('./utils/copy-one');

const root = resolve(__dirname, '..');
const dirs = readdirSync(root);

if (existsSync(resolve(root, 'dist'))) {
  readdirSync(resolve(root, 'dist')).forEach(it => {
    removeSync(resolve(root, 'dist', it));
  });
} else {
  mkdirSync(resolve(root, 'dist'));
}

const list = [];

// 编译脚本
const distJs = resolve(root, 'dist/js');
if (!existsSync(distJs)) {
  mkdirSync(distJs);
}
const queue = dirs.map(it => {
  if (!statSync(it).isDirectory()) {
    return;
  }
  // meta.yml
  if (existsSync(resolve(root, it, 'package.json'))) {
    // 需要编译的
    return buildOne(it, distJs);
  } else if (existsSync(resolve(root, it, it + '.user.js'))) {
    // 纯复制，但仍然需要解析meta
    return Promise.resolve(copyOne(it, distJs));
  }
});

// 生成列表
Promise.all(queue)
.then(result => {
  result.forEach(it => {
    if (!it) {
      return;
    }
    const meta = it.meta.meta;
    list.push({
      name: meta.name,
      version: meta.version,
      installURL: meta.downloadURL,
      homepageURL: "https://github.com/FirefoxBar/userscript/tree/master/" + it.name,
      description: meta.description
    });
  });
  
  if (!existsSync(resolve(root, 'dist/api'))) {
    mkdirSync(resolve(root, 'dist/api'));
  }
  writeFileSync(resolve(root, 'dist/api/list.json'), JSON.stringify(list), {
    encoding: 'UTF-8'
  });
  writeFileSync(resolve(root, 'dist/api/list.js'), 'onGetList(' + JSON.stringify(list) + ')', {
    encoding: 'UTF-8'
  });
})
.then(() => {
  // 复制站点文件
  copySync(resolve(__dirname, 'www'), resolve(root, 'dist'));
})