<script setup lang="ts">
import { nextTick, reactive, ref } from "vue";
import { rea_上下文菜单_文件夹, rea_弹窗_操作, rea_登录信息 } from "../../全局共享数据";

const ref_菜单实例 = ref(null);

const fn关闭菜单 = () => {
  rea_上下文菜单_文件夹.显示菜单 = false;
};

const rea_菜单坐标 = reactive<{ X: number; Y: number }>({
  X: rea_上下文菜单_文件夹.X,
  Y: rea_上下文菜单_文件夹.Y,
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
};
fn计算菜单坐标();

const fn操作文件夹 = (操作方式: "查看" | "编辑" | "移动") => {
  rea_弹窗_操作.操作 = 操作方式;
  rea_弹窗_操作.类型 = "文件夹";
  rea_弹窗_操作.父级类型 = "子分类";

  rea_弹窗_操作.层级 = [rea_上下文菜单_文件夹.分类, rea_上下文菜单_文件夹.子分类];

  rea_弹窗_操作.当前 = rea_上下文菜单_文件夹.文件夹;

  rea_弹窗_操作.显示 = true;
  fn关闭菜单();
};

const fn文件夹内容排序 = () => {
  rea_弹窗_操作.操作 = "排序";
  rea_弹窗_操作.父级类型 = "文件夹";

  rea_弹窗_操作.层级 = [
    rea_上下文菜单_文件夹.分类,
    rea_上下文菜单_文件夹.子分类,
    rea_上下文菜单_文件夹.文件夹,
  ];

  rea_弹窗_操作.显示 = true;
  fn关闭菜单();
};
</script>

<template>
  <Teleport to="body">
    <div id="id_上下文菜单_文件夹" @click.self="fn关闭菜单" @contextmenu.prevent>
      <div
        ref="ref_菜单实例"
        class="菜单-内容"
        :style="{ left: rea_菜单坐标.X + 'px', top: rea_菜单坐标.Y + 'px' }"
      >
        <button class="菜单-按钮 清除按钮默认样式" @click="fn操作文件夹('查看')">
          <el-icon><ElIconView /></el-icon> 查看文件夹
        </button>

        <template v-if="rea_登录信息.状态">
          <button class="菜单-按钮 清除按钮默认样式" @click="fn操作文件夹('编辑')">
            <el-icon><ElIconEdit /></el-icon> 编辑文件夹
          </button>
          <button class="菜单-按钮 清除按钮默认样式" @click="fn操作文件夹('移动')">
            <el-icon><ElIconDArrowRight /></el-icon> 移动文件夹
          </button>
          <button class="菜单-按钮 清除按钮默认样式" @click="fn文件夹内容排序">
            <el-icon><ElIconSort /></el-icon> 内容排序
          </button>
          <!-- <button class="菜单-按钮 清除按钮默认样式" @click="fn操作文件夹('移动')">
            <el-icon><ElIconDArrowRight /></el-icon> 移动文件夹
          </button> -->
        </template>
      </div>
    </div>
  </Teleport>
</template>
