<script setup lang="ts">
import type { t_分类 } from "@公共代码/类型";
import {
  cmp_分类列表,
  ref_是否显示_层级或导航_删除,
  ref_是否显示_层级或导航_操作,
  rea层级与导航数据,
  cmp_所有导航Map,
} from "../../全局响应式数据";
import { fn层级数据转信息 } from "../../工具/工具";
import { type t_操作方式 } from "../../类型";

const cmp_表格数据 = computed(() => {
  const 返回数据 = [];
  for (const 分类 of cmp_分类列表.value) {
    返回数据.push(fn层级数据转信息(分类));
  }
  return 返回数据;
});

const fn删除分类 = (ID: number) => {
  rea层级与导航数据.类型 = "分类";
  rea层级与导航数据.操作方式 = "删除";
  const 分类 = cmp_所有导航Map.value.get(ID) as t_分类;
  rea层级与导航数据.当前数据 = 分类;
  rea层级与导航数据.分类 = 分类;
  ref_是否显示_层级或导航_删除.value = true;
};

const fn编辑分类 = (ID: number, 操作方式: t_操作方式) => {
  rea层级与导航数据.类型 = "分类";
  rea层级与导航数据.操作方式 = 操作方式;

  if (操作方式 !== "添加") {
    const 分类 = cmp_所有导航Map.value.get(ID) as t_分类;
    rea层级与导航数据.当前数据 = 分类;
    rea层级与导航数据.分类 = 分类;
  }

  ref_是否显示_层级或导航_操作.value = true;
};
</script>

<template>
  <el-table
    id="id_分类-设置"
    :data="cmp_表格数据"
    row-key="id"
    stripe
    style="width: 100%"
    highlight-current-row
  >
    <el-table-column 排序 width="50" align="center">
      <template #header>
        <el-button disabled type="primary" circle size="small" class="圆按钮">
          <ElIconSort />
        </el-button>
      </template>
      <template #default="scope">
        <div :class="{ 公开: scope.row.公开 === true }">{{ scope.$index + 1 }}</div>
      </template>
    </el-table-column>

    <el-table-column prop="排序" label="排序" width="60" align="center" />

    <el-table-column prop="名称" label="分类名称" max-width="180" min-width="70" align="center">
      <template #header>
        分类名称
        <el-button
          @click="fn编辑分类(-1, '添加')"
          type="primary"
          circle
          size="small"
          class="圆按钮"
          style="margin-left: 8px"
        >
          <ElIconPlus />
        </el-button>
      </template>
      <template #default="scope">
        <div
          style="width: 100%; height: 100%; cursor: pointer"
          @click="fn编辑分类((scope as any).row.ID, '查看')"
        >
          {{ scope.row.名称 }}
        </div>
      </template>
    </el-table-column>

    <el-table-column prop="子内容数量" label="子分类" width="70" align="center">
      <template #default="scope">
        {{ scope.row.子内容数量 < 1 ? "无" : `${scope.row.子内容数量} 个` }}
      </template>
    </el-table-column>

    <el-table-column prop="描述" label="描述" align="center" width="auto">
      <template #default="scope">
        <n-ellipsis style="max-width: 100%">
          {{ scope.row.描述 }}
        </n-ellipsis>
      </template>
    </el-table-column>

    <el-table-column label="操作" width="90" align="center">
      <template #default="scope">
        <el-button
          @click="fn删除分类(scope.row.ID)"
          type="danger"
          circle
          size="small"
          class="圆按钮"
        >
          <ElIconDelete />
        </el-button>
        <el-button
          @click="fn编辑分类(scope.row.ID, '编辑')"
          type="primary"
          circle
          size="small"
          class="圆按钮"
          style="margin-left: 18px"
        >
          <ElIconEditPen />
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>
/* class="分类" 样式在文件 css/设置-分类.css 并在 style.css 中导入 */
</style>
