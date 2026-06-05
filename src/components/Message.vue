<template>
  <div class="message-wrap-modal">
    <div class="message-wrap" :style="{ background: props.type == 'error' ? '#f55047' : '#00D6B9' }">
      <span class="icon">
        <svg t="1669278323056" class="icon" viewBox="0 0 1030 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13893" width="200" height="200">
          <path
            d="M996.7104 441.97888 609.4336 38.8096C585.36448 13.77792 553.20064 0 518.72256 0S452.08064 13.77792 428.01664 38.8096L40.73984 441.97888c-39.9616 41.61536-34.816 77.58336-28.2112 92.61056 4.70528 10.65984 20.60288 39.9616 66.39616 39.9616l56.76544 0 0 310.15936c0 70.41536 50.56 136.71936 122.41408 136.71936l65.14688 0L422.9632 1021.42976l0-72.87808 0-255.36c0-35.19488-5.32992-54.79936 30.61248-54.79936l65.14688 0 65.14688 0c35.93728 0 30.61248 19.60448 30.61248 54.79936l0 255.36 0 72.87808 99.71712 0 65.152 0c71.84896 0 122.40384-66.304 122.40384-136.71936l0-310.15936 56.77056 0c45.77792 0 61.68576-29.30176 66.39616-39.9616C1031.53664 519.56736 1036.672 483.59424 996.7104 441.97888z"
            p-id="13894"
            fill="#fff"
          ></path>
        </svg>
      </span>
      <span class="title">
        {{ props.tip }}
      </span>
      <span class="icon" @click="$emit('close')">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.12234 7.19562L12.6119 2.70605L13.5098 3.60397L9.02026 8.09353L13.5098 12.5831L12.6119 13.481L8.12234 8.99145L3.63278 13.481L2.73486 12.5831L7.22443 8.09353L2.73486 3.60397L3.63278 2.70605L8.12234 7.19562Z"
            fill="white"
          />
        </svg>
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps(["tip", "type"]);
</script>
<style lang="less" scoped>
@keyframes drop {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
.message-wrap-modal {
  position: fixed;
  width: 380px;
  z-index: 9999999;
  left: calc(50% - 140px);
  top: 50px;
  display: flex;
  justify-content: center;
  .message-wrap {
    max-width: 380px;
    display: flex;
    padding: 0 8px 0 16px;
    height: 35px;
    align-items: center;
    border-radius: 4px;
    box-shadow: 0px 2px 10px 0px rgba(31, 36, 41, 0.2);
    justify-content: space-between;
    animation: drop linear 0.2s forwards;
    .icon {
      display: flex;
      width: 16px;
      height: 16px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .title {
      flex: 1;
      margin: 0 8px;
      color: #fff;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
    }
  }
}
</style>
