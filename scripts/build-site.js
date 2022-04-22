const { existsSync, readdirSync, mkdirSync, statSync } = require("fs");
const { copySync, writeFile } = require("fs-extra");
const path = require("path");
const buildOne = require("./utils/build-one");
const copyOne = require("./utils/copy-one");
const chalk = require("chalk");

const root = path.join(__dirname, "..");
const dirs = readdirSync(root);

if (!existsSync(path.join(root, "dist"))) {
  mkdirSync(path.join(root, "dist"));
}
if (!existsSync(path.join(root, "dist/master"))) {
  mkdirSync(path.join(root, "dist/master"));
}
if (!existsSync(path.join(root, "dist/pages"))) {
  mkdirSync(path.join(root, "dist/pages"));
}

// 生成列表
async function main() {
  // 编译脚本
  const distJs = path.join(root, "dist/pages/js");
  if (!existsSync(distJs)) {
    mkdirSync(distJs);
  }
  const queue = dirs.map(async (it) => {
    const fullPath = path.join(root, it);
    if (!statSync(fullPath).isDirectory()) {
      return;
    }
    // meta.yml
    if (existsSync(path.join(fullPath, "package.json"))) {
      // 需要编译的
      return await buildOne(it, distJs);
    } else if (existsSync(path.join(root, it, it + ".user.js"))) {
      // 纯复制，但仍然需要解析meta
      return copyOne(it, distJs);
    }
  });

  try {
    const result = await Promise.all(queue);
    const list = result
      .map((it) => {
        if (!it) return;
        console.log(chalk.green("✔") + it.name + ": 已" + (it.stats ? "编译" : "复制"));
        const meta = it.meta.meta;
        const res = {
          name: meta.name,
          version: meta.version,
          installURL: meta.downloadURL,
          homepageURL: "https://github.com/FirefoxBar/userscript/tree/main/" + it.name,
          description: meta.description,
        };
        if (meta.icon) {
          res.icon = meta.icon;
        }
        return res;
      })
      .filter((x) => !!x)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (!existsSync(path.join(root, "dist/pages/api"))) {
      mkdirSync(path.join(root, "dist/pages/api"));
    }
    await writeFile(
      path.join(root, "dist/pages/api/list.json"),
      JSON.stringify(list)
    );
    await writeFile(
      path.join(root, "dist/pages/api/list.js"),
      "onGetList(" + JSON.stringify(list) + ")"
    );
    // 复制站点文件
    copySync(path.join(__dirname, "www"), path.join(root, "dist/pages"));
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
