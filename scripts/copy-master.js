// 从pages目录，复制文件到master分支
const { existsSync, readdirSync, mkdirSync } = require('fs');
const { copySync } = require('fs-extra');
const { resolve } = require('path');
const dist = resolve(__dirname, '../dist');
const pages = resolve(dist, 'pages/js');
const master = resolve(dist, 'master');

readdirSync(pages).forEach(it => {
  if (!it.includes('.user.js') && !it.includes('.meta.js')) {
    return;
  }

  const name = it.substr(0, it.indexOf('.'));

  if (!existsSync(resolve(master, name))) {
    mkdirSync(resolve(master, name));
  }
  copySync(resolve(pages, it), resolve(master, name, it));
});

copySync(resolve(__dirname, 'master'), master);