const chalk = require('chalk');

module.exports = {
  assets: assets => {
    Object.entries(assets).forEach(it => {
      const name = it[0];
      const asset = it[1];
      console.log((asset.emitted ? chalk.green('[emitted]') : chalk.red('[not emitted]')) + ' ' + name);
    });
  }
}