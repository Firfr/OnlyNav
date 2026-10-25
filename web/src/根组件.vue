<script setup lang="ts">
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { fn获取所有数据, fn获取登录状态 } from "./工具/数据";
import {
  rea_弹窗_文件夹,
  rea_弹窗_操作,
  rea_上下文菜单_导航,
  rea_上下文菜单_文件夹,
} from "./全局共享数据.ts";
import Vue_搜索 from "./组件/搜索.vue";
import Vue_内外网切换 from "./组件/按钮/内外网切换.vue";
import Vue_按钮_设置_登录 from "./组件/按钮/设置_登录.vue";
import Vue_按钮_分类跳转 from "./组件/按钮/分类跳转.vue";
import Vue_设置 from "./组件/设置.vue";
import Vue_全部导航 from "./组件/全部导航.vue";
import Vue_文件夹_弹窗 from "./组件/层级/文件夹-弹窗.vue";
import Vue_上下文菜单_导航 from "./组件/上下文菜单/导航.vue";
import Vue_上下文菜单_文件夹 from "./组件/上下文菜单/文件夹.vue";
import Vue_操作_添加 from "./组件/操作/添加.vue";
import Vue_操作_查看 from "./组件/操作/查看.vue";
import Vue_操作_编辑 from "./组件/操作/编辑.vue";
import Vue_操作_移动 from "./组件/操作/移动.vue";
import Vue_操作_删除 from "./组件/操作/删除.vue";
import Vue_操作_排序 from "./组件/操作/排序.vue";

fn获取登录状态();
fn获取所有数据();
</script>

<template>
  <el-config-provider
    :locale="zhCn"
    :message="{
      showClose: true,
      grouping: true,
      placement: 'bottom-right',
      duration: 5000,
    }"
  >
    <n-scrollbar
      style="max-height: 100%"
      class="主内容滚动包裹容器"
      content-class="主要内容滚动视图"
    >
      <Vue_搜索 />

      <Vue_全部导航 />

      <div style="width: 100%; height: calc(var(--内容-下边距) * 3)"></div>

      <n-back-top id="id_回到顶部">
        <div class="回到顶部内容">
          <ElIconUpload />
        </div>
      </n-back-top>
    </n-scrollbar>

    <Vue_按钮_设置_登录 />
    <Vue_内外网切换 />

    <Vue_设置 />

    <Vue_文件夹_弹窗 v-if="rea_弹窗_文件夹.显示" />

    <Vue_上下文菜单_导航 v-if="rea_上下文菜单_导航.显示菜单" />
    <Vue_上下文菜单_文件夹 v-if="rea_上下文菜单_文件夹.显示菜单" />

    <template v-if="rea_弹窗_操作.显示">
      <Vue_操作_添加 v-if="rea_弹窗_操作.操作 === '添加'" />
      <Vue_操作_查看 v-else-if="rea_弹窗_操作.操作 === '查看'" />
      <Vue_操作_编辑 v-else-if="rea_弹窗_操作.操作 === '编辑'" />
      <Vue_操作_移动 v-else-if="rea_弹窗_操作.操作 === '移动'" />
      <Vue_操作_删除 v-else-if="rea_弹窗_操作.操作 === '删除'" />
      <Vue_操作_排序 v-else-if="rea_弹窗_操作.操作 === '排序'" />
    </template>

    <Vue_按钮_分类跳转 />
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
