<script setup lang="ts">
import { ref_是否登录, rea_登录信息, fn重新获取导航数据 } from "../../全局响应式数据";
import { fn发送请求 } from "../../工具/请求";
import Vue_登录 from "../登录.vue";

const fn退出 = async () => {
  await fn发送请求("GET", "/logout");
  fn重新获取导航数据();
};
</script>

<template>
  <Vue_登录 v-if="!ref_是否登录" />
  <div
    v-else
    id="id_设置-账号"
    style="
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    "
  >
    <div>登录方式：{{ rea_登录信息.登录方式 }}</div>
    <div>过期时间：{{ rea_登录信息.过期时间 }}</div>
    <el-button @click="fn退出" type="danger" style="position: absolute; bottom: 0; right: 0">
      退出
    </el-button>
  </div>
</template>

<style scoped></style>
