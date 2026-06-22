<script setup lang="ts">
import { fn默认值_层级, type t_分类, type t_子分类, type t_文件夹 } from "@公共代码/类型";
import {
  cmp_分类列表,
  ref_是否显示_层级或导航_删除,
  ref_是否显示_层级或导航_操作,
  rea层级与导航数据,
  cmp_所有导航Map,
  cmp_导航层级Map,
} from "../../全局响应式数据";
import { fn图标地址转换, fn层级数据转信息 } from "../../工具/工具";
import { type t_层级信息, type t_操作方式 } from "../../类型";
import type { CascaderOption } from "element-plus";

const ref_当前选择内容 = ref<number[]>([]);
const cmp_级联选择器数据 = computed<(CascaderOption & { value: number })[]>(() => {
  if (cmp_分类列表.value.length === 0) return [];
  const 第一分类第一子分类 = cmp_导航层级Map.value.get(cmp_分类列表.value[0].ID);
  if (第一分类第一子分类 && 第一分类第一子分类.length > 0) {
    ref_当前选择内容.value = [cmp_分类列表.value[0].ID, 第一分类第一子分类[0].ID];
  }

  return cmp_分类列表.value.map((分类) => {
    const 分类数据 = 分类;
    const 返回数据: CascaderOption & { value: number } = {
      value: 分类数据.ID,
      label: 分类数据.名称,
    };
    const 子分类数据 = cmp_导航层级Map.value.get(分类.ID);
    if (!子分类数据 || 子分类数据.length === 0) {
      返回数据.disabled = true;
      return 返回数据;
    }

    返回数据.children = [];
    子分类数据.map((子分类) => {
      // @ts-expect-error
      返回数据.children.push({ value: 子分类.ID, label: 子分类.名称 });
    });

    return 返回数据;
  });
});

const 默认分类数据 = fn默认值_层级("分类");
const 默认子分类数据 = fn默认值_层级("子分类");
interface t_本组件所有展示数据 {
  分类: t_分类;
  分类信息: t_层级信息<t_分类>;
  子分类: t_子分类;
  子分类信息: t_层级信息<t_子分类>;
  表格数据: t_层级信息<t_文件夹>[];
}
const cmp_本组件所有展示数据 = computed<t_本组件所有展示数据>(() => {
  const 返回值: t_本组件所有展示数据 = {
    分类: 默认分类数据,
    分类信息: fn层级数据转信息(默认分类数据),
    子分类: 默认子分类数据,
    子分类信息: fn层级数据转信息(默认子分类数据),
    表格数据: [],
  };
  if (ref_当前选择内容.value.length !== 2) return 返回值;
  返回值.分类 = cmp_所有导航Map.value.get(ref_当前选择内容.value[0]) as t_分类;
  返回值.分类信息 = fn层级数据转信息(返回值.分类);
  返回值.子分类 = cmp_所有导航Map.value.get(ref_当前选择内容.value[1]) as t_子分类;
  返回值.子分类信息 = fn层级数据转信息(返回值.子分类);
  const 子分类内容列表 = cmp_导航层级Map.value.get(ref_当前选择内容.value[1]);
  if (!子分类内容列表) return 返回值;
  for (const 文件夹或导航 of 子分类内容列表) {
    if (文件夹或导航.类型 !== "文件夹") continue;
    返回值.表格数据.push(fn层级数据转信息(文件夹或导航 as t_文件夹));
  }
  return 返回值;
});

const fn删除文件夹 = (ID: number) => {
  rea层级与导航数据.类型 = "文件夹";
  rea层级与导航数据.操作方式 = "删除";
  rea层级与导航数据.分类 = cmp_本组件所有展示数据.value.分类;
  rea层级与导航数据.子分类 = cmp_本组件所有展示数据.value.子分类;
  const 文件夹 = cmp_所有导航Map.value.get(ID) as t_文件夹;
  rea层级与导航数据.当前数据 = 文件夹;
  rea层级与导航数据.文件夹 = 文件夹;
  ref_是否显示_层级或导航_删除.value = true;
};

const fn文件夹操作 = (操作方式: t_操作方式, ID: number) => {
  rea层级与导航数据.类型 = "文件夹";
  rea层级与导航数据.操作方式 = 操作方式;
  rea层级与导航数据.分类 = cmp_本组件所有展示数据.value.分类;
  rea层级与导航数据.子分类 = cmp_本组件所有展示数据.value.子分类;

  if (操作方式 !== "添加") {
    const 文件夹 = cmp_所有导航Map.value.get(ID) as t_文件夹;
    rea层级与导航数据.当前数据 = 文件夹;
    rea层级与导航数据.文件夹 = 文件夹;
  }

  ref_是否显示_层级或导航_操作.value = true;
};
</script>

<template>
  <div id="id_设置-文件夹">
    <el-cascader class="文件夹选择" :options="cmp_级联选择器数据" v-model="ref_当前选择内容" />

    <div
      v-for="父级信息 in [cmp_本组件所有展示数据.分类信息, cmp_本组件所有展示数据.子分类信息]"
      class="父级信息"
      :class="{ 分类信息: 父级信息.类型 === '分类', 未选择: 父级信息.ID === -1 }"
    >
      <div class="信息展示" v-show="父级信息.ID !== -1">
        <div class="基础信息">
          <el-tag>{{ 父级信息.类型 }}</el-tag>
          <el-tag> 公开：{{ 父级信息.公开 === true ? "是" : "否" }} </el-tag>
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
      <div class="图标展示" v-show="父级信息.图标类型 !== '无'">
        <div class="表情符号" v-if="父级信息.图标类型 === '文字'">
          {{ [...(父级信息.图标内容 ?? "")][0] }}
        </div>

        <el-image v-if="父级信息.图标类型 === '图片'" :src="fn图标地址转换(父级信息.图标地址)">
          <template #error>
            <div class="图片加载失败">
              <span>加载</span>
              <span>失败</span>
            </div>
          </template>
        </el-image>
      </div>
    </div>

    <el-table
      class="表格"
      :data="cmp_本组件所有展示数据.表格数据"
      row-key="id"
      stripe
      style="width: 100%"
      highlight-current-row
    >
      <el-table-column 序号 align="center" width="50">
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

      <el-table-column prop="名称" label="文件夹名称" align="center" max-width="180" min-width="70">
        <template #header>
          文件夹名称
          <el-button
            @click="fn文件夹操作('添加', -1)"
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
            @click="fn文件夹操作('查看', scope.row.ID)"
          >
            {{ scope.row.名称 }}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="子内容数量" label="导航" width="70" align="center">
        <template #default="scope">
          {{ scope.row.子分类中文件夹数量 < 1 ? "无" : `${scope.row.子分类中文件夹数量} 个` }}
        </template>
      </el-table-column>

      <el-table-column prop="描述" label="描述" align="center">
        <template #default="scope">
          <n-ellipsis style="max-width: 100%">
            {{ scope.row.描述 }}
          </n-ellipsis>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="90" align="center">
        <template #default="scope">
          <el-button
            @click="fn删除文件夹(scope.row.ID)"
            type="danger"
            circle
            size="small"
            class="圆按钮"
          >
            <ElIconDelete />
          </el-button>
          <el-button
            @click="fn文件夹操作('编辑', scope.row.ID)"
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
/* class="分类" 样式在文件 css/设置-文件夹.css 并在 style.css 中导入 */
</style>
