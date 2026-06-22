<script setup lang="ts">
import { ref_是否显示文件夹, rea_文件夹层级数据, rea_导航右键菜单数据 } from "../../全局响应式数据";
import { ref_是内网 } from "../../全局响应式数据";
import { fn图标地址转换 } from "../../工具/工具";
import { fn打开导航 } from "../../工具/打开连接";
import type { t_分类, t_子分类, t_导航, t_文件夹 } from "@公共代码/类型";

interface t_参数 {
  父级名称: "子分类" | "文件夹";
  分类: t_分类;
  子分类: t_子分类;
  文件夹: t_文件夹;
  展示内容: t_导航 | t_文件夹;
}
const { 父级名称, 分类, 子分类, 文件夹, 展示内容 } = defineProps<t_参数>();

const 内外网标识颜色 = {
  同类型: "rgba(0, 255, 255, 1)",
  不同类型: "rgba(0, 255, 255, 0.6)",
};
const fn内外网标识颜色 = (网络类型: string) => {
  if (ref_是内网.value) {
    if (网络类型 === "内网") {
      return 内外网标识颜色.同类型;
    }
    return 内外网标识颜色.不同类型;
  }
  if (网络类型 === "外网") {
    return 内外网标识颜色.同类型;
  }
  return 内外网标识颜色.不同类型;
};

const fn打开文件夹 = () => {
  if (父级名称 === "文件夹") return;
  rea_文件夹层级数据.分类 = 分类;
  rea_文件夹层级数据.子分类 = 子分类;
  rea_文件夹层级数据.文件夹 = 展示内容 as t_文件夹;
  ref_是否显示文件夹.value = true;
};

const fn点击右键 = (事件: MouseEvent) => {
  if (展示内容.类型 !== "导航") return;
  rea_导航右键菜单数据.X = 事件.clientX;
  rea_导航右键菜单数据.Y = 事件.clientY;
  rea_导航右键菜单数据.是否显示菜单 = true;
  rea_导航右键菜单数据.分类 = 分类;
  rea_导航右键菜单数据.子分类 = 子分类;
  if (父级名称 === "子分类") {
    rea_导航右键菜单数据.导航类型 = "子分类_导航";
    rea_导航右键菜单数据.导航 = 展示内容;
    return;
  }
  rea_导航右键菜单数据.导航类型 = "文件夹_导航";
  rea_导航右键菜单数据.文件夹 = 文件夹;
  if (展示内容.类型 !== "导航") {
    throw new Error("页面视图/导航层级/子分类内容.vue 文件夹导航 右键点击 '文件夹导航' 数据不存在");
  }
  rea_导航右键菜单数据.导航 = 展示内容;
};
</script>

<template>
  <button
    class="清除按钮默认样式 子分类内容"
    :class="{ 文件夹类型: 展示内容.类型 === '文件夹' }"
    :style="{
      '--内外网-标识-内网颜色': fn内外网标识颜色('内网'),
      '--内外网-标识-外网颜色': fn内外网标识颜色('外网'),
    }"
    @click="展示内容.类型 === '文件夹' ? fn打开文件夹() : fn打开导航(展示内容)"
    @contextmenu.prevent="fn点击右键"
  >
    <div v-if="展示内容.图标类型 !== '无'" class="图标">
      <el-image v-if="展示内容.图标类型 === '图片'" :src="fn图标地址转换(展示内容.图标地址)">
        <template #error>
          <div class="图片加载失败">
            <span>加载</span>
            <span>失败</span>
          </div>
        </template>
      </el-image>
      <span v-else>{{ 展示内容.图标内容 }}</span>
    </div>

    <div class="文字信息">
      <div class="名称" :class="{ 无描述: !展示内容.描述 }">
        <n-ellipsis style="max-width: 100%">
          {{ 展示内容.名称 }}
        </n-ellipsis>
      </div>
      <div class="描述" v-if="展示内容.描述">
        <n-ellipsis style="max-width: 100%">
          {{ 展示内容.描述 }}
        </n-ellipsis>
      </div>
    </div>

    <template v-if="展示内容.类型 === '导航'">
      <div v-if="展示内容.内网地址" class="内网"></div>
      <div v-if="展示内容.外网地址" class="外网"></div>
    </template>
  </button>
</template>

<style scoped>
/* class="子分类内容" 样式在文件 css/子分类内容.css 并在 style.css 中导入 */
</style>
