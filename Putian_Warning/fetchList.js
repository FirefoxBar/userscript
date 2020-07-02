const fetch = require('node-fetch');
const { writeFile } = require('fs-extra');
const { resolve } = require('path');
const url = 'https://raw.githubusercontent.com/open-power-workgroup/Hospital/master/resource/API_resource/hospital_list.json';

const getDomain = (url) => {
  let result = url;
  result = result.replace(/^https?:\/\//, '');
  if (result.includes('/')) {
    result = result.substr(0, result.indexOf('/'));
  }
  return result;
}

const main = async function() {
  const res = await fetch(url);
  const json = await res.json();

  const result = {};

  Object.values(json).forEach(city => {
    Object.entries(city).forEach(hospitalArr => {
      const name = hospitalArr[0];
      const hospital = hospitalArr[1];
      if (typeof hospital['网址'] === 'undefined') {
        return;
      }
      
      const urls = hospital['网址'];
      delete hospital['网址'];
      // 先转换其他部分内容
      const text = [
        "名称：" + name
      ];
      Object.entries(hospital).forEach(it => {
        text.push(`${it[0]}: ${it[1].join("\n")}`);
      });

      // 网址
      urls.forEach(url => {
        result[getDomain(url)] = text;
      });
    });
  });

  await writeFile(resolve(__dirname, 'src/list.json'), JSON.stringify(result, undefined, 2), {
    encoding: 'UTF-8'
  });
}

main();