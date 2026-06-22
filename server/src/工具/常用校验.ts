import { t_返回 } from "@公共代码/类型";

export const fn正整数校验 = (待校验内容: any): t_返回 => {
  if (typeof 待校验内容 !== "number") return { 状态: false, 信息: "不是数字" };
  if (!Number.isInteger(待校验内容)) return { 状态: false, 信息: "不是整数" };
  if (待校验内容 < 0) return { 状态: false, 信息: "不能小于0" };
  return { 状态: true };
};

/**
 * 校验字符串长度和空格/不可见字符
 * @参数 {代校验值} 任意类型
 * @参数 {对象} 配置
 * @参数 {数字} [配置.最小长度] - 最小长度（可选）
 * @参数 {数字} [配置.最大长度] - 最大长度（可选）
 * @参数 {布尔值} [配置.空格=false] - 是否允许空格和其他不可见字符（换行、制表符等），默认 false
 * @返回 {boolean} - 校验通过返回 true，否则返回 false
 */
export const fn字符串校验 = (
  待校验值: any,
  配置: { 最小长度?: number; 最大长度?: number; 空格?: boolean },
) => {
  if (typeof 待校验值 !== "string") {
    return false;
  }

  if (!配置.空格) {
    if (/\s/.test(待校验值)) {
      return false;
    }
  }

  if (配置.最小长度 !== undefined && 待校验值.length < 配置.最小长度) {
    return false;
  }

  if (配置.最大长度 !== undefined && 待校验值.length > 配置.最大长度) {
    return false;
  }

  return true;
};
