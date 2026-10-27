// ==UserScript==
// @name Tieba Swiper Hang
// @version 1
// @description 禁用/限流贴吧轮播(Swiper)的update自激循环，缓解卡死问题
// @include https://tieba.baidu.com/*
// @include https://tiebac.baidu.com/*
// @author ShuangYa
// @run-at document-start
// @icon https://tieba.baidu.com/favicon.ico
// @namespace blog.sylingd.com
// @updateURL https://userscript.firefoxcn.net/js/Tieba_Swiper_Hang.meta.js
// @downloadURL https://userscript.firefoxcn.net/js/Tieba_Swiper_Hang.user.js
// ==/UserScript==
(function () {
  'use strict';

  /* ==================== 配置 ==================== */
  // 'noop'     : 彻底废掉轮播的更新逻辑（最省 CPU，轮播视觉上不再自动排版/动画）
  // 'throttle' : 保留轮播，但把热方法限流到 THROTTLE_MS 毫秒最多一次
  const MODE = 'noop';
  const THROTTLE_MS = 500;

  // 是否在拿不到实例时，额外拦截 .swiper* 元素的 innerHTML 重写（兜底）
  const HOOK_INNERHTML = true;
  // 是否削弱第三方扩展的 MutationObserver（有效但可能让广告过滤类扩展失效）
  const THROTTLE_OBSERVERS = false;

  const DEBUG = true;
  const log = (...a) => DEBUG && console.log('[swiper-fix]', ...a);

  /* ========== 1. 兜底：拦截 swiper 容器的 innerHTML 全量重写 ========== */
  // 对应 trace 里 5.2s 的 jQuery html()（Swiper.render → update）
  // 注意：jQuery 走 .append() 路径时拦不到，所以这只是辅助，主力是第 2 步
  if (HOOK_INNERHTML) {
    const desc = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    if (desc && desc.set) {
      Object.defineProperty(Element.prototype, 'innerHTML', {
        configurable: true,
        enumerable: desc.enumerable,
        get() { return desc.get.call(this); },
        set(v) {
          try {
            const c = typeof this.className === 'string' ? this.className : '';
            if (c.indexOf('swiper') !== -1) {
              log('blocked innerHTML write on', c.slice(0, 60));
              return;
            }
          } catch (e) { /* 忽略，走原逻辑 */ }
          desc.set.call(this, v);
        }
      });
      log('innerHTML hook installed');
    }
  }

  /* ========== 2. 主力：拿到 Swiper 实例，把热方法改成 no-op / 限流 ========== */
  // 对应 trace 热点：update / updateSize(读 clientWidth) / updateSlidesClasses(remove)
  const HOT = [
    'update', 'updateSize', 'updateSlides', 'updateSlidesClasses',
    'updateActiveIndex', 'updateAutoHeight', 'updateProgress',
    'updateSlidesOffset', 'slideTo', 'slideNext', 'slidePrev'
  ];

  function patchInstance(sw) {
    if (!sw || sw.__patched) return;
    const proto = Object.getPrototypeOf(sw);
    if (!proto) return;
    sw.__patched = true;
    let n = 0;
    for (const m of HOT) {
      if (typeof sw[m] !== 'function') continue;
      const orig = sw[m].bind(sw);
      if (MODE === 'noop') {
        sw[m] = function () { return sw; };   // 保持链式调用返回值
      } else {
        let last = 0;
        sw[m] = function (...args) {
          const now = Date.now();
          if (now - last < THROTTLE_MS) return sw;
          last = now;
          return orig(...args);
        };
      }
      n++;
    }
    log(`patched ${n} methods on swiper instance (MODE=${MODE})`);
  }

  function tryFindAndPatch() {
    // Swiper 4/5/6 都会把实例挂回容器元素：el.swiper
    const nodes = document.querySelectorAll('[class*="swiper"]');
    for (const el of nodes) {
      if (el.swiper) patchInstance(el.swiper);
      if (el.Swiper) patchInstance(el.Swiper);
    }
    return nodes.length;
  }

  // 容器是 Vue 动态渲染的，前 30 秒持续尝试（每 500ms 一次，开销可忽略）
  const t0 = Date.now();
  const timer = setInterval(() => {
    tryFindAndPatch();
    if (Date.now() - t0 > 30000) { clearInterval(timer); log('scan finished'); }
  }, 500);

  window.addEventListener('DOMContentLoaded', tryFindAndPatch);
  window.addEventListener('load', tryFindAndPatch);

  /* ========== 3. 可选：削弱第三方扩展的 MutationObserver 放大 ========== */
  // trace 里两个扩展共约 2.1 万次回调（onDomChanged / observerHandler）
  // 开启后能砍掉这部分同步开销，但广告过滤类扩展的实时隐藏可能失效
  if (THROTTLE_OBSERVERS) {
    const MO = window.MutationObserver;
    if (MO) {
      window.MutationObserver = function (cb) {
        let last = 0;
        return new MO(function (...a) {
          const now = Date.now();
          if (now - last < 200) return;      // 200ms 内合并
          last = now;
          return cb(...a);
        });
      };
      window.MutationObserver.prototype = MO.prototype;
      log('MutationObserver throttled to 200ms');
    }
  }
})();
