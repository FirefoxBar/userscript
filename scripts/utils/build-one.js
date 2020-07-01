const webpack = require('webpack');
const config = require('./webpack.base');
const generateMeta = require('./generate-meta');
const { readFileSync } = require('fs');
const path = require('path');

module.exports = function(name, output) {
  return new Promise((resolve, reject) => {
    const root = path.resolve(__dirname, '../..', name);
    const outputDir = output || root;
    // 读取版本号
    const package = JSON.parse(readFileSync(path.resolve(root, 'package.json')));
    // 读取配置，生成注释
    const meta = generateMeta(path.resolve(root, 'meta.yml'), {
      version: package.version,
      updateURL: `https://userscript.firefoxcn.net/js/${name}.meta.js`,
      downloadURL: `https://userscript.firefoxcn.net/js/${name}.user.js`
    });

    const complier = webpack(config(name, meta.text, outputDir));
  
    complier.run((err, stats) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ name, meta, stats });
    });
  });
}
