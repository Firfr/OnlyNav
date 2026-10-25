<script setup lang="ts">
import type { CascaderOption } from "element-plus";
import { computed, ref } from "vue";
import { cmp_数据格式化, rea_弹窗_操作, 设置_文件夹_选中层级ID数组 } from "../../全局共享数据";
import type { t_分类, t_子分类, t_文件夹 } from "@公共代码/类型";
import type { t_层级信息, t_操作方式 } from "../../类型";
import { 默认值_分类, 默认值_分类信息, 默认值_子分类, 默认值_子分类信息 } from "../../工具/默认值";
import { fn层级数据转信息 } from "../../工具/层级数据转表格信息";
import Vue_图标 from "../其他/图标.vue";
import { Delete, EditPen, Plus, Sort } from "@element-plus/icons-vue";

const fn获取本地存储选择 = () => {
  let 返回值: number[] = [];
  try {
    const 存储值: number[] = JSON.parse(localStorage.getItem(设置_文件夹_选中层级ID数组) || "[]");
    if (存储值.length >= 1) {
      返回值.push(Number.isFinite(Number(存储值[0])) ? Number(存储值[0]) : 0);
      if (存储值.length >= 2) {
        返回值.push(Number.isFinite(Number(存储值[1])) ? Number(存储值[1]) : 0);
      }
    }
  } catch (e) {}
  return 返回值;
};
const ref_当前选择内容 = ref<number[]>([]);
const cmp_级联选择器数据 = computed<(CascaderOption & { value: number })[]>(() => {
  if (cmp_数据格式化.value.分类列表.length === 0) return [];
  const 第一分类第一子分类 = cmp_数据格式化.value.Map_层级数据.get(
    cmp_数据格式化.value.分类列表[0].ID,
  );
  if (第一分类第一子分类 && 第一分类第一子分类.length > 0) {
    ref_当前选择内容.value = [cmp_数据格式化.value.分类列表[0].ID, 第一分类第一子分类[0].ID];
  }

  return cmp_数据格式化.value.分类列表.map((分类) => {
    const 分类数据 = 分类;
    const 返回数据: CascaderOption & { value: number } = {
      value: 分类数据.ID,
      label: 分类数据.名称,
    };
    const 子分类数据 = cmp_数据格式化.value.Map_层级数据.get(分类.ID);
    if (!子分类数据 || 子分类数据.length === 0) {
      返回数据.disabled = true;
      return 返回数据;
    }

    返回数据.children = [];
    子分类数据.map((子分类) => {
      // @ts-expect-error
      返回数据.children.push({ value: 子分类.ID, label: 子分类.名称 });
    });

    ref_当前选择内容.value = fn获取本地存储选择();

    return 返回数据;
  });
});
const fn选中子分类 = () => {
  localStorage.setItem(设置_文件夹_选中层级ID数组, JSON.stringify(ref_当前选择内容.value));
};

interface t_本组件所有展示数据 {
  分类: t_分类;
  分类信息: t_层级信息<t_分类>;
  子分类: t_子分类;
  子分类信息: t_层级信息<t_子分类>;
  表格数据: t_层级信息<t_文件夹>[];
}
const cmp_本组件所有展示数据 = computed<t_本组件所有展示数据>(() => {
  const 返回值: t_本组件所有展示数据 = {
    分类: { ...默认值_分类 },
    分类信息: { ...默认值_分类信息 },
    子分类: { ...默认值_子分类 },
    子分类信息: { ...默认值_子分类信息 },
    表格数据: [],
  };
  if (ref_当前选择内容.value.length !== 2) return 返回值;
  返回值.分类 = cmp_数据格式化.value.Map_全部数据.get(ref_当前选择内容.value[0]) as t_分类;
  返回值.分类信息 = fn层级数据转信息(返回值.分类);
  返回值.子分类 = cmp_数据格式化.value.Map_全部数据.get(ref_当前选择内容.value[1]) as t_子分类;
  返回值.子分类信息 = fn层级数据转信息(返回值.子分类);
  const 子分类内容列表 = cmp_数据格式化.value.Map_层级数据.get(ref_当前选择内容.value[1]);
  if (!子分类内容列表) return 返回值;
  for (const 文件夹或导航 of 子分类内容列表) {
    if (文件夹或导航.类型 !== "文件夹") continue;
    返回值.表格数据.push(fn层级数据转信息(文件夹或导航 as t_文件夹));
  }
  return 返回值;
});

