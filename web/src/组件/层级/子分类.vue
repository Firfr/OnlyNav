<script setup lang="ts">
import type { t_分类, t_子分类, t_导航, t_文件夹 } from "@公共代码/类型";
import { cmp_数据格式化 } from "../../全局共享数据";
import { computed } from "vue";
import Vue_导航 from "./导航.vue";
import Vue_文件夹 from "./文件夹.vue";

const { 分类, 子分类 } = defineProps<{ 分类: t_分类; 子分类: t_子分类 }>();

const cmp_子分类内容列表 = computed<(t_文件夹 | t_导航)[]>(
  () => (cmp_数据格式化.value.Map_层级数据.get(子分类.ID) as (t_文件夹 | t_导航)[]) ?? [],
);
</script>

<template>
  <div class="子分类">
    <template v-if="cmp_子分类内容列表.length > 0" v-for="导航或文件夹 in cmp_子分类内容列表">
      <Vue_导航
        v-if="导航或文件夹.类型 === '导航'"
        父级类型="子分类"
        :分类="分类"
        :子分类="子分类"
        :导航="导航或文件夹"
        :key="`导航-${导航或文件夹.ID}`"
      />
      <Vue_文件夹
        v-else
        :分类="分类"
        :子分类="子分类"
        :文件夹="导航或文件夹"
        :key="`文件夹-${导航或文件夹.ID}`"
      />
    </template>
    <div v-else style="text-align: center">子分类无内容</div>
  </div>
</template>
