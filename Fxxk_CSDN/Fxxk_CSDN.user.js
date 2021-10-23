GM_addStyle('#csdn-redpack, .toolbar-advert { display: none !important; }');

const hide = document.querySelector('.hide-article-box');
if (hide) {
  Array.prototype.forEach.call(document.querySelectorAll('.article_content'), it => it.style.height = "auto");
  hide.remove();
}

const observer = new MutationObserver(() => {
  const loginBox = document.querySelector('.passport-login-container');
  if (loginBox) {
    loginBox.remove();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});