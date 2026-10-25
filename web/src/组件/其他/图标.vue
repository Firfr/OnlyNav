<script setup lang="ts">
import type { t_导航和层级 } from "@公共代码/类型";
import { fn图标地址转换 } from "../../工具/图标地址转换";
import { rea_登录信息 } from "../../全局共享数据";
interface t_数据 {
  数据: t_导航和层级;
}
const 参数 = defineProps<t_数据>();
</script>

<template>
  <div class="图标展示-基础">
    <div class="字符" v-if="数据.图标类型 === '文字'">
      {{ [...(数据.图标内容 ?? "")][0] }}
    </div>

    <el-image
      v-if="rea_登录信息.状态 && 数据.图标类型 === '图片'"
      :src="fn图标地址转换(数据.图标地址)"
      fit="contain"
    >
      <template #error>
        <div class="图片加载失败">
          <span>加载</span>
          <span>失败</span>
        </div>
      </template>
    </el-image>
  </div>
</template>
