import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import monkey, { cdn } from "vite-plugin-monkey";
import path from "path";
import fs from "fs";

const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "package.json"), "utf-8"));

function generateMetaFile() {
  return {
    name: "generate-meta-file",
    closeBundle() {
      const userJsPath = path.resolve(__dirname, "dist/tfs-ai-tool.user.js");
      const metaJsPath = path.resolve(__dirname, "dist/tfs-ai-tool.meta.js");

      if (fs.existsSync(userJsPath)) {
        const content = fs.readFileSync(userJsPath, "utf-8");
        const metaMatch = content.match(/\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/);

        if (metaMatch) {
          let metaContent = metaMatch[0];
          metaContent = metaContent.replace(/^\/\/ @require\s+.+$/m, "// @require      https://unpkg.com/vue@3.5.31/dist/vue.global.prod.js");
          fs.writeFileSync(metaJsPath, metaContent + "\n");
          console.log("✅ Generated meta.js successfully");
        }
      }
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    },
    server: {
      cors: true,
      host: "localhost",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Private-Network": "true"
      }
    },
    plugins: [
      vue(),
      monkey({
        entry: "src/main.ts",
        userscript: {
          name: "tfs-ai-tool",
          icon: "https://vitejs.dev/logo.svg",
          namespace: "tfs-ai-tool",
          match: ["https://*/*", "http://*/*"],
          author: "石小石orz",
          version: packageJson.version,
          description: "TFS AI代码审查与工作项标签管理工具",
          noframes: true,
          license: "MIT",
          downloadURL: "https://github.com/fdsatang/tfs-ai-tool/raw/master/dist/tfs-ai-tool.user.js",
          updateURL: "https://github.com/fdsatang/tfs-ai-tool/raw/master/dist/tfs-ai-tool.meta.js",
          connect: ["172.17.0.118", "gitee.com", "raw.giteeusercontent.com"],
          grant: ["unsafeWindow", "GM_setValue", "GM_getValue", "GM_xmlhttpRequest"],
          "run-at": "document-start"
        },
        build: {
          externalGlobals: {
            vue: cdn.unpkg("Vue", "dist/vue.global.prod.js")
          }
        }
      }),
      generateMetaFile()
    ]
  };
});
