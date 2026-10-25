/**
 * 判断图标地址是否是外部链接，外部连接直接返回，本地图标则补全地址
 * @参数 图标地址
 * @返回 最终的图标地址
 */
export const fn图标地址转换 = (地址: string | undefined) => {
  if (!地址) {
    return 地址;
  }
  if (地址.startsWith("http://") || 地址.startsWith("https://")) {
    return 地址;
  } else {
    return `api/icon/file/${地址}`;
  }
};
