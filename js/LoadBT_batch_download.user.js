// ==UserScript==
// @name LoadBT 批量下载
// @version 5
// @description LoadBT 批量复制下载链接
// @include https://www.loadbt.com/files*
// @author ShuangYa
// @run-at document-end
// @icon https://www.loadbt.com/images/icons/favicon.ico
// @grant unsafeWindow
// @grant GM_setClipboard
// @namespace http://blog.sylingd.com
// @updateURL https://userscript.firefoxcn.net/js/LoadBT_batch_download.meta.js
// @downloadURL https://userscript.firefoxcn.net/js/LoadBT_batch_download.user.js
// ==/UserScript==
(function () {
  let _fetchQueueCount = 0;
  const _fetchQueueArr = [];
  const _fetchQueueRun = async () => {
    const item = _fetchQueueArr.shift();
    if (!item) return;
    fetch(item.url)
      .then((x) => x.json())
      .then(item.resolve)
      .catch(item.reject)
      .finally(() => {
        _fetchQueueCount--;
        _fetchQueueRun();
      });
  };
  const fetchQueue = (url) => {
    return new Promise((resolve, reject) => {
      _fetchQueueArr.push({ url, resolve, reject });
      if (_fetchQueueCount < 3) {
        _fetchQueueCount++;
        _fetchQueueRun();
      }
    });
  };

  const waitUntil = (cb) => {
    return new Promise((resolve) => {
      const check = () => {
        setTimeout(() => {
          if (cb()) resolve();
          else check();
        }, 300);
      };
      check();
    });
  };

  let tipContainer = null;
  let tipProgressDisplay = "";
  function tip(text, progress) {
    if (!tipContainer) {
      tipContainer = document.createElement("div");
      tipContainer.style.position = "fixed";
      tipContainer.style.zIndex = "99999";
      tipContainer.style.textAlign = "center";
      tipContainer.style.bottom = "20px";
      tipContainer.style.left = "50%";
      tipContainer.style.width = "400px";
      tipContainer.style.maxWidth = "100%";
      tipContainer.style.transform = "translateX(-50%)";
      tipContainer.style.border = "1px solid #00000026";
      tipContainer.style.borderRadius = "0.25rem";
      tipContainer.style.padding = "12px";
      tipContainer.style.background = "#fff";
      tipContainer.innerHTML = "<div class='desc'></div><div class='progress'><div class='progress-bar bg-info'></div></div>";
      document.body.appendChild(tipContainer);
      tipProgressDisplay = getComputedStyle(tipContainer.querySelector(".progress")).display;
    }
    tipContainer.querySelector(".progress").style.display = typeof progress === "undefined" ? "none" : tipProgressDisplay;
    tipContainer.querySelector(".desc").innerText = text;
    if (typeof progress !== "undefined") {
      tipContainer.querySelector(".progress-bar").style.width = progress * 100 + "%";
    }
  }

  function hideTip() {
    tipContainer.remove();
    tipContainer = null;
  }

  async function onItemClick(rootId) {
    if (rootId == -1) return;
    tip("正在获取文件列表");
    const result = [];
    let totalCount = 0;
    // 更新进度
    const updateProgress = () => tip("获取下载地址 " + result.length + " / " + totalCount, result.length / totalCount);
    const addFolder = async (folderId) => {
      const { files } = await fetchQueue("/files/" + folderId);
      totalCount += files.filter((x) => !x.is_directory).length;
      for (const file of files) {
        // 处理多级文件夹
        if (file.is_directory) {
          await addFolder(file.id);
        } else {
          const u = await fetchQueue("/download/" + file.id);
          result.push(u.url);
        }
        updateProgress();
      }
    };
    await addFolder(rootId);

    hideTip();
    GM_setClipboard(result.join("\n"));
    setTimeout(() => alert("下载地址已复制到剪贴板"));
  }

  async function run() {
    tip("正在获取文件夹");
    // 加载文件夹列表
    const folders = (await fetchQueue("/files/0")).files;
    hideTip();
    if (folders.length === 0) {
      alert("没有可下载的文件夹");
      return;
    }

    folders.push({
      id: -1,
      name: "取消"
    });

    const folderList = document.createElement("div");
    folderList.className = "dropdown-menu dropdown-menu-right show";
    folderList.style.position = "fixed";
    folderList.style.zIndex = "99999";
    folderList.style.top = "50%";
    folderList.style.left = "50%";
    folderList.style.width = "400px";
    folderList.style.maxWidth = "100%";
    folderList.style.transform = "translate(-50%, -50%)";

    folders.forEach((folder) => {
      const item = document.createElement("span");
      item.classList = "dropdown-item";
      item.innerText = folder.name;
      item.style.cursor = "pointer";
      item.setAttribute("data-id", folder.id);

      item.addEventListener("click", () => {
        onItemClick(folder.id);
        folderList.remove();
      });

      folderList.appendChild(item);
    });

    document.body.appendChild(folderList);
  }

  async function main() {
    await waitUntil(() => !!document.getElementById("torrent-file"));
    const container = document.getElementById("torrent-file").parentElement;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn btn-primary mb-2 ml-2 d-none d-sm-block";
    b.innerHTML = "批量下载";
    b.addEventListener("click", run);
    container.appendChild(b);
  }

  main();
})();
