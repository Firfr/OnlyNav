import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { setCookie } from "hono/cookie";
import SHA256 from "crypto-js/sha256";
import jwt from "jsonwebtoken";
import { const_账号设置 } from "../../数据/账号设置";
import { fn普通凭据, fn超长凭据 } from "../../数据/凭据";
import fn创建日志实例 from "../../工具/日志";

const log = fn创建日志实例("路由/api/login");

const app = new Hono();
let 报错信息 = "";

app.post("/", async (c) => {
  let 用户名 = "";
  let 密码 = "";
  let 盐 = "";
  let 长期登录秘钥;
  try {
    ({ 用户名, 密码, 盐, 长期登录秘钥 } = await c.req.json());
  } catch (e) {
    报错信息 = `格式错误：从请求体中获取属性 用户名 密码 盐 长期登录秘钥 失败`;
    log.error(报错信息, e);
    throw new HTTPException(400, { message: 报错信息 });
  }
  log.debug("用户名", 用户名, "密码", 密码, "盐", 盐, "长期登录秘钥", 长期登录秘钥);

  if (
    const_账号设置.用户名 != 用户名 ||
    密码 != SHA256(`${const_账号设置.用户名}:${const_账号设置.密码}:${盐}`).toString()
  ) {
    报错信息 = `认证失败，账号或密码错误！`;
    log.warn(报错信息);
    throw new HTTPException(400, { message: 报错信息 });
  }

  let 是否超长凭据: boolean = false;

  if (typeof 长期登录秘钥 === "string") {
    是否超长凭据 = true;
    log.debug("使用超长凭据");
    if (
      长期登录秘钥 !=
      SHA256(`${const_账号设置.用户名}:${const_账号设置.长期登录秘钥}:${盐}`).toString()
    ) {
      报错信息 = `认证失败，长期登录秘钥 错误！`;
      log.warn(报错信息);
      throw new HTTPException(400, { message: 报错信息 });
    }
  } else {
    log.debug("使用普通凭据");
  }

  let 令牌 = "";
  let 公共配置: { httpOnly: boolean; maxAge: number } = {
    httpOnly: true,
    maxAge: 0,
  };

  if (是否超长凭据) {
    令牌 = jwt.sign({ 用户名: const_账号设置.用户名 }, const_账号设置.JWT_密钥, {
      expiresIn: `${const_账号设置.超长凭据过期时间}d`,
    });
    fn超长凭据.新增(令牌);
    公共配置 = {
      httpOnly: true,
      maxAge: 86400 * const_账号设置.超长凭据过期时间,
    };
  } else {
    令牌 = jwt.sign({ 用户名: const_账号设置.用户名 }, const_账号设置.JWT_密钥, {
      expiresIn: `${const_账号设置.过期时间}d`,
    });
    fn普通凭据.新增(令牌);
    公共配置 = {
      httpOnly: true,
      maxAge: 86400 * const_账号设置.过期时间,
    };
  }

  setCookie(c, "firfe_nav_token", 令牌, 公共配置);
  setCookie(c, "firfe_nav_token_long", 是否超长凭据.toString(), 公共配置);
  return c.text("登录成功");
});

export default app;
