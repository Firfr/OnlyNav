<script setup lang="ts">
defineOptions({ name: "组件/层级或导航操作.vue" });
import {
  fn默认值_导航,
  fn默认值_层级,
  type t_分类,
  type t_子分类,
  type t_导航,
  type t_文件夹,
} from "@公共代码/类型";
import {
  ref_是否显示_层级或导航_操作,
  rea层级与导航数据,
  fn增加数据同步到本地,
  fn修改数据同步到本地,
} from "../全局响应式数据";
import { fn发送请求 } from "../工具/请求";
import type { FormInstance, FormRules } from "element-plus";
import type { t_操作方式 } from "../类型";
import { fn图标地址转换 } from "../工具/工具";
import Vue_选择图标 from "./选择图标.vue";

const ref_表单实例 = ref<FormInstance>();
const ref_表单数据 = ref<t_导航>(fn默认值_导航());
const rul_校验规则 = reactive<FormRules<t_导航>>({
  公开: [{ required: true, type: "boolean", message: "请选择公开或私有", trigger: "change" }],
  名称: [
    { required: true, message: "请输入名称", trigger: "blur" },
    { pattern: /^\S*$/, message: "不能包含空白字符", trigger: "blur" },
  ],
  描述: [{ whitespace: true, message: "不能输入纯空格", trigger: "blur" }],
  父级ID: [{ required: true, type: "integer", message: "请选择父级", trigger: "change" }],
  图标类型: [
    { required: true, message: "请输入图标类型", trigger: "blur" },
    {
      type: "enum",
      enum: ["无", "文字", "图片"],
      message: "只能从 无、表情符号、图片 中选择",
      trigger: "blur",
    },
  ],
  图标内容: [
    { required: true, message: "请输入表情符号", trigger: "blur" },
    { min: 1, max: 2, message: "字符串长度不能超过两个！", trigger: "blur" },
    { pattern: /^\S*$/, message: "不能包含空白字符", trigger: "blur" },
  ],
  图标地址: [
    { required: true, message: "请输入图标地址！", trigger: "blur" },
    { pattern: /^\S*$/, message: "不能包含空白字符！", trigger: "blur" },
    { min: 1, message: "请输入图标地址！", trigger: "blur" },
  ],
  内网地址: [{ pattern: /^\S*$/, message: "不能包含空白字符！", trigger: "blur" }],
  外网地址: [{ pattern: /^\S*$/, message: "不能包含空白字符！", trigger: "blur" }],
});

