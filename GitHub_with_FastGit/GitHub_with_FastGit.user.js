(function () {
  const isDotGit = (url) =>
    url.indexOf("https://github.com/") === 0 && url.substr(-4) === ".git";

  const replaceUrl = (url) => {
    if (url.indexOf(".fastgit.org") !== -1) return;
    // 下载 Release
    if (url.indexOf("/releases/download/") !== -1) {
      return url.replace("github.com", "download.fastgit.org");
    }
    // 下载某分支
    if (url.indexOf("/archive/refs/") !== -1) {
      return url.replace("github.com", "archive.fastgit.org");
    }
    // .git，只识别 https 协议
    if (isDotGit(url)) {
      return url.replace("github.com", "hub.fastgit.xyz");
    }
    // RAW
    const rawRegex = /https?:\/\/(.*?)\/(.*?)\/(.*?)\/raw\//;
    if (rawRegex.test(url)) {
      return url.replace(rawRegex, "https://raw.fastgit.org/$2/$3/");
    }
  };

  const replaceAnchor = (anchor) => {
    const newUrl = replaceUrl(anchor.href);
    if (newUrl) {
      console.log(
        "[GitHub with FastGit] 将 " + anchor.href + " 替换为 " + newUrl
      );
      anchor.href = newUrl;
    }
  };

  const replaceAnchors = (anchors) =>
    Array.prototype.forEach.call(anchors, replaceAnchor);

  const checkTasks = [
    () => {
      // Download ZIP
      const modal = document.querySelector(
        "div[data-target='get-repo.modal']:not(.x_hacked)"
      );
      if (!modal) return;
      modal.classList.add("x_hacked");
      replaceAnchors(modal.querySelectorAll("a"));
      // HTTPS Clone
      const e = Array.from(modal.querySelectorAll("input")).find((x) =>
        isDotGit(x.value)
      );
      if (e) {
        const inputGroup = e.parentElement;
        inputGroup.classList.add("mt-2");
        const newGroup = inputGroup.cloneNode(true);
        const newInput = newGroup.querySelector("input");
        newInput.value = replaceUrl(newInput.value);
        const newCopy = newGroup.querySelector("clipboard-copy");
        newCopy.value = replaceUrl(newCopy.value);
        inputGroup.parentElement.insertBefore(newGroup, inputGroup);
      }
    },
    () => {
      // Release 下载页面
      const cards = document.querySelectorAll(
        "div[data-test-selector='release-card']:not(.x_hacked)"
      );
      if (cards.length === 0) return;
      Array.prototype.forEach.call(cards, (card) => {
        card.classList.add("x_hacked");
        replaceAnchors(card.querySelectorAll(".Box-footer ul li a"));
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
        replaceAnchors(card.querySelectorAll("ul li a"));
      });
    },
    () => {
      // Raw 按钮
      const raw = document.querySelector("#raw-url");
      if (!raw) return;
      replaceAnchor(raw);
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
