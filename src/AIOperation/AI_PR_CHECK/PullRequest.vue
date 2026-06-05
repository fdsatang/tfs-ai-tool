<template>
  <div class="ai-pr-check-btn" :class="{ 'first-show': isFirstShow }" @click="handleClick">
    {{ text }}
    <span v-if="isFirstShow" class="guide-tip">脚本功能</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps<{
  text?: string;
  onCheck?: () => void;
}>();

const isFirstShow = ref(true);

const handleClick = () => {
  if (isFirstShow.value) {
    localStorage.setItem("ai-pr-check-guide", "true");
    isFirstShow.value = false;
  }

  if (props.onCheck) {
    props.onCheck();
  }
};

onMounted(() => {
  const hasSeen = localStorage.getItem("ai-pr-check-guide");
  if (hasSeen) {
    isFirstShow.value = false;
  }
});
</script>

<style scoped lang="less">
.ai-pr-check-btn {
  margin-right: 16px;
  padding: 8px 12px;
  cursor: pointer;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
  position: relative;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(245, 87, 108, 0.5);
  }

  &:active {
    transform: translateY(0);
  }

  &.first-show {
    animation: guide-pulse 0.6s ease-in-out 3;

    .guide-tip {
      position: absolute;
      top: -20px;
      right: -10px;
      background: #ff6b6b;
      color: #fff;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 8px;
      white-space: nowrap;
      animation: tip-bounce 0.6s ease-in-out 3;
    }
  }
}

@keyframes guide-pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
  }
  50% {
    transform: scale(1.1);
    box-shadow:
      0 0 25px rgba(245, 87, 108, 0.8),
      0 0 50px rgba(245, 87, 108, 0.4);
  }
}

@keyframes tip-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}
</style>
