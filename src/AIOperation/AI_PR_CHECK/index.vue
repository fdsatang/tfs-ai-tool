<template>
  <div class="pr-check-log" v-drag v-show="showLog">
    <div class="log-content">
      <div class="log-title v-drag-handle">
        <span>{{ `AI-PR-CHECK 日志面板` }}{{ loading ? " -检查 进行中..." : "" }}</span>
        <Button type="danger" @click="showLog = false">关闭</Button>
      </div>
      <div class="log-list">
        <div v-for="(log, index) in logs" :key="index" :class="['log-item', log.type]">
          <div v-html="log.text" v-if="log.isHtml"></div>
          <div v-else>{{ log.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from "vue";
import { createInstanceWrap } from "../../utils/vueRender";
import PullRequest from "./PullRequest.vue";
import { GM_xmlhttpRequest } from "$";
import useMessage from "../../hooks/useMessage";
import Button from "../../components/Button.vue";

type LogType = "info" | "warn" | "error" | "success";

interface LogItem {
  text: string;
  type: LogType;
  isHtml?: boolean;
}
const { success, warning, error } = useMessage();

const showLog = ref(false);
const logs = ref<LogItem[]>([]);
const prOk = ref(false);
const loading = ref(false);
const text = ref("AI-PR-CHECK");

const addLog = (text: string, type: LogType = "info", isHtml = false) => {
  logs.value.push({
    text: `[${new Date().toLocaleTimeString()}] ${text}`,
    type,
    isHtml
  });
};

// 增加重试次数变量
let retryCount = 0;
const MAX_RETRY = 2; // 最多自动重试2次

const aiPrCheck = () => {
  if (prOk.value) return warning(`PR检查已经成功,请刷新页面查看pr评论状态`);
  if (loading.value) return warning(`PR检查中,请稍后`);
  loading.value = true;
  // 清空日志
  logs.value = [];
  showLog.value = true;
  const currentUrl = window.location.href;
  const apiUrl = `http://172.17.0.118:8001/api/check?pr_url=${encodeURIComponent(currentUrl)}`;
  addLog(`开始检查 PR...`, "success");
  addLog(`请求已经发送,请耐心等待...`);
  const timer = setInterval(() => {
    addLog(`执行中...，请不要刷新页面`);
  }, 3000);
  GM_xmlhttpRequest({
    method: "GET",
    url: apiUrl,
    timeout: 20000,
    onload: function (response) {
      // 处理响应
      if (response.status >= 200 && response.status < 300) {
        addLog(`请求成功！<br>响应状态: ${response.status}`, "success");
        addLog(`响应内容`, "success");
        addLog(`${response.responseText}`, "success", true);
        success(`PR检查成功,请刷新页面查看pr状态`);
        text.value = "PR-CHECK-SUCCESS";
        prOk.value = true;
        // 成功后重置重试次数
        retryCount = 0;
      } else {
        addLog(`检查请求失败！<br>状态码: ${response.status}<br>错误信息: ${response.responseText}`, "error", true);
        // 检测是否因缺少关联工作项而失败
        if (response.responseText && response.responseText.includes("没有关联工作项")) {
          failedDueToNoWorkItem = true;
          addLog(`请在 PR 中关联工作项后，将自动重新检查`, "warn");
        }
      }
      clearInterval(timer);
      loading.value = false;
    },
    onerror: function (error) {
      const errorStr = typeof error === "object" ? JSON.stringify(error) : error;
      addLog(`请求发生错误，日志如下 \n ${errorStr}`, "error");
      addLog(`请检查页面是否正确，重新尝试`, "warn");
      loading.value = false;
      clearInterval(timer);
    },
    ontimeout: function () {
      addLog(`请求超时，请重试！(开发者备注:日常超时,重试大概率能好)`, "warn");
      // 超时重试逻辑：最多重试2次
      retryCount++;
      if (retryCount < MAX_RETRY) {
        addLog(`第 ${retryCount} 次自动重试中...`, "warn");
        loading.value = false;
        clearInterval(timer);
        // 自动重试
        aiPrCheck();
      } else {
        // 达到最大重试次数
        addLog(`已达到最大重试次数(${MAX_RETRY}次)，自动停止，请手动重试！`, "error");
        error(`请求超时，请手动点击检查！`);
        loading.value = false;
        clearInterval(timer);
        // 重置次数
        retryCount = 0;
      }
    }
  });
};

let checkDomTimer: number | null = null;
let workItemObserver: MutationObserver | null = null;
// 是否因缺少关联工作项而失败
let failedDueToNoWorkItem = false;
// 选择器常量
const TARGET_SELECTOR = ".vc-pullrequest-review-title-component .description-row .right-group .vc-pullrequest-action-bar";
// TFS PR 页面工作项区域选择器
const WORK_ITEM_SELECTOR = ".vc-pullrequest-work-items";

onMounted(() => {
  let attemptCount = 0;
  const MAX_ATTEMPTS = 10; // SPA 路由切换后 DOM 可能需要更长时间渲染，增加重试次数

  const tryMountComponent = () => {
    attemptCount++;
    const rightGroupDom = document.querySelector<HTMLElement>(TARGET_SELECTOR);

    // 找到 DOM 就挂载（但先检查按钮是否已存在，防止重复）
    if (rightGroupDom && !rightGroupDom.querySelector(".ai-pr-check-btn")) {
      createInstanceWrap(
        rightGroupDom,
        PullRequest,
        {
          text: text.value,
          onCheck: aiPrCheck
        },
        true
      );
      // 挂载成功后，监听工作项区域变化
      watchWorkItemChanges();
      return;
    }

    // 没找到 && 没超过次数 → 继续重试
    if (attemptCount < MAX_ATTEMPTS) {
      checkDomTimer = window.setTimeout(tryMountComponent, 500);
    } else {
      console.warn("[PR] 多次尝试均未找到DOM，停止加载");
    }
  };

  // 第一次立即执行
  tryMountComponent();
});

// 监听工作项区域 DOM 变化，当用户关联工作项后自动重新检查
const watchWorkItemChanges = () => {
  const workItemArea = document.querySelector(WORK_ITEM_SELECTOR);
  if (!workItemArea) return;

  workItemObserver = new MutationObserver((mutations) => {
    // 只在因缺少工作项失败后才自动重试
    if (!failedDueToNoWorkItem) return;

    // 检测到工作项区域有新增节点（用户关联了工作项）
    const hasAddedNodes = mutations.some(
      (m) => m.addedNodes.length > 0
    );
    if (hasAddedNodes) {
      addLog(`检测到工作项变更，自动重新检查...`, "success");
      failedDueToNoWorkItem = false;
      // 延迟1秒，等 TFS 保存完成
      setTimeout(() => aiPrCheck(), 1000);
    }
  });

  workItemObserver.observe(workItemArea, { childList: true, subtree: true });
};

// 销毁时清除定时器和观察器，避免内存泄漏
onUnmounted(() => {
  if (checkDomTimer) {
    clearTimeout(checkDomTimer);
    checkDomTimer = null;
  }
  if (workItemObserver) {
    workItemObserver.disconnect();
    workItemObserver = null;
  }
});
</script>

<style scoped lang="less">
&::-webkit-scrollbar {
  width: 8px;
}

&::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

&::-webkit-scrollbar-thumb {
  background: rgba(255, 68, 68, 0.5);
  border-radius: 4px;
}
#monkey-ai-check-btn {
  position: fixed;
  top: 127px;
  right: 357px;
  z-index: 999999;
}
.pr-check-log {
  position: fixed;
  top: 180px;
  right: 16px;
  width: 800px;
  background: rgba(0, 0, 0, 0.75);
  border-radius: 8px;
  padding: 12px;
  font-family: monospace;
  font-size: 12px;
  color: #ff4444;
  z-index: 9999999;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);

  .log-content {
    .log-title {
      display: flex;
      justify-content: space-between;
      cursor: move;
      font-size: 17px;
      font-weight: 800;
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(255, 68, 68, 0.3);
      span:nth-child(2) {
        cursor: pointer;
        color: #4caf50;
        font-size: 16px;
      }
    }
    .log-list {
      max-height: 620px;
      padding-right: 10px;
      overflow-x: hidden;
      overflow-y: auto;
      .log-item {
        margin-bottom: 6px;
        span {
          display: block;
        }
        &.info {
          color: gainsboro;
          font-size: 14px !important;
        }
        &.warn {
          color: #ffb84d;
          font-size: 14px !important;
        }
        &.error {
          color: #ff4444;
          font-size: 14px !important;
        }
        &.success {
          color: #4caf50;
          font-size: 14px !important;
        }
      }
    }
  }
}
</style>
