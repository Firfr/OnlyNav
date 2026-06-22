export const fn随机整数 = (最大值: number, 最小值: number = 0) => {
  return Math.floor(Math.random() * 最大值) + 最小值;
};

const 随机字符串集合 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * 生成随机字符串，不传长度则随机 5~20 位
 * @参数 长度 可选，指定字符串长度
 * @返回 随机字符串
 */
export const fn随机字符串 = (长度?: number): string => {
  // 未传参则取 5-20 随机长度
  const 最终长度 = 长度 ?? fn随机整数(20, 5);

  if (!Number.isInteger(最终长度) || 最终长度 <= 0) {
    throw new Error("长度必须为正整数");
  }

  let 最终字符串 = "";
  for (let i = 0; i < 最终长度; i++) {
    const 随机字符 = fn随机整数(随机字符串集合.length);
    最终字符串 += 随机字符串集合[随机字符];
  }
  return 最终字符串;
};
