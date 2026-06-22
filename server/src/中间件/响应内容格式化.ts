import type { Context, Next } from "hono";
import { t_返回 } from "@公共代码/类型";
import fn创建日志实例 from "../工具/日志";

const log = fn创建日志实例("响应格式化");

const 跳过路径前缀集合 = new Set(["/api/icon/file/"]);

const fn响应内容格式化 = async (c: Context, next: Next) => {
  const 请求路径 = c.req.path;
  for (const 路径前缀 of 跳过路径前缀集合) {
    if (请求路径.startsWith(路径前缀)) {
      log.info("跳过响应格式化:", 请求路径);
      return await next();
    }
  }

  // 等待正常业务逻辑处理完成
  await next();

  log.debug("==== 响应格式化开始");

  // 只处理成功状态码 (2xx)
  if (c.res.status >= 200 && c.res.status < 300) {
    try {
      // 克隆并读取原始 Body
      const 原响应文本 = await c.res.clone().text();
      let 响应内容格式化: any;

      try {
        响应内容格式化 = JSON.parse(原响应文本);
        log.debug("路由返回内容 JSON 解析成功");
      } catch (e) {
        响应内容格式化 = 原响应文本;
        log.debug("路由返回内容 JSON 解析失败，使用原始字符串");
      }

      const 返回内容: t_返回 = {
        状态: true,
        内容: 响应内容格式化,
      };

      if (c.get("信息")) {
        返回内容.信息 = c.get("信息");
        log.debug("路由传递了额外的信息，添加到返回数据中");
      }

      // 手动构造一个新的 Response 对象 覆盖原响应内容
      const newResponse = new Response(JSON.stringify(返回内容), {
        status: c.res.status,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });

      c.res = newResponse;
      log.debug("==== 响应格式化结束");
      return;
    } catch (e) {
      console.error("响应格式化异常:", e);
      throw new Error("响应数据格式化失败！");
    }
  }

  log.debug("==== 响应格式化结束");
  return c.res;
};

export default fn响应内容格式化;
