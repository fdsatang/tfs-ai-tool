<template>
  <div class="gm-input-wrap" :class="{ small: small }">
    <input
      type="text"
      class="gm_input"
      v-model="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="{ disabled: disabled, 'has-clear': props.showClear && value && !small }"
    />
    <span @click="value = ''" v-if="props.showClear && value && !small">
      <svg t="1770183451518" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2445" width="14" height="14">
        <path
          d="M512 883.2A371.2 371.2 0 1 0 140.8 512 371.2 371.2 0 0 0 512 883.2z m0 64a435.2 435.2 0 1 1 435.2-435.2 435.2 435.2 0 0 1-435.2 435.2z"
          fill="#8a8a8a"
          p-id="2446"
        ></path>
        <path
          d="M557.056 512l122.368 122.368a31.744 31.744 0 1 1-45.056 45.056L512 557.056l-122.368 122.368a31.744 31.744 0 1 1-45.056-45.056L466.944 512 344.576 389.632a31.744 31.744 0 1 1 45.056-45.056L512 466.944l122.368-122.368a31.744 31.744 0 1 1 45.056 45.056z"
          fill="#8a8a8a"
          p-id="2447"
        ></path>
      </svg>
    </span>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
const props = defineProps(["modelValue", "showClear", "placeholder", "disabled", "small"]);
const emit = defineEmits(["update:modelValue"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  }
});
</script>
<style lang="less" scoped>
.gm-input-wrap {
  position: relative;
  flex: 1;
  min-width: 40px;
  .gm_input {
    height: 23px;
    border: 1px solid #ccc;
    padding: 3px 5px; /* 初始无右侧内边距 */
    width: 100%;
    font-size: 12px;
    color: #8d9399;
    background: #fff;
    border-radius: 3px;
    box-sizing: border-box;
    -webkit-transition:
      border-color ease-in-out 0.15s,
      -webkit-box-shadow ease-in-out 0.15s;
    -o-transition:
      border-color ease-in-out 0.15s,
      box-shadow ease-in-out 0.15s;
    transition:
      border-color ease-in-out 0.15s,
      box-shadow ease-in-out 0.15s;

    /* 只有显示清空按钮时，才加右侧内边距 */
    &.has-clear {
      padding-right: 25px;
    }
  }

  .gm_input:focus {
    border-color: #66afe9;
    outline: unset;
    -webkit-box-shadow:
      inset 0 1px 1px rgba(0, 0, 0, 0.075),
      0 0 8px rgba(102, 175, 233, 0.6);
    box-shadow:
      inset 0 1px 1px rgba(0, 0, 0, 0.075),
      0 0 8px rgba(102, 175, 233, 0.6);
  }

  .disabled {
    cursor: not-allowed;
    background: gainsboro;
  }

  span {
    position: absolute;
    top: 0;
    right: 0;
    width: 23px;
    height: 23px;
    padding: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  &.small {
    .gm_input {
      height: 20px;
      font-size: 11px;
      padding: 0 4px;
      border-radius: 2px;

      /* 小尺寸下，有清空按钮才加右侧边距 */
      &.has-clear {
        padding-right: 20px;
      }
    }

    span {
      width: 20px;
      height: 20px;

      svg {
        width: 12px;
        height: 12px;
      }
    }
  }
}
</style>
