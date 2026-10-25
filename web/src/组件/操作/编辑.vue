<script setup lang="ts">
import { reactive, ref, toRaw } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import type { t_导航 } from "@公共代码/类型";
import {
  fn弹窗_操作_清空,
  rea_弹窗_操作,
  ref_所有导航数据,
  rul_全局校验规则,
} from "../../全局共享数据";
import Vue_选择图标 from "./选择图标.vue";
import { fn发送请求 } from "../../工具/请求.ts";
import { fn获取所有数据 } from "../../工具/数据.ts";
import Vue_图标 from "../其他/图标.vue";

const ref_显示本组件 = ref(true);
const fn关闭组件 = () => {
  ref_显示本组件.value = false;
  fn弹窗_操作_清空();
};

if (rea_弹窗_操作.类型 !== rea_弹窗_操作.当前.类型) {
  ElMessage.error(`组件 编辑.vue 所需数据出错！`);
  console.log(
    `编辑.vue rea_弹窗_操作 类型 和 当前.类型 不同！`,
    rea_弹窗_操作.类型,
    rea_弹窗_操作.当前.类型,
  );
  fn关闭组件();
}
const 父级数据 = rea_弹窗_操作.层级.at(-1);
if (rea_弹窗_操作.类型 !== "分类" && 父级数据?.类型 !== rea_弹窗_操作.父级类型) {
  ElMessage.error(`数据父级类型不匹配`);
  fn关闭组件();
}

const 原数据 = structuredClone(toRaw(rea_弹窗_操作.当前)) as Required<t_导航>;

if (!原数据.描述) 原数据.描述 = "";
if (原数据.类型 === "导航") {
  if (!原数据.外网地址) 原数据.外网地址 = "";
  if (!原数据.外网地址) 原数据.外网地址 = "";
}

const ref_表单实例 = ref<FormInstance>();
const rea_表单数据 = reactive({ ...原数据 });
const rul_校验规则 = reactive<FormRules<t_导航>>({
  名称: rul_全局校验规则.名称,
  描述: rul_全局校验规则.描述,
  图标内容: rul_全局校验规则.图标内容,
  图标地址: rul_全局校验规则.图标地址,
  内网地址: [
    ...rul_全局校验规则.网址,
    {
      validator: (_规则, _输入值, 回调函数) => {
        if (!rea_表单数据.内网地址 && !rea_表单数据.外网地址) {
          return 回调函数(new Error("内外网地址不能同时为空！"));
        }
        回调函数();
      },
      trigger: "blur",
    },
  ],
  外网地址: [
    ...rul_全局校验规则.网址,
    {
      validator: (_规则, _输入值, 回调函数) => {
        if (!rea_表单数据.内网地址 && !rea_表单数据.外网地址) {
          return 回调函数(new Error("内外网地址不能同时为空！"));
        }
        回调函数();
      },
      trigger: "blur",
    },
  ],
});

const fn提交 = async () => {
  if (rea_弹窗_操作.类型 !== rea_弹窗_操作.当前.类型) {
    ElMessage.error(`组件 编辑.vue 所需数据出错！`);
    console.log(
      `编辑.vue rea_弹窗_操作 类型 和 当前.类型 不同！`,
      rea_弹窗_操作.类型,
      rea_弹窗_操作.当前.类型,
    );
    fn关闭组件();
    return;
  }
  const 父级数据 = rea_弹窗_操作.层级.at(-1);
  if (rea_弹窗_操作.类型 !== "分类" && 父级数据?.类型 !== rea_弹窗_操作.父级类型) {
    ElMessage.error(`数据父级类型不匹配`);
    fn关闭组件();
    return;
  }

  if (!ref_表单实例.value) return;

  try {
    await ref_表单实例.value.validate();

    const 发送数据: Partial<t_导航> = {};

    if (rea_表单数据.公开 !== 原数据.公开) {
      发送数据.公开 = rea_表单数据.公开;
    }

    if (rea_表单数据.名称 !== 原数据.名称) {
      发送数据.名称 = rea_表单数据.名称;
    }

    if (rea_表单数据.描述 !== 原数据.描述) {
      发送数据.描述 = rea_表单数据.描述;
    }

    if (rea_表单数据.图标类型 === "无" && rea_表单数据.图标类型 !== 原数据.图标类型) {
      发送数据.图标类型 = rea_表单数据.图标类型;
    }

    if (rea_表单数据.图标类型 === "文字" && rea_表单数据.图标内容 !== 原数据.图标内容) {
      发送数据.图标内容 = [...(rea_表单数据.图标内容 ?? "")][0];
      发送数据.图标类型 = rea_表单数据.图标类型;
    }

    if (rea_表单数据.图标类型 === "图片" && rea_表单数据.图标地址 !== 原数据.图标地址) {
      发送数据.图标地址 = rea_表单数据.图标地址;
      发送数据.图标类型 = rea_表单数据.图标类型;
    }

    if (原数据.类型 === "导航") {
      if (rea_表单数据.内网地址 !== 原数据.内网地址!) {
        发送数据.内网地址 = rea_表单数据.内网地址;
      }
      if (rea_表单数据.外网地址 !== 原数据.外网地址) {
        发送数据.外网地址 = rea_表单数据.外网地址;
      }
    }

    if (Object.keys(发送数据).length === 0) {
      ElMessage.warning("数据无变化！");
      return;
    }

    let 路径 = "-";
    switch (rea_弹窗_操作.类型) {
      case "分类":
        路径 = `cate/${原数据.ID}`;
        break;
      case "子分类":
        路径 = `sub-cate/${原数据.ID}`;
        break;
      case "文件夹":
        路径 = `folder/${原数据.ID}`;
        break;
      case "导航":
        路径 = `nav/${原数据.ID}`;
        break;
    }

    const 请求结果 = await fn发送请求("patch", 路径, 发送数据);
    if (!请求结果.状态) return;

    const 数据索引 = ref_所有导航数据.value.findIndex((项) => 项.ID === 原数据.ID);
    if (数据索引 !== -1) {
      ref_所有导航数据.value[数据索引] = {
        ...ref_所有导航数据.value[数据索引],
        ...发送数据,
      } as any;
    } else {
      console.error(`[${原数据.类型}] ${原数据.名称} 本地更新失败，重新获取全部数据`);
      fn获取所有数据();
    }

    ElMessage.success(`[${rea_弹窗_操作.类型}] 更新成功`);
    fn关闭组件();
  } catch (校验失败) {}
};
</script>

