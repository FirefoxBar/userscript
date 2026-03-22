(function () {
  const isDotGit = (url) =>
    url.indexOf("https://github.com/") === 0 && /\.git$/.test(url);

  const isReleaseDownload = (url) => url.includes("/releases/download/");
  const rawRegex = /https?:\/\/(.*?)\/(.*?)\/(.*?)\/raw\//;
  const isRAW = (url) => rawRegex.test(url);
  const isArchive = (url) => url.includes("/archive/refs/");

  const handler = {
    "gh-proxy-main": (url) => {
      if (
        isReleaseDownload(url) ||
        isArchive(url) ||
        isRAW(url) ||
        isDotGit(url)
      ) {
        return `https://gh-proxy.org/${url}`;
      }
    },
    "gh-proxy-hk": (url) => {
      if (
        isReleaseDownload(url) ||
        isArchive(url) ||
        isRAW(url) ||
        isDotGit(url)
      ) {
        return `https://hk.gh-proxy.org/${url}`;
      }
    },
    ghfast: (url) => {
      if (
        isReleaseDownload(url) ||
        isArchive(url) ||
        isRAW(url) ||
        isDotGit(url)
      ) {
        return `https://ghfast.top/${url}`;
      }
    },
    "custom-hubproxy": (url) => {
      if (
        isReleaseDownload(url) ||
        isArchive(url) ||
        isRAW(url) ||
        isDotGit(url)
      ) {
        return `${GM_getValue("prefix")}/${url}`;
      }
    },
  };

  const openSetting = () => {
    // 创建遮罩层
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
      z-index: 10000;
      display: flex;
      justify-content: center;
      align-items: center;
    `;

    // 创建弹窗容器
    const modal = document.createElement("div");
    modal.style.cssText = `
      background: white;
      border-radius: 8px;
      padding: 20px;
      min-width: 400px;
      max-width: 500px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;

    // 创建标题
    const title = document.createElement("h3");
    title.textContent = "代理设置";
    title.style.cssText = "margin-top: 0; margin-bottom: 15px;";

    // 创建代理选项
    const optionsContainer = document.createElement("div");
    optionsContainer.style.marginBottom = "15px";

    const proxyOptions = [
      { value: "gh-proxy-main", label: "gh-proxy-main" },
      { value: "gh-proxy-hk", label: "gh-proxy-hk" },
      { value: "ghfast", label: "ghfast" },
      { value: "custom-hubproxy", label: "Custom Hub Proxy" },
    ];

    const selectedHandler = GM_getValue("handler") || "gh-proxy-main";
    let currentSelection = selectedHandler;

    proxyOptions.forEach((option) => {
      const radioDiv = document.createElement("div");
      radioDiv.style.cssText =
        "margin-bottom: 10px; display: flex; align-items: center;";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "proxy-option";
      radio.value = option.value;
      radio.checked = option.value === selectedHandler;
      radio.addEventListener("change", (e) => {
        currentSelection = e.target.value;
        updatePrefixVisibility();
      });

      const label = document.createElement("label");
      label.textContent = option.label;
      label.style.marginLeft = "8px";

      radioDiv.appendChild(radio);
      radioDiv.appendChild(label);
      optionsContainer.appendChild(radioDiv);
    });

    // 创建prefix输入框
    const prefixContainer = document.createElement("div");
    prefixContainer.id = "prefix-container";
    prefixContainer.style.cssText = "margin-bottom: 15px;";

    const prefixLabel = document.createElement("label");
    prefixLabel.textContent = "Prefix (以http或https开头):";
    prefixLabel.style.display = "block";
    prefixLabel.style.marginBottom = "5px";

    const prefixInput = document.createElement("input");
    prefixInput.type = "text";
    prefixInput.placeholder = "例如: https://your-proxy.com";
    prefixInput.style.cssText = `
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    `;

    // 设置当前值
    const currentPrefix = GM_getValue("prefix", "");
    if (currentSelection === "custom-hubproxy") {
      prefixInput.value = currentPrefix;
    }

    prefixContainer.appendChild(prefixLabel);
    prefixContainer.appendChild(prefixInput);

    // 更新prefix可见性
    const updatePrefixVisibility = () => {
      prefixContainer.style.display =
        currentSelection === "custom-hubproxy" ? "block" : "none";
    };

    // 初始化时调用一次
    updatePrefixVisibility();

    // 创建按钮容器
    const buttonContainer = document.createElement("div");
    buttonContainer.style.cssText =
      "display: flex; justify-content: flex-end; gap: 10px;";

    // 创建取消按钮
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "取消";
    cancelButton.style.cssText = `
      padding: 8px 16px;
      background: #f0f0f0;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
    `;
    cancelButton.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });

    // 创建保存按钮
    const saveButton = document.createElement("button");
    saveButton.textContent = "保存";
    saveButton.style.cssText = `
      padding: 8px 16px;
      background: #0969da;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;

    // 验证函数
    const validateInputs = () => {
      if (currentSelection === "custom-hubproxy") {
        const prefixValue = prefixInput.value.trim();
        return prefixValue && /^(https?:\/\/)/.test(prefixValue);
      }
      return true;
    };

    // 保存按钮事件
    saveButton.addEventListener("click", () => {
      if (!validateInputs()) {
        alert("请提供有效的Prefix（以http或https开头）");
        return;
      }

      // 保存选择的代理
      GM_setValue("handler", currentSelection);

      // 如果是自定义代理，保存prefix
      if (currentSelection === "custom-hubproxy") {
        GM_setValue("prefix", prefixInput.value.trim());
      }

      // 关闭弹窗
      document.body.removeChild(overlay);

      // 刷新页面以应用新设置
      location.reload();
    });

    // 添加按钮到容器
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(saveButton);

    // 组装弹窗内容
    modal.appendChild(title);
    modal.appendChild(optionsContainer);
    modal.appendChild(prefixContainer);
    modal.appendChild(buttonContainer);

    // 添加弹窗到遮罩
    overlay.appendChild(modal);

    // 添加遮罩到页面
    document.body.appendChild(overlay);
  };

  const replaceAnchor = (anchor) => {
    if (anchor.classList.contains("x_hacked")) {
      return;
    }
    anchor.classList.add("x_hacked");
    const replaceUrl = handler[GM_getValue("handler") || "gh-proxy-main"];
    const newUrl = replaceUrl(anchor.href);
    if (newUrl) {
      console.log("[GitHub Mirror] 将 " + anchor.href + " 替换为 " + newUrl);
      anchor.href = newUrl;
    }
  };

  const replaceAnchors = (anchors) =>
    Array.prototype.forEach.call(anchors, replaceAnchor);

  const checkTasks = [
    () => {
      // Download ZIP
      const modalLink = document.querySelector('ul[class^="prc-ActionList-ActionList"]');
      if (modalLink) {
        replaceAnchors(modalLink.querySelectorAll("a"));
      }
      // HTTPS Clone
      const e = document.querySelector('#clone-with-https');
      if (e && !e.classList.contains('x_hacked')) {
        e.classList.add("x_hacked");
        const replaceUrl = handler[GM_getValue("handler") || "gh-proxy-main"];
        const newUrl = replaceUrl(e.value);
        if (newUrl) {
          console.log("[GitHub Mirror] 将 " + e.value + " 替换为 " + newUrl);
          e.value = newUrl;
        }
      }
    },
    () => {
      // Release 下载页面
      const el = document.querySelectorAll(".Box-footer ul li a");
      if (el.length === 0) return;
      replaceAnchors(el);
    },
    () => {
      // Tags 页面
      const desc = document.querySelector(".commit-desc");
      if (!desc) return;
      replaceAnchors(document.querySelectorAll(".Details a"));
    },
    () => {
      // Raw 按钮
      const raw = document.querySelector('a[data-testid="raw-button"]');
      if (!raw) return;
      replaceAnchor(raw);
    },
  ];

  const doCheck = () => checkTasks.forEach((x) => x());

  function main() {
    GM_registerMenuCommand("设置", () => openSetting());
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
