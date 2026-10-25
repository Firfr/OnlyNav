<script setup lang="ts">
import { ref } from "vue";
import {
  cmp_数据格式化,
  fn弹窗_操作_清空,
  rea_弹窗_操作,
  ref_所有导航数据,
} from "../../全局共享数据";
import { ElMessageBox } from "element-plus";
import { fn发送请求 } from "../../工具/请求";
import { fn获取所有数据 } from "../../工具/数据";
import Vue_图标 from "../其他/图标.vue";

const ref_显示本组件 = ref(true);
const fn关闭组件 = () => {
  ref_显示本组件.value = false;
  fn弹窗_操作_清空();
};

const fn确认删除 = () => {
  ElMessageBox.confirm(
    `确定要 ${rea_弹窗_操作.操作} [${rea_弹窗_操作.类型}] ${rea_弹窗_操作.当前.名称} 吗？`,
  )
    .then(() => {
      fn删除();
    })
    .catch(() => {});
};

const fn删除 = async () => {
  if (rea_弹窗_操作.类型 !== rea_弹窗_操作.当前.类型) {
    ElMessage.error(`组件 编辑.vue 所需数据出错！`);
    console.log(
      `编辑.vue rea_弹窗_操作 类型 和 当前.类型 不同！`,
      rea_弹窗_操作.类型,
      rea_弹窗_操作.当前.类型,
    );
    return;
  }

  if (rea_弹窗_操作.类型 !== "导航") {
    const 层级数据 = cmp_数据格式化.value.Map_层级数据.get(rea_弹窗_操作.当前.ID);
    if (!层级数据) {
      ElMessage.error(`[${rea_弹窗_操作.类型}] ${rea_弹窗_操作.当前.名称} 不存在！`);
      fn关闭组件();
      return;
    }
    if (层级数据.length > 0) {
      ElMessage.error(
        `[${rea_弹窗_操作.类型}] ${rea_弹窗_操作.当前.名称} 存在 ${层级数据.length} 个子内容，无法删除！`,
      );
      fn关闭组件();
      return;
    }
  }

  let 路径 = "-";
  switch (rea_弹窗_操作.类型) {
    case "分类":
      路径 = `cate/${rea_弹窗_操作.当前.ID}`;
      break;
    case "子分类":
      路径 = `sub-cate/${rea_弹窗_操作.当前.ID}`;
      break;
    case "文件夹":
      路径 = `folder/${rea_弹窗_操作.当前.ID}`;
      break;
    case "导航":
      路径 = `nav/${rea_弹窗_操作.当前.ID}`;
      break;
  }

  const 请求结果 = await fn发送请求("delete", 路径);
  if (!请求结果.状态) return;

  const 数据索引 = ref_所有导航数据.value.findIndex((项) => 项.ID === rea_弹窗_操作.当前.ID);
  if (数据索引 !== -1) {
    ref_所有导航数据.value.splice(数据索引, 1);
  } else {
    console.error(
      `[${rea_弹窗_操作.当前.类型}] ${rea_弹窗_操作.当前.名称} 本地更新失败，重新获取全部数据`,
    );
    fn获取所有数据();
  }

  ElMessage.success(`删除成功`);
  fn关闭组件();
};
</script>

<template>
  <el-dialog
    append-to-body
    v-model="ref_显示本组件"
    align-center
    @closed="fn关闭组件"
    :title="`${rea_弹窗_操作.操作} [${rea_弹窗_操作.类型}] ${rea_弹窗_操作.当前.名称}`"
    class="操作-删除-弹窗"
  >
    <div class="行信息 层级信息" v-for="层级 in rea_弹窗_操作.层级">
      <div class="左侧标签">{{ 层级.类型 }}</div>
      <div class="内容">
        <el-tag v-if="层级.公开" type="success">公开</el-tag>
        <el-tag v-else type="primary">私有</el-tag>
        <span style="margin-left: var(--大圆角)">
          {{ 层级.名称 }}
          {{ 层级.描述 ? ` • ${层级.描述}` : "" }}
        </span>
      </div>
    </div>

    <hr v-if="rea_弹窗_操作.层级.length !== 0" />

    <div class="信息聚合">
      <div class="信息">
        <div style="display: flex; flex-direction: row; flex-wrap: nowrap">
          <div class="行信息">
            <div class="左侧标签">类型</div>
            <div class="内容">{{ rea_弹窗_操作.类型 }}</div>
          </div>
          <div class="行信息">
            <div class="左侧标签" style="width: 40px">ID</div>
            <div class="内容">{{ rea_弹窗_操作.当前.ID }}</div>
          </div>
          <div class="行信息">
            <div class="左侧标签" style="width: 50px">排序</div>
            <div class="内容">{{ rea_弹窗_操作.当前.排序 }}</div>
          </div>
        </div>
        <div class="行信息">
          <div
            class="左侧标签"
            style="display: flex; justify-content: flex-end; align-items: center"
          >
            公开
          </div>
          <div class="内容" style="display: flex; align-items: center">
            <el-tag :type="`${rea_弹窗_操作.当前.公开 ? 'success' : 'danger'}`">
              {{ rea_弹窗_操作.当前.公开 ? "是" : "否" }}
            </el-tag>
            <span v-if="rea_弹窗_操作.类型 !== '分类'" style="margin-left: 10px">
              同时受到父级的影响
            </span>
          </div>
        </div>
      </div>

      <Vue_图标
        v-if="rea_弹窗_操作.当前.图标类型 !== '无'"
        class="图标"
        :数据="rea_弹窗_操作.当前"
      />
    </div>

    <div style="display: flex; justify-content: center">
      <el-button @click="fn确认删除" type="danger">删除</el-button>
    </div>
  </el-dialog>
</template>
