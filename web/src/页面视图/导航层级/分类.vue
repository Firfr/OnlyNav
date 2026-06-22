<script setup lang="ts">
import {
  cmp_所有导航Map,
  cmp_导航层级Map,
  rea层级与导航数据,
  ref_是否显示_层级或导航_操作,
} from "../../全局响应式数据.ts";
import { fn图标地址转换 } from "../../工具/工具.ts";
import { type t_分类, type t_子分类 } from "@公共代码/类型";
import Vue_子分类 from "./子分类.vue";

const { 分类 } = defineProps<{ 分类: t_分类 }>();

const cmp_当前子分类列表 = computed<t_子分类[]>(
  () => (cmp_导航层级Map.value.get(分类.ID) as t_子分类[]) ?? [],
);

const ref_当前选中子分类ID = ref(cmp_当前子分类列表.value?.[0]?.ID ?? 0);
const 本地存储的当前选中子分类 = localStorage.getItem(`firfe_nav_sub_${分类.ID}`);
if (cmp_所有导航Map.value.has(Number(本地存储的当前选中子分类))) {
  ref_当前选中子分类ID.value = Number(本地存储的当前选中子分类);
}

watch(ref_当前选中子分类ID, () => {
  localStorage.setItem(`firfe_nav_sub_${分类.ID}`, ref_当前选中子分类ID.value.toString());
});

const fn添加导航 = () => {
  rea层级与导航数据.类型 = "子分类_导航";
  rea层级与导航数据.操作方式 = "添加";
  rea层级与导航数据.分类 = 分类;
  const 当前选中子分类 = cmp_所有导航Map.value.get(ref_当前选中子分类ID.value) as t_子分类;
  if (!当前选中子分类) {
    ElMessage.error({
      message: "当前为选中有效的子分类！",
      placement: "bottom-right",
    });
    return;
  }
  rea层级与导航数据.子分类 = 当前选中子分类;
  ref_是否显示_层级或导航_操作.value = true;
};
</script>
<template>
  <div :id="`id_分类_${分类.ID}`" class="分类 主页内容宽度">
    <div class="标题">
      <div v-if="分类.图标类型 !== '无'" class="图标">
        <el-image v-if="分类.图标类型 === '图片'" :src="fn图标地址转换(分类.图标地址)">
          <template #error>
            <div class="图片加载失败">※</div>
          </template>
        </el-image>
        <span v-else>{{ 分类.图标内容 }}</span>
      </div>
      <h2>{{ 分类.名称 }}</h2>
      <span v-if="分类.描述">{{ `• ` }}{{ 分类.描述 }}</span>
      <button
        v-if="cmp_当前子分类列表.length !== 0"
        class="增加子分类内容 清除按钮默认样式"
        @click="fn添加导航"
      >
        ✚
      </button>
    </div>

    <el-tabs v-if="cmp_当前子分类列表.length > 1" v-model="ref_当前选中子分类ID" class="子分类切换">
      <el-tab-pane v-for="子分类 in cmp_当前子分类列表" :label="子分类.名称" :name="子分类.ID" lazy>
        <template #label>
          <div class="标签" :class="{ 标签选中: ref_当前选中子分类ID === 子分类.ID }">
            {{ 子分类.名称 }}
          </div>
        </template>
        <Vue_子分类 :分类="分类" :子分类="子分类" />
      </el-tab-pane>
    </el-tabs>

    <Vue_子分类
      v-else-if="cmp_当前子分类列表.length === 1"
      :分类="分类"
      :子分类="cmp_当前子分类列表[0]"
    />

    <div v-else="cmp_当前子分类列表.length === 0" style="text-align: center">无子分类</div>
  </div>

  <!-- <Vue_添加导航
    v-if="ref_是否显示添加导航"
    v-model="ref_是否显示添加导航"
    操作方式="添加"
    :链接="cmp_添加导航组件部分数据.链接"
    :分类="分类"
    :子分类="cmp_添加导航组件部分数据.子分类信息"
    :导航数据="fn默认值_导航()"
  /> -->
</template>

<style scoped>
/* class="分类" 样式在文件 css/分类.css 并在 style.css 中导入 */
</style>
