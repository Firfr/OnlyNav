<script setup lang="ts">
import SHA256 from "crypto-js/sha256";
import WordArray from "crypto-js/lib-typedarrays";
import type { FormInstance, FormRules } from "element-plus";
import { fn发送请求 } from "../工具/请求";
import { fn重新获取导航数据, ref_是否登录 } from "../全局响应式数据";

interface t_表单 {
  用户名: string;
  密码: string;
  长期登录秘钥?: string;
}

const ref_表单实例 = ref<FormInstance>();
const rea_表单数据 = reactive<t_表单>({
  用户名: "",
  密码: "",
  长期登录秘钥: "",
});

const rul_校验规则 = reactive<FormRules<t_表单>>({
  用户名: [
    { required: true, message: "用户名不能为空！", trigger: "blur" },
    { whitespace: true, message: "不能输入纯空格", trigger: "blur" },
    { min: 2, max: 32, message: "长度只能在 2-32之间", trigger: "blur" },
    {
      pattern: /^[^\s]+$/,
      message: "不允许包含空格换行等不可见字符",
      trigger: ["blur", "change"],
    },
  ],
  密码: [
    { required: true, message: "密码不能为空！", trigger: "blur" },
    { whitespace: true, message: "不能输入纯空格", trigger: "blur" },
    { min: 2, max: 32, message: "长度只能在 2-32之间", trigger: "blur" },
    {
      pattern: /^[^\s]+$/,
      message: "不允许包含空格换行等不可见字符",
      trigger: ["blur", "change"],
    },
  ],
  长期登录秘钥: [
    { whitespace: true, message: "不能输入纯空格", trigger: "blur" },
    { min: 2, max: 32, message: "长度只能在 2-32之间", trigger: "blur" },
    {
      pattern: /^[^\s]+$/,
      message: "不允许包含空格换行等不可见字符",
      trigger: ["blur", "change"],
    },
  ],
});

const ref_是否长期登录 = ref(false);

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
    if (ref_是否长期登录.value) {
      最终发送数据.长期登录秘钥 = SHA256(
        `${rea_表单数据.用户名}:${rea_表单数据.长期登录秘钥}:${盐}`,
      ).toString();
    }

    const 登录结果 = await fn发送请求("POST", "/login", 最终发送数据);

    if (登录结果.状态) {
      ElMessage.success({
        message: "登录成功",
        placement: "bottom-right",
      });

      ref_是否登录.value = true;

      fn重新获取导航数据();
    }
  } catch (校验失败详情) {
    console.log("校验失败!", 校验失败详情);
    // ElMessage.error({
    //   message: "校验失败",
    //   placement: "bottom-right",
    // });
  }
};
</script>

<template>
  <div id="id_登录">
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
          placeholder="请输入用户名"
          clearable
        />
      </el-form-item>

      <el-form-item label="密码" prop="密码">
        <el-input v-model="rea_表单数据.密码" type="password" placeholder="请输入密码" clearable />
      </el-form-item>

      <el-form-item class="自定义按钮">
        <el-tooltip
          class="box-item"
          effect="light"
          content="不要在公共设备上勾选！！！"
          placement="left"
        >
          <el-checkbox v-model="ref_是否长期登录"> 长期登录 </el-checkbox>
        </el-tooltip>
      </el-form-item>

      <el-form-item
        label="长期秘钥"
        prop="长期登录秘钥"
        :style="{ opacity: ref_是否长期登录 ? 1 : 0 }"
      >
        <el-input
          v-model="rea_表单数据.长期登录秘钥"
          type="password"
          placeholder="请输入长期登录秘钥"
          v-show="ref_是否长期登录"
        />
      </el-form-item>

      <el-form-item class="自定义按钮">
        <el-button type="primary" clearable @click="fn登录(ref_表单实例)"> 登录 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style>
#id_登录 {
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  .表单 {
    max-width: 100%;
    width: 300px;

    .自定义按钮 {
      .el-form-item__content {
        justify-content: center;
      }
    }
  }
}
</style>
