// 从pages目录，复制文件到master分支
const { existsSync, readdirSync, mkdirSync } = require('fs');
const { copySync } = require('fs-extra');
const { join } = require('path');
const dist = join(__dirname, '../dist');
const pages = join(dist, 'pages/js');
const master = join(dist, 'master');

readdirSync(pages).forEach(it => {
  if (!it.includes('.user.js') && !it.includes('.meta.js')) {
    return;
  }

  const name = it.substr(0, it.indexOf('.'));

  if (!existsSync(join(master, name))) {
    mkdirSync(join(master, name));
  }
  copySync(join(pages, it), join(master, name, it));
});

copySync(join(__dirname, 'master'), master);