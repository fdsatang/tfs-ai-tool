<template>
  <AI_PR_CHECK v-if="showAI_PR_CHECK" />
  <TFS_TAG v-if="showTags" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed, ref, onMounted, onUnmounted } from "vue";

// 用响应式 ref 跟踪当前 URL，解决 SPA 路由切换时 computed 不更新的问题
const currentUrl = ref(location.href);

const updateUrl = () => {
  currentUrl.value = location.href;
};

// 监听路由变化
onMounted(() => {
  window.addEventListener("popstate", updateUrl);
  // 劫持 pushState/replaceState 由 main.ts 触发，这里也监听 hashchange 兜底
  window.addEventListener("hashchange", updateUrl);
});

onUnmounted(() => {
  window.removeEventListener("popstate", updateUrl);
  window.removeEventListener("hashchange", updateUrl);
});

const showAI_PR_CHECK = computed(() => currentUrl.value.includes("pullrequest"));

const showTags = computed(() => currentUrl.value.includes("queries") || currentUrl.value.includes("_workitems"));

const AI_PR_CHECK = defineAsyncComponent(() => import("./AI_PR_CHECK/index.vue"));
const TFS_TAG = defineAsyncComponent(() => import("./TFS_TAG/index.vue"));
</script>
