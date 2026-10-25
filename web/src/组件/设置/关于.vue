<script setup lang="ts">
import { ref } from "vue";
import type { ImageInst } from "naive-ui";
import 图标_GitHub from "../../assets/github.svg";
import 图标_Gitee from "../../assets/gitee.svg";
import 图标_B站 from "../../assets/哔哩哔哩.svg";
import 图标_阿里云 from "../../assets/阿里云.svg";
import 图标_腾讯云 from "../../assets/腾讯云.svg";
import 图标_雨云 from "../../assets/雨云.png";
import 图片_收款码_微信 from "../../assets/收款码-微信.png";
import 图片_收款码_支付宝 from "../../assets/收款码-支付宝.jpg";

const ref_收款码_微信 = ref<ImageInst>();
const ref_收款码_支付宝 = ref<ImageInst>();
</script>

<template>
  <div id="id_设置-关于">
    <div style="display: flex; flex-direction: column; align-items: center">
      <h1 style="margin: 0 0 8px 0">只有导航</h1>
      <h3 style="margin-top: 0; margin-bottom: 10px">OnlyNav</h3>
    </div>
    <div style="font-size: 18px; text-align: center">
      <div style="margin-bottom: 6px">开发不易，期待您的打赏！</div>
      <div style="font-size: 14px; text-align: center">
        <!-- GitHub -->
        <el-tooltip placement="top">
          <template #content>
            期待点亮 Start <br />
            有问题或建议，请再此处反馈。
          </template>
          <a target="_blank" href="https://github.com/Firfr/OnlyNav">
            <img :src="图标_GitHub" alt="" />
            <div>GitHub</div>
          </a>
        </el-tooltip>
        <!-- Gitee -->
        <el-tooltip placement="top">
          <template #content>
            期待点亮 Start <br />
            有问题或建议，请再此处反馈。
          </template>
          <a target="_blank" href="https://gitee.com/firfe/OnlyNav">
            <img :src="图标_Gitee" alt="" />
            <div>Gitee</div>
          </a>
        </el-tooltip>
        <!-- B站 -->
        <el-tooltip placement="top">
          <template #content>
            期待您的关注！ <br />
            私信或评论可能回复不及时。
          </template>
          <a target="_blank" href="https://space.bilibili.com/17547201/lists">
            <img :src="图标_B站" alt="" />
            <div>哔哩哔哩</div>
          </a>
        </el-tooltip>
        <!-- 微信 -->
        <el-tooltip content="点击此处，微信打赏！" placement="top">
          <a @click="ref_收款码_微信?.showPreview()">
            <n-image
              ref="ref_收款码_微信"
              style="width: 100%; aspect-ratio: 1/1; text-align: center"
              :src="图片_收款码_微信"
            />
            <div>微信</div>
          </a>
        </el-tooltip>
        <!-- 支付宝 -->
        <el-tooltip content="点击此处，支付宝打赏！" placement="top">
          <a @click="ref_收款码_支付宝?.showPreview()">
            <n-image
              ref="ref_收款码_支付宝"
              style="width: 100%; aspect-ratio: 1/1; text-align: center"
              :src="图片_收款码_支付宝"
            />
            <div>支付宝</div>
          </a>
        </el-tooltip>
      </div>
    </div>
    <div style="margin-top: 10px">
      <div>通过下面优惠连接购买服务器来支持我！</div>
      <div class="推广连接">
        <n-tooltip trigger="hover">
          <template #trigger>
            <a
              class="链接图标"
              href="https://www.aliyun.com/minisite/goods?userCode=napc1zre"
              target="_blank"
            >
              <img :src="图标_阿里云" alt="" />
            </a>
          </template>
          <div class="文字居中">通过推广连接购买<br />阿里云 服务来支持我！</div>
        </n-tooltip>
        <!-- 腾讯云 -->
        <n-tooltip trigger="hover">
          <template #trigger>
            <a class="链接图标" href="https://curl.qcloud.com/RJz7oNIa" target="_blank">
              <img :src="图标_腾讯云" alt="" />
            </a>
          </template>
          <div class="文字居中">通过推广连接购买<br />腾讯云 服务来支持我！</div>
        </n-tooltip>
        <!-- 雨云 -->
        <n-tooltip trigger="hover">
          <template #trigger>
            <a class="链接图标" href="https://www.rainyun.com/MTA0OTAwMw==_" target="_blank">
              <img :src="图标_雨云" alt="" />
            </a>
          </template>
          <div class="文字居中">通过推广连接购买<br />雨云 服务来支持我！</div>
        </n-tooltip>
      </div>
    </div>
    <div style="width: 80%; overflow: auto">
      <p>关于可私有部署的个人导航项目，我体验过很多。 但是遇到了各种问题，不符合我的实际需求：</p>
      <p>
        无关功能太多，花里胡哨；
        分类层级太少，不能嵌套；导航必须设置图标；没有对普通登录和长期登录做区分。
        重启后登录状态丢失，无法自定义同时登录的数量。
      </p>
      <p>于是我决定根据我本人的需求开发一个自己的导航项目：只有导航。</p>
      <p>
        正如项目的名字“只有导航”一样，只专注于个人网址的收藏和展示。
        让网址收藏不在局限于浏览器的收藏夹！提供多层级设置，方便对不同的导航进行聚合分类。
        登录方式有普通登录和长期登录可选，重启后登录状态不丢失。
        可以自定义每种登录方式的过期时间，以及同时登录的数量。
      </p>
    </div>
  </div>
</template>
