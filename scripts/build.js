const build = require('./utils/build-one');
const terminal = require('./utils/terminal');

const isDev = process.argv.includes('-D');
const name = process.argv[process.argv.length - 1];

build(name, undefined, isDev)
.then(res => {
  terminal.assets(res.stats.compilation.assets);
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
})