<script setup lang="ts">
import { fn默认值_层级, type t_分类, type t_子分类 } from "@公共代码/类型";
import {
  cmp_分类列表,
  ref_是否显示_层级或导航_删除,
  ref_是否显示_层级或导航_操作,
  rea层级与导航数据,
  cmp_所有导航Map,
  cmp_导航层级Map,
} from "../../全局响应式数据";
import { fn层级数据转信息 } from "../../工具/工具";
import { type t_层级信息, type t_操作方式 } from "../../类型";

const ref_当前分类ID = ref<number>(cmp_分类列表.value?.[0].ID ?? 0);

interface t_本组件所有展示数据 {
  分类数据: t_分类;
  表格数据: t_层级信息<t_子分类>[];
}
const cmp_本组件所有展示数据 = computed<t_本组件所有展示数据>(() => {
  const 返回值: t_本组件所有展示数据 = {
    分类数据: fn默认值_层级("分类"),
    表格数据: [],
  };
  if (cmp_分类列表.value.length === 0) return 返回值;

  返回值.分类数据 = cmp_所有导航Map.value.get(ref_当前分类ID.value) as t_分类;

  const 子分类列表 = cmp_导航层级Map.value.get(ref_当前分类ID.value);
  if (!子分类列表) return 返回值;

  for (const 子分类 of 子分类列表) {
    返回值.表格数据.push(fn层级数据转信息(子分类 as t_子分类));
  }

  return 返回值;
});

const fn删除子分类 = (ID: number) => {
  rea层级与导航数据.类型 = "子分类";
  rea层级与导航数据.操作方式 = "删除";
  rea层级与导航数据.分类 = cmp_本组件所有展示数据.value.分类数据;
  const 子分类 = cmp_所有导航Map.value.get(ID) as t_子分类;
  rea层级与导航数据.当前数据 = 子分类;
  rea层级与导航数据.子分类 = 子分类;
  ref_是否显示_层级或导航_删除.value = true;
};

const fn编辑子分类 = (ID: number, 操作方式: t_操作方式) => {
  rea层级与导航数据.类型 = "子分类";
  rea层级与导航数据.操作方式 = 操作方式;
  rea层级与导航数据.分类 = cmp_本组件所有展示数据.value.分类数据;

  if (操作方式 !== "添加") {
    const 子分类 = cmp_所有导航Map.value.get(ID) as t_子分类;
    rea层级与导航数据.当前数据 = 子分类;
    rea层级与导航数据.子分类 = 子分类;
  }

  ref_是否显示_层级或导航_操作.value = true;
};
</script>

<template>
  <div id="id_设置-子分类">
    <div class="分类选择">
      <div>请选择分类</div>
      <el-select 分类选择器 v-model="ref_当前分类ID" placeholder="请选择分类···">
        <el-option
          v-for="(分类, 索引) in cmp_分类列表"
          :key="分类.ID"
          :label="`${索引 + 1} ⇛ ${分类.名称}${分类.描述 ? ` · ${分类.描述}` : ''}`"
          :value="分类.ID"
        />
      </el-select>
    </div>

    <el-table
      class="表格"
      :data="cmp_本组件所有展示数据.表格数据"
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
            @click="fn编辑子分类(-1, '添加')"
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
            @click="fn编辑子分类((scope as any).row.ID, '查看')"
          >
            {{ scope.row.名称 }}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="子分类中导航数量" label="导航" width="70" align="center">
        <template #default="scope">
          {{ scope.row.子分类中导航数量 < 1 ? "无" : `${scope.row.子分类中导航数量} 个` }}
        </template>
      </el-table-column>
      <el-table-column prop="子分类中文件夹数量" label="文件夹" width="70" align="center">
        <template #default="scope">
          {{ scope.row.子分类中文件夹数量 < 1 ? "无" : `${scope.row.子分类中文件夹数量} 个` }}
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
            @click="fn删除子分类(scope.row.ID)"
            type="danger"
            circle
            size="small"
            class="圆按钮"
          >
            <ElIconDelete />
          </el-button>
          <el-button
            @click="fn编辑子分类(scope.row.ID, '编辑')"
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
  </div>
</template>

<style scoped>
/* class="分类" 样式在文件 css/设置-子分类.css 并在 style.css 中导入 */
</style>
