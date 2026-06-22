import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import jwt from "jsonwebtoken";
import { const_账号设置 } from "../数据/账号设置";
import fn创建日志实例 from "../工具/日志";
import { fn普通凭据, fn超长凭据 } from "../数据/凭据";
import { t_返回 } from "@公共代码/类型";

const log = fn创建日志实例("登录状态检查.ts");
let 信息 = "";

const fn秒时间戳转换 = (秒时间戳: number) => {
  const date = new Date(秒时间戳 * 1000);
  const 年 = date.getFullYear();
  const 月 = String(date.getMonth() + 1).padStart(2, "0");
  const 日 = String(date.getDate()).padStart(2, "0");
  const 时 = String(date.getHours()).padStart(2, "0");
  const 分 = String(date.getMinutes()).padStart(2, "0");
  const 秒 = String(date.getSeconds()).padStart(2, "0");

  return `${年}年${月}月${日}日 ${时}:${分}:${秒}`;
};

const fn登录状态 = (c: Context): t_返回 => {
  const 令牌 = getCookie(c, "firfe_nav_token") || "";
  const 是否超长凭据 = getCookie(c, "firfe_nav_token_long") === "true" ? true : false;
  if (!令牌) {
    log.debug(`请求 方式：${c.req.method} 路径：${c.req.url}`);
    log.debug("请求头 Cookie:", getCookie(c));

    信息 = `未登录!`;
    log.warn(信息);
    return { 状态: false, 信息: 信息 + "请登录！" };
  }

  try {
    const 令牌解码 = jwt.verify(令牌, const_账号设置.JWT_密钥) as {
      用户名: string;
      iat: number; // 令牌的签发时间
      exp: number; // 令牌的过期时间
    };
    c.set("过期时间", fn秒时间戳转换(令牌解码.exp));
    log.debug(
      `用户名: ${令牌解码.用户名} 签发时间: ${fn秒时间戳转换(令牌解码.iat)} 过期时间: ${fn秒时间戳转换(令牌解码.exp)}`,
    );
  } catch (e: any) {
    if (e.name === "TokenExpiredError") {
      信息 = `登录已过期`;
      log.error(信息);
      return { 状态: false, 信息: "请登录！" };
    }
    信息 = `无效的令牌`;
    log.error(信息);
    return { 状态: false, 信息: "请登录！" };
  }

  if (是否超长凭据) {
    log.info("本次凭据为：超长凭据");
    if (!fn超长凭据.查找(令牌)) {
      信息 = `${令牌} 的值未记录或被覆盖`;
      log.error(信息);
      return { 状态: false, 信息: "请登录！" };
    }
    fn超长凭据.刷新(令牌);
    return { 状态: true, 内容: "已登录！" };
  } else {
    log.info("本次凭据为：普通凭据");
    if (!fn普通凭据.查找(令牌)) {
      信息 = `${令牌} 的值未记录或被覆盖`;
      log.error(信息);
      return { 状态: false, 信息: "请登录！" };
    }
    fn普通凭据.刷新(令牌);
    return { 状态: true, 内容: "已登录！" };
  }
};

const 不认证路径 = new Set(["/api/all_nav"]);

export const fn认证 = (c: Context, next: Next) => {
  const 路径 = c.req.path.replace(/\/+$/, "");
  log.info("路径", 路径);
  c.set("登录", false);

  const 登录状态 = fn登录状态(c);

  if (!登录状态.状态) {
    if (不认证路径.has(路径) && c.req.method === "GET") {
      log.info("未登录");
      c.header("Cache-Control", "no-cache, no-store, must-revalidate");
      c.header("Pragma", "no-cache");
      c.header("Expires", "0");
      return next();
    } else {
      throw new HTTPException(401, { message: 登录状态.信息 });
    }
  }

  c.set("登录", true);
  log.info("令牌有效");
  c.header("Cache-Control", "no-cache, no-store, must-revalidate");
  c.header("Pragma", "no-cache");
  c.header("Expires", "0");
  return next();
};

export default fn认证;
