<script setup lang="ts">
import { rea_登录信息, ref_当前选择设置, ref_显示设置, ref_首次打开设置 } from "../../全局共享数据";

const fn点击 = () => {
  if (rea_登录信息.状态) {
    if (ref_当前选择设置.value === "登录") {
      ref_当前选择设置.value = "账号";
    }
  } else {
    if (ref_当前选择设置.value !== "关于" && ref_当前选择设置.value !== "登录") {
      ref_当前选择设置.value = "登录";
    }
  }

  ref_首次打开设置.value = true;
  ref_显示设置.value = true;
};
</script>

<template>
  <Teleport to="body">
    <button id="id_按钮_设置_登录" class="清除按钮默认样式" @click="fn点击">
      <ElIconSetting v-if="rea_登录信息.状态" />
      <ElIconUser v-else />
    </button>
  </Teleport>
</template>

<style>
#id_按钮_设置_登录 {
  position: fixed;
  top: var(--悬浮按钮--边距);
  right: var(--悬浮按钮--边距);

  width: var(--悬浮按钮-宽度);
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border: 1px solid var(--背景-颜色);
  border-radius: var(--大圆角);
  padding: 2px;

  backdrop-filter: blur(6px);
  background-color: color-mix(in srgb, var(--背景-颜色) 60%, transparent);

  z-index: 10;
  transition:
    box-shadow 0.5s,
    border-color 0.5s,
    backdrop-filter 0.5s;
  &:hover {
    backdrop-filter: blur(30px);
    border-color: var(--文字-颜色);
    box-shadow: 0px 0px 30px -5px rgba(41, 41, 41, 0.45);
    background-color: color-mix(in srgb, var(--文字-颜色) 20%, transparent);
  }
}
</style>
