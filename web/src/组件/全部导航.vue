<script setup lang="ts">
import { onErrorCaptured } from "vue";
import { cmp_数据格式化 } from "../全局共享数据.ts";
import Vue_分类 from "./层级/分类.vue";

// 捕获子组件的错误
onErrorCaptured((error, instance, info) => {
  const 发生错误的组件名称 =
    instance?.$options?.name || instance?.$options?.__name || "根组件.vue 中的子组件";
  console.log("发生错误的组件名称:", 发生错误的组件名称, "错误来源:", info);
  console.error("捕获到子组件错误:", error.message);

  return false;
});
</script>

<template>
  <Vue_分类 v-for="分类 in cmp_数据格式化.分类列表" :分类="分类" :key="`分类-${分类.ID}`" />
</template>
