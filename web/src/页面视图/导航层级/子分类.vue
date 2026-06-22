<script setup lang="ts">
import {
  fn默认值_层级,
  type t_分类,
  type t_子分类,
  type t_导航,
  type t_文件夹,
} from "@公共代码/类型";
import { cmp_导航层级Map } from "../../全局响应式数据";
import Vue_子分类内容 from "./子分类内容.vue";

const { 分类, 子分类 } = defineProps<{ 分类: t_分类; 子分类: t_子分类 }>();

const cmp_子分类内容列表 = computed<(t_文件夹 | t_导航)[]>(
  () => (cmp_导航层级Map.value.get(子分类.ID) as (t_文件夹 | t_导航)[]) ?? [],
);
</script>

<template>
  <div class="子分类">
    <template v-if="cmp_子分类内容列表.length > 0" v-for="导航或文件夹 in cmp_子分类内容列表">
      <Vue_子分类内容
        父级名称="子分类"
        :分类="分类"
        :子分类="子分类"
        :文件夹="fn默认值_层级('文件夹')"
        :展示内容="导航或文件夹"
      />
    </template>
    <div v-else style="text-align: center">子分类无内容</div>
  </div>
</template>

<style scoped>
/* class="子分类" 样式在文件 css/子分类.css 并在 style.css 中导入 */
</style>
