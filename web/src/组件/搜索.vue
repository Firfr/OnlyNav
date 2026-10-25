<script setup lang="ts">
import { ref } from "vue";

const ref_搜索关键词 = ref("");

const 搜索引擎 = [
  {
    名称: "必应",
    图标: "必应.svg",
    搜索链接: "https://www.bing.com/search?q=",
  },
];

const fn执行搜索 = () => {
  if (ref_搜索关键词.value.trim()) {
    const 搜索链接 = 搜索引擎[0].搜索链接 + encodeURIComponent(ref_搜索关键词.value.trim());
    window.open(搜索链接, "_blank");
  }
};
const fn回车搜索 = (事件: KeyboardEvent) => {
  if (事件.key === "Enter") {
    fn执行搜索();
  }
};
</script>

<template>
  <div id="id_搜索栏" class="主页内容宽度">
    <div class="搜索引擎图标">
      <img :src="搜索引擎[0].图标" />
    </div>

    <input
      name="搜索框"
      type="text"
      v-model="ref_搜索关键词"
      @keyup.enter="fn回车搜索"
      :placeholder="`从当前导航或${搜索引擎[0].名称}中搜索...`"
      class="搜索输入框"
    />
    <button
      v-show="ref_搜索关键词.length > 0"
      @click="ref_搜索关键词 = ''"
      class="清除搜索关键字 清除按钮默认样式"
    >
      <ElIconClose />
    </button>
    <button @click="fn执行搜索" class="开始搜索 清除按钮默认样式">
      <ElIconSearch />
    </button>
  </div>
</template>

<style scoped>
#id_搜索栏 {
  --搜索栏-高度: 40px;
  --搜索栏-内容-高度: calc(var(--搜索栏-高度) - 10px);
  --搜索栏-间距: 8px;

  display: flex;
  align-items: center;

  margin-top: 60px;
  margin-bottom: var(--内容-下边距);
  width: var(--搜索-宽度);
  max-width: 96%;
  min-height: max-content;
  height: var(--搜索栏-高度);
  border: 1.5px solid var(--文字-颜色);
  border-radius: var(--大圆角);
  padding: 0 var(--搜索栏-间距);
  backdrop-filter: blur(2px);
  background-color: rgba(0, 0, 0, 0.3);

  transition:
    box-shadow 0.5s,
    backdrop-filter 0.5s;

  &:hover {
    backdrop-filter: blur(10px);
    box-shadow: 0px 0px 30px -5px rgba(41, 41, 41, 0.45);
  }

  .搜索引擎图标,
  .清除搜索关键字,
  .开始搜索 {
    width: var(--搜索栏-内容-高度);
    height: var(--搜索栏-内容-高度);
    img {
      width: 100%;
      height: 100%;
    }
  }
  .清除搜索关键字 {
    margin-right: var(--搜索栏-间距);
  }

  .搜索输入框 {
    flex: 1;
    min-width: 0;
    height: var(--搜索栏-内容-高度);
    padding: 0px var(--搜索栏-间距);
    border: none;
    outline: none;
    font-size: 16px;
    background: none;
    color: var(--文字-颜色);
  }
}
</style>
