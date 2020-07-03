const { existsSync, readdirSync, mkdirSync, statSync, writeFileSync } = require('fs');
const { copySync } = require('fs-extra');
const { resolve } = require('path');
const buildOne = require('./utils/build-one');
const copyOne = require('./utils/copy-one');
const chalk = require('chalk');

const root = resolve(__dirname, '..');
const dirs = readdirSync(root);

if (!existsSync(resolve(root, 'dist'))) {
  mkdirSync(resolve(root, 'dist'));
}
if (!existsSync(resolve(root, 'dist/master'))) {
  mkdirSync(resolve(root, 'dist/master'));
}
if (!existsSync(resolve(root, 'dist/pages'))) {
  mkdirSync(resolve(root, 'dist/pages'));
}

const list = [];

// 编译脚本
const distJs = resolve(root, 'dist/pages/js');
if (!existsSync(distJs)) {
  mkdirSync(distJs);
}
const queue = dirs.map(async it => {
  const fullPath = resolve(root, it);
  if (!statSync(fullPath).isDirectory()) {
    return;
  }
  // meta.yml
  if (existsSync(resolve(fullPath, 'package.json'))) {
    // 需要编译的
    return await buildOne(it, distJs);
  } else if (existsSync(resolve(root, it, it + '.user.js'))) {
    // 纯复制，但仍然需要解析meta
    return copyOne(it, distJs);
  }
});

// 生成列表
Promise
.all(queue)
.then(result => {
  result.forEach(it => {
    if (!it) {
      return;
    }
    console.log(chalk.green('✔') + ' 已' + (it.stats ? '编译' : '复制') + ' ' + it.name);
    const meta = it.meta.meta;
    list.push({
      name: meta.name,
      version: meta.version,
      installURL: meta.downloadURL,
      homepageURL: "https://github.com/FirefoxBar/userscript/tree/main/" + it.name,
      description: meta.description
    });
  });
  
  if (!existsSync(resolve(root, 'dist/pages/api'))) {
    mkdirSync(resolve(root, 'dist/pages/api'));
  }
  writeFileSync(resolve(root, 'dist/pages/api/list.json'), JSON.stringify(list), {
    encoding: 'UTF-8'
  });
  writeFileSync(resolve(root, 'dist/pages/api/list.js'), 'onGetList(' + JSON.stringify(list) + ')', {
    encoding: 'UTF-8'
  });
})
.then(() => {
  // 复制站点文件
  copySync(resolve(__dirname, 'www'), resolve(root, 'dist/pages'));
})
.catch(err => {
  if (Array.isArray(err)) {
    err.forEach(error => {
      console.error(error.message);
    });
  } else {
    console.error(err);
  }
  process.exit(1);
});