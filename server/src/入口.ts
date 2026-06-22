import "./配置读取";
import "./数据/导航";
import "./数据/账号设置";
import "./数据/凭据";
import "./工具/退出前执行";

import { serve } from "bun";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { const_端口 } from "./配置读取";

import fn创建日志实例 from "./工具/日志";

import 中间件_请求记录 from "./中间件/请求记录";
import 中间件_响应内容格式化 from "./中间件/响应内容格式化";
import 中间件_统一错误处理 from "./中间件/统一错误处理";

import 路由_api from "./路由/api";

const log = fn创建日志实例("入口");

const app = new Hono();

// 静态文件服务（项目根目录 ./* → web 文件夹）
app.use(
  "/*",
  serveStatic({
    root: `${import.meta.dir}/web`, // 当前目录下的 web
  }),
);

declare module "hono" {
  interface ContextVariableMap {
    信息: string;
    登录: boolean;
    过期时间: string;
  }
}

const 路径转发 = ["/login", "/seting"];

app.use("*", async (c, next) => {
  const path = c.req.path;

  if (路径转发.includes(path)) {
    // 动态拼接新的查询字符串并返回重定向响应
    return c.redirect(`/?path=${path.slice(1)}`);
  }

  await next();
});

app.use(中间件_请求记录);
app.use(中间件_响应内容格式化);
app.onError(中间件_统一错误处理);

app.route("/api", 路由_api);

app.notFound((c) => {
  return c.json(
    {
      状态: false,
      内容: `接口不存在或路径错误：${c.req.path}`,
    },
    404,
  );
});

serve({
  port: const_端口,
  hostname: "::",
  fetch: app.fetch,
});
log.info(`启动成功，监听端口：${const_端口}`);
