<script setup lang="ts">
defineOptions({ name: "组件/层级或导航删除.vue" });
import { type t_分类, type t_子分类, type t_导航, type t_文件夹 } from "@公共代码/类型";
import { ref_是否显示_层级或导航_删除, rea层级与导航数据, fn删除本地数据 } from "../全局响应式数据";
import { fn发送请求 } from "../工具/请求";

const cmp_展示内容 = computed(() => {
  const 返回值: {
    标题: string;
    层级: (t_分类 | t_子分类 | t_文件夹 | t_导航)[];
    链接: string;
  } = { 标题: "", 层级: [rea层级与导航数据.分类], 链接: "-" };

  if (rea层级与导航数据.操作方式 !== "删除") {
    返回值.标题 = "❌操作方式错误❗";
    return 返回值;
  }

  const 类型 = rea层级与导航数据.类型;
  返回值.标题 = `确定删除 [${类型}] [${rea层级与导航数据.当前数据.名称}] 吗？`;

  switch (类型) {
    case "分类":
      返回值.链接 = `/cate/${rea层级与导航数据.分类.ID}`;
      break;
    case "子分类":
      返回值.链接 = `/sub_cate/${rea层级与导航数据.子分类.ID}`;
      break;
    case "文件夹":
      返回值.链接 = `/folder/${rea层级与导航数据.文件夹.ID}`;
      break;
    case "子分类_导航":
      返回值.链接 = `/nav/${rea层级与导航数据.导航.ID}`;
      break;
    case "文件夹_导航":
      返回值.链接 = `/nav/${rea层级与导航数据.导航.ID}`;
      break;

    default:
      返回值.标题 = `❌类型错误❗`;
      break;
  }

  if (类型 === "子分类" || 类型 === "文件夹" || 类型 === "子分类_导航" || 类型 === "文件夹_导航") {
    返回值.层级.push(rea层级与导航数据.子分类);
  }

  if (类型 === "文件夹") {
    返回值.层级.push(rea层级与导航数据.文件夹);
  }

  if (类型 === "子分类_导航" || 类型 === "文件夹_导航") {
    返回值.层级.push(rea层级与导航数据.导航);
  }

  return 返回值;
});

const fn删除 = async () => {
  console.log(`要删除 ${rea层级与导航数据.类型} 链接 ${cmp_展示内容.value.链接}`);
  const 删除分类结果 = await fn发送请求("DELETE", cmp_展示内容.value.链接);
  if (!删除分类结果.状态) return;

  const 本地删除结果 = fn删除本地数据(rea层级与导航数据.当前数据);

  if (!本地删除结果.状态) {
    ElMessage.error({
      message: "本地删除：" + 本地删除结果.信息,
      placement: "bottom-right",
    });
    return;
  }

  ElMessage.success({
    message: "删除成功",
    placement: "bottom-right",
  });
  ref_是否显示_层级或导航_删除.value = false;
};
</script>

<template>
  <el-dialog
    id="id_删除"
    v-model="ref_是否显示_层级或导航_删除"
    :title="cmp_展示内容.标题"
    align-center
  >
    <div v-for="数据 in cmp_展示内容.层级">
      {{ 数据.类型 }}：{{ 数据.名称 }}{{ 数据.描述 ? ` • ${数据.描述}` : "" }}
    </div>
    <el-button @click="fn删除" type="danger" style="margin-top: 10px">删除</el-button>
  </el-dialog>
</template>

<style>
/* 样式在文件 css/删除.css 并在 style.css 中导入 */
</style>
