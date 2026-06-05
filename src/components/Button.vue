<template>
  <div class="btn-wrap" :class="props.type">
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  type: {
    type: String,
    default: "primary"
  }
});
</script>
<style lang="less" scoped>
.btn-wrap {
  display: inline-block;
  border-radius: 5px;
  font-size: 12px;
  padding: 0 5px;
  line-height: 18px;
  cursor: pointer;
  color: #0065b3;
  border: 1px solid #0065b3;
  &:hover {
    background-color: #e6f2ff;
  }
  &.primary {
    background-color: rgb(0, 101, 179);
    color: #fff;
  }
  &.danger {
    color: rgb(172, 47, 40);
    border: 1px solid rgb(172, 47, 40);
    // background-color: #e63c35;
    background-color: rgb(253, 227, 226);
  }
}
</style>
