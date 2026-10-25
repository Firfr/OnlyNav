import type { Context, Next } from "hono";
import { t_返回 } from "@公共代码/类型";
import fn创建日志实例 from "../工具/日志";

const log = fn创建日志实例("响应格式化");

const 跳过路径前缀集合 = new Set(["/api/icon/file/"]);
const fn返回内容 = (文本: string): unknown => {
  try {
    return JSON.parse(文本);
  } catch {
    return 文本;
  }
};

const fn响应内容格式化 = async (c: Context, next: Next) => {
  const 请求路径 = c.req.path;
  for (const 路径前缀 of 跳过路径前缀集合) {
    if (请求路径.startsWith(路径前缀)) {
      log.debug("跳过响应格式化:", 请求路径);
      return await next();
    }
  }

  // 等待正常业务逻辑处理完成
  await next();

  // 非 2xx 直接返回，交给 onError / 后续处理
  if (c.res.status < 200 || c.res.status >= 300) return c.res;

  // 克隆并读取原始 Body
  const 原响应文本 = await c.res.clone().text();

  // 拦截"handler 没有返回内容"的情况：2xx 但 body 为空
  if (原响应文本 === "") {
    const 返回内容: t_返回 = { 状态: false, 信息: `【${c.req.path}】功能等待开发！` };

    const 新响应头 = new Headers(c.res.headers);
    新响应头.set("Content-Type", "application/json; charset=utf-8");

    c.res = new Response(JSON.stringify(返回内容), { status: 200, headers: 新响应头 });

    log.debug(`【${c.req.path}】功能等待开发`);
    return;
  }

  if (c.get("功能") === "查询是否支持长期登录") {
    const 新响应头 = new Headers(c.res.headers);
    新响应头.set("Content-Type", "application/json; charset=utf-8");

    c.res = new Response(
      JSON.stringify({
        状态: true,
        内容: 原响应文本 === "false" ? false : true,
      }),
      { status: c.res.status, headers: 新响应头 },
    );
    return;
  }
  const 返回内容: t_返回 = {
    状态: true,
    内容: fn返回内容(原响应文本),
  };

  if (c.get("信息")) 返回内容.信息 = c.get("信息");

  // 合并原响应头，再覆盖 Content-Type
  const 新响应头 = new Headers(c.res.headers);
  新响应头.set("Content-Type", "application/json; charset=utf-8");

  c.res = new Response(JSON.stringify(返回内容), { status: c.res.status, headers: 新响应头 });

  log.trace(`【${c.req.path}】响应内容格式化完成`);

  return;
};

export default fn响应内容格式化;
