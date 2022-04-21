const { existsSync, readdirSync, mkdirSync, statSync } = require("fs");
const { copySync, writeFile } = require("fs-extra");
const { resolve } = require("path");
const buildOne = require("./utils/build-one");
const copyOne = require("./utils/copy-one");
const chalk = require("chalk");

const root = resolve(__dirname, "..");
const dirs = readdirSync(root);

if (!existsSync(resolve(root, "dist"))) {
  mkdirSync(resolve(root, "dist"));
}
if (!existsSync(resolve(root, "dist/master"))) {
  mkdirSync(resolve(root, "dist/master"));
}
if (!existsSync(resolve(root, "dist/pages"))) {
  mkdirSync(resolve(root, "dist/pages"));
}

// 生成列表
async function main() {
  // 编译脚本
  const distJs = resolve(root, "dist/pages/js");
  if (!existsSync(distJs)) {
    mkdirSync(distJs);
  }
  const queue = dirs.map(async (it) => {
    const fullPath = resolve(root, it);
    if (!statSync(fullPath).isDirectory()) {
      return;
    }
    // meta.yml
    if (existsSync(resolve(fullPath, "package.json"))) {
      // 需要编译的
      return await buildOne(it, distJs);
    } else if (existsSync(resolve(root, it, it + ".user.js"))) {
      // 纯复制，但仍然需要解析meta
      return copyOne(it, distJs);
    }
  });

  try {
    const result = await Promise.all(queue);
    const list = result
      .map((it) => {
        if (!it) return;
        console.log(
          chalk.green("✔") +
            " 已" +
            (it.stats ? "编译" : "复制") +
            " " +
            it.name
        );
        const meta = it.meta.meta;
        return {
          name: meta.name,
          version: meta.version,
          installURL: meta.downloadURL,
          homepageURL:
            "https://github.com/FirefoxBar/userscript/tree/main/" + it.name,
          description: meta.description,
        };
      })
      .filter((x) => !!x)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (!existsSync(resolve(root, "dist/pages/api"))) {
      mkdirSync(resolve(root, "dist/pages/api"));
    }
    await writeFile(
      resolve(root, "dist/pages/api/list.json"),
      JSON.stringify(list)
    );
    await writeFile(
      resolve(root, "dist/pages/api/list.js"),
      "onGetList(" + JSON.stringify(list) + ")"
    );
    // 复制站点文件
    copySync(resolve(__dirname, "www"), resolve(root, "dist/pages"));
  } catch (err) {
    if (Array.isArray(err)) {
      err.forEach((error) => {
        console.error(error.message);
      });
    } else {
      console.error(err);
    }
    process.exit(1);
  }
}

main();
