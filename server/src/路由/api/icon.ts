import { Hono } from "hono";
import fn创建日志实例 from "../../工具/日志";
import { HTTPException } from "hono/http-exception";
import { writeFileSync } from "node:fs";
import { const_数据目录 } from "../../配置读取";
import { const_图标列表 } from "../../数据/图标";

const log = fn创建日志实例("路由/api/icon");

const app = new Hono();
let 报错信息 = "";

app.get("/file/:文件名", async (c) => {
  const 文件名 = c.req.param("文件名");
  log.info("开始获取图标", 文件名);

  const 文件路径 = `${const_数据目录.图标}/${文件名}`;

  const 文件 = Bun.file(文件路径);

  if (!(await 文件.exists())) {
    报错信息 = `文件不存在： ${文件路径}`;
    log.error(报错信息);
    throw new HTTPException(404, { message: 报错信息 });
  }

  return c.body(文件.stream(), 200, {
    "Content-Type": 文件.type || "application/octet-stream",
    "Cache-Control": "public, max-age=2592000",
  });
});

app.get("/list", (c) => {
  log.info("获取图标列表");
  return c.json(const_图标列表);
});

app.post("/", async (c) => {
  log.info("开始上传图标");

  const 请求体 = await c.req.parseBody();
  const 文件 = 请求体["icon"] as File;

  if (!文件 || !文件.name) {
    报错信息 = `未上传文件`;
    log.error(报错信息);
    throw new HTTPException(400, { message: 报错信息 });
  }

  const 原始文件名 = 文件.name;
  log.info("原始文件名:", 原始文件名);

  const 新文件名字 = `${Date.now()}-${原始文件名}`;

  try {
    const 二进制文件数据 = await 文件.arrayBuffer();
    writeFileSync(`${const_数据目录.图标}/${新文件名字}`, Buffer.from(二进制文件数据));
    log.info("图标保存成功:", 新文件名字);
  } catch (e) {
    报错信息 = `图标保存失败`;
    log.error(报错信息, e);
    throw new HTTPException(400, { message: 报错信息 });
  }

  const_图标列表.push(新文件名字);
  const_图标列表.sort((a, b) => -a.localeCompare(b));

  return c.text(新文件名字);
});

export default app;