const fn更新表单数据 = () => {
  console.debug(
    `组件 层级或导航操作.vue  rea层级与导航数据: `,
    `操作：${rea层级与导航数据.操作方式} 类型：${rea层级与导航数据.类型} `,
    `分类ID：${rea层级与导航数据.分类.ID} 子类ID：${rea层级与导航数据.子分类.ID} 文件夹ID：${rea层级与导航数据.文件夹.ID} 导航ID：${rea层级与导航数据.导航.ID}`,
  );
  if (rea层级与导航数据.操作方式 === "删除") {
    console.log(`组件 层级或导航操作.vue 不处理删除事件！ `);
    return;
  }

  if (!rea层级与导航数据.操作方式 || !rea层级与导航数据.类型) {
    ref_表单数据.value = fn默认值_导航();
    return;
  }

  if (rea层级与导航数据.操作方式 === "添加") {
    if (rea层级与导航数据.类型 === "分类") {
      ref_表单数据.value = fn默认值_层级("分类") as unknown as t_导航;
    } else if (rea层级与导航数据.类型 === "子分类") {
      ref_表单数据.value = fn默认值_层级("子分类") as unknown as t_导航;
    } else if (rea层级与导航数据.类型 === "文件夹") {
      ref_表单数据.value = fn默认值_层级("文件夹") as unknown as t_导航;
    } else {
      ref_表单数据.value = fn默认值_导航();
    }

    return;
  }

  ref_表单数据.value = { ...(rea层级与导航数据.当前数据 as t_导航) };
};
const cmp_所用数据 = computed(() => {
  let 返回值: {
    层级: (t_分类 | t_子分类 | t_文件夹)[];
    链接: string;
  } = { 层级: [], 链接: "-" };
  const 类型 = rea层级与导航数据.类型;

  const 操作方式 = rea层级与导航数据.操作方式;
  const 本组件显示状态 = ref_是否显示_层级或导航_操作.value;
  console.debug(`组件 层级或导航操作.vue 显示状态：${本组件显示状态}`);
  fn更新表单数据();
  if (!操作方式 || !类型 || 操作方式 === "删除") return 返回值;

  if (类型 === "分类") {
    if (操作方式 === "添加") {
      返回值.链接 = "/cate";
    } else {
      返回值.链接 = `/cate/${rea层级与导航数据.分类.ID}`;
    }
  } else if (类型 === "子分类") {
    if (操作方式 === "添加") {
      返回值.链接 = `/sub_cate/super/${rea层级与导航数据.分类.ID}`;
    } else {
      返回值.链接 = `/sub_cate/${rea层级与导航数据.子分类.ID}`;
    }
  } else if (类型 === "文件夹") {
    if (操作方式 === "添加") {
      返回值.链接 = `/folder/super/${rea层级与导航数据.子分类.ID}`;
    } else {
      返回值.链接 = `/folder/${rea层级与导航数据.文件夹.ID}`;
    }
  } else if (类型 === "子分类_导航") {
    if (操作方式 === "添加") {
      返回值.链接 = `/nav/super/${rea层级与导航数据.子分类.ID}`;
    } else {
      返回值.链接 = `/nav/${rea层级与导航数据.导航.ID}`;
    }
  } else {
    if (操作方式 === "添加") {
      返回值.链接 = `/nav/super/${rea层级与导航数据.文件夹.ID}`;
    } else {
      返回值.链接 = `/nav/${rea层级与导航数据.导航.ID}`;
    }
  }

  if (类型 === "子分类" || 类型 === "文件夹" || 类型 === "子分类_导航" || 类型 === "文件夹_导航") {
    返回值.层级.push(rea层级与导航数据.分类);
  }

  if (类型 === "文件夹" || 类型 === "子分类_导航" || 类型 === "文件夹_导航") {
    返回值.层级.push(rea层级与导航数据.子分类);
  }

  if (类型 === "文件夹_导航") {
    返回值.层级.push(rea层级与导航数据.文件夹);
  }

  return 返回值;
});

