<script setup lang="ts">
import { cmp_导航层级Map, cmp_分类列表 } from "../全局响应式数据";
import { fn图标地址转换 } from "../工具/工具";
import type { t_分类 } from "@公共代码/类型";

const ref_显示快速选择 = ref(false);
const fn切换快速选择 = () => {
  ref_显示快速选择.value = !ref_显示快速选择.value;
};

const fn分类快速跳转 = (ID: number) => {
  ref_显示快速选择.value = !ref_显示快速选择.value;

  // 通过元素 ID 触发浏览器原生瞬间跳转
  location.hash = `id_分类_${ID}`;

  // 第一次清洗：立即执行（0ms），试图在浏览器渲染前拦截
  window.history.replaceState(null, "", window.location.pathname + window.location.search);

  // 第二次清洗：延迟执行，确保兜底
  setTimeout(() => {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }, 50);
};
</script>

<template>
  <Teleport to="body">
    <button id="id_快速选择按钮" @click="fn切换快速选择" class="清除按钮默认样式">
      <ElIconSetting />
    </button>

    <div id="id_快速选择_背景遮罩" v-show="ref_显示快速选择" @click="fn切换快速选择"></div>

    <Transition name="快速选择">
      <div id="id_快速选择" v-show="ref_显示快速选择">
        <n-scrollbar>
          <template v-for="(分类, 索引) in cmp_分类列表">
            <el-tooltip effect="light" placement="left" :hide-after="100">
              <template #content>
                <div class="快速选择_分类悬浮信息">
                  <span class="分类名称">{{ 分类.名称 }}</span>
                  <span v-if="分类.描述" class="分类描述">{{ 分类.描述 }}</span>
                </div>
              </template>

              <button class="分类选择按钮 清除按钮默认样式" @click="fn分类快速跳转(分类.ID)">
                <el-image
                  class="图标"
                  v-if="分类.图标类型 === '图片'"
                  :src="fn图标地址转换(分类.图标地址)"
                >
                  <template #error>
                    <div class="图片加载失败">
                      <span>加载</span>
                      <span>失败</span>
                    </div>
                  </template>
                </el-image>
                <div class="表情符号" v-else-if="分类.图标类型 === '文字'">
                  {{ 分类.图标内容 }}
                </div>
                <div class="无图标" v-else>{{ [...分类.名称.replace(/\s/g, "")][0] }}</div>
              </button>
            </el-tooltip>
          </template>
        </n-scrollbar>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
#id_快速选择按钮 {
  all: revert;

  position: fixed;
  bottom: var(--悬浮按钮--边距);
  right: var(--悬浮按钮--边距);

  width: var(--悬浮按钮-宽度);
  aspect-ratio: 1 / 1;
  border: 1px solid var(--边框颜色);
  border-radius: var(--大圆角);
  padding: 2px;

  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.01);

  z-index: 12;
  transition:
    box-shadow 0.5s,
    border-color 0.5s,
    backdrop-filter 0.5s;

  /* &:hover {
    backdrop-filter: blur(30px);
    border-color: var(--文字-颜色);
    box-shadow: 0px 0px 30px -5px rgba(41, 41, 41, 0.45);
  } */
}

#id_快速选择_背景遮罩 {
  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  background-color: rgba(0, 0, 0, 0.06);
  /* backdrop-filter: blur(30px); */
  /* opacity: 0.9; */
  z-index: 10;
}

#id_快速选择 {
  position: fixed;
  bottom: calc(var(--悬浮按钮--边距) * 2 + var(--悬浮按钮-宽度));
  right: 0;

  width: calc(var(--悬浮按钮-宽度) + var(--悬浮按钮--边距) * 2);
  max-height: calc(100% - var(--悬浮按钮--边距) * 4 - var(--悬浮按钮-宽度) * 2);

  z-index: 12;

  .分类选择按钮 {
    margin-left: var(--悬浮按钮--边距);
    min-height: 0;
    width: var(--悬浮按钮-宽度);
    aspect-ratio: 1 / 1;

    border-radius: var(--大圆角);
    border: 1px solid var(--边框颜色);
    padding: 3px;

    &:hover {
      border-color: var(--文字-颜色);
    }

    &:not(:first-child) {
      margin-top: var(--悬浮按钮--边距);
    }

    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: calc(2px - var(--悬浮按钮--边距) / 2);
      left: calc(0px - var(--悬浮按钮--边距));

      width: calc(100% + var(--悬浮按钮--边距) * 2);
      height: calc(100% + var(--悬浮按钮--边距) - 4px);

      /* background-color: rgba(0, 0, 0, 0.2); */

      z-index: -1;
    }

    transition:
      box-shadow 0.5s,
      border-color 0.5s,
      backdrop-filter 0.5s;

    backdrop-filter: blur(2px);
    background-color: rgba(0, 0, 0, 0.3);
    &:hover {
      backdrop-filter: blur(30px);
      border-color: var(--文字-颜色);
      box-shadow: 0px 0px 30px -5px rgba(41, 41, 41, 0.45);
    }

    & > * {
      width: 100%;
      height: 100%;
      border-radius: var(--大圆角);
    }

    .图标 {
      img {
        border-radius: var(--小圆角);
      }

      .图片加载失败 {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        span {
          font-size: 12px;
          line-height: 1;
          opacity: 0.6;
        }
      }
    }

    .表情符号,
    .无图标 {
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .无图标 {
      font-weight: bold;
    }
  }

  & .el-scrollbar__view {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

.快速选择_分类悬浮信息 {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  & > .分类名称 {
    font-size: 16px;
  }

  & > .分类描述 {
    margin-top: 6px;
  }
}
</style>

<style>
#id_快速选择 {
  & .el-scrollbar__view {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

/* 进入 和 离开 的动画属性和时间 */
.快速选择-enter-active,
.快速选择-leave-active {
  /* transition: opacity 0.5s ease; */
  transition: transform 0.5s ease;
}

/* 进入状态 开始样式 */
.快速选择-enter-from {
  transform: translateX(calc(var(--悬浮按钮--边距) * 2 + var(--悬浮按钮-宽度)));
}
/* 进入状态 结束样式 */
.快速选择-enter-to {
  transform: translateX(0);
}
/* 离开状态 开始样式 */
.快速选择-leave-from {
  transform: translateX(0);
}
/* 离开状态 结束样式 */
.快速选择-leave-to {
  transform: translateX(calc(var(--悬浮按钮--边距) * 2 + var(--悬浮按钮-宽度)));
}
</style>
