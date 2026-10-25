import type { t_返回 } from "@公共代码/类型";
import { fn获取图片尺寸 } from "./图片";

const 最大像素 = 1024;
const 最大字节 = 1024 * 1024; // 1M

export const fn图标校验 = async (文件: File): Promise<t_返回<string>> => {
  if (!文件.type.startsWith("image/")) {
    return {
      状态: false,
      信息: "不是图片",
    };
  }

  if (文件.size > 最大字节) {
    return {
      状态: false,
      信息: "文件大小超过 1M",
    };
  }

  const 尺寸 = await fn获取图片尺寸(文件);

  if (!尺寸.状态) {
    return {
      状态: false,
      信息: 尺寸.信息,
    };
  }

  if (尺寸.内容.高 > 最大像素) {
    return {
      状态: false,
      信息: `文件长度超出 ${最大像素} 像素`,
    };
  }

  if (尺寸.内容.宽 > 最大像素) {
    return {
      状态: false,
      信息: `文件宽度超出 ${最大像素} 像素`,
    };
  }

  return {
    状态: true,
    内容: `文件大小及尺寸符合图标要求`,
  };
};
