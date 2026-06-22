<script setup lang="ts">
import { ref_是否显示设置组件, ref_是否登录, ref_是否首次打开设置 } from "../全局响应式数据.ts";

import Vue_图标 from "./设置/图标.vue";
import Vue_分类设置 from "./设置/分类.vue";
import Vue_子分类设置 from "./设置/子分类.vue";
import Vue_文件夹设置 from "./设置/文件夹.vue";
import Vue_账号 from "./设置/账号.vue";
import Vue_关于 from "./设置/关于.vue";

const router = useRouter();

const ref_当前选择设置 = ref("关于");

watch([ref_是否显示设置组件, ref_是否登录], () => {
  if (!ref_是否显示设置组件.value) {
    router.push("/");
    return;
  }

  if (ref_当前选择设置.value !== "关于" && !ref_是否登录.value) {
    router.push("/login");
    ref_是否首次打开设置.value = false;
    ref_当前选择设置.value = "账号";
    return;
  }

  router.push("/seting");
});

// 捕获子组件的错误
onErrorCaptured((error, instance, info) => {
  console.error("页面视图/设置.vue 捕获到子组件错误:", error.message);
  console.log("错误发生在哪个组件:", instance);
  console.log("错误来源:", info);

  return false;
});
</script>

<template>
  <Teleport to="body">
    <Transition name="设置">
      <div
        id="id_设置"
        v-if="!ref_是否首次打开设置"
        v-show="ref_是否显示设置组件"
        @click.self="ref_是否显示设置组件 = false"
      >
        <Transition name="设置-内容">
          <div class="设置_内容" v-show="ref_是否显示设置组件" :bordered="false">
            <div class="按钮组">
              <!-- <el-button>设置</el-button> -->
              <template v-if="ref_是否登录">
                <el-button
                  @click="ref_当前选择设置 = '图标'"
                  :type="ref_当前选择设置 === '图标' ? 'primary' : ''"
                >
                  图标
                </el-button>

                <el-button
                  @click="ref_当前选择设置 = '分类'"
                  :type="ref_当前选择设置 === '分类' ? 'primary' : ''"
                >
                  分类
                </el-button>

                <el-button
                  @click="ref_当前选择设置 = '子分类'"
                  :type="ref_当前选择设置 === '子分类' ? 'primary' : ''"
                >
                  子分类
                </el-button>

                <el-button
                  @click="ref_当前选择设置 = '文件夹'"
                  :type="ref_当前选择设置 === '文件夹' ? 'primary' : ''"
                >
                  文件夹
                </el-button>
              </template>

              <el-button
                style="margin-top: auto"
                @click="ref_当前选择设置 = '账号'"
                :type="ref_当前选择设置 === '账号' ? 'primary' : ''"
              >
                账号
              </el-button>

              <el-button
                @click="ref_当前选择设置 = '关于'"
                :type="ref_当前选择设置 === '关于' ? 'primary' : ''"
              >
                关于
              </el-button>
            </div>

            <div class="设置页面">
              <template v-if="ref_是否登录">
                <Vue_图标 v-if="ref_当前选择设置 === '图标'" />
                <Vue_分类设置 v-if="ref_当前选择设置 === '分类'" />
                <Vue_子分类设置 v-if="ref_当前选择设置 === '子分类'" />
                <Vue_文件夹设置 v-if="ref_当前选择设置 === '文件夹'" />
              </template>

              <Vue_账号 v-if="ref_当前选择设置 === '账号'" />
              <Vue_关于 v-if="ref_当前选择设置 === '关于'" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
    <Transition name="设置_遮罩">
      <div class="设置_遮罩" v-show="ref_是否显示设置组件"></div>
    </Transition>
  </Teleport>
</template>

<style scoped>
#id_设置 {
  z-index: 20;

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background-color: rgba(0, 0, 0, 0.345); */

  display: flex;
  align-items: center;
  justify-content: center;

  .设置_内容 {
    min-width: var(--设置-宽度);
    width: var(--设置-宽度);
    height: var(--设置-高度);
    border-radius: var(--大圆角);
    border: var(--设置-边框宽度) solid var(--边框颜色);
    padding: var(--设置-内边距);
    background-color: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(30px);
    display: flex;
    overflow: hidden;

    & > div {
      height: var(--设置-内容-高度);
    }

    .按钮组 {
      width: var(--设置-按钮组-宽度);

      display: flex;
      flex-direction: column;
    }

    .设置页面 {
      flex: 1;
      margin-left: var(--设置-设置内容-左边距);
      /* border-radius: var(--大圆角); */
      overflow: hidden;
    }
  }
}

.设置_遮罩 {
  z-index: 19;

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>

<style>
#id_设置 {
  .按钮组 .el-button {
    margin: 0;
    &:not(:first-child) {
      margin-top: var(--大圆角);
    }
  }
}

/* 离开 的动画属性和时间 */
.设置-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}
/* 离开状态 开始样式 */
.设置-leave-from {
  opacity: 1;
  transform: translate(0, 0) scale(1);
}
/* 离开状态 结束样式 */
.设置-leave-to {
  opacity: 0;
  transform: translate(50vw, -50vh) scale(0);
}

/* 进入 的动画属性和时间 */
.设置-内容-enter-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}
/* 进入状态 开始样式 */
.设置-内容-enter-from {
  opacity: 0;
  transform: translate(50vw, -50vh) scale(0);
}
/* 进入状态 结束样式 */
.设置-内容-enter-to {
  opacity: 1;
  transform: translate(0, 0) scale(1);
}

/* 进入 和 离开 的动画属性和时间 */
.设置_遮罩-enter-active,
.设置_遮罩-leave-active {
  transition: opacity 0.3s ease;
}

/* 进入状态 开始样式 */
/* 离开状态 结束样式 */
.设置_遮罩-enter-from,
.设置_遮罩-leave-to {
  opacity: 0;
}

/* 进入状态 结束样式 */
/* 离开状态 开始样式 */
.设置_遮罩-enter-to,
.设置_遮罩-leave-from {
  opacity: 1;
}
</style>
