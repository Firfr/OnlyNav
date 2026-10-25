import { Hono } from "hono";
import { fn获取所有导航数据, fn获取公开导航数据 } from "../../数据/导航";
import fn创建日志实例 from "../../工具/日志";

const log = fn创建日志实例("api/all-nav.ts");

const app = new Hono();

app.get("/", (c) => {
  const 登录状态 = c.get("登录");
  log.info(`当前登录状态: ${登录状态}`);
  if (登录状态) {
    log.info("返回全部数据");
    return c.json([...fn获取所有导航数据().values()]);
  }

  log.info("返回公开数据");
  return c.json(fn获取公开导航数据());
});

export default app;
