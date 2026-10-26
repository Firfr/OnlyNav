<script setup lang="ts">
import { ref_图标列表 } from "../../全局共享数据";
import { fn图标地址转换 } from "../../工具/图标地址转换";
import { fn获取图标列表 } from "../../工具/数据";

if (ref_图标列表.value.length === 0) {
  fn获取图标列表();
}

const ref_选中图标 = defineModel<string>("ref_选中图标", { default: "" });
const 参数 = withDefaults(
  defineProps<{
    宽度?: string;
    高度?: string;
    列数?: number;
  }>(),
  {
    宽度: () => "100%",
    高度: () => "100%",
    列数: () => 7,
  },
);

const fn选中图标 = (图标: string) => {
  ref_选中图标.value = 图标;
};
</script>

<template>
  <div
    id="id_图标选择"
    :style="{ '--图标-选择-宽度': 宽度, '--图标-选择-高度': 高度, '--图标-选择-每行数量': 列数 }"
  >
    <div
      v-for="图标 in ref_图标列表"
      class="选项"
      :class="{ 选中: ref_选中图标 === 图标 }"
      @click="fn选中图标(图标)"
      :key="图标"
    >
      <img :key="图标" :src="fn图标地址转换(图标)" />
    </div>

    <div v-if="ref_图标列表.length === 0" style="text-align: center">无图标！请上先传！</div>
  </div>
</template>
