<template>
  <div class="tfs-tags-btn-box" :class="{ fullScreen: fullScreen }">
    <div class="tfs-tags-btn" @click.stop="aiMark('bug')">AI-BUG-FIX</div>
    <div class="tfs-tags-btn success" @click.stop="aiMark('coding')">AI-CODING</div>
    <div class="tfs-tags-btn blue" @click.stop="aiMark('check')">AI-PR-CHECK</div>
    <div class="tfs-tags-btn info" @click.stop="showPanel = !showPanel">{{ pat ? "更新TFS令牌" : "配置TFS令牌" }}</div>
  </div>
  <div class="tfs-pat-input-wrap" :class="{ fullScreen: fullScreen }" v-if="showPanel" @click.stop>
    <span class="tfs-pat-label">TFS令牌</span>
    <Input v-model="tfsToken" placeholder="获取方式：点击右上角头像->安全性->个人访问令牌" :showClear="true"></Input>
    <ButtonBox type="primary" @click="handleConfirm">确定</ButtonBox>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import Input from "../../components/Input.vue";
import ButtonBox from "../../components/Button.vue";
import $ from "../../gmTool/";
import useMessage from "../../hooks/useMessage";
import useAIMark from "../../hooks/useAIMark";

const { DB } = $;
const { mark } = useAIMark();
const { error } = useMessage();

const urlParams = new URLSearchParams(window.location.search);
const fullScreen = ref(urlParams.get("fullScreen") === "true");

const pat = ref(DB.tfsClientMeta.get()?.pat || "");
const tfsToken = ref(pat.value);

const showPanel = ref(false);

const handleConfirm = () => {
  pat.value = tfsToken.value;
  DB.tfsClientMeta.set({ pat: tfsToken.value });
  showPanel.value = false;
  window.location.reload();
};

const aiMark = (type: string) => {
  if (!pat.value) {
    error("请先配置TFS令牌", 3000);
    showPanel.value = true;
    return;
  }
  mark(type);
};

const closePanel = (e: MouseEvent) => {
  showPanel.value = false;
  if (!tfsToken.value) {
    tfsToken.value = pat.value;
  }
};

watch(showPanel, (val) => {
  if (val) {
    window.addEventListener("click", closePanel);
  } else {
    window.removeEventListener("click", closePanel);
  }
});
</script>

<style scoped lang="less">
.tfs-tags-btn-box {
  display: flex;
  align-items: center;
  position: fixed;
  z-index: 20;
  right: 0px;
  top: 45px;
  .tfs-tags-btn {
    margin-right: 16px;
    padding: 5px 8px;
    cursor: pointer;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    transition: all 0.1s ease-in-out;

    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    &.success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }
    &.blue {
      background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
    }
    &.info {
      background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    }

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(245, 87, 108, 0.5);
      &.success {
        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
      }
      &.blue {
        box-shadow: 0 6px 20px rgba(0, 123, 255, 0.5);
      }
      &.info {
        box-shadow: 0 6px 20px rgba(107, 114, 128, 0.5);
      }
    }
  }
  &.fullScreen {
    top: 7px;
    right: 185px;
  }
}

.tfs-pat-input-wrap {
  position: fixed;
  top: 80px;
  right: 16px;
  z-index: 21;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: #fff;
  border-radius: 8px;
  width: 500px;
  border: 1px solid #ccc;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.15),
    0 2px 8px rgba(0, 0, 0, 0.1);
  .tfs-pat-label {
    font-size: 12px;
    color: #333;
    white-space: nowrap;
  }
  &.fullScreen {
    top: 40px;
    right: 199px;
  }
}
</style>
