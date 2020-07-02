const webpack = require('webpack');
const config = require('./webpack.base');
const generateMeta = require('./generate-meta');
const { readFileSync, existsSync } = require('fs');
const path = require('path');
const { exec } = require('./index');

module.exports = function(name, output, isDev = false) {
  return new Promise(async (resolve, reject) => {
    const root = path.resolve(__dirname, '../..', name);

    // 检查有没有安装依赖
    if (!existsSync(path.resolve(root, 'node_modules'))) {
      await exec("cd " + root + " && yarn install --frozen-lockfile");
    }

    const outputDir = output || root;
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
      output: outputDir,
      isDev
    }));
  
    complier.run((err, stats) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ name, meta, stats });
    });
  });
}
