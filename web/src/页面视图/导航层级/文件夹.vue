<script setup lang="ts">
import type { t_导航 } from "@公共代码/类型.ts";
import {
  cmp_导航层级Map,
  ref_是否显示文件夹,
  rea_文件夹层级数据,
  rea层级与导航数据,
  ref_是否显示_层级或导航_操作,
} from "../../全局响应式数据";
import Vue_子分类内容 from "./子分类内容.vue";

const cmp_文件夹导航列表 = computed<t_导航[]>(() => {
  return (cmp_导航层级Map.value.get(rea_文件夹层级数据.文件夹.ID) as t_导航[]) ?? [];
});

const fn添加导航 = () => {
  rea层级与导航数据.类型 = "文件夹_导航";
  rea层级与导航数据.操作方式 = "添加";
  rea层级与导航数据.分类 = rea_文件夹层级数据.分类;
  rea层级与导航数据.子分类 = rea_文件夹层级数据.子分类;
  rea层级与导航数据.文件夹 = rea_文件夹层级数据.文件夹;
  ref_是否显示_层级或导航_操作.value = true;
};
</script>

<template>
  <Teleport to="body">
    <Transition name="文件夹">
      <div id="id_文件夹" v-show="ref_是否显示文件夹" @click.self="ref_是否显示文件夹 = false">
        <Transition name="文件夹-内容">
          <div v-show="ref_是否显示文件夹">
            <div class="顶部信息">
              <div class="文字">
                <div class="标题">{{ rea_文件夹层级数据.文件夹.名称 }}</div>
                <div class="描述" v-if="rea_文件夹层级数据.文件夹.描述">
                  {{ rea_文件夹层级数据.文件夹.描述 }}
                </div>
              </div>

              <div class="添加导航" @click="fn添加导航">✚</div>

              <div class="图标" v-if="rea_文件夹层级数据.文件夹.图标类型 !== '无'">
                <el-image
                  v-if="rea_文件夹层级数据.文件夹.图标类型 === '图片'"
                  :src="rea_文件夹层级数据.文件夹.图标地址"
                >
                  <template #error>
                    <div class="图片加载失败">
                      <span>加载</span>
                      <span>失败</span>
                    </div>
                  </template>
                </el-image>
                <span v-else>{{ rea_文件夹层级数据.文件夹.图标内容 }}</span>
              </div>
            </div>
            <div class="文件夹-导航">
              <Vue_子分类内容
                v-for="导航 in cmp_文件夹导航列表"
                @click="ref_是否显示文件夹 = false"
                父级名称="文件夹"
                :分类="rea_文件夹层级数据.分类"
                :子分类="rea_文件夹层级数据.子分类"
                :文件夹="rea_文件夹层级数据.文件夹"
                :展示内容="导航"
              />
              <div v-if="cmp_文件夹导航列表.length === 0" style="text-align: center">
                无导航，待添加
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
    <Transition name="文件夹_遮罩">
      <div class="文件夹_遮罩" v-show="ref_是否显示文件夹"></div>
    </Transition>
  </Teleport>
</template>

<style>
#id_文件夹 {
  z-index: 20;

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  & > div:nth-of-type(1) {
    width: 600px;
    display: flex;
    flex-direction: column;
    border-radius: var(--大圆角);
    border: 1px solid rgb(from var(--文字-颜色) r g b / 0.4);
    padding: calc(var(--大圆角) * 2);
    backdrop-filter: blur(10px);
    background-color: rgba(82, 82, 82, 0.2);

    & > div {
      width: 100%;
    }
  }

  & > div:nth-of-type(1) .顶部信息 {
    height: 60px;
    display: flex;
    align-items: center;

    color: var(--文字-颜色);

    .文字 {
      flex: 1;

      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      white-space: nowrap;

      .标题 {
        font-size: 32px;
        line-height: 32px;
        font-weight: 900;
      }

      .描述 {
        font-size: 14px;
      }
    }

    .添加导航 {
      margin-left: var(--大圆角);
      height: 100%;
      aspect-ratio: 1/1;
      border-radius: var(--小圆角);
      overflow: hidden;
      font-size: 30px;
      line-height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0.2;
      transition: opacity 0.3s ease;
      &:hover {
        opacity: 1;
      }
    }

    .图标 {
      margin-left: var(--大圆角);
      height: 100%;
      aspect-ratio: 1/1;
      border-radius: var(--小圆角);
      overflow: hidden;

      display: flex;
      align-items: center;
      justify-content: center;

      .el-image {
        height: 100%;
        aspect-ratio: 1/1;
      }

      & > span {
        --表情符号字体大小: 28px;
        font-size: var(--表情符号字体大小);
        line-height: var(--表情符号字体大小);
      }

      .图片加载失败 {
        width: 100%;
        height: 100%;
        border-radius: var(--小圆角);
        background-color: #1f1f1f6d;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        span {
          font-size: 12px;
          color: #b9b9b9;
        }
      }
    }
  }

  & > div:nth-of-type(1) .文件夹-导航 {
    margin-top: var(--大圆角);
    width: 100%;
    display: grid;
    gap: var(--子分类内容-间距);
    grid-template-columns: repeat(auto-fit, minmax(var(--子分类内容-最小宽度), 1fr));
  }

  /* max-width: 600px;
  backdrop-filter: blur(30px);
  border-radius: var(--大圆角); */

  --文件夹卡片边距: 20px;
  .n-card-header1 {
    padding-bottom: 20px;
  }
  .n-card-content1 {
    padding-left: var(--文件夹卡片边距);
    padding-right: var(--文件夹卡片边距);
  }
}

.文件夹_遮罩 {
  z-index: 19;

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
}

/* 离开 的动画属性和时间 */
.文件夹-leave-active {
  transition: opacity 0.3s ease;
}
/* 离开状态 开始样式 */
.文件夹-leave-from {
  opacity: 1;
}
/* 离开状态 结束样式 */
.文件夹-leave-to {
  opacity: 0;
}

/* 离开 的动画属性和时间 */
.文件夹-内容-enter-active {
  transition: opacity 0.3s ease;
}
/* 进入状态 开始样式 */
.文件夹-内容-enter-from {
  opacity: 0;
}
/* 进入状态 结束样式 */
.文件夹-内容-enter-to {
  opacity: 1;
}

/* 进入 和 离开 的动画属性和时间 */
.文件夹_遮罩-enter-active,
.文件夹_遮罩-leave-active {
  transition: opacity 0.3s ease;
}

/* 进入状态 开始样式 */
/* 离开状态 结束样式 */
.文件夹_遮罩-enter-from,
.文件夹_遮罩-leave-to {
  opacity: 0;
}

/* 进入状态 结束样式 */
/* 离开状态 开始样式 */
.文件夹_遮罩-enter-to,
.文件夹_遮罩-leave-from {
  opacity: 1;
}
</style>
