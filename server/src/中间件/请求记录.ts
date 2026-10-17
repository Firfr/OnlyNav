import type { Context, Next } from "hono";
import { getConnInfo } from "hono/bun";
import fn创建日志实例 from "../工具/日志";
import { getCookie } from "hono/cookie";

const log = fn创建日志实例("请求记录");

const 存在请求体的请求方法集合 = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const fn获取客户端IP = (c: Context): string => {
  log.debug("优先从代理头部获取");
  const 转发IP = c.req.header("x-forwarded-for")?.split(",")[0].trim();
  if (转发IP && 转发IP !== "unknown") return 转发IP;

  const 真实IP = c.req.header("x-real-ip");
  if (真实IP) return 真实IP;

  const 云flareIP = c.req.header("cf-connecting-ip");
  if (云flareIP) return 云flareIP;

  const 真实客户端IP = c.req.header("true-client-ip");
  if (真实客户端IP) return 真实客户端IP;

  const x客户端IP = c.req.header("x-client-ip");
  if (x客户端IP) return x客户端IP;

  log.debug("从 forwarded 头部解析");
  const 转发头 = c.req.header("forwarded");
  if (转发头) {
    const 匹配结果 = 转发头.match(/for=([^;]+)/);
    if (匹配结果 && 匹配结果[1]) return 匹配结果[1].replace(/[["']/g, "");
  }

  log.debug("从连接信息获取 (Bun 环境 - 同步方式)");
  try {
    log.debug("通过 socket 获取");
    const socket地址 = (c.req.raw as any).socket?.remoteAddress;
    if (socket地址 && socket地址 !== "::1" && socket地址 !== "127.0.0.1") {
      return socket地址;
    }

    log.debug("通过 connection 获取");
    const 连接对象 = (c.req.raw as any).connection;
    if (连接对象?.remoteAddress) {
      const 连接地址 = 连接对象.remoteAddress;
      if (连接地址 && 连接地址 !== "::1") return 连接地址;
    }
  } catch (错误) {
    log.error("获取连接信息失败:", 错误);
  }

  log.debug("从原始 headers 再次获取");
  const 原始转发IP = c.req.raw.headers.get("x-forwarded-for");
  if (原始转发IP) return 原始转发IP.split(",")[0].trim();

  const 原始真实IP = c.req.raw.headers.get("x-real-ip");
  if (原始真实IP) return 原始真实IP;

  log.debug("使用 getConnInfo  获取");

  return getConnInfo(c).remote.address || "未知";
};

const fn请求记录 = async (c: Context, next: Next) => {
  console.log();
  log.debug("开始请求记录");
  log.info(`请求 方式：${c.req.method} 路径：${c.req.url}`);
  log.debug("请求头 Cookie:", getCookie(c));
  log.debug(`客户端IP：${fn获取客户端IP(c)}`);

  记录请求体: if (存在请求体的请求方法集合.has(c.req.method)) {
    if (Bun.env.LOG_LEVEL !== "trace") break 记录请求体;

    const 克隆请求 = c.req.raw.clone();
    const 请求体类型 = c.req.header("content-type") || "";
    const 请求体 = await 克隆请求.text();

    if (!请求体) break 记录请求体;

    let 请求体格式化: any = 请求体;
    let 请求体内容类型 = "";

    if (请求体类型.includes("multipart/form-data")) {
      log.trace("请求体 (文件传输)");
      break 记录请求体;
    } else if (请求体类型.includes("application/json")) {
      try {
        请求体格式化 = JSON.parse(请求体);
        请求体内容类型 = " (JSON)";
      } catch {
        请求体内容类型 = " (无效JSON)";
      }
    } else if (请求体类型.includes("application/x-www-form-urlencoded")) {
      const 表单请求体 = new URLSearchParams(请求体);
      请求体格式化 = {};
      表单请求体.forEach((值, 键) => {
        请求体格式化[键] = 值;
      });
      请求体内容类型 = " (表单)";
    } else if (请求体类型.includes("text/")) {
      请求体内容类型 = " (文本)";
    }

    log.trace(`请求体${请求体内容类型}:`);
    log.trace(
      typeof 请求体格式化 === "string" ? 请求体格式化 : JSON.stringify(请求体格式化, null, 2),
    );
  }
  log.debug("结束请求记录\n");

  await next();
};

export default fn请求记录;
