const m = new MutationObserver(() => {
  const e = document.querySelector('.bpx-player-ending-related-item-cancel');
  if (e && getComputedStyle(e).display !== 'none') {
    e.click();
  }
});

m.observe(document.body, { subtree: true, childList: true });