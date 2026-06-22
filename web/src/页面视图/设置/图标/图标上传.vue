<script setup lang="ts">
import { darkTheme } from "naive-ui";
import type { UploadOnFinish } from "naive-ui";
import type { t_返回 } from "@公共代码/类型";
import { rea_图标列表 } from "../../../全局响应式数据";
const ref_是否显示图标上传组件 = defineModel<boolean>({ default: false });

const fn上传成功: UploadOnFinish = ({ file, event }) => {
  try {
    // 安全地获取响应内容（event 可能是 undefined）
    const 返回数据 = JSON.parse((event?.target as XMLHttpRequest)?.response) as t_返回;
    if (!返回数据.状态) {
      ElMessage.error({
        message: 返回数据.信息,
        placement: "bottom-right",
        duration: 5000,
      });
      return;
    }

    ElMessage.success({
      message: `${file.name} 上传成功}`,
      placement: "bottom-right",
      duration: 5000,
    });

    rea_图标列表.unshift({ key: 返回数据.内容, 文件名: 返回数据.内容 });
  } catch (error) {
    console.error("解析上传响应失败:", error);
  }
};
</script>

<template>
  <n-modal v-model:show="ref_是否显示图标上传组件">
    <n-config-provider :theme="darkTheme">
      <n-card id="id_图标上传" :bordered="false">
        <n-upload
          multiple
          directory-dnd
          action="/api/icon"
          name="icon"
          @finish="fn上传成功"
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
              服务端会保留原文件名，请确保文件名不要太长！
            </n-p>
          </n-upload-dragger>
        </n-upload>
      </n-card>
    </n-config-provider>
  </n-modal>
</template>

<style>
#id_图标上传 {
  width: 600px;
}
</style>
