<script setup lang="ts">
import { computed } from "vue";
import { fn层级数据转信息 } from "../../工具/层级数据转表格信息";
import { cmp_数据格式化, rea_弹窗_操作 } from "../../全局共享数据";
import type { t_操作方式 } from "../../类型";
import { Delete, EditPen, Plus, Sort } from "@element-plus/icons-vue";

const cmp_表格数据 = computed(() => {
  const 返回数据 = [];
  for (const 分类 of cmp_数据格式化.value.分类列表) {
    返回数据.push(fn层级数据转信息(分类));
  }
  return 返回数据;
});

const fn操作分类 = (ID: number, 操作方式: t_操作方式) => {
  if (操作方式 === "添加") {
    rea_弹窗_操作.类型 = "分类";
    rea_弹窗_操作.操作 = "添加";
    rea_弹窗_操作.层级 = [];

    rea_弹窗_操作.显示 = true;
    return;
  }

  const 分类数据 = cmp_数据格式化.value.Map_全部数据.get(ID);
  if (!分类数据 || 分类数据.类型 !== "分类") {
    ElMessage.warning(`ID 为 [${ID}] 的分类不存在！`);
    return;
  }

  switch (操作方式) {
    case "查看":
      rea_弹窗_操作.操作 = 操作方式;
      break;
    case "编辑":
      rea_弹窗_操作.操作 = 操作方式;
      break;
    case "删除":
      rea_弹窗_操作.操作 = 操作方式;
      break;

    default:
      ElMessage.warning(`分类${操作方式} 待开发！`);
      return;
  }
  rea_弹窗_操作.当前 = 分类数据;
  rea_弹窗_操作.类型 = "分类";
  rea_弹窗_操作.层级 = [];
  rea_弹窗_操作.显示 = true;
};

const fn分类排序 = () => {
  rea_弹窗_操作.操作 = "排序";
  rea_弹窗_操作.父级类型 = "";
  rea_弹窗_操作.层级 = [];
  rea_弹窗_操作.显示 = true;
};
</script>

<template>
  <el-table
    id="id_设置-分类"
    class="设置-层级-共有"
    :data="cmp_表格数据"
    row-key="id"
    stripe
    highlight-current-row
  >
    <el-table-column prop="排序" label="排序" width="90" align="center">
      <template #header>
        <div
          style="display: flex; flex-direction: row; justify-content: center; align-items: center"
        >
          <el-button
            @click="fn分类排序"
            type="primary"
            circle
            size="small"
            class="圆按钮"
            :icon="Sort"
          />
          <div style="margin-left: var(--小圆角)">/ {{ cmp_表格数据.length }}</div>
        </div>
      </template>
      <template #default="scope">
        <div :class="{ '设置-层级-公开': scope.row.公开 === true }">{{ scope.row.排序 }}</div>
      </template>
    </el-table-column>

    <el-table-column prop="名称" label="分类名称" max-width="180" min-width="70" align="center">
      <template #header>
        <div
          style="
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: center;
            align-items: center;
          "
        >
          分类名称
          <el-button
            @click="fn操作分类(0, '添加')"
            type="primary"
            circle
            size="small"
            class="圆按钮"
            style="margin-left: var(--小圆角)"
            :icon="Plus"
          />
        </div>
      </template>
      <template #default="scope">
        <div
          style="width: 100%; height: 100%; cursor: pointer"
          @click="fn操作分类(scope.row.ID, '查看')"
        >
          {{ scope.row.名称 }}
        </div>
      </template>
    </el-table-column>

    <el-table-column prop="子内容数量" label="子分类" width="74" align="center">
      <template #header>
        <el-tooltip content="格式：子分类中公开数量 | 子分类数量 " placement="top">
          子内容
        </el-tooltip>
      </template>
      <template #default="scope">
        {{ scope.row.子内容公开数量 < 1 ? "无" : `${scope.row.子内容公开数量}` }} |
        {{ scope.row.子内容数量 < 1 ? "无" : `${scope.row.子内容数量}` }}
      </template>
    </el-table-column>

    <el-table-column prop="描述" label="描述" align="center" width="auto">
      <template #default="scope">
        <n-ellipsis style="max-width: 100%">
          {{ scope.row.描述 }}
        </n-ellipsis>
      </template>
    </el-table-column>

    <el-table-column label="操作" width="84" align="center">
      <template #default="scope">
        <el-button
          @click="fn操作分类(scope.row.ID, '删除')"
          type="danger"
          circle
          size="small"
          class="圆按钮"
          :icon="Delete"
        />
        <el-button
          @click="fn操作分类(scope.row.ID, '编辑')"
          type="primary"
          circle
          size="small"
          class="圆按钮"
          style="margin-left: var(--大圆角)"
          :icon="EditPen"
        />
      </template>
    </el-table-column>
  </el-table>
</template>
