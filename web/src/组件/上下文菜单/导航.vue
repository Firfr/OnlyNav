<script setup lang="ts">
import { computed, nextTick, reactive, ref } from "vue";
import { rea_上下文菜单_导航, rea_弹窗_操作, rea_登录信息 } from "../../全局共享数据";
import type { t_操作方式 } from "../../类型";

const ref_菜单实例 = ref(null);

const fn关闭菜单 = () => {
  rea_上下文菜单_导航.显示菜单 = false;
};

const rea_菜单坐标 = reactive<{ X: number; Y: number }>({
  X: rea_上下文菜单_导航.X,
  Y: rea_上下文菜单_导航.Y,
});

const fn计算菜单坐标 = async () => {
  await nextTick();
  const 菜单元素 = ref_菜单实例.value as unknown as HTMLElement;

  if (rea_菜单坐标.X + 菜单元素.offsetWidth > innerWidth) {
    rea_菜单坐标.X = rea_菜单坐标.X - 菜单元素.offsetWidth;
  }
  if (rea_菜单坐标.Y + 菜单元素.offsetHeight > innerHeight) {
    rea_菜单坐标.Y = rea_菜单坐标.Y - 菜单元素.offsetHeight;
  }

  // console.log(
  //   "上下文菜单_导航",
  //   rea_上下文菜单_导航.X,
  //   rea_菜单坐标.X,
  //   菜单元素.offsetWidth,
  //   innerWidth,
  // );
};
fn计算菜单坐标();

const cmp_链接 = computed(() => {
  const 返回值: {
    内网: undefined | string;
    外网: undefined | string;
  } = {
    内网: undefined,
    外网: undefined,
  };

  if (/^https?:\/\//.test(rea_上下文菜单_导航.导航.内网地址?.trim() ?? "")) {
    返回值.内网 = rea_上下文菜单_导航.导航.内网地址!.trim();
  }

  if (/^https?:\/\//.test(rea_上下文菜单_导航.导航.外网地址?.trim() ?? "")) {
    返回值.外网 = rea_上下文菜单_导航.导航.外网地址!.trim();
  }

  return 返回值;
});

const fn操作导航 = (操作方式: t_操作方式) => {
  switch (操作方式) {
    case "查看":
      rea_弹窗_操作.操作 = 操作方式;
      break;
    case "编辑":
      rea_弹窗_操作.操作 = 操作方式;
      break;
    case "移动":
      rea_弹窗_操作.操作 = 操作方式;
      break;
    case "删除":
      rea_弹窗_操作.操作 = 操作方式;
      break;

    default:
      ElMessage.warning(`导航操作 ${操作方式} 待开发！`);
      fn关闭菜单();
      return;
  }

  rea_弹窗_操作.类型 = "导航";
  rea_弹窗_操作.父级类型 = rea_上下文菜单_导航.父级类型;

  rea_弹窗_操作.层级 = [rea_上下文菜单_导航.分类, rea_上下文菜单_导航.子分类];
  if (rea_上下文菜单_导航.父级类型 === "文件夹") {
    rea_弹窗_操作.层级.push(rea_上下文菜单_导航.文件夹);
  }

  rea_弹窗_操作.当前 = rea_上下文菜单_导航.导航;

  rea_弹窗_操作.显示 = true;
  fn关闭菜单();
};
</script>

<template>
  <Teleport to="body">
    <div id="id_上下文菜单_导航" @click.self="fn关闭菜单" @contextmenu.prevent>
      <div
        ref="ref_菜单实例"
        class="菜单-内容"
        :style="{ left: rea_菜单坐标.X + 'px', top: rea_菜单坐标.Y + 'px' }"
      >
        <a
          v-if="rea_上下文菜单_导航.导航.内网地址"
          class="菜单-按钮"
          target="_blank"
          rel="noopener noreferrer"
          :href="cmp_链接.内网"
        >
          打开内网
        </a>

        <a
          v-if="rea_上下文菜单_导航.导航.外网地址"
          class="菜单-按钮"
          target="_blank"
          rel="noopener noreferrer"
          :href="cmp_链接.外网"
        >
          打开外网
        </a>

        <button class="菜单-按钮 清除按钮默认样式" @click="fn操作导航('查看')">
          <el-icon><ElIconView /></el-icon> 查看导航
        </button>

        <template v-if="rea_登录信息.状态">
          <button class="菜单-按钮 清除按钮默认样式" @click="fn操作导航('编辑')">
            <el-icon><ElIconEdit /></el-icon> 编辑导航
          </button>
          <button class="菜单-按钮 清除按钮默认样式" @click="fn操作导航('移动')">
            <el-icon><ElIconDArrowRight /></el-icon> 移动导航
          </button>
          <button class="菜单-按钮 清除按钮默认样式" @click="fn操作导航('删除')">
            <el-icon><ElIconDelete /></el-icon> 删除导航
          </button>
        </template>
      </div>
    </div>
  </Teleport>
</template>
