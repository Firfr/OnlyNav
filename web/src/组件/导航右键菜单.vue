<script setup lang="ts">
import {
  ref_是否登录,
  rea_导航右键菜单数据,
  rea层级与导航数据,
  ref_是否显示_层级或导航_操作,
} from "../全局响应式数据";
import { fn打开导航 } from "../工具/打开连接";

const ref_菜单实例 = ref(null);
const rea_菜单坐标 = reactive<{ X: number; Y: number }>({ X: 0, Y: 0 });
const ref_是否显示菜单 = ref(false);
const ref_是否视觉隐藏菜单 = ref(false);
const fn关闭菜单 = () => {
  ref_是否显示菜单.value = false;
  rea_导航右键菜单数据.是否显示菜单 = false;
};
watch(
  () => rea_导航右键菜单数据.是否显示菜单,
  async () => {
    if (!rea_导航右键菜单数据.是否显示菜单) return;
    rea_菜单坐标.X = rea_导航右键菜单数据.X;
    rea_菜单坐标.Y = rea_导航右键菜单数据.Y;
    ref_是否视觉隐藏菜单.value = true;
    ref_是否显示菜单.value = true;

    await nextTick();

    const 菜单元素 = ref_菜单实例.value as unknown as HTMLElement;

    if (rea_菜单坐标.X + 菜单元素.offsetWidth > innerWidth) {
      rea_菜单坐标.X = rea_菜单坐标.X - 菜单元素.offsetWidth;
    }
    if (rea_菜单坐标.Y + 菜单元素.offsetHeight > innerHeight) {
      rea_菜单坐标.Y = rea_菜单坐标.Y - 菜单元素.offsetHeight;
    }
    ref_是否视觉隐藏菜单.value = false;
  },
);

const fn打开内网地址 = () => {
  fn打开导航(rea_导航右键菜单数据.导航.内网地址 as string);
  fn关闭菜单();
};
const fn打开外网地址 = () => {
  fn打开导航(rea_导航右键菜单数据.导航.外网地址 as string);
  fn关闭菜单();
};
const fn编辑导航 = (操作方式: "查看" | "编辑") => {
  rea层级与导航数据.类型 = rea_导航右键菜单数据.导航类型;
  rea层级与导航数据.操作方式 = 操作方式;
  rea层级与导航数据.分类 = rea_导航右键菜单数据.分类;
  rea层级与导航数据.子分类 = rea_导航右键菜单数据.子分类;
  if (rea_导航右键菜单数据.导航类型 === "文件夹_导航") {
    rea层级与导航数据.文件夹 = rea_导航右键菜单数据.文件夹;
  }
  rea层级与导航数据.导航 = rea_导航右键菜单数据.导航;
  rea层级与导航数据.当前数据 = rea_导航右键菜单数据.导航;
  ref_是否显示_层级或导航_操作.value = true;
  fn关闭菜单();
};
const fn删除导航 = () => {
  fn关闭菜单();
};
</script>

<template>
  <Teleport to="body">
    <div
      id="id_导航右键菜单"
      v-show="ref_是否显示菜单"
      :class="{ 导航右键菜单_视觉隐藏: ref_是否视觉隐藏菜单 }"
      @click.self="fn关闭菜单"
      @contextmenu.prevent
    >
      <div
        ref="ref_菜单实例"
        id="id_导航右键菜单_内容"
        :style="{ left: rea_菜单坐标.X + 'px', top: rea_菜单坐标.Y + 'px' }"
      >
        <button
          v-if="rea_导航右键菜单数据.导航.内网地址"
          @click="fn打开内网地址"
          class="清除按钮默认样式"
        >
          打开内网
        </button>
        <button
          v-if="rea_导航右键菜单数据.导航.外网地址"
          @click="fn打开外网地址"
          class="清除按钮默认样式"
        >
          打开外网
        </button>

        <template v-if="ref_是否登录">
          <button class="清除按钮默认样式" @click="fn编辑导航('查看')">查看导航</button>
          <button class="清除按钮默认样式" @click="fn编辑导航('编辑')">编辑导航</button>
          <button class="清除按钮默认样式" @click="fn删除导航">删除导航</button>
        </template>
      </div>
      <!-- <pre>开发中<br />{{ JSON.stringify(rea_导航右键菜单数据,null,2) }}</pre> -->
    </div>
  </Teleport>
</template>

<style scoped>
#id_导航右键菜单 {
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background-color: rgba(0, 0, 0, 0.5); */
}

.导航右键菜单_视觉隐藏 {
  visibility: hidden;
}

#id_导航右键菜单_内容 {
  --右键菜单-按钮-字体大小: 16px;
  --右键菜单-按钮-上下边距: 4px;
  --右键菜单-按钮-左右边距: 14px;

  position: absolute;
  display: flex;
  flex-direction: column;
  width: fit-content;
  padding-top: calc(var(--右键菜单-按钮-上下边距) * 3);
  padding-bottom: calc(var(--右键菜单-按钮-上下边距) * 3);
  /* padding-left: var(--右键菜单-按钮-左右边距); */
  /* padding-right: var(--右键菜单-按钮-左右边距); */
  border-radius: var(--大圆角);

  background-color: #1f1f1f;

  button {
    font-size: var(--右键菜单-按钮-字体大小);
    padding: var(--右键菜单-按钮-上下边距) var(--右键菜单-按钮-左右边距);
    color: rgb(219, 219, 219);

    white-space: nowrap;
    overflow: visible;

    &:hover {
      background-color: #363635;
    }

    &:not(:last-child) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.6);
    }
  }
}
</style>
