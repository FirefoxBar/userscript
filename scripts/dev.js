const webpack = require('webpack');
const config = require('./utils/webpack.config');
const generateMeta = require('./utils/generate-meta');
const { readFileSync, existsSync } = require('fs');
const path = require('path');
const { exec } = require('./utils');
const terminal = require('./utils/terminal');

const name = process.argv[process.argv.length - 1];

const main = async function() {
  const root = path.resolve(__dirname, '..', name);

  // 检查有没有安装依赖
  if (!existsSync(path.resolve(root, 'node_modules'))) {
    await exec("cd " + root + " && yarn install --frozen-lockfile");
  }

  // 读取版本号
  const package = JSON.parse(readFileSync(path.resolve(root, 'package.json')));
  // 读取配置，生成注释
  const meta = generateMeta(path.resolve(root, 'meta.yml'), {
    version: package.version,
    updateURL: `https://userscript.firefoxcn.net/js/${name}.meta.js`,
    downloadURL: `https://userscript.firefoxcn.net/js/${name}.user.js`
  });

  const complier = webpack(config({
    name,
    meta: meta.text,
    output: root,
    isDev: true
  }));

  complier.watch({}, (err, stats) => {
    if (err) {
      console.error(err);
    } else {
      // 遍历结果，输出错误
      for (const module of stats.compilation.modules) {
        if (module.errors && module.errors.length > 0) {
          module.errors.forEach(error => {
            console.error(error.message);
          });
          return;
        }
      }
      terminal.assets(stats.compilation.assets);
    }
  });
}

main();