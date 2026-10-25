<script setup lang="ts">
import { Delete, Upload } from "@element-plus/icons-vue";
import type { t_返回 } from "@公共代码/类型";
import { darkTheme, type UploadCustomRequestOptions, type UploadFileInfo } from "naive-ui";
import { computed, ref } from "vue";
import { ref_图标列表 } from "../../全局共享数据";
import { fn图标校验 } from "../../工具/图标校验";

const ref_是否显示图标上传组件 = defineModel<boolean>({ default: false });

const 正则_文件名校验 = /^[\u4e00-\u9fa5a-zA-Z0-9_-]{1,20}$/;

interface t_文件信息 {
  文件: Required<UploadFileInfo>;
  原名: string;
  后缀: string;
  新文件名: string;
  序号: number;
  上传成功: boolean;
}
const Map_选择文件 = ref<Map<string, t_文件信息>>(new Map<string, t_文件信息>());
const cmp_文件列表 = computed<t_文件信息[]>(() => {
  return [...Map_选择文件.value.values()].sort((前, 后) => 前.序号 - 后.序号);
});

let 文件计数 = 0;

const fn选中文件后 = async ({ file, onFinish }: UploadCustomRequestOptions) => {
  onFinish();

  const 图标校验 = await fn图标校验(file.file!);

  if (!图标校验.状态) {
    ElMessage.error(图标校验.信息);
    return;
  }

  const 文件原名 = file.name;
  if (Map_选择文件.value.has(文件原名)) {
    ElMessage.error(`文件以选择 ${文件原名}`);
    return;
  }

  const 最后一个点位置 = 文件原名.lastIndexOf(".");
  const 新文件名 = 最后一个点位置 > 0 ? 文件原名.slice(0, 最后一个点位置) : 文件原名;
  const 后缀 = 最后一个点位置 > 0 ? 文件原名.slice(最后一个点位置) : "";

  文件计数 += 1;
  Map_选择文件.value.set(文件原名, {
    文件: file,
    原名: 文件原名,
    后缀: 后缀,
    新文件名: 新文件名,
    序号: 文件计数,
    上传成功: false,
  });
};

const fn上传文件 = async (文件原名: string) => {
  const 文件信息 = Map_选择文件.value.get(文件原名);
  if (!文件信息) {
    ElMessage(`文件不存在 ${文件原名}`);
    return;
  }

  if (!正则_文件名校验.test(文件信息.新文件名)) {
    ElMessage.error("文件名只能包含 1-20 位中文、字母、数字、下划线或减号");
    return;
  }

  const 原始文件 = 文件信息.文件;
  if (!原始文件.file) {
    ElMessage.error("文件不存在");
    return;
  }

  const formData = new FormData();
  formData.append("icon", 原始文件.file, `${文件信息.新文件名}${文件信息.后缀}`);

  try {
    const 请求结果 = await fetch("api/icon", {
      method: "POST",
      body: formData,
    });

    const 响应体 = (await 请求结果.json()) as t_返回<string>;

    if (!请求结果.ok || !响应体.状态) {
      if (import.meta.env.DEV) {
        ElMessage.error(`HTTP错误: ${请求结果.status} ${响应体.信息 || ""}`);
        return;
      }
      ElMessage.error(响应体.信息 || "未知错误！");
      return;
    }

    ref_图标列表.value.unshift(响应体.内容);

    文件信息.上传成功 = true;
    ElMessage.success(`上传成功`);
  } catch (e) {
    console.error("上传异常：", e);
    ElMessage.error(`上传异常：${e instanceof Error ? e.message : String(e)}`);
  }
};

const fn取消选择文件 = (文件原名: string) => {
  const 文件信息 = Map_选择文件.value.get(文件原名);
  if (!文件信息) {
    ElMessage(`文件不存在 ${文件原名}`);
    return;
  }
  Map_选择文件.value.delete(文件原名);
  ElMessage(`文件已取消！`);
};
</script>

<template>
  <n-modal v-model:show="ref_是否显示图标上传组件">
    <n-config-provider :theme="darkTheme">
      <n-card class="图标-上传" style="width: 600px" :bordered="false">
        <n-upload
          multiple
          :show-file-list="false"
          :custom-request="fn选中文件后"
          accept=".jpg,.jpeg,.png,.webp,.apng,.svg,image/jpeg,image/png,image/webp,image/apng,image/svg+xml"
        >
          <n-upload-dragger>
            <div style="margin-bottom: 10px">
              <n-icon size="48" :depth="3">
                <ElIconUploadFilled />
              </n-icon>
            </div>
            <n-text style="font-size: 16px"> 点击或者拖动文件到该区域来上传 </n-text>
            <n-p depth="3" style="margin: 8px 0 0 0">
              请选择图片后输入新名称，再逐行点击上传。
            </n-p>
          </n-upload-dragger>
        </n-upload>

        <div v-if="cmp_文件列表.length !== 0" style="margin-top: 20px; width: 100%">
          新文件名，不能超过 20 个字符，只能包含 常见中文 英文 数字 _ -
        </div>
        <div v-for="文件 in cmp_文件列表" class="已选文件列表">
          <div class="原名">{{ 文件.原名 }}</div>

          <template v-if="文件.上传成功">
            <el-tag plain>{{ 文件.新文件名 }}{{ 文件.后缀 }}</el-tag>
            <el-tag type="success" plain>已上传</el-tag>
          </template>

          <template v-else>
            <el-input v-model="文件.新文件名" maxlength="20" placeholder="请输入新文件名！">
              <template #append>{{ 文件.后缀 }}</template>
            </el-input>
            <el-button @click="fn取消选择文件(文件.原名)" type="danger" :icon="Delete" circle />
            <el-button @click="fn上传文件(文件.原名)" type="success" :icon="Upload" circle />
          </template>
        </div>
      </n-card>
    </n-config-provider>
  </n-modal>
</template>
