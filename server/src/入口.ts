import "./启动前检查";

import { serve, Server } from "bun";
import { Hono } from "hono";
import { serveStatic } from "@hono/bun";

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
    功能: string;
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
app.onError(中间件_统一错误处理);
app.use(中间件_响应内容格式化);

app.route("/api", 路由_api);

app.notFound((c) => {
  const 信息 = `接口不存在或路径错误：${c.req.method} ${c.req.path}`;
  log.warn(信息);
  return c.json({ 状态: false, 信息: 信息 }, 404);
});

const 端口 = Number(Bun.env.PORT) || 5191;
const 监听地址 = Bun.env.HOST;
console.log();

let 服务实例: Server<undefined> | null = null;

if (监听地址) {
  try {
    服务实例 = serve({ port: 端口, hostname: 监听地址, fetch: app.fetch });
    log.info(`服务启动成功，监听地址：${监听地址} ，端口：${端口}`);
  } catch (error) {
    log.fatal(`服务启动失败，监听地址：${监听地址} ，端口：${端口}`);
    log.fatal(error);
    process.exit(1);
  }
} else {
  try {
    服务实例 = serve({ port: 端口, hostname: "::", fetch: app.fetch });
    log.info(`服务启动成功，已开启 IPv4/IPv6 双栈监听，端口：${端口}`);
  } catch (error) {
    log.warn("IPv6 部分监听失败！尝试监听纯 IPv4 地址 0.0.0.0");
    try {
      服务实例 = serve({ port: 端口, hostname: "0.0.0.0", fetch: app.fetch });
      log.info(`服务启动成功，已开启纯 IPv4 监听，端口：${端口}`);
    } catch (error) {
      log.fatal(`服务启动失败，监听地址：0.0.0.0 ，端口：${端口}`);
      log.fatal(error);
      process.exit(1);
    }
  }
}

// 处理 容器 SIGTERM 和 SIGINT 信号
let 正在关闭 = false;
const fn停止运行 = async (信号: "SIGTERM" | "SIGINT") => {
  if (正在关闭) return;
  正在关闭 = true;
  log.info(`收到 ${信号}，正在关闭服务...`);
  try {
    if (服务实例) {
      // 最多等 3 秒，避免长连接把关闭流程挂住
      await Promise.race([
        服务实例.stop(), // 停止接受新连接，等待进行中请求完成
        new Promise((r) => setTimeout(r, 3000)),
      ]);
    }
  } catch (err) {
    log.error("关闭服务器时出错:", err);
  } finally {
    log.info("服务已关闭");
    process.exit(0);
  }
};
process.on("SIGTERM", () => fn停止运行("SIGTERM"));
process.on("SIGINT", () => fn停止运行("SIGINT"));
