<script setup lang="ts">
import { ref_是否显示设置组件, ref_是否首次打开设置 } from "../全局响应式数据";

const fn点击设置 = () => {
  console.log("点击设置按钮");
  ref_是否首次打开设置.value = false;
  ref_是否显示设置组件.value = true;
};
</script>

<template>
  <Teleport to="body">
    <button id="id_设置按钮" class="清除按钮默认样式" @click="fn点击设置">
      <ElIconSetting />
    </button>
  </Teleport>
</template>

<style>
#id_设置按钮 {
  position: fixed;
  top: var(--悬浮按钮--边距);
  right: var(--悬浮按钮--边距);

  width: var(--悬浮按钮-宽度);
  aspect-ratio: 1 / 1;
  border: 1px solid var(--边框颜色);
  border-radius: var(--大圆角);
  padding: 2px;

  backdrop-filter: blur(2px);
  background-color: rgba(0, 0, 0, 0.3);

  z-index: 10;
  transition:
    box-shadow 0.5s,
    border-color 0.5s,
    backdrop-filter 0.5s;
  &:hover {
    backdrop-filter: blur(30px);
    border-color: var(--文字-颜色);
    box-shadow: 0px 0px 30px -5px rgba(41, 41, 41, 0.45);
  }
}
</style>
