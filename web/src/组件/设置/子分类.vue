<script setup lang="ts">
import { computed, ref } from "vue";
import { cmp_数据格式化, rea_弹窗_操作, 设置_子分类_选中分类ID } from "../../全局共享数据";
import type { t_分类, t_子分类 } from "@公共代码/类型";
import type { t_层级信息, t_操作方式 } from "../../类型";
import { fn层级数据转信息 } from "../../工具/层级数据转表格信息";
import { 默认值_分类信息 } from "../../工具/默认值";
import { Delete, EditPen, Plus, Sort } from "@element-plus/icons-vue";
import Vue_图标 from "../其他/图标.vue";

const fn初始化选择分类ID = () => {
  const 存储的分类ID = Number(localStorage.getItem(设置_子分类_选中分类ID));
  if (Number.isFinite(存储的分类ID)) {
    return 存储的分类ID || undefined;
  }
  return undefined;
};

const ref_当前选择分类ID = ref<number | undefined>(fn初始化选择分类ID());
const fn选择分类后 = () => {
  localStorage.setItem(设置_子分类_选中分类ID, `${ref_当前选择分类ID.value}`);
};

interface t_本组件所有展示数据 {
  分类信息: t_层级信息<t_分类>;
  表格数据: t_层级信息<t_子分类>[];
}
const cmp_本组件所有展示数据 = computed<t_本组件所有展示数据>(() => {
  const 返回值: t_本组件所有展示数据 = {
    分类信息: { ...默认值_分类信息 },
    表格数据: [],
  };
  if (cmp_数据格式化.value.分类列表.length === 0) return 返回值;

  const 分类数据 = cmp_数据格式化.value.Map_全部数据.get(ref_当前选择分类ID.value!);
  if (!分类数据) return 返回值;

  返回值.分类信息 = fn层级数据转信息(分类数据 as t_分类);

  const 子分类列表 = cmp_数据格式化.value.Map_层级数据.get(ref_当前选择分类ID.value!);
  if (!子分类列表) return 返回值;

  for (const 子分类 of 子分类列表) {
    返回值.表格数据.push(fn层级数据转信息(子分类 as t_子分类));
  }

  return 返回值;
});