const fn提交 = async (操作方式: t_操作方式, 表单实例: FormInstance | undefined) => {
  if (!操作方式 || 操作方式 === "查看" || !rea层级与导航数据.类型) return;
  if (!表单实例) return;

  try {
    await 表单实例.validate();
    const 发送数据: Partial<t_导航> = {};

    if (rea层级与导航数据.类型 === "子分类_导航" || rea层级与导航数据.类型 === "文件夹_导航") {
      if (!ref_表单数据.value.内网地址 && !ref_表单数据.value.外网地址) {
        ElMessage.error({
          message: "内网地址和外网地址不能同时为空！",
          placement: "bottom-right",
        });
        return;
      }
    }

    if (操作方式 === "添加") {
      发送数据.名称 = ref_表单数据.value.名称;
      发送数据.描述 = ref_表单数据.value.描述;
      发送数据.图标类型 = ref_表单数据.value.图标类型;
      发送数据.公开 = ref_表单数据.value.公开;

      if (ref_表单数据.value.图标类型 === "图片") 发送数据.图标地址 = ref_表单数据.value.图标地址;
      if (ref_表单数据.value.图标类型 === "文字") 发送数据.图标内容 = ref_表单数据.value.图标内容;
      if (rea层级与导航数据.类型 === "子分类_导航" || rea层级与导航数据.类型 === "文件夹_导航") {
        发送数据.内网地址 = ref_表单数据.value.内网地址;
        发送数据.外网地址 = ref_表单数据.value.外网地址;
      }
    } else {
      if (ref_表单数据.value.名称 !== rea层级与导航数据.当前数据.名称) {
        发送数据.名称 = ref_表单数据.value.名称;
      }
      if (ref_表单数据.value.描述 !== rea层级与导航数据.当前数据.描述) {
        发送数据.描述 = ref_表单数据.value.描述;
      }
      if (ref_表单数据.value.公开 !== rea层级与导航数据.当前数据.公开) {
        发送数据.公开 = ref_表单数据.value.公开;
      }
      if (ref_表单数据.value.图标类型 !== rea层级与导航数据.当前数据.图标类型) {
        发送数据.图标类型 = ref_表单数据.value.图标类型;
      }

      if (
        ref_表单数据.value.图标类型 === "图片" &&
        ref_表单数据.value.图标地址 !== rea层级与导航数据.当前数据.图标地址
      ) {
        发送数据.图标地址 = ref_表单数据.value.图标地址;
      }
      if (
        ref_表单数据.value.图标类型 === "文字" &&
        ref_表单数据.value.图标内容 !== rea层级与导航数据.当前数据.图标内容
      ) {
        发送数据.图标内容 = ref_表单数据.value.图标内容;
      }

      if (rea层级与导航数据.类型 === "子分类_导航" || rea层级与导航数据.类型 === "文件夹_导航") {
        if (ref_表单数据.value.内网地址 !== (rea层级与导航数据.当前数据 as t_导航).内网地址) {
          发送数据.内网地址 = ref_表单数据.value.内网地址;
        }
        if (ref_表单数据.value.外网地址 !== (rea层级与导航数据.当前数据 as t_导航).外网地址) {
          发送数据.外网地址 = ref_表单数据.value.外网地址;
        }
      }
    }

    // console.log("发送数据:", 发送数据);

    if (Object.keys(发送数据).length === 0) {
      ElMessage({
        message: `数据无变化！`,
        placement: "bottom-right",
      });
      return;
    }

    const 请求结果 = await fn发送请求(
      操作方式 === "添加" ? "POST" : "PATCH",
      cmp_所用数据.value.链接,
      发送数据,
    );

    if (!请求结果.状态) return;

    ElMessage.success({
      message: `${操作方式} ${rea层级与导航数据.当前数据.类型} 成功`,
      placement: "bottom-right",
    });

    try {
      if (操作方式 === "添加") {
        fn增加数据同步到本地(请求结果.内容);
      } else {
        fn修改数据同步到本地(rea层级与导航数据.当前数据.ID, 发送数据);
      }
      ref_是否显示_层级或导航_操作.value = false;
    } catch (e) {
      ElMessage.error({
        message: `${操作方式} ${rea层级与导航数据.当前数据.类型} 写入本地缓存失败！`,
        placement: "bottom-right",
      });
      console.error(`${操作方式} ${rea层级与导航数据.当前数据.类型} 写入本地缓存失败！`, e);
    }
  } catch (校验失败详情) {
    console.log("校验失败!", 校验失败详情);
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="层级或导航操作">
      <div
        class="层级或导航操作"
        v-show="ref_是否显示_层级或导航_操作"
        @click.self="ref_是否显示_层级或导航_操作 = false"
      >
        <el-form
          class="表单"
          ref="ref_表单实例"
          :model="ref_表单数据"
          :rules="rul_校验规则"
          label-width="auto"
        >
          <el-form-item
            v-for="层级数据 in cmp_所用数据.层级"
            :label="层级数据.类型"
            style="margin-bottom: 0"
          >
            <el-tag v-if="层级数据.公开" type="success">公开</el-tag>
            <el-tag v-else type="primary">私有</el-tag>
            <span style="width: var(--大圆角)"></span>
            {{ 层级数据.名称 }}
            {{ 层级数据.描述 ? ` • ${层级数据.描述}` : "" }}
          </el-form-item>

          <hr v-if="cmp_所用数据.层级.length" />

          <div class="信息聚合">
            <div class="信息">
              <div style="width: 100px">
                <el-form-item label="ID">
                  {{ rea层级与导航数据.操作方式 === "添加" ? "-" : ref_表单数据.ID }}
                </el-form-item>
                <el-form-item label="排序">
                  {{ rea层级与导航数据.操作方式 === "添加" ? "-" : ref_表单数据.排序 }}
                </el-form-item>
              </div>

              <div style="flex: 1">
                <el-form-item label="类型"> {{ ref_表单数据.类型 }} </el-form-item>
                <el-form-item label="公开">
                  <el-switch
                    v-model="ref_表单数据.公开"
                    :class="{ 不可交互: rea层级与导航数据.操作方式 === '查看' }"
                    inline-prompt
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #409eff"
                    active-text="是"
                    inactive-text="否"
                  />
                  <span v-if="rea层级与导航数据.类型 !== '分类'" style="margin-left: 10px">
                    同时受到父级的影响
                  </span>
                </el-form-item>
              </div>
            </div>

            <div class="图标展示" v-show="ref_表单数据.图标类型 !== '无'">
              <div class="表情符号" v-if="ref_表单数据.图标类型 === '文字'">
                {{ [...(ref_表单数据.图标内容 ?? "")][0] }}
              </div>

              <el-image
                v-if="ref_表单数据.图标类型 === '图片'"
                :src="fn图标地址转换(ref_表单数据.图标地址)"
              >
                <template #error>
                  <div class="图片加载失败">
                    <span>加载</span>
                    <span>失败</span>
                  </div>
                </template>
              </el-image>
            </div>
          </div>

          <el-form-item label="名称" prop="名称">
            <el-input
              :readonly="rea层级与导航数据.操作方式 === '查看'"
              v-model="ref_表单数据.名称"
              placeholder="请输入子名称"
            />
          </el-form-item>

          <el-form-item label="描述" prop="描述">
            <el-input
              :readonly="rea层级与导航数据.操作方式 === '查看'"
              v-model="ref_表单数据.描述"
              placeholder="请输入子描述"
            />
          </el-form-item>

          <el-form-item label="图标类型" prop="图标类型">
            <el-radio-group
              :disabled="rea层级与导航数据.操作方式 === '查看'"
              class="图标类型"
              v-model="ref_表单数据.图标类型"
            >
              <el-radio value="无">无</el-radio>
              <el-radio value="文字">文字</el-radio>
              <el-radio value="图片">图片</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="ref_表单数据.图标类型 === '无'" label="图标" class="图标设置">
            无图标
          </el-form-item>

          <el-form-item
            v-else-if="ref_表单数据.图标类型 === '文字'"
            prop="图标内容"
            label="图标"
            class="图标设置"
          >
            <div style="margin-right: var(--大圆角)">使用表情符号作为图标</div>
            <el-input
              :readonly="rea层级与导航数据.操作方式 === '查看'"
              class="表情符号输入"
              v-model="ref_表单数据.图标内容"
              maxlength="2"
            />
          </el-form-item>

          <el-form-item v-else prop="图标地址" label="图标" class="图标设置">
            <div class="图标选择">
              <el-input readonly v-model="ref_表单数据.图标地址" placeholder="请选择图片···" />
              <el-tooltip raw-content placement="bottom" effect="light">
                <template #content>
                  <div class="层级或导航操作_选择图标">
                    <Vue_选择图标
                      v-model:ref_选中图标="ref_表单数据.图标地址"
                      const_宽度="320px"
                      const_高度="400px"
                    />
                  </div>
                </template>
                <div class="图标选择-悬浮层"></div>
              </el-tooltip>
            </div>
          </el-form-item>

          <template
            v-if="
              rea层级与导航数据.类型 === '子分类_导航' || rea层级与导航数据.类型 === '文件夹_导航'
            "
          >
            <el-form-item label=" " style="margin-bottom: var(--大圆角)">
              <el-tag type="warning" style="margin: auto"
                >这里不对输入格式做校验！仅无空格即可。</el-tag
              >
            </el-form-item>

            <el-form-item label="内网地址" prop="内网地址">
              <el-input
                :readonly="rea层级与导航数据.操作方式 === '查看'"
                v-model="ref_表单数据.内网地址"
                placeholder="请输入子内网地址"
              />
            </el-form-item>

            <el-form-item label="外网地址" prop="外网地址">
              <el-input
                :readonly="rea层级与导航数据.操作方式 === '查看'"
                v-model="ref_表单数据.外网地址"
                placeholder="请输入子外网地址"
              />
            </el-form-item>
          </template>

          <div
            v-if="rea层级与导航数据.操作方式 !== '查看'"
            style="display: flex; justify-content: center"
          >
            <el-button
              @click="fn提交(rea层级与导航数据.操作方式 as t_操作方式, ref_表单实例)"
              :type="rea层级与导航数据.操作方式 === '添加' ? 'success' : 'primary'"
              >{{ rea层级与导航数据.操作方式 }}</el-button
            >
          </div>
        </el-form>
      </div>
    </Transition>
    <Transition name="层级或导航操作_遮罩">
      <div class="层级或导航操作_遮罩" v-show="ref_是否显示_层级或导航_操作"></div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* 样式在文件 css/层级或导航操作.css 并在 style.css 中导入 */
</style>
