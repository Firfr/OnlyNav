<script setup lang="ts">
import { computed, ref } from "vue";
import {
  rea_登录信息,
  ref_当前选择设置,
  ref_显示设置,
  ref_首次打开设置,
  按钮名称本地存储名称,
} from "../全局共享数据";
import type { t_设置_功能_名称, t_设置_功能_列表 } from "../类型.ts";
import Vue_图标 from "./设置/图标.vue";
import Vue_分类 from "./设置/分类.vue";
import Vue_子分类 from "./设置/子分类.vue";
import Vue_文件夹 from "./设置/文件夹.vue";
import Vue_账号 from "./设置/账号.vue";
import Vue_登录 from "./设置/登录.vue";
import Vue_关于 from "./设置/关于.vue";

const cmp_按钮列表 = computed<t_设置_功能_列表[]>(() => {
  const 返回值: t_设置_功能_列表[] = [
    { 名称: "图标", 显示: rea_登录信息.状态 },
    { 名称: "分类", 显示: rea_登录信息.状态 },
    { 名称: "子分类", 显示: rea_登录信息.状态 },
    { 名称: "文件夹", 显示: rea_登录信息.状态 },
    { 名称: "账号", 显示: rea_登录信息.状态 },
    { 名称: "登录", 显示: !rea_登录信息.状态 },
    { 名称: "关于", 显示: true },
  ];

  return 返回值;
});
const fn点击按钮 = (按钮名称: t_设置_功能_名称) => {
  ref_当前选择设置.value = 按钮名称;
  localStorage.setItem(按钮名称本地存储名称, ref_当前选择设置.value);
};

const ref_组件全屏 = ref(false);
const fn组件全屏 = () => {
  ref_组件全屏.value = !ref_组件全屏.value;
};
const cmp_全屏样式 = computed(() => {
  if (!ref_组件全屏.value) return {};
  return {
    "--设置-宽度": "96%",
    "--设置-高度": "96%",
  };
});
</script>

<template>
  <Teleport to="body">
    <Transition name="设置">
      <div
        id="id_设置"
        v-if="ref_首次打开设置"
        v-show="ref_显示设置"
        @click.self="ref_显示设置 = false"
      >
        <Transition name="设置-内容">
          <div class="设置-内容" v-show="ref_显示设置" :style="cmp_全屏样式">
            <div class="设置-按钮组">
              <el-button @click="fn组件全屏" :type="ref_组件全屏 ? 'primary' : ''">
                {{ ref_组件全屏 ? "退出全屏" : "全屏" }}
              </el-button>

              <template v-for="按钮 in cmp_按钮列表">
                <el-button
                  v-if="按钮.显示"
                  @click="fn点击按钮(按钮.名称)"
                  :class="{ 分隔: 按钮.名称 === '账号' || 按钮.名称 === '登录' }"
                  :type="ref_当前选择设置 === 按钮.名称 ? 'primary' : ''"
                >
                  {{ 按钮.名称 }}
                </el-button>
              </template>
            </div>

            <div class="设置-功能区">
              <Vue_图标 v-if="ref_当前选择设置 === '图标'" />
              <Vue_分类 v-if="ref_当前选择设置 === '分类'" />
              <Vue_子分类 v-if="ref_当前选择设置 === '子分类'" />
              <Vue_文件夹 v-if="ref_当前选择设置 === '文件夹'" />
              <Vue_账号 v-if="ref_当前选择设置 === '账号'" />
              <Vue_登录 v-if="ref_当前选择设置 === '登录'" />
              <Vue_关于 v-if="ref_当前选择设置 === '关于'" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
    <Transition name="设置-遮罩">
      <div v-if="ref_首次打开设置" id="id_设置-遮罩" v-show="ref_显示设置"></div>
    </Transition>
  </Teleport>
</template>
