const { existsSync, readdirSync, mkdirSync, statSync } = require("fs");
const { execFile } = require("child_process");
const { promisify } = require("util");
const { copySync, writeFile } = require("fs-extra");
const path = require("path");
const buildOne = require("./utils/build-one");
const copyOne = require("./utils/copy-one");
const chalk = require("chalk");

const execFileAsync = promisify(execFile);

const root = path.join(__dirname, "..");
const dirs = readdirSync(root);

// 并发上限，避免脚本目录很多时一次性拉起大量 git 进程
const GIT_CONCURRENCY = 8;

// 带并发上限的 map，保证结果顺序与入参一致
async function mapWithLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (cursor < items.length) {
        const index = cursor++;
        results[index] = await mapper(items[index], index);
      }
    }
  );
  await Promise.all(workers);
  return results;
}

const lastUpdateCache = new Map();

/**
 * 取某个脚本目录最后一次被 git 提交的时间
 * @param {string} dirName 仓库根目录下的脚本目录名
 * @returns {Promise<number>} Unix 秒级时间戳（10 位），取不到时为 0
 */
async function getLastUpdate(dirName) {
  if (lastUpdateCache.has(dirName)) {
    return lastUpdateCache.get(dirName);
  }

  let ts = null;
  try {
    const { stdout } = await execFileAsync(
      "git",
      ["-C", root, "log", "-1", "--format=%ct", "--", ":(literal)" + dirName],
      { maxBuffer: 1024 * 1024 }
    );
    const parsed = parseInt(stdout.trim(), 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      ts = parsed;
    }
  } catch (err) {
    // 非 git 仓库 / git 不可用 / 目录尚未提交，走下面的兜底逻辑
  }

  if (ts === null) {
    // 兜底：用目录自身的最后修改时间
    try {
      ts = Math.floor(statSync(path.join(root, dirName)).mtimeMs / 1000);
    } catch (err) {
      ts = 0;
    }
  }

  lastUpdateCache.set(dirName, ts);
  return ts;
}

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
    const list = (
      await mapWithLimit(result, GIT_CONCURRENCY, async (it) => {
        if (!it) return;
        console.log(chalk.green("✔") + it.name + ": 已" + (it.stats ? "编译" : "复制"));
        const meta = it.meta.meta;
        const res = {
          name: meta.name,
          version: meta.version,
          lastUpdate: await getLastUpdate(it.name),
          installURL: meta.downloadURL,
          homepageURL: "https://github.com/FirefoxBar/userscript/tree/main/" + it.name,
          description: meta.description,
        };
        if (meta.icon) {
          res.icon = meta.icon;
        }
        return res;
      })
    )
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
