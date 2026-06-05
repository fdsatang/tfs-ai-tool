<template>
  <AI_PR_CHECK v-if="showAI_PR_CHECK" />
  <TFS_TAG v-if="showTags" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed } from "vue";

const showAI_PR_CHECK = computed(() => location.href.includes("pullrequest"));

const showTags = computed(() => location.href.includes("queries") || location.href.includes("_workitems"));

const AI_PR_CHECK = defineAsyncComponent(() => import("./AI_PR_CHECK/index.vue"));
const TFS_TAG = defineAsyncComponent(() => import("./TFS_TAG/index.vue"));
</script>
