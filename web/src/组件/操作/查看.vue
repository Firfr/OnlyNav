<script setup lang="ts">
import { computed, ref } from "vue";
import { fn弹窗_操作_清空, rea_弹窗_操作, rea_登录信息 } from "../../全局共享数据";
import Vue_图标 from "../其他/图标.vue";

const ref_显示本组件 = ref(true);
const fn关闭组件 = () => {
  fn弹窗_操作_清空();
};

const cmp_标题 = computed(() => {
  let 返回值 = "";
  for (let 索引 = 0; 索引 < rea_弹窗_操作.层级.length; 索引++) {
    const 层级 = rea_弹窗_操作.层级[索引];
    返回值 += `${层级.类型} > `;
  }
  返回值 += `${rea_弹窗_操作.类型}`;
  return 返回值;
});
</script>

<template>
  <el-dialog
    append-to-body
    v-model="ref_显示本组件"
    align-center
    @closed="fn关闭组件"
    :title="cmp_标题"
    class="操作-查看-弹窗"
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
        v-if="rea_登录信息.状态 && rea_弹窗_操作.当前.图标类型 !== '无'"
        class="图标"
        :数据="rea_弹窗_操作.当前"
      />
    </div>

    <div class="行信息">
      <div class="左侧标签">名称</div>
      <div class="内容">{{ rea_弹窗_操作.当前.名称 }}</div>
    </div>

    <div class="行信息">
      <div class="左侧标签">描述</div>
      <div class="内容">{{ rea_弹窗_操作.当前.描述 || "无" }}</div>
    </div>

    <div class="行信息">
      <div class="左侧标签">图标类型</div>
      <div class="内容">{{ rea_弹窗_操作.当前.图标类型 }}</div>
    </div>

    <div v-if="rea_弹窗_操作.当前.图标类型 === '图片'" class="行信息">
      <div class="左侧标签">图标名称</div>
      <div class="内容">{{ rea_弹窗_操作.当前.图标地址 }}</div>
    </div>

    <template v-if="rea_弹窗_操作.当前.类型 === '导航'">
      <div v-if="rea_弹窗_操作.当前.内网地址" class="行信息">
        <div class="左侧标签">内网地址</div>
        <div class="内容 选择" @click="fn剪切板写入(rea_弹窗_操作.当前.内网地址)">
          {{ rea_弹窗_操作.当前.内网地址 }}
        </div>
      </div>

      <div v-if="rea_弹窗_操作.当前.外网地址" class="行信息">
        <div class="左侧标签">外网地址</div>
        <div class="内容 选择" @click="fn剪切板写入(rea_弹窗_操作.当前.外网地址)">
          {{ rea_弹窗_操作.当前.外网地址 }}
        </div>
      </div>
    </template>
  </el-dialog>
</template>