const fn操作文件夹 = (ID: number, 操作方式: t_操作方式) => {
  if (操作方式 === "添加") {
    rea_弹窗_操作.操作 = 操作方式;
    rea_弹窗_操作.类型 = "文件夹";
    rea_弹窗_操作.父级类型 = "子分类";
    rea_弹窗_操作.层级 = [cmp_本组件所有展示数据.value.分类, cmp_本组件所有展示数据.value.子分类];
    rea_弹窗_操作.显示 = true;
    return;
  }

  const 文件夹数据 = cmp_数据格式化.value.Map_全部数据.get(ID);
  if (!文件夹数据 || 文件夹数据.类型 !== "文件夹") {
    ElMessage.warning(`ID 为 [${ID}] 的文件夹不存在！`);
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
  rea_弹窗_操作.当前 = 文件夹数据;
  rea_弹窗_操作.类型 = "文件夹";
  rea_弹窗_操作.父级类型 = "子分类";
  rea_弹窗_操作.层级 = [cmp_本组件所有展示数据.value.分类, cmp_本组件所有展示数据.value.子分类];
  rea_弹窗_操作.显示 = true;
};

const fn文件夹排序 = () => {
  const 选择数据 = cmp_数据格式化.value.Map_全部数据.get(ref_当前选择内容.value[1] || -1);
  if (选择数据?.类型 !== "子分类") {
    ElMessage.warning("未选择子分类！");
    return;
  }
  rea_弹窗_操作.操作 = "排序";
  rea_弹窗_操作.父级类型 = "子分类";
  rea_弹窗_操作.层级 = [
    cmp_数据格式化.value.Map_全部数据.get(ref_当前选择内容.value[0]!) as t_分类,
    选择数据,
  ];
  rea_弹窗_操作.显示 = true;
};
</script>

<template>
  <div id="id_设置-文件夹" class="设置-层级-共有">
    <div class="父级选择">
      <div class="提示文字">请选择子分类</div>
      <el-cascader
        class="选择器"
        v-model="ref_当前选择内容"
        :options="cmp_级联选择器数据"
        @change="fn选中子分类"
      />
    </div>

    <div
      v-for="父级信息 in [cmp_本组件所有展示数据.分类信息, cmp_本组件所有展示数据.子分类信息]"
      class="父级信息"
      :class="{ 分类信息: 父级信息.类型 === '分类', 未选择: 父级信息.ID === -1 }"
    >
      <div class="信息展示" v-if="父级信息.ID !== -1">
        <div class="基础信息">
          <el-tag>{{ 父级信息.类型 }}</el-tag>
          <el-tag :type="`${父级信息.公开 ? 'success' : 'primary'}`">
            公开：{{ 父级信息.公开 === true ? "是" : "否" }}
          </el-tag>
          <el-tag>ID：{{ 父级信息.ID }}</el-tag>
          <el-tag>排序：{{ 父级信息.排序 }}</el-tag>
          <el-tag v-if="父级信息.类型 === '分类'">包含子分类：{{ 父级信息.子内容数量 }}</el-tag>
          <el-tag v-else>
            <span>包含</span>
            <span>
              文件夹：{{ 父级信息.子分类中文件夹数量 < 1 ? "无" : 父级信息.子分类中文件夹数量 }}
            </span>
            <span>
              导航：{{ 父级信息.子分类中导航数量 < 1 ? "无" : 父级信息.子分类中导航数量 }}
            </span>
          </el-tag>
        </div>
        <div style="font-size: 18px; overflow: hidden; text-overflow: ellipsis">
          {{ 父级信息.名称 || "-" }}<span v-if="父级信息.描述">{{ ` • ` }}{{ 父级信息.描述 }}</span>
        </div>
      </div>

      <Vue_图标 v-if="父级信息.图标类型 !== '无'" class="图标" :数据="父级信息" />
    </div>

    <el-table
      class="表格"
      :data="cmp_本组件所有展示数据.表格数据"
      row-key="id"
      stripe
      style="width: 100%"
      highlight-current-row
    >
      <el-table-column prop="排序" label="排序" width="90" align="center">
        <template #header>
          <div
            style="display: flex; flex-direction: row; justify-content: center; align-items: center"
          >
            <el-button
              @click="fn文件夹排序"
              type="primary"
              circle
              size="small"
              class="圆按钮"
              :icon="Sort"
            />
            <div style="margin-left: var(--小圆角)">
              / {{ cmp_本组件所有展示数据.表格数据.length }}
            </div>
          </div>
        </template>
        <template #default="scope">
          <div :class="{ '设置-层级-公开': scope.row.公开 === true }">{{ scope.row.排序 }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="名称" label="文件夹" max-width="180" min-width="84" align="center">
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
            文件夹
            <el-button
              @click="fn操作文件夹(0, '添加')"
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
            @click="fn操作文件夹(scope.row.ID, '查看')"
          >
            {{ scope.row.名称 }}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="导航数量" label="子内容" width="110" align="center">
        <template #header>
          <el-tooltip content="格式：导航公开数量 | 导航数量" placement="top"> 导航 </el-tooltip>
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
            @click="fn操作文件夹(scope.row.ID, '删除')"
            type="danger"
            circle
            size="small"
            class="圆按钮"
            :icon="Delete"
          />
          <el-button
            @click="fn操作文件夹(scope.row.ID, '编辑')"
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
  </div>
</template>
