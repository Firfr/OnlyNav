<script setup lang="ts">
import { ref } from "vue";
import { ref_图标列表 } from "../../全局共享数据";
import { fn获取图标列表 } from "../../工具/数据";
import Vue_图标_上传 from "./图标-上传.vue";
import { Refresh } from "@element-plus/icons-vue";

if (ref_图标列表.value.length === 0) {
  fn获取图标列表();
}

const ref_是否显示图标上传组件 = ref(false);
const fn打开图标上传组件 = () => {
  ref_是否显示图标上传组件.value = true;
};
</script>

<template>
  <div id="id_图标">
    <div class="图标-顶部">
      <div class="按钮">
        <div style="flex: 1">
          <el-button
            tag="a"
            target="_blank"
            href="https://www.bilibili.com/video/BV1g5dGBoEBi/?share_source=copy_web&vd_source=556dcac19ae55e9c3e695dabb00fe591"
            type="primary"
            round
          >
            <el-tooltip
              effect="light"
              placement="top"
              content="动态图片推荐 APNG 格式，可以使用我汉化的动图生成器来制作"
            >
              动态图片制作
            </el-tooltip>
          </el-button>

          <el-button
            tag="a"
            target="_blank"
            href="https://www.bilibili.com/video/BV1KQKfz5E3Y/?share_source=copy_web&vd_source=556dcac19ae55e9c3e695dabb00fe591"
            type="primary"
            round
          >
            <el-tooltip
              effect="light"
              placement="top"
              content="图片的格式转换和压缩，推荐使用我独家汉化的工具：Mazanoke"
            >
              图片压缩与格式转换
            </el-tooltip>
          </el-button>
        </div>
        <el-button type="success" round @click="fn打开图标上传组件">上传</el-button>
        <el-button :icon="Refresh" circle @click="fn获取图标列表" />
      </div>

      <div class="提示">
        <el-tag round>图片不要太大，以免影响加载速度，推荐正方形图片，推荐使用 svg 格式</el-tag>
      </div>
    </div>

    <n-scrollbar class="图标展示滚动框容器" content-class="图标展示滚动框内容">
      <div v-for="图片 in ref_图标列表" key="图片" class="图标展示">
        <n-image
          class="单个展示图片"
          object-fit="contain"
          width="100%"
          height="100%"
          lazy
          :src="`api/icon/file/${图片}`"
        />
      </div>
    </n-scrollbar>
  </div>

  <Vue_图标_上传 v-model="ref_是否显示图标上传组件" />
</template>

<style scoped>
/* 样式 */
</style>
