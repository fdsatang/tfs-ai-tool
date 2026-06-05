import GM from "./gmTool/index";

// TFS 代码审查页面
GM.unsafeWindow.addEventListener("load", async () => {
  if (location.href.includes("tfs2018-web.winning.com.cn:8080")) {
    const App = (await import("./AIOperation/index.vue")).default;
    const { createApp } = await import("vue");
    const directive = (await import("./directives")).default;
    createApp(App)
      .use(directive)
      .mount(
        (() => {
          const el = document.createElement("div");
          document.body.append(el);
          return el;
        })()
      );
  }
});
