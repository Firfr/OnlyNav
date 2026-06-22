import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { ContentfulStatusCode } from "hono/utils/http-status";
import fn创建日志实例 from "../工具/日志";

const log = fn创建日志实例("统一错误处理");

export const fn统一错误处理 = (err: Error, c: Context) => {
  let 状态码: ContentfulStatusCode = 500;
  let 信息 = "出现未知错误，请查看服务端日志";

  // 判断是否是 Hono 的 HTTPException (通常用于手动抛出的业务错误)
  if (err instanceof HTTPException) {
    状态码 = err.status;
    信息 = err.message;
    log.debug(`当前错误为主动抛出的错误: 状态码 ${状态码} 信息 ${信息}`);
  } else {
    log.debug(`当前错误为非主动抛出的错误 代码异常！`);
    log.error(`未知错误: ${err.message}`);
    log.error(err.stack || "无堆栈信息");
  }

  // 统一错误响应格式
  return c.json({ 状态: false, 信息: 信息 }, 状态码);
};

export default fn统一错误处理;
