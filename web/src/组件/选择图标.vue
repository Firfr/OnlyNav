<script setup lang="ts">
import { fn获取图标列表, rea_图标列表 } from "../全局响应式数据";
import { fn图标地址转换 } from "../工具/工具";

const ref_选中图标 = defineModel<string>("ref_选中图标", { default: "" });
const 参数 = withDefaults(
  defineProps<{
    const_宽度?: string;
    const_高度?: string;
  }>(),
  {
    const_宽度: () => "600px",
    const_高度: () => "500px",
  },
);

if (rea_图标列表.length === 0) {
  fn获取图标列表();
}

const fn选中图标 = (图标: string) => {
  ref_选中图标.value = 图标;
};
</script>

<template>
  <div id="id_图标选择" :style="{ '--图标-选择-宽度': const_宽度, '--图标-选择-高度': const_高度 }">
    <n-scrollbar content-class="图标选择滚动框内容">
      <img
        v-for="图标 in rea_图标列表"
        :key="图标.key"
        :src="fn图标地址转换(图标.文件名)"
        class="选项"
        :class="{ 选中: ref_选中图标 === 图标.文件名 }"
        @click="fn选中图标(图标.文件名)"
      />
    </n-scrollbar>
  </div>
</template>

<style>
/* 样式在文件 css/图标选择.css 并在 style.css 中导入 */
</style>
