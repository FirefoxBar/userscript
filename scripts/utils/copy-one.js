const generateMeta = require('./generate-meta');
const path = require('path');
const { readFileSync, writeFileSync } = require('fs');

module.exports = function(name, output) {
  const root = path.join(__dirname, '../..', name);
  // 读取配置，生成注释
  const meta = generateMeta(path.join(root, 'meta.yml'), {
    updateURL: `https://userscript.firefoxcn.net/js/${name}.meta.js`,
    downloadURL: `https://userscript.firefoxcn.net/js/${name}.user.js`
  });

  // 生成meta.js
  writeFileSync(path.join(output, name + '.meta.js'), meta.text.trim(), {
    encoding: 'UTF-8' 
  });

  // 复制user.js
  const content = readFileSync(path.join(root,  name + '.user.js'), {
    encoding: 'UTF-8'
  });
  writeFileSync(path.join(output, name + '.user.js'), meta.text + content, {
    encoding: 'UTF-8' 
  });

  return { name, meta };
}