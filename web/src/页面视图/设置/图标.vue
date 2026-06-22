<script setup lang="ts">
import { rea_图标列表, fn获取图标列表 } from "../../全局响应式数据";
import Vue_图标上传 from "./图标/图标上传.vue";

if (rea_图标列表.length === 0) {
  fn获取图标列表();
}

const ref_是否显示图标上传组件 = ref(false);

const fn打开图标上传组件 = () => {
  ref_是否显示图标上传组件.value = true;
};
</script>

<template>
  <div id="id_图标">
    <div class="图标_顶部">
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
      </div>

      <div class="提示">
        <el-tag round>图片不要太大，以免影响加载速度，推荐正方形图片，推荐使用 svg 格式</el-tag>
      </div>
    </div>

    <n-scrollbar class="图标展示滚动框容器" content-class="图标展示滚动框内容">
      <div v-for="图片 in rea_图标列表" key="图片.key" class="图标展示">
        <n-image
          class="单个展示图片"
          object-fit="contain"
          width="100%"
          height="100%"
          lazy
          :src="`/api/icon/file/${图片.文件名}`"
        />
      </div>
    </n-scrollbar>
  </div>

  <Vue_图标上传 v-model="ref_是否显示图标上传组件" />
</template>

<style>
#id_图标 {
  width: var(--设置-设置内容-宽度);
  height: 100%;
  display: flex;
  flex-direction: column;

  --图片-顶部高度: 70px;

  --图标-每行图片数: 6;
  --图标-展示-间距: 10px;
  --图标-展示-图片宽度: calc(
    (var(--设置-设置内容-宽度) - (var(--图标-每行图片数) - 1) * var(--图标-展示-间距)) /
      var(--图标-每行图片数)
  );

  .图标_顶部 {
    /* height: var(--图片-顶部高度); */
    display: flex;
    flex-direction: column;

    .按钮 {
      display: flex;
      margin-bottom: var(--大圆角);
    }

    .提示 {
      display: flex;
      justify-content: center;
      margin-bottom: var(--大圆角);
    }
  }

  .图标展示滚动框容器 {
    .图标展示滚动框内容 {
      display: grid;
      gap: var(--图标-展示-间距);
      grid-template-columns: repeat(auto-fit, minmax(var(--图标-展示-图片宽度), 1fr));

      .单个展示图片 {
        width: var(--图标-展示-图片宽度);
        aspect-ratio: 1/1;
        background-color: #f0f8ff2b;
        border-radius: var(--小圆角);
      }
    }
  }
}
</style>
