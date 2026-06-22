<script setup lang="ts">
import { fn发送请求 } from "../工具/请求.ts";
import { ref_所有导航数据, cmp_分类列表 } from "../全局响应式数据.ts";
import Vue_分类 from "./导航层级/分类.vue";

(async () => {
  const 获取所有导航数据 = await fn发送请求("GET", "/all_nav");
  if (!获取所有导航数据.状态) return;
  ref_所有导航数据.value = 获取所有导航数据.内容;
})();

// 捕获子组件的错误
onErrorCaptured((error, instance, info) => {
  console.error("页面视图/全部导航.vue 捕获到子组件错误:", error.message);
  console.log("错误发生在哪个组件:", instance);
  console.log("错误来源:", info);

  return false;
});
</script>

<template>
  <template v-for="分类 in cmp_分类列表">
    <Vue_分类 :分类="分类" />
  </template>
</template>
