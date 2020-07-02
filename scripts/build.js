const build = require('./utils/build-one');

const isDev = process.argv.includes('-D');
const name = process.argv[process.argv.length - 1];

build(name, undefined, isDev).then(res => {
  // console.log(res.stats.compilation.modules);
  // console.log(res.stats.compilation.records);
  console.log(res.stats.compilation.assets);
})