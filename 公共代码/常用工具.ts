/**
 * 校验字符串长度和空格/不可见字符
 * @参数 {代校验值} 任意类型
 * @参数 {对象} 配置
 * @参数 {数字} [配置.最小长度] - 最小长度（可选）
 * @参数 {数字} [配置.最大长度] - 最大长度（可选）
 * @参数 {布尔值} [配置.空格=false] - 是否允许空格和其他不可见字符（换行、制表符等），默认 false
 * @参数 {布尔值} [配置.首尾空格=false] - 字符串首位存在空格，默认 false
 * @返回 {boolean} - 校验通过返回 true，否则返回 false
 */
export const fn字符串校验 = (
  待校验值: any,
  配置?: { 最小长度?: number; 最大长度?: number; 中间空格?: boolean; 首尾空格?: boolean },
) => {
  if (typeof 待校验值 !== "string") return false;
  const 中间空格 = 配置?.中间空格 ?? false;
  const 首尾空格 = 配置?.首尾空格 ?? false;

  if (!中间空格 && /\s/.test(待校验值.trim())) return false;

  if (!首尾空格 && /^\s|\s$/.test(待校验值)) return false;

  if (配置?.最小长度 !== undefined && 待校验值.length < 配置.最小长度) return false;

  if (配置?.最大长度 !== undefined && 待校验值.length > 配置.最大长度) return false;

  return true;
};
