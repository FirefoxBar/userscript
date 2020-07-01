const { readFileSync } = require('fs');
const yaml = require('yaml');

module.exports = function(file, merge = {}) {
  const text = readFileSync(file, {
    encoding: 'UTF-8'
  });
  const meta = {
    ...yaml.parse(text),
    ...merge
  };

  const result = ['// ==UserScript=='];
  for (const k in meta) {
    if (Array.isArray(meta[k])) {
      meta[k].forEach(v => {
        result.push(`// @${k} ${v}`);
      });
    } else {
      result.push(`// @${k} ${meta[k]}`);
    }
  }
  result.push('// ==/UserScript==');

  return {
    meta: meta,
    text: result.join("\n") + "\n"
  };
}