import $ from "../gmTool/index";

export const isLocalhost = () => {
  return location.hostname === "localhost" || location.hostname === "0.0.0.0";
};

// 防抖
export const debounce = (fn: Function, delay: number) => {
  let timer: any = null;
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

// 解析JSON字符串
export const parseJson = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return null;
  }
};

export function parseUrlInfo(url: string) {
  try {
    const u = new URL(url);
    const port = u.port || (u.protocol === "https:" ? "443" : "80");
    const [, appName] = u.pathname.split("/");
    return {
      protocol: u.protocol,
      hostname: u.hostname,
      port,
      appName,
      origin: u.origin
    };
  } catch {
    return null;
  }
}

export const log = (title: string, text: string) => {
  const color = "#ff4d4f";
  ($.unsafeWindow as any).originalLog(
    `%c ${title} %c ${text} %c`,
    `background:${color};border:1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
    `border:1px solid ${color}; padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`,
    "background:transparent"
  );
};

/**
 * 从目标HTML页面提取所有JS和CSS资源URL
 * @param {string} htmlUrl - 目标HTML的请求地址
 * @returns {Promise<{js: string[], css: string[]}>} 包含JS/CSS数组的对象
 */
type ExtractAssetsResult = { js: string[]; css: string[] };

export const extractAssetsFromHtml = async (htmlUrl: string): Promise<ExtractAssetsResult> => {
  try {
    // 1. 发起fetch请求获取HTML内容（处理跨域：需确保服务端允许跨域，或用油猴/代理）
    const response = await fetch(htmlUrl);
    if (!response.ok) {
      throw new Error(`请求失败：状态码 ${response.status}`);
    }
    const htmlText = await response.text();

    // 2. 将HTML文本转为DOM文档（模拟浏览器解析）
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    // 核心工具函数：补全相对路径为绝对路径
    const completeUrl = (url) => {
      if (!url || !url.trim()) return ""; // 空值直接返回
      // 判断是否为绝对路径（包含http/https）
      if (url.startsWith("http://") || url.startsWith("https://")) {
        return url.trim();
      }
      // 相对路径：拼接location.origin（当前页面的域名+端口）
      // 若需要拼接目标HTML的origin，可解析htmlUrl获取（下方有扩展说明）
      return `${location.origin}${url.trim().startsWith("/") ? "" : "/"}${url.trim()}`;
    };

    // 3. 提取所有CSS资源（link[rel="stylesheet"][href]的href，补全路径）
    const cssLinks = doc.querySelectorAll('link[rel="stylesheet"][href]');
    const cssArray = Array.from(cssLinks)
      .map((link) => completeUrl(link.getAttribute("href"))) // 补全路径
      .filter((href, index, self) => self.indexOf(href) === index);

    // 4. 提取所有JS资源（script[src]的src，补全路径）
    const scriptTags = doc.querySelectorAll("script[src]");
    const jsArray = Array.from(scriptTags)
      .map((script) => completeUrl(script.getAttribute("src"))) // 补全路径
      .filter((src, index, self) => self.indexOf(src) === index); // 可选：去重

    // 5. 返回结果（均为绝对路径）
    return {
      js: jsArray,
      css: cssArray
    };
  } catch (error) {
    console.error("提取资源失败：", error);
    return { js: [], css: [] }; // 异常时返回空数组
  }
};

/**
 * 批量加载JS和CSS资源
 * @param {string[]} jsUrls - 需要加载的JS资源URL数组
 * @param {string[]} cssUrls - 需要加载的CSS资源URL数组
 * @description 保留原逻辑：兼容老IE、JS插入body、CSS插入head，支持加载完成回调（可选）
 */
export const loadAssets = (jsUrls: string[], cssUrls: string[]) => {
  // 加载单个JS文件
  const loadSingleJs = (jsUrl: string) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = jsUrl;
    document.body.appendChild(script);
  };
  // 加载单个CSS文件
  const loadSingleCss = (cssUrl: string) => {
    const link = document.createElement("link");
    link.href = cssUrl;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  };
  // 批量加载所有JS
  if (Array.isArray(jsUrls)) {
    jsUrls.forEach((jsUrl) => {
      loadSingleJs(jsUrl);
    });
  }
  // 批量加载所有CSS
  if (Array.isArray(cssUrls)) {
    cssUrls.forEach((cssUrl) => {
      loadSingleCss(cssUrl);
    });
  }
};

export function fixSockJsUrl(originalUrl: string, appOrigin: string) {
  // 判断是否是热更新的 sockjs-node/info 请求
  if (originalUrl && originalUrl.includes("sockjs-node")) {
    const pathIndex = originalUrl.indexOf("/sockjs-node");
    if (pathIndex !== -1) {
      const pathAndQuery = originalUrl.substring(pathIndex);
      const cleanOrigin = appOrigin.replace(/\/$/, ""); // 去掉结尾的 /
      const url = `${cleanOrigin}${pathAndQuery}`;
      return url.replace("https", "http");
    }
  }
  return originalUrl;
}

export function fixHotUpdate(originalUrl: string, appName: string, appOrigin: string) {
  // 判断是否是热更新的 sockjs-node/info 请求
  if (appName && originalUrl.includes(appName)) {
    const pathIndex = originalUrl.indexOf(`/${appName}`);
    if (pathIndex !== -1) {
      const pathAndQuery = originalUrl.substring(pathIndex);
      const cleanOrigin = appOrigin.replace(/\/$/, ""); // 去掉结尾的 /
      const url = `${cleanOrigin}${pathAndQuery}`;
      return url.replace("https", "http");
    }
  }
  return originalUrl;
}
