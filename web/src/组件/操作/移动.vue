<script setup lang="ts">
import { reactive, ref } from "vue";
import {
  cmp_数据格式化,
  fn弹窗_操作_清空,
  rea_弹窗_操作,
  ref_所有导航数据,
} from "../../全局共享数据";
import type { FormInstance, FormRules } from "element-plus";
import Vue_图标 from "../其他/图标.vue";
import { fn发送请求 } from "../../工具/请求.ts";
import { fn获取所有数据 } from "../../工具/数据.ts";

const ref_显示本组件 = ref(true);
const fn关闭组件 = () => {
  ref_显示本组件.value = false;
  fn弹窗_操作_清空();
};

if (rea_弹窗_操作.类型 !== "导航" && rea_弹窗_操作.类型 !== "文件夹") {
  ElMessage.warning(`当前仅支持移动 [导航、文件夹]！`);
  fn关闭组件();
}

const ref_表单实例 = ref<FormInstance>();
const rea_表单数据 = reactive<{
  分类ID: number | null;
  子分类ID: number | null;
  文件夹ID: number | null;
}>({ 分类ID: null, 子分类ID: null, 文件夹ID: null });
const rul_校验规则 = reactive<FormRules>({
  分类ID: [
    { required: true, message: "所属 分类 必须选择！", trigger: "blur" },
    {
      validator: (_规则, 输入值, 回调函数) => {
        const 数据 = cmp_数据格式化.value.Map_全部数据.get(输入值);

        if (数据 && 数据.类型 === "分类") {
          回调函数();
        }

        return 回调函数(new Error("分类 不存在！"));
      },
      trigger: "blur",
    },
  ],
  子分类ID: [
    { required: true, message: "所属 子分类 必须选择！", trigger: "blur" },
    {
      validator: (_规则, 输入值, 回调函数) => {
        const 数据 = cmp_数据格式化.value.Map_全部数据.get(输入值);

        if (数据 && 数据.类型 === "子分类") {
          if (数据.父级ID !== rea_表单数据.分类ID) {
            return 回调函数(new Error("该 子分类 不属于所选分类！"));
          }
          回调函数();
        }

        return 回调函数(new Error("子分类 不存在！"));
      },
      trigger: "blur",
    },
  ],
  文件夹ID: [
    {
      validator: (_规则, 输入值, 回调函数) => {
        if (!输入值) {
          回调函数();
        }
        const 数据 = cmp_数据格式化.value.Map_全部数据.get(输入值);

        if (数据 && 数据.类型 === "文件夹") {
          if (数据.父级ID !== rea_表单数据.子分类ID) {
            return 回调函数(new Error("该 文件夹 不属于所选子分类！"));
          }
          回调函数();
        }

        return 回调函数(new Error("文件夹 不存在！"));
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
    return;
  }

  if (!ref_表单实例.value) return;
  try {
    await ref_表单实例.value.validate();

    let 父级ID: number | null = null;
    if (rea_表单数据.文件夹ID) {
      父级ID = rea_表单数据.文件夹ID;
    } else if (rea_表单数据.子分类ID) {
      父级ID = rea_表单数据.子分类ID;
    } else {
      父级ID = rea_表单数据.分类ID;
    }

    const 父级数据 = cmp_数据格式化.value.Map_全部数据.get(父级ID!);
    if (!父级数据) {
      ElMessage.error(`所选新父级不存在！`);
      return;
    }
    if (父级数据.类型 !== "子分类" && 父级数据.类型 !== "文件夹") {
      ElMessage.error(`导航的父级必须是 [子分类] 或 [文件夹]`);
      return;
    }

    if (父级ID === rea_弹窗_操作.当前.父级ID) {
      ElMessage.warning(`父级无变化！`);
      return;
    }

    let 路径 = "";
    switch (rea_弹窗_操作.类型) {
      case "导航":
        路径 = `nav/${rea_弹窗_操作.当前.ID}/move/${父级ID}`;
        break;
      case "文件夹":
        路径 = `folder/${rea_弹窗_操作.当前.ID}/move/${父级ID}`;
        break;
    }

    const 请求结果 = await fn发送请求("patch", 路径);
    if (!请求结果.状态) return;

    const 数据索引 = ref_所有导航数据.value.findIndex((项) => 项.ID === rea_弹窗_操作.当前.ID);
    if (数据索引 !== -1) {
      ref_所有导航数据.value[数据索引].父级ID = 父级ID!;
    } else {
      console.error(
        `[${rea_弹窗_操作.类型}] ${rea_弹窗_操作.当前.名称} 本地更新失败，重新获取全部数据`,
      );
      fn获取所有数据();
    }

    ElMessage.success(`[${rea_弹窗_操作.类型}] 移动成功`);
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
    :title="`移动 [${rea_弹窗_操作.类型}] ${rea_弹窗_操作.当前.名称}`"
    style="width: var(--操作-弹窗-宽度)"
    class="操作-移动-弹窗"
    body-class="弹窗内容"
  >
    <el-divider v-if="rea_弹窗_操作.层级.length !== 0">
      ↓ 当前 [{{ rea_弹窗_操作.类型 }}] 的父级 ↓
    </el-divider>

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

    <el-divider> ↓ 当前 [{{ rea_弹窗_操作.类型 }}] ↓ </el-divider>
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

    <el-divider>
      <el-tag> ↓ 请重新选择该 [{{ rea_弹窗_操作.类型 }}] 的父级 ↓ </el-tag>
    </el-divider>

    <el-form
      ref="ref_表单实例"
      class="表单"
      :model="rea_表单数据"
      :rules="rul_校验规则"
      label-width="auto"
    >
      <el-form-item label="分类" prop="分类ID">
        <el-select v-model="rea_表单数据.分类ID" placeholder="请选择分类">
          <el-option
            v-for="(分类, 索引) in cmp_数据格式化.分类列表"
            :key="分类.ID"
            :label="`${索引 + 1} ⇛ ${分类.名称}${分类.描述 ? ` · ${分类.描述}` : ''}`"
            :value="分类.ID"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="子分类" prop="子分类ID">
        <el-select v-model="rea_表单数据.子分类ID" placeholder="请选择子分类">
          <el-option
            v-for="(子分类, 索引) in cmp_数据格式化.Map_层级数据.get(rea_表单数据.分类ID!) || []"
            :key="子分类.ID"
            :label="`${索引 + 1} ⇛ ${子分类.名称}${子分类.描述 ? ` · ${子分类.描述}` : ''}`"
            :value="子分类.ID"
          />
        </el-select>
      </el-form-item>

      <el-form-item v-if="rea_弹窗_操作.类型 === '导航'" label="文件夹" prop="文件夹ID">
        <el-select v-model="rea_表单数据.文件夹ID" placeholder="请选择文件夹" clearable>
          <template
            v-for="(导航或文件夹, 索引) in cmp_数据格式化.Map_层级数据.get(
              rea_表单数据.子分类ID!,
            ) || []"
          >
            <el-option
              v-if="导航或文件夹.类型 === '文件夹'"
              :key="导航或文件夹.ID"
              :label="`${索引 + 1} ⇛ ${导航或文件夹.名称}${导航或文件夹.描述 ? ` · ${导航或文件夹.描述}` : ''}`"
              :value="导航或文件夹.ID"
            />
          </template>
        </el-select>
      </el-form-item>

      <div style="display: flex; justify-content: center">
        <el-button @click="fn提交" type="primary">确定</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