<template>
  <el-dialog
    append-to-body
    v-model="ref_显示本组件"
    align-center
    @closed="fn关闭组件"
    :title="`${rea_弹窗_操作.操作} [${rea_弹窗_操作.类型}] ${rea_弹窗_操作.当前.名称}`"
    class="操作-编辑-弹窗"
    body-class="弹窗内容"
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
            <div class="内容">{{ rea_表单数据.类型 }}</div>
          </div>
          <div class="行信息">
            <div class="左侧标签" style="width: 40px">ID</div>
            <div class="内容">{{ rea_表单数据.ID }}</div>
          </div>
          <div class="行信息">
            <div class="左侧标签" style="width: 50px">排序</div>
            <div class="内容">{{ rea_表单数据.排序 }}</div>
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
            <el-switch
              v-model="rea_表单数据.公开"
              inline-prompt
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #409eff"
              active-text="是"
              inactive-text="否"
            />
            <span v-if="rea_弹窗_操作.类型 !== '分类'" style="margin-left: 10px">
              同时受到父级的影响
            </span>
          </div>
        </div>
      </div>

      <Vue_图标 v-if="rea_表单数据.图标类型 !== '无'" class="图标" :数据="rea_表单数据" />
    </div>

    <el-form
      ref="ref_表单实例"
      class="表单"
      :model="rea_表单数据"
      :rules="rul_校验规则"
      label-width="70px"
    >
      <el-form-item label="名称" prop="名称">
        <el-input v-model="rea_表单数据.名称" placeholder="请输入名称" clearable />
      </el-form-item>

      <el-form-item label="描述" prop="描述">
        <el-input v-model="rea_表单数据.描述" placeholder="请输入描述" type="textarea" clearable />
      </el-form-item>

      <el-form-item label="图标类型" prop="图标类型">
        <el-radio-group class="图标类型" v-model="rea_表单数据.图标类型">
          <el-radio value="无">无</el-radio>
          <el-radio value="文字">文字</el-radio>
          <el-radio value="图片">图片</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="rea_表单数据.图标类型 === '无'" label="图标" class="图标设置">
        无图标
      </el-form-item>

      <el-form-item
        v-else-if="rea_表单数据.图标类型 === '文字'"
        prop="图标内容"
        label="图标内容"
        class="图标设置"
      >
        <div style="margin-right: var(--大圆角)">使用表情符号作为图标</div>
        <el-input class="表情符号输入" v-model="rea_表单数据.图标内容" maxlength="2" />
      </el-form-item>

      <el-form-item v-else prop="图标地址" label="图标地址" class="图标设置">
        <div class="图标选择">
          <el-input readonly v-model="rea_表单数据.图标地址" placeholder="请选择图片···" />
          <el-tooltip raw-content placement="bottom" effect="light">
            <template #content>
              <div class="层级或导航操作_选择图标">
                <Vue_选择图标
                  v-model:ref_选中图标="rea_表单数据.图标地址"
                  宽度="300px"
                  高度="400px"
                  :列数="6"
                />
              </div>
            </template>
            <div class="图标选择-悬浮层"></div>
          </el-tooltip>
        </div>
      </el-form-item>

      <template v-if="rea_弹窗_操作.类型 === '导航'">
        <el-form-item label=" " style="margin-bottom: var(--大圆角)">
          <el-tag type="warning" style="margin: auto">
            这里不对输入格式做校验！仅无空格即可。
          </el-tag>
        </el-form-item>

        <el-form-item label="内网地址" prop="内网地址">
          <el-input v-model="rea_表单数据.内网地址" placeholder="请输入子内网地址" clearable />
        </el-form-item>

        <el-form-item label="外网地址" prop="外网地址">
          <el-input v-model="rea_表单数据.外网地址" placeholder="请输入子外网地址" clearable />
        </el-form-item>
      </template>

      <div style="display: flex; justify-content: center">
        <el-button @click="fn提交" type="primary">确定</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
