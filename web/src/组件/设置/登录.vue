<script setup lang="ts">
import { onUnmounted, reactive, ref } from "vue";
import SHA256 from "crypto-js/sha256";
import WordArray from "crypto-js/lib-typedarrays";
import { fn发送请求 } from "../../工具/请求";
import type { FormInstance, FormRules } from "element-plus";
import { fn获取所有数据, fn获取登录状态 } from "../../工具/数据";
import { ref_当前选择设置 } from "../../全局共享数据";

location.hash = "#/login";

const ref_是否支持长期登录 = ref(false);
const fn查询是否支持长期登录 = async () => {
  const 请求结果 = await fn发送请求<boolean>("get", "auth/long-login");
  if (请求结果.状态) {
    ref_是否支持长期登录.value = 请求结果.内容;
  }
};
fn查询是否支持长期登录();

const fn关闭组件 = () => {
  const url = location.pathname + location.search;
  history.replaceState(null, "", url);
  ref_当前选择设置.value = "账号";
};

interface t_表单 {
  用户名: string;
  密码: string;
  长期登录秘钥: string;
}
const ref_表单实例 = ref<FormInstance>();
const rea_表单数据 = reactive<t_表单>({
  用户名: "",
  密码: "",
  长期登录秘钥: "",
});

if (import.meta.env.DEV) {
  rea_表单数据.用户名 = "123";
  rea_表单数据.密码 = "123";
  rea_表单数据.长期登录秘钥 = "qwertyuiop";
}

const rul_校验规则 = reactive<FormRules<t_表单>>({
  用户名: [
    { required: true, message: "用户名不能为空！", trigger: "blur" },
    { whitespace: true, message: "不能输入纯空格", trigger: "blur" },
    { min: 2, max: 32, message: "长度只能在 2-32之间", trigger: "blur" },
    {
      pattern: /[\u4e00-\u9fa5a-zA-Z0-9_!@#.-]/,
      message: "只能包含 常见简体中文a-zA-Z0-9_!@#.-",
      trigger: ["blur", "change"],
    },
  ],
  密码: [
    { required: true, message: "密码不能为空！", trigger: "blur" },
    { whitespace: true, message: "不能输入纯空格", trigger: "blur" },
    { min: 2, max: 32, message: "长度只能在 2-32之间", trigger: "blur" },
    {
      pattern: /[a-zA-Z0-9_!@#.-]/,
      message: "只能包含 a-zA-Z0-9_!@#.-",
      trigger: ["blur", "change"],
    },
  ],
  长期登录秘钥: [
    { whitespace: true, message: "不能输入纯空格", trigger: "blur" },
    { min: 2, max: 32, message: "长度只能在 2-32之间", trigger: "blur" },
    {
      pattern: /[a-zA-Z0-9_!@#.-]/,
      message: "只能包含 a-zA-Z0-9_!@#.-",
      trigger: ["blur", "change"],
    },
  ],
});

const fn登录 = async (表单实例: FormInstance | undefined) => {
  if (!表单实例) return;
  try {
    await 表单实例.validate();

    const 盐 = WordArray.random(16).toString();
    const 最终发送数据: { 用户名: string; 密码: string; 盐: string; 长期登录秘钥?: string } = {
      用户名: rea_表单数据.用户名,
      密码: SHA256(`${rea_表单数据.用户名}:${rea_表单数据.密码}:${盐}`).toString(),
      盐: 盐,
    };

    if (ref_是否支持长期登录 && rea_表单数据.长期登录秘钥) {
      最终发送数据.长期登录秘钥 = SHA256(
        `${rea_表单数据.用户名}:${rea_表单数据.长期登录秘钥}:${盐}`,
      ).toString();
    }
    const 登录结果 = await fn发送请求("post", "auth/login", 最终发送数据);
    if (!登录结果.状态) return;

    ElMessage.success("登录成功");

    fn获取登录状态();
    fn获取所有数据();

    fn关闭组件();
  } catch (校验失败详情) {}
};

onUnmounted(() => {
  fn关闭组件();
});
</script>

<template>
  <div
    style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center"
  >
    <el-form
      class="表单"
      ref="ref_表单实例"
      label-width="auto"
      :model="rea_表单数据"
      :rules="rul_校验规则"
    >
      <el-form-item label="用户名" prop="用户名">
        <el-input
          v-model="rea_表单数据.用户名"
          type="username"
          autocomplete="username"
          placeholder="请输入用户名"
          clearable
        />
      </el-form-item>

      <el-form-item label="密码" prop="密码">
        <el-input v-model="rea_表单数据.密码" type="password" placeholder="请输入密码" clearable />
      </el-form-item>

      <div
        v-if="!ref_是否支持长期登录"
        style="width: 100%; margin-bottom: 14px; display: flex; justify-content: center"
      >
        <el-tag>长期登录功能已关闭！</el-tag>
      </div>

      <el-form-item v-if="ref_是否支持长期登录" label="长期秘钥" prop="长期登录秘钥">
        <div style="width: 100%; display: flex; flex-direction: column; align-items: center">
          <el-input
            v-model="rea_表单数据.长期登录秘钥"
            type="password"
            placeholder="请输入长期登录秘钥"
            clearable
          />
          <div style="margin: auto">
            <el-tag type="danger">↑ 请不要在公共设备上填写！！！ ↑</el-tag>
          </div>
        </div>
      </el-form-item>

      <div style="width: 100%; margin-top: 14px; display: flex; justify-content: center">
        <el-button type="primary" clearable @click="fn登录(ref_表单实例)"> 登录 </el-button>
      </div>
    </el-form>
  </div>
</template>
