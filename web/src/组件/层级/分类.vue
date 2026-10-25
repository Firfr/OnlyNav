<script setup lang="ts">
import { computed, ref } from "vue";
import type { t_分类, t_子分类 } from "@公共代码/类型";
import { cmp_数据格式化, rea_弹窗_操作, rea_登录信息, 本地存储前缀 } from "../../全局共享数据";
import { fn图标地址转换 } from "../../工具/图标地址转换";
import Vue_子分类 from "./子分类.vue";

const { 分类 } = defineProps<{ 分类: t_分类 }>();

const cmp_当前子分类列表 = computed<t_子分类[]>(
  () => (cmp_数据格式化.value.Map_层级数据.get(分类.ID) as t_子分类[]) ?? [],
);

const ref_当前选中子分类ID = ref(cmp_当前子分类列表.value?.[0]?.ID ?? 0);
const 本地存储的当前选中子分类 = localStorage.getItem(`${本地存储前缀}sub_${分类.ID}`);
if (cmp_数据格式化.value.Map_全部数据.has(Number(本地存储的当前选中子分类))) {
  ref_当前选中子分类ID.value = Number(本地存储的当前选中子分类);
}
const fn保存当前选中子分类ID = () => {
  localStorage.setItem(`${本地存储前缀}sub_${分类.ID}`, ref_当前选中子分类ID.value.toString());
};

const fn添加导航 = () => {
  if (!cmp_数据格式化.value.Map_全部数据.has(ref_当前选中子分类ID.value)) {
    ref_当前选中子分类ID.value = cmp_当前子分类列表.value[0].ID || 0;
  }

  const 当前选中子分类 = cmp_数据格式化.value.Map_全部数据.get(ref_当前选中子分类ID.value);
  if (!当前选中子分类) {
    ElMessage.error(`无法找到 ID 为 [${ref_当前选中子分类ID.value}] 的子分类`);
    return;
  }

  rea_弹窗_操作.类型 = "导航";
  rea_弹窗_操作.父级类型 = "子分类";
  rea_弹窗_操作.操作 = "添加";
  rea_弹窗_操作.层级 = [分类, 当前选中子分类 as t_分类];

  rea_弹窗_操作.显示 = true;
};
</script>

<template>
  <div :id="`id_分类_${分类.ID}`" class="分类">
    <div class="标题">
      <div v-if="分类.公开" class="分类公开"></div>
      <div v-if="rea_登录信息.状态 && 分类.图标类型 === '图片'" class="图标">
        <el-image :src="fn图标地址转换(分类.图标地址)" fit="contain">
          <template #error>
            <div class="图片加载失败">※</div>
          </template>
        </el-image>
      </div>
      <div v-if="分类.图标类型 === '文字'" class="图标">
        <span>{{ 分类.图标内容 }}</span>
      </div>

      <h2>{{ 分类.名称 }}</h2>
      <span v-if="分类.描述">{{ `• ` }}{{ 分类.描述 }}</span>

      <button
        v-if="rea_登录信息.状态 && cmp_当前子分类列表.length !== 0"
        class="增加子分类内容 清除按钮默认样式"
        @click="fn添加导航"
      >
        <ElIconCirclePlusFilled style="width: 30px; height: 30px" />
      </button>
    </div>

    <div
      v-if="cmp_当前子分类列表.length === 0"
      style="text-align: center; mix-blend-mode: difference"
    >
      无子分类
    </div>

    <Vue_子分类
      v-else-if="cmp_当前子分类列表.length === 1"
      :分类="分类"
      :子分类="cmp_当前子分类列表[0]"
      :key="cmp_当前子分类列表[0].ID"
    />

    <el-tabs
      v-else
      v-model="ref_当前选中子分类ID"
      @tab-change="fn保存当前选中子分类ID"
      class="子分类切换"
    >
      <el-tab-pane
        v-for="子分类 in cmp_当前子分类列表"
        :key="`子分类-${子分类.ID}`"
        :label="子分类.名称"
        :name="子分类.ID"
        lazy
      >
        <template #label>
          <div
            class="标签"
            :class="{ 标签选中: ref_当前选中子分类ID === 子分类.ID, 子分类公开: 子分类.公开 }"
          >
            {{ 子分类.名称 }}
          </div>
        </template>
        <Vue_子分类 :分类="分类" :子分类="子分类" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
