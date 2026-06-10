import GM from "./gmTool/index";

let appInstance: any = null;
let mountEl: HTMLElement | null = null;
let mountTimer: ReturnType<typeof setTimeout> | null = null;

async function mountApp() {
  // 先卸载之前的实例，清理 DOM
  if (appInstance) {
    appInstance.unmount();
    appInstance = null;
  }
  if (mountEl && mountEl.parentNode) {
    mountEl.parentNode.removeChild(mountEl);
    mountEl = null;
  }

  const App = (await import("./AIOperation/index.vue")).default;
  const { createApp } = await import("vue");
  const directive = (await import("./directives")).default;

  const el = document.createElement("div");
  document.body.append(el);
  mountEl = el;

  const app = createApp(App);
  app.use(directive);
  app.mount(el);
  appInstance = app;
}

// 监听 SPA 路由变化，重新挂载应用
let lastUrl = "";
let isMounting = false;

function onUrlChange() {
  const currentUrl = location.href;
  if (currentUrl === lastUrl) return;
  lastUrl = currentUrl;

  if (currentUrl.includes("tfs2018-web.winning.com.cn:8080")) {
    // 防止重复挂载：取消上一次未执行的定时器
    if (mountTimer) {
      clearTimeout(mountTimer);
      mountTimer = null;
    }
    // 防止并发挂载
    if (isMounting) return;
    isMounting = true;
    mountTimer = setTimeout(async () => {
      mountTimer = null;
      await mountApp();
      isMounting = false;
    }, 300);
  }
}

// 方式1：监听 popstate（浏览器前进/后退）
window.addEventListener("popstate", () => onUrlChange());

// 方式2：劫持 pushState / replaceState（SPA 内部路由跳转）
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function (...args) {
  originalPushState.apply(this, args);
  onUrlChange();
};

history.replaceState = function (...args) {
  originalReplaceState.apply(this, args);
  onUrlChange();
};

// 方式3：MutationObserver 兜底，检测 DOM 变化时检查 URL（加防抖）
let observer: MutationObserver | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

GM.unsafeWindow.addEventListener("load", () => {
  onUrlChange();

  observer = new MutationObserver(() => {
    // 防抖：DOM 变化频繁，300ms 内只触发一次
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      onUrlChange();
    }, 300);
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
