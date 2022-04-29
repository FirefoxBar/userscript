// ==UserScript==
// @name GitHub with FastGit
// @version 1
// @description 自动替换 GitHub 页面上的相关链接为 FastGit
// @include https://github.com/*
// @author ShuangYa
// @run-at document-end
// @icon https://github.githubassets.com/favicons/favicon.png
// @grant unsafeWindow
// @namespace blog.sylingd.com
// @updateURL https://userscript.firefoxcn.net/js/GitHub_with_FastGit.meta.js
// @downloadURL https://userscript.firefoxcn.net/js/GitHub_with_FastGit.user.js
// ==/UserScript==
(function () {
  const replaceLinks = (links) => {
    Array.prototype.forEach.call(links, (link) => {
      const url = link.href;
      if (url.indexOf(".fastgit.org") !== -1) return;
      // 下载 Release
      if (url.indexOf("/releases/download/") !== -1) {
        console.log("将 " + url + " 替换为 download.fastgit.org");
        link.href = url.replace("github.com", "download.fastgit.org");
        return;
      }
      // 下载某分支
      if (url.indexOf("/archive/refs/") !== -1) {
        console.log("将 " + url + " 替换为 archive.fastgit.org");
        link.href = url.replace("github.com", "archive.fastgit.org");
        return;
      }
      // RAW
      const rawRegex = /https?:\/\/(.*?)\/(.*?)\/(.*?)\/raw\//;
      if (rawRegex.test(url)) {
        console.log("将 " + url + " 替换为 raw.fastgit.org");
        link.href = url.replace(rawRegex, "https://raw.fastgit.org/$2/$3/");
        return;
      }
    });
  };

  const checkTasks = [
    () => {
      // Download ZIP
      const modal = document.querySelector(
        "div[data-target='get-repo.modal']:not(.x_hacked)"
      );
      if (!modal) return;
      modal.classList.add("x_hacked");
      replaceLinks(modal.querySelectorAll("a"));
    },
    () => {
      // Release 下载页面
      const cards = document.querySelectorAll(
        "div[data-test-selector='release-card']:not(.x_hacked)"
      );
      if (cards.length === 0) return;
      Array.prototype.forEach.call(cards, (card) => {
        card.classList.add("x_hacked");
        replaceLinks(card.querySelectorAll(".Box-footer ul li a"));
      });
    },
    () => {
      // Tags 页面
      const cards = document.querySelectorAll(
        "div[data-test-selector='tag-info-container']:not(.x_hacked)"
      );
      if (cards.length === 0) return;
      Array.prototype.forEach.call(cards, (card) => {
        card.classList.add("x_hacked");
        replaceLinks(card.querySelectorAll("ul li a"));
      });
    },
    () => {
      // Raw 按钮
      const raw = document.querySelector("#raw-url");
      if (!raw) return;
      replaceLinks([raw]);
    },
  ];

  const doCheck = () => checkTasks.forEach((x) => x());

  function main() {
    const observer = new MutationObserver(doCheck);
    observer.observe(document.body, {
      childList: true,
      attributes: true,
      subtree: true,
    });
    doCheck();
  }

  main();
})();
