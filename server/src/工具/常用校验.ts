import { t_返回 } from "@公共代码/类型";

export const fn正整数校验 = (待校验内容: any): t_返回<number> => {
  if (!Number.isFinite(待校验内容)) return { 状态: false, 信息: "不是常规数字" };
  if (!Number.isInteger(待校验内容)) return { 状态: false, 信息: "不是整数" };
  if (待校验内容 < 0) return { 状态: false, 信息: "不能小于0" };
  return { 状态: true, 内容: 待校验内容 };
};

const reg_用户名 = /^[\u4e00-\u9fa5a-zA-Z0-9_!@#.-]{3,32}$/;
export const fn校验用户名 = (用户名: any): t_返回<string> => {
  if (!用户名 || typeof 用户名 !== "string" || 用户名.length < 3 || 用户名.length > 32) {
    return { 状态: false, 信息: `不是长度 3-32 之间的字符串 (${用户名 || ""})` };
  }
  if (reg_用户名.test(用户名)) {
    return { 状态: true, 内容: 用户名 };
  }
  return { 状态: false, 信息: `只能包含 常见简体中文a-zA-Z0-9_!@#.- (${用户名})` };
};

export const reg_密码 = /^[a-zA-Z0-9_!@#.-]{3,32}$/;
export const fn校验密码 = (密码: any): t_返回<string> => {
  if (!密码 || typeof 密码 !== "string" || 密码.length < 3 || 密码.length > 32) {
    return { 状态: false, 信息: `不是长度 3-32 之间的字符串 (${密码 || ""})` };
  }
  if (reg_密码.test(密码)) {
    return { 状态: true, 内容: 密码 };
  }
  return { 状态: false, 信息: `只能包含 a-zA-Z0-9_!@#.- (${密码})` };
};
