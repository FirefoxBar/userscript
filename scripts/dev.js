const webpack = require('webpack');
const config = require('./utils/webpack.config');
const generateMeta = require('./utils/generate-meta');
const { readFileSync, existsSync } = require('fs');
const path = require('path');
const { exec } = require('./utils');
const terminal = require('./utils/terminal');

const name = process.argv[process.argv.length - 1];

const main = async function() {
  const root = path.join(__dirname, '..', name);

  // 读取版本号
  const package = JSON.parse(readFileSync(path.join(root, 'package.json')));
  // 读取配置，生成注释
  const meta = generateMeta(path.join(root, 'meta.yml'), {
    version: package.version,
    updateURL: `https://userscript.firefoxcn.net/js/${name}.meta.js`,
    downloadURL: `https://userscript.firefoxcn.net/js/${name}.user.js`
  });

  const webpackConfig = config({
    name,
    meta: meta.text,
    output: root,
    isDev: true
  });

  if (existsSync(path.join(root, 'webpack.overwrite.js'))) {
    require(path.join(root, 'webpack.overwrite.js'))(webpackConfig);
  }

  const compiler = webpack(webpackConfig);

  compiler.watch({}, (err, stats) => {
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