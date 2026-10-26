import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import jwt from "jsonwebtoken";
import { const_配置 } from "../启动前检查";
import fn创建日志实例 from "../工具/日志";
import { fn普通凭据, fn超长凭据 } from "../数据/凭据";
import { t_返回 } from "@公共代码/类型";

const log = fn创建日志实例("中间价/登录状态检查.ts");

const fn秒时间戳转换 = (秒时间戳: number) => {
  const date = new Date((秒时间戳 + 8 * 3600) * 1000);
  const 年 = date.getUTCFullYear();
  const 月 = String(date.getUTCMonth() + 1).padStart(2, "0");
  const 日 = String(date.getUTCDate()).padStart(2, "0");
  const 时 = String(date.getUTCHours()).padStart(2, "0");
  const 分 = String(date.getUTCMinutes()).padStart(2, "0");
  const 秒 = String(date.getUTCSeconds()).padStart(2, "0");

  return `${年}年${月}月${日}日 ${时}:${分}:${秒}`;
};

const fn登录状态 = (c: Context): t_返回<string> => {
  const 令牌 = getCookie(c, const_配置.Cookie_名称_令牌) || "";
  const 是否超长凭据 = getCookie(c, const_配置.Cookie_名称_长期登录标识) === "true" ? true : false;
  if (!令牌) {
    log.debug(`请求 方式：${c.req.method} 路径：${c.req.url}`);
    log.trace("请求头 Cookie:", getCookie(c));

    return { 状态: false, 信息: "请登录！" };
  }

  if (!const_配置.长期登录凭据 && 是否超长凭据) {
    log.warn("未配置 长期登录凭据 ，不允许 长期登录!");
    return { 状态: false, 信息: "未配置 长期登录凭据 ，不允许 长期登录!" };
  }

  try {
    const 令牌解码 = jwt.verify(令牌, const_配置.JWT) as {
      用户名: string;
      iat: number; // 令牌的签发时间
      exp: number; // 令牌的过期时间
    };
    c.set("过期时间", fn秒时间戳转换(令牌解码.exp));
    log.trace(
      `用户名: ${令牌解码.用户名}`,
      `签发时间: ${fn秒时间戳转换(令牌解码.iat)}`,
      `过期时间: ${fn秒时间戳转换(令牌解码.exp)}`,
    );
  } catch (e: any) {
    if (e.name === "TokenExpiredError") {
      log.warn("登录已过期");
      return { 状态: false, 信息: "请登录！" };
    }
    log.warn("无效的令牌");
    return { 状态: false, 信息: "请登录！" };
  }

  if (是否超长凭据) {
    log.debug("本次凭据为：超长凭据");
    if (!fn超长凭据.查找(令牌)) {
      log.warn(`令牌失效，被其他设备顶下线`);
      return { 状态: false, 信息: "请登录！" };
    }
    return { 状态: true, 内容: "已登录！" };
  }

  log.debug("本次凭据为：普通凭据");
  if (!fn普通凭据.查找(令牌)) {
    log.warn(`令牌失效，被其他设备顶下线`);
    return { 状态: false, 信息: "请登录！" };
  }
  return { 状态: true, 内容: "已登录！" };
};

export const fn认证 = (c: Context, next: Next) => {
  const 路径 = c.req.path.replace(/\/+$/, "");

  if (路径 === "/api/auth/login" && c.req.method.toUpperCase() === "POST") return next();
  if (路径 === "/api/auth/long-login" && c.req.method.toUpperCase() === "GET") return next();

  c.set("登录", false);
  const 登录状态 = fn登录状态(c);

  if (!登录状态.状态) {
    if (路径 === "/api/all-nav" && c.req.method.toUpperCase() === "GET") {
      log.debug("未登录");
      c.header("Cache-Control", "no-cache, no-store, must-revalidate");
      c.header("Pragma", "no-cache");
      c.header("Expires", "0");
      return next();
    } else {
      throw new HTTPException(401, { message: 登录状态.信息 });
    }
  }

  c.set("登录", true);
  log.debug("令牌有效");
  c.header("Cache-Control", "no-cache, no-store, must-revalidate");
  c.header("Pragma", "no-cache");
  c.header("Expires", "0");
  return next();
};

export default fn认证;
