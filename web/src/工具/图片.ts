import type { t_返回 } from "@公共代码/类型";

type t_图片尺寸 = {
  宽: number;
  高: number;
};

/**
 * 获取图片尺寸
 * @参数 文件 需要校验的文件
 * @返回 通用返回模板
 */
export const fn获取图片尺寸 = (文件: File): Promise<t_返回<t_图片尺寸>> =>
  new Promise<t_返回<t_图片尺寸>>((resolve) => {
    // 没有文件直接返回，避免后面创建无效地址
    if (!文件) {
      resolve({
        状态: false,
        信息: "文件不存在",
      });
      return;
    }

    // 部分环境（如 SSR、Node）没有这些浏览器 API
    if (typeof URL === "undefined" || typeof Image === "undefined") {
      resolve({
        状态: false,
        信息: "当前环境不支持读取图片尺寸",
      });
      return;
    }

    let 图片地址: string;
    try {
      图片地址 = URL.createObjectURL(文件);
    } catch {
      resolve({
        状态: false,
        信息: "创建图片临时地址失败",
      });
      return;
    }

    const 图片: HTMLImageElement = new Image();

    /** 释放临时地址，防止内存泄漏 */
    const 释放地址 = (): void => {
      URL.revokeObjectURL(图片地址);
    };

    图片.onload = (): void => {
      const 尺寸: t_图片尺寸 = {
        宽: 图片.naturalWidth,
        高: 图片.naturalHeight,
      };
      释放地址();

      // 极少数情况会加载成功但宽高为 0，视为无效图片
      if (!尺寸.宽 || !尺寸.高) {
        resolve({
          状态: false,
          信息: "图片宽高为 0 或不存在，可能不是有效图片",
        });
        return;
      }

      resolve({
        状态: true,
        内容: 尺寸,
      });
    };

    图片.onerror = (): void => {
      释放地址();
      resolve({
        状态: false,
        信息: "图片加载或解码失败",
      });
    };

    图片.src = 图片地址;
  });
