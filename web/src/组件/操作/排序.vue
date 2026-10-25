<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, toRaw } from "vue";
import {
  cmp_数据格式化,
  fn弹窗_操作_清空,
  rea_弹窗_操作,
  ref_所有导航数据,
} from "../../全局共享数据";
import Sortable from "sortablejs";
import type { t_导航和层级 } from "@公共代码/类型";
import { fn发送请求 } from "../../工具/请求";
import { fn获取所有数据 } from "../../工具/数据";

const ref_显示本组件 = ref(true);
const fn关闭组件 = () => {
  ref_显示本组件.value = false;
  fn弹窗_操作_清空();
};

if (rea_弹窗_操作.操作 !== "排序") {
  ElMessage.error(`组件 排序.vue 所需数据出错！`);
  console.log("编辑.vue 操作:[%s] 父级类型:[%s]", rea_弹窗_操作?.操作, rea_弹窗_操作?.父级类型);
  fn关闭组件();
}

const cmp_标题 = computed(() => {
  let 父级类型 = "-";
  let 排序类型 = "-";
  switch (rea_弹窗_操作.父级类型) {
    case "":
      父级类型 = "全部数据";
      排序类型 = "分类";
      break;
    case "分类":
      父级类型 = rea_弹窗_操作.父级类型;
      排序类型 = "子分类";
      break;
    case "子分类":
      父级类型 = rea_弹窗_操作.父级类型;
      排序类型 = "导航、文件夹";
      break;
    case "文件夹":
      父级类型 = rea_弹窗_操作.父级类型;
      排序类型 = "导航";
      break;
  }
  return `对 [${父级类型}] 中的 [${排序类型}] 进行排序`;
});

const fn待排序数据 = (): t_导航和层级[] => {
  if (rea_弹窗_操作.父级类型 === "") {
    return cmp_数据格式化.value.分类列表;
  }

  const 层级数据 = cmp_数据格式化.value.Map_层级数据.get(rea_弹窗_操作.层级.at(-1)?.ID!);
  if (!层级数据) {
    ElMessage.error(`获取 [${rea_弹窗_操作.父级类型}] 子内容列表失败！`);
    fn关闭组件();
    return [];
  }

  let 返回值: t_导航和层级[] = [];
  for (let 索引 = 0; 索引 < 层级数据.length; 索引++) {
    const 项 = 层级数据[索引];
    返回值.push(structuredClone(toRaw(项)));
  }

  return 返回值.sort((a, b) => a.排序 - b.排序);
};

const ref_排序容器 = ref<HTMLElement>();
const ref_排序列表 = ref<t_导航和层级[]>(fn待排序数据());
let 拖拽实例: Sortable;

const fn打开组件 = async () => {
  await nextTick();
  if (!ref_排序容器.value) {
    console.warn("排序容器未渲染，拖拽未初始化");
    return;
  }
  拖拽实例?.destroy();
  拖拽实例 = Sortable.create(ref_排序容器.value, {
    animation: 150,
    onEnd({ oldIndex, newIndex }) {
      if (oldIndex == null || newIndex == null) return;
      const 列表 = [...ref_排序列表.value];
      const [当前项] = 列表.splice(oldIndex, 1);
      列表.splice(newIndex, 0, 当前项);
      ref_排序列表.value = 列表;
    },
  });
};

const fn排序 = async () => {
  const 结果 = [...ref_排序容器.value!.children].map((元素, 索引) => ({
    ID: Number((元素 as HTMLElement).dataset.id!),
    排序: 索引 + 1,
  }));

  let 路径 = "-";
  switch (rea_弹窗_操作.父级类型) {
    case "":
      路径 = "sort/all";
      break;
    case "分类":
      路径 = "sort/cate";
      break;
    case "子分类":
      路径 = "sort/sub-cate";
      break;
    case "文件夹":
      路径 = "sort/folder";
      break;
  }

  const 请求结果 = await fn发送请求("post", 路径, 结果);
  if (!请求结果.状态) return;

  for (let 索引 = 0; 索引 < 结果.length; 索引++) {
    const 数据 = 结果[索引];

    const 数据索引 = ref_所有导航数据.value.findIndex((项) => 项.ID === 数据.ID);
    if (数据索引 !== -1) {
      ref_所有导航数据.value[数据索引].排序 = 数据.排序;
    } else {
      console.error(`ID [${数据.ID}] 的数据 本地更新失败，重新获取全部数据`);
      fn获取所有数据();
      break;
    }
  }

  ElMessage.success(请求结果.内容);
  fn关闭组件();
};

onBeforeUnmount(() => 拖拽实例?.destroy());
</script>

<template>
  <el-dialog
    append-to-body
    v-model="ref_显示本组件"
    align-center
    @opened="fn打开组件"
    @closed="fn关闭组件"
    :title="cmp_标题"
    style="width: var(--文件夹-弹窗-宽度)"
    class="操作-排序-弹窗"
    body-class="弹窗内容"
  >
    <template #header="{ titleId, titleClass }">
      <div
        :id="titleId"
        :class="titleClass"
        style="display: flex; align-items: center; gap: var(--小圆角)"
      >
        <el-button
          @click="fn排序"
          type="primary"
          :disabled="ref_排序列表.length < 2"
          style="padding: 0 10px"
        >
          确定
        </el-button>
        {{ cmp_标题 }}
      </div>
    </template>

    <div class="行信息 层级信息" v-for="层级 in rea_弹窗_操作.层级">
      <div class="左侧标签">{{ 层级.类型 }}</div>
      <div class="内容">
        <el-tag v-if="层级.公开" type="success">公开</el-tag>
        <el-tag v-else type="primary">私有</el-tag>
        <span style="margin-left: var(--大圆角)">
          {{ 层级.名称 }}
          {{ 层级.描述 ? ` • ${层级.描述}` : "" }}
        </span>
      </div>
    </div>

    <hr v-if="rea_弹窗_操作.层级.length !== 0" />

    <div ref="ref_排序容器" class="排序容器">
      <div
        v-for="项 in ref_排序列表"
        :key="项.ID"
        :data-id="项.ID"
        class="拖拽元素"
        :class="{ 公开: 项.公开 }"
      >
        <div>{{ 项.类型 }}</div>
        <div>{{ 项.名称 }}</div>
      </div>
    </div>
  </el-dialog>
</template>
