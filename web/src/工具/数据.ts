import type { t_导航和层级, t_登录状态 } from "@公共代码/类型";
import { rea_登录信息, ref_图标列表, ref_所有导航数据 } from "../全局共享数据";
import { fn发送请求 } from "./请求";

export const fn获取登录状态 = async () => {
  const 请求结果 = await fn发送请求<t_登录状态>("get", "auth/status");
  if (请求结果.状态) {
    rea_登录信息.状态 = true;
    rea_登录信息.登录方式 = 请求结果.内容.登录方式;
    rea_登录信息.过期时间 = 请求结果.内容.过期时间;
  } else {
    rea_登录信息.状态 = false;
    rea_登录信息.登录方式 = "-";
    rea_登录信息.过期时间 = "-";
  }
};

export const fn获取所有数据 = async () => {
  const 请求结果 = await fn发送请求<t_导航和层级[]>("get", "all-nav");
  if (!请求结果.状态) return;

  ref_所有导航数据.value = 请求结果.内容;
};

export const fn获取图标列表 = async () => {
  const 请求结果 = await fn发送请求<string[]>("get", "icon/list");
  if (!请求结果.状态) return;

  ref_图标列表.value = 请求结果.内容;
};
