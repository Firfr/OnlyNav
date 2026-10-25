<script setup lang="ts">
import type { t_分类, t_子分类, t_导航, t_文件夹 } from "@公共代码/类型";
import {
  cmp_数据格式化,
  rea_上下文菜单_文件夹,
  rea_弹窗_文件夹,
  rea_登录信息,
  长按毫秒数,
} from "../../全局共享数据";
import Vue_图标 from "../其他/图标.vue";
import { onBeforeUnmount } from "vue";

interface t_参数 {
  分类: t_分类;
  子分类: t_子分类;
  文件夹: t_文件夹;
}
const 参数 = defineProps<t_参数>();

const fn打开文件夹 = () => {
  rea_弹窗_文件夹.分类 = 参数.分类;
  rea_弹窗_文件夹.子分类 = 参数.子分类;
  rea_弹窗_文件夹.文件夹 = 参数.文件夹;
  rea_弹窗_文件夹.导航列表 = cmp_数据格式化.value.Map_层级数据.get(参数.文件夹.ID)! as t_导航[];
  rea_弹窗_文件夹.显示 = true;
};

const fn打开菜单 = (X: number, Y: number) => {
  rea_上下文菜单_文件夹.X = X;
  rea_上下文菜单_文件夹.Y = Y;

  rea_上下文菜单_文件夹.分类 = 参数.分类;
  rea_上下文菜单_文件夹.子分类 = 参数.子分类;
  rea_上下文菜单_文件夹.文件夹 = 参数.文件夹;

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
  <button
    class="导航_文件夹-共同 文件夹 清除按钮默认样式"
    @click="fn打开文件夹()"
    @contextmenu.prevent="fn点击右键"
    @touchstart="fn触摸开始"
    @touchend="fn触摸结束"
    @touchmove="fn触摸结束"
    @touchcancel="fn触摸结束"
  >
    <Vue_图标 v-if="rea_登录信息.状态 && 文件夹.图标类型 !== '无'" class="图标" :数据="文件夹" />

    <div class="文字信息">
      <div class="名称" :class="{ 无描述: !文件夹.描述 }">
        <n-ellipsis style="max-width: 100%">
          {{ 文件夹.名称 }}
        </n-ellipsis>
      </div>
      <div class="描述" v-if="文件夹.描述">
        <n-ellipsis style="max-width: 100%">
          {{ 文件夹.描述 }}
        </n-ellipsis>
      </div>
    </div>

    <div v-if="文件夹.公开" class="公开"></div>
  </button>
</template>
