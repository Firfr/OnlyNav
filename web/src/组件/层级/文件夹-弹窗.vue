<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import {
  rea_弹窗_文件夹,
  rea_登录信息,
  cmp_数据格式化,
  rea_弹窗_操作,
  rea_上下文菜单_文件夹,
  长按毫秒数,
} from "../../全局共享数据";
import Vue_导航 from "./导航.vue";
import type { t_导航, t_文件夹 } from "@公共代码/类型.ts";
import Vue_图标 from "../其他/图标.vue";
import { 默认值_文件夹 } from "../../工具/默认值.ts";

const ref_显示本组件 = ref(true);
const fn关闭组件 = () => {
  rea_弹窗_文件夹.显示 = false;
};

const cmp_文件夹 = computed(() => {
  let 返回值: t_文件夹 = { ...默认值_文件夹 };
  const 文件夹 = cmp_数据格式化.value.Map_全部数据.get(rea_弹窗_文件夹.文件夹.ID);
  if (文件夹) {
    返回值 = 文件夹 as t_文件夹;
  }
  return 返回值;
});

const cmp_文件夹导航列表 = computed<t_导航[]>(() => {
  return (cmp_数据格式化.value.Map_层级数据.get(rea_弹窗_文件夹.文件夹.ID) as t_导航[]) ?? [];
});

const fn添加导航 = () => {
  rea_弹窗_操作.操作 = "添加";
  rea_弹窗_操作.类型 = "导航";
  rea_弹窗_操作.父级类型 = "文件夹";
  rea_弹窗_操作.层级 = [rea_弹窗_文件夹.分类, rea_弹窗_文件夹.子分类, rea_弹窗_文件夹.文件夹];
  rea_弹窗_操作.显示 = true;
};

const fn打开菜单 = (X: number, Y: number) => {
  rea_上下文菜单_文件夹.X = X;
  rea_上下文菜单_文件夹.Y = Y;

  rea_上下文菜单_文件夹.分类 = rea_弹窗_文件夹.分类;
  rea_上下文菜单_文件夹.子分类 = rea_弹窗_文件夹.子分类;
  rea_上下文菜单_文件夹.文件夹 = rea_弹窗_文件夹.文件夹;

  rea_上下文菜单_文件夹.显示菜单 = true;
};

const fn点击右键 = (事件: MouseEvent) => {
  fn打开菜单(事件.clientX, 事件.clientY);
};

let 长按计时器: number | null = null;
const fn触摸开始 = (事件: TouchEvent) => {
  const 触点 = 事件.touches[0];
  长按计时器 = window.setTimeout(() => {
    fn打开菜单(触点.clientX, 触点.clientY);
    navigator.vibrate?.(30);
  }, 长按毫秒数);
};

const fn触摸结束 = () => {
  if (长按计时器 !== null) {
    clearTimeout(长按计时器);
    长按计时器 = null;
  }
};

onBeforeUnmount(() => {
  if (长按计时器 !== null) clearTimeout(长按计时器);
});
</script>

<template>
  <el-dialog
    append-to-body
    v-model="ref_显示本组件"
    align-center
    @closed="fn关闭组件"
    title="文件夹"
    class="文件夹-弹窗"
  >
    <template #header="{ titleId, titleClass }">
      <div :id="titleId" :class="titleClass" class="顶部信息">
        <div :class="{ 文件夹公开: rea_弹窗_文件夹.文件夹.公开 }"></div>
        <div v-if="rea_登录信息.状态" class="添加导航" @click="fn添加导航">
          <ElIconCirclePlusFilled style="width: 40px; height: 40px" />
        </div>

        <div class="文字">
          <div
            class="标题 选择"
            @contextmenu.prevent="fn点击右键"
            @touchstart="fn触摸开始"
            @touchend="fn触摸结束"
            @touchmove="fn触摸结束"
            @touchcancel="fn触摸结束"
          >
            {{ cmp_文件夹.名称 }}
          </div>
          <div class="描述" v-if="cmp_文件夹.描述">
            {{ cmp_文件夹.描述 }}
          </div>
        </div>

        <Vue_图标
          v-if="rea_登录信息.状态 && cmp_文件夹.图标类型 !== '无'"
          class="图标"
          :数据="cmp_文件夹"
        />
      </div>
    </template>

    <div class="文件夹-导航">
      <Vue_导航
        v-for="导航 in cmp_文件夹导航列表"
        @click="ref_显示本组件 = false"
        父级类型="文件夹"
        :分类="rea_弹窗_文件夹.分类"
        :子分类="rea_弹窗_文件夹.子分类"
        :文件夹="rea_弹窗_文件夹.文件夹"
        :导航="导航"
        :key="`导航-${导航.ID}`"
      />
      <div v-if="cmp_文件夹导航列表.length === 0" style="text-align: center">无导航，待添加</div>
    </div>
  </el-dialog>
</template>
