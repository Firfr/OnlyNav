import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import SHA256 from "crypto-js/sha256";
import jwt from "jsonwebtoken";
import { const_配置 } from "../../启动前检查";
import { fn普通凭据, fn超长凭据 } from "../../数据/凭据";
import fn创建日志实例 from "../../工具/日志";
import { t_登录状态 } from "@公共代码/类型";

const log = fn创建日志实例("路由/api/auth.ts");

const app = new Hono();

app.get("/status", async (c) => {
  c.header("Cache-Control", "no-cache, no-store, must-revalidate");
  c.header("Pragma", "no-cache");
  c.header("Expires", "0");

  const 登录方式 =
    getCookie(c, const_配置.Cookie_名称_长期登录标识) === "true" ? "长期登录" : "普通登录";

  return c.json<t_登录状态>({ 状态: true, 登录方式: 登录方式, 过期时间: c.get("过期时间") });
});

app.get("/long-login", async (c) => {
  c.header("Cache-Control", "no-cache, no-store, must-revalidate");
  c.header("Pragma", "no-cache");
  c.header("Expires", "0");

  c.set("功能", "查询是否支持长期登录");

  return c.text(String(Boolean(const_配置.长期登录凭据)));
});

app.post("/login", async (c) => {
  let 用户名 = "";
  let 密码 = "";
  let 盐 = "";
  let 长期登录秘钥;

  let 报错信息 = "";

  try {
    ({ 用户名, 密码, 盐, 长期登录秘钥 } = await c.req.json());
  } catch (e) {
    报错信息 = `格式错误：请求体不是 JSON 格式`;
    log.error(报错信息, e);
    throw new HTTPException(400, { message: 报错信息 });
  }
  log.trace("用户名", 用户名, "密码", 密码, "盐", 盐, "长期登录秘钥", 长期登录秘钥);

  if (const_配置.用户名 != 用户名) {
    log.warn(`登录失败，用户名错误！`);
    throw new HTTPException(400, { message: `登录失败，用户名或密码错误！` });
  }

  if (密码 != SHA256(`${const_配置.用户名}:${const_配置.密码}:${盐}`).toString()) {
    log.warn(`登录失败，密码错误！`);
    throw new HTTPException(400, { message: `登录失败，账号或密码错误！` });
  }

  let 是否超长凭据: boolean = false;

  if (typeof 长期登录秘钥 === "string") {
    if (!const_配置.长期登录凭据) {
      报错信息 = "未配置 长期登录凭据 ，不允许 长期登录!";
      log.warn(报错信息);
      throw new HTTPException(400, { message: 报错信息 });
    }

    是否超长凭据 = true;
    if (
      长期登录秘钥 != SHA256(`${const_配置.用户名}:${const_配置.长期登录凭据}:${盐}`).toString()
    ) {
      报错信息 = `登录失败，长期登录秘钥 错误！`;
      log.warn(报错信息);
      throw new HTTPException(400, { message: 报错信息 });
    }
    log.debug("使用超长凭据");
  } else {
    log.debug("使用普通凭据");
  }

  const 过期天数 = 是否超长凭据 ? const_配置.长期登录过期时间 : const_配置.普通登录过期时间;
  const 新增凭据 = 是否超长凭据 ? fn超长凭据.新增 : fn普通凭据.新增;

  const 令牌 = jwt.sign({ 用户名: const_配置.用户名 }, const_配置.JWT, {
    expiresIn: `${过期天数}d`,
  });

  await 新增凭据(令牌);

  const 公共配置 = {
    path: "/",
    httpOnly: true,
    maxAge: 86400 * 过期天数,
  };

  setCookie(c, const_配置.Cookie_名称_令牌, 令牌, 公共配置);
  setCookie(c, const_配置.Cookie_名称_长期登录标识, 是否超长凭据.toString(), 公共配置);

  return c.text("登录成功");
});

app.post("/logout", async (c) => {
  log.info("退出登录！");
  const 令牌 = getCookie(c, const_配置.Cookie_名称_令牌) as string;
  const 是否超长凭据 = getCookie(c, const_配置.Cookie_名称_长期登录标识) === "true" ? true : false;
  if (是否超长凭据) {
    await fn超长凭据.删除(令牌);
  } else {
    await fn普通凭据.删除(令牌);
  }

  c.header("Cache-Control", "no-cache, no-store, must-revalidate");
  c.header("Pragma", "no-cache");
  c.header("Expires", "0");

  deleteCookie(c, const_配置.Cookie_名称_令牌);
  deleteCookie(c, const_配置.Cookie_名称_长期登录标识);

  return c.text("退出成功");
});

export default app;
