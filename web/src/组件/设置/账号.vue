<script setup lang="ts">
import { rea_登录信息, ref_当前选择设置, ref_显示设置 } from "../../全局共享数据";
import { fn获取所有数据 } from "../../工具/数据";
import { fn发送请求 } from "../../工具/请求";

const fn退出 = async () => {
  const 请求结果 = await fn发送请求("post", "auth/logout");
  if (!请求结果.状态) return;
  ref_当前选择设置.value = "登录";
  rea_登录信息.状态 = false;
  rea_登录信息.登录方式 = "-";
  rea_登录信息.过期时间 = "-";
  fn获取所有数据();
  ref_显示设置.value = false;
};
</script>

<template>
  <div
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
