<script setup lang="ts">
import { ref } from "vue";
import { ref_是内网, 本地存储前缀 } from "../../全局共享数据";

const ref_是外网 = ref(!ref_是内网.value);

const fn状态切换 = () => {
  ref_是内网.value = !ref_是外网.value;
  localStorage.setItem(`${本地存储前缀}是内网`, ref_是内网.value.toString());
};
</script>

<template>
  <Teleport to="body">
    <div id="id_内外网切换">
      <el-switch
        v-model="ref_是外网"
        @change="fn状态切换"
        size="large"
        inline-prompt
        style="
          --el-switch-off-color: #27b064;
          --el-switch-on-color: #0c84e9;
          transform: scale(1.3);
          margin: 0;
        "
        active-text="外网"
        inactive-text="内网"
      >
        <template #inactive-action>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              fill="currentColor"
              d="M14 3a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1v2h8v2h-3v2h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1v-2H8v2h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4l.005-.102A1 1 0 0 1 5 15h1v-2H3v-2h8V9h-1a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm2 16h2v-2h-2zM6 19h2v-2H6zm5-12h2V5h-2z"
            />
          </svg>
        </template>
        <template #active-action>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <path d="M6 9a6 6 0 1 0 12 0A6 6 0 0 0 6 9" />
              <path
                d="M12 3q2 .5 2 6c0 5.5-.667 5.667-2 6m0-12q-2 .5-2 6c0 5.5.667 5.667 2 6M6 9h12M3 20h7m4 0h7m-11 0a2 2 0 1 0 4 0a2 2 0 0 0-4 0m2-5v3"
              />
            </g>
          </svg>
        </template>
      </el-switch>
    </div>
  </Teleport>
</template>

<style>
#id_内外网切换 {
  position: fixed;
  top: var(--悬浮按钮--边距);
  right: calc(var(--悬浮按钮--边距) * 2 + var(--悬浮按钮-宽度));

  height: var(--悬浮按钮-宽度);
  width: 70px;

  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  z-index: 10;
  .el-switch__action {
    padding: 1px;
  }
}
</style>