const fn操作子分类 = (ID: number, 操作方式: t_操作方式 | "排序") => {
  const 选择数据 = cmp_数据格式化.value.Map_全部数据.get(ref_当前选择分类ID.value!);
  if (选择数据?.类型 !== "分类") {
    ElMessage.warning("未选择分类！");
    return;
  }

  if (操作方式 === "排序") {
    rea_弹窗_操作.操作 = "排序";
    rea_弹窗_操作.父级类型 = "分类";
    rea_弹窗_操作.层级 = [选择数据];
    rea_弹窗_操作.显示 = true;
    return;
  }

  if (操作方式 === "添加") {
    rea_弹窗_操作.操作 = "添加";
    rea_弹窗_操作.类型 = "子分类";
    rea_弹窗_操作.父级类型 = "分类";
    rea_弹窗_操作.层级 = [cmp_本组件所有展示数据.value.分类信息];
    rea_弹窗_操作.显示 = true;
    return;
  }

  const 子分类数据 = cmp_数据格式化.value.Map_全部数据.get(ID);
  if (!子分类数据 || 子分类数据.类型 !== "子分类") {
    ElMessage.warning(`ID 为 [${ID}] 的子分类不存在！`);
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
  rea_弹窗_操作.当前 = 子分类数据;
  rea_弹窗_操作.类型 = "子分类";
  rea_弹窗_操作.父级类型 = "分类";
  rea_弹窗_操作.层级 = [cmp_本组件所有展示数据.value.分类信息];
  rea_弹窗_操作.显示 = true;
};
</script>

<template>
  <div id="id_设置-子分类" class="设置-层级-共有">
    <div class="父级选择">
      <div class="提示文字">请选择分类</div>
      <el-select v-model="ref_当前选择分类ID" @change="fn选择分类后" placeholder="请选择分类">
        <el-option
          v-for="(分类, 索引) in cmp_数据格式化.分类列表"
          :key="分类.ID"
          :label="`${索引 + 1} ⇛ ${分类.名称}${分类.描述 ? ` · ${分类.描述}` : ''}`"
          :value="分类.ID"
        />
      </el-select>
    </div>

    <div
      class="父级信息"
      :class="{
        分类信息: cmp_本组件所有展示数据.分类信息.类型 === '分类',
        未选择: cmp_本组件所有展示数据.分类信息.ID === -1,
      }"
    >
      <div class="信息展示" v-if="cmp_本组件所有展示数据.分类信息.ID !== -1">
        <div class="基础信息">
          <el-tag>{{ cmp_本组件所有展示数据.分类信息.类型 }}</el-tag>
          <el-tag :type="`${cmp_本组件所有展示数据.分类信息.公开 ? 'success' : 'primary'}`">
            公开：{{ cmp_本组件所有展示数据.分类信息.公开 === true ? "是" : "否" }}
          </el-tag>
          <el-tag>ID：{{ cmp_本组件所有展示数据.分类信息.ID }}</el-tag>
          <el-tag>排序：{{ cmp_本组件所有展示数据.分类信息.排序 }}</el-tag>
          <el-tag v-if="cmp_本组件所有展示数据.分类信息.类型 === '分类'">
            包含子分类：{{ cmp_本组件所有展示数据.分类信息.子内容数量 }}
          </el-tag>
          <el-tag v-else>
            <span>包含</span>
            <span>
              文件夹：{{
                cmp_本组件所有展示数据.分类信息.子分类中文件夹数量 < 1
                  ? "无"
                  : cmp_本组件所有展示数据.分类信息.子分类中文件夹数量
              }}
            </span>
            <span>
              导航：{{
                cmp_本组件所有展示数据.分类信息.子分类中导航数量 < 1
                  ? "无"
                  : cmp_本组件所有展示数据.分类信息.子分类中导航数量
              }}
            </span>
          </el-tag>
        </div>
        <div style="font-size: 18px; overflow: hidden; text-overflow: ellipsis">
          {{ cmp_本组件所有展示数据.分类信息.名称 || "-" }}
          <span v-if="cmp_本组件所有展示数据.分类信息.描述">
            {{ ` • ` }}{{ cmp_本组件所有展示数据.分类信息.描述 }}
          </span>
        </div>
      </div>

      <Vue_图标
        v-if="cmp_本组件所有展示数据.分类信息.图标类型 !== '无'"
        class="图标"
        :数据="cmp_本组件所有展示数据.分类信息"
      />
    </div>

    <el-table
      class="表格"
      :data="cmp_本组件所有展示数据.表格数据"
      row-key="id"
      stripe
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column prop="排序" label="排序" width="90" align="center">
        <template #header>
          <div
            style="display: flex; flex-direction: row; justify-content: center; align-items: center"
          >
            <el-button
              @click="fn操作子分类('排序')"
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

      <el-table-column prop="名称" label="子分类" max-width="180" min-width="84" align="center">
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
            子分类
            <el-button
              @click="fn操作子分类(0, '添加')"
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
            @click="fn操作子分类(scope.row.ID, '查看')"
          >
            {{ scope.row.名称 }}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="子分类中导航数量" label="子内容" width="140" align="center">
        <template #header>
          <el-tooltip
            content="格式：导航数量 | 文件夹数量 | 子内容公开数量 | 子内容总数"
            placement="top"
          >
            子内容
          </el-tooltip>
        </template>
        <template #default="scope">
          {{ scope.row.子分类中导航数量 < 1 ? "无" : `${scope.row.子分类中导航数量}` }} |
          {{ scope.row.子分类中文件夹数量 < 1 ? "无" : `${scope.row.子分类中文件夹数量}` }} |
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
            @click="fn操作子分类(scope.row.ID, '删除')"
            type="danger"
            circle
            size="small"
            class="圆按钮"
            :icon="Delete"
          />
          <el-button
            @click="fn操作子分类(scope.row.ID, '编辑')"
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
