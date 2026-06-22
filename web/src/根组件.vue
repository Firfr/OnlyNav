<script setup lang="ts">
import zhCn from "element-plus/es/locale/lang/zh-cn";

import { ref_是否显示设置组件, ref_是否首次打开设置 } from "./全局响应式数据.ts";
import { fn获取登录状态, wait } from "./工具/工具.ts";

import Vue_设置按钮 from "./组件/设置按钮.vue";
import Vue_内外网切换 from "./组件/内外网切换.vue";
import Vue_搜索栏 from "./组件/搜索栏.vue";

import Vue_全部导航 from "./页面视图/全部导航.vue";
import Vue_文件夹 from "./页面视图/导航层级/文件夹.vue";

import Vue_设置 from "./页面视图/设置.vue";

import Vue_层级或导航删除 from "./组件/层级或导航删除.vue";
import Vue_层级或导航操作 from "./组件/层级或导航操作.vue";

import Vue_快速选择按钮 from "./组件/快速选择按钮.vue";

import Vue_导航右键菜单 from "./组件/导航右键菜单.vue";

// 获取当前路由对象
const route = useRoute();
const router = useRouter();

watch(
  () => route,
  (newRoute) => {
    // 输出当前的完整路径（包含 query 和 hash）
    console.log("当前路径:", newRoute.fullPath, newRoute.path);

    // 输出该路由对应的元数据（meta）
    console.log("路由元数据:", newRoute.meta);
    console.log("路由name:", newRoute.name);
  },
  { deep: true }, // 必须开启深度监听，因为 route 对象的内部属性变化需要深层追踪
);

const Url参数 = new URLSearchParams(window.location.search);

(async () => {
  await fn获取登录状态();
  await wait(1);
  if (Url参数.get("path") === "seting" || Url参数.get("path") === "login") {
    router.push("/");
    ref_是否显示设置组件.value = true;
    ref_是否首次打开设置.value = false;
  }
})();

// 捕获子组件的错误
onErrorCaptured((error, instance, info) => {
  const 发生错误的组件名称 =
    instance?.$options?.name || instance?.$options?.__name || "根组件.vue 中的子组件";
  console.log("错误发生在哪个组件:", 发生错误的组件名称);
  console.log("错误来源:", info);
  console.error("捕获到子组件错误:", error.message);

  return false;
});
</script>

<template>
  <el-config-provider :locale="zhCn">
    <n-scrollbar
      style="max-height: 100%"
      class="主内容滚动包裹容器"
      content-class="主要内容滚动视图"
    >
      <Vue_搜索栏 />
      <Vue_全部导航 />
      <div style="width: 100%; height: calc(var(--内容-下边距) * 3)"></div>

      <Teleport to="body">
        <n-back-top id="id_回到顶部">
          <div class="回到顶部内容">
            <ElIconUpload />
          </div>
        </n-back-top>
      </Teleport>
    </n-scrollbar>

    <Vue_设置按钮 />
    <Vue_内外网切换 />

    <Vue_文件夹 />

    <Vue_设置 />

    <Vue_层级或导航删除 />
    <Vue_层级或导航操作 />

    <Vue_快速选择按钮 />

    <Vue_导航右键菜单 />
  </el-config-provider>
</template>

<style>
.主要内容滚动视图 {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#id_回到顶部 {
  right: calc(var(--悬浮按钮--边距) * 2 + var(--悬浮按钮-宽度)) !important;
  bottom: var(--悬浮按钮--边距) !important;

  width: var(--悬浮按钮-宽度) !important;
  min-width: var(--悬浮按钮-宽度) !important;
  height: var(--悬浮按钮-宽度) !important;

  background: none !important;

  z-index: 4;

  .回到顶部内容 {
    width: 100%;
    height: 100%;
    padding: 2px;
    border: 1px solid var(--边框颜色);
    border-radius: var(--小圆角);
    transition: backdrop-filter 0.5s;

    backdrop-filter: blur(2px);
    background-color: rgba(0, 0, 0, 0.3);

    color: var(--文字-颜色);
    &:hover {
      backdrop-filter: blur(30px);
    }
  }
}
</style>
