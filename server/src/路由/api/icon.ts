import { Hono } from "hono";
import fn创建日志实例 from "../../工具/日志";
import { HTTPException } from "hono/http-exception";
import { writeFileSync } from "node:fs";
import { const_配置 } from "../../启动前检查";
import { const_图标列表 } from "../../数据/图标";

const log = fn创建日志实例("路由/api/icon");

const app = new Hono();
let 报错信息 = "";

app.get("/file/:文件名", async (c) => {
  const 文件名 = c.req.param("文件名");
  log.info("开始获取图标", 文件名);

  const 文件路径 = `${const_配置.路径_图标目录}/${文件名}`;

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

const 正则_文件名校验 = /^[\u4e00-\u9fa5a-zA-Z0-9_-]{1,50}$/;
const 允许后缀集合 = new Set([".jpg", ".jpeg", ".png", ".webp", ".apng", ".svg"]);
app.post("/", async (c) => {
  log.info("开始上传图标");

  const 请求体 = await c.req.parseBody();
  const 文件 = 请求体["icon"] as File;

  if (!文件 || !文件.name) {
    报错信息 = `未上传文件`;
    log.warn(报错信息);
    throw new HTTPException(400, { message: 报错信息 });
  }

  const 原始文件名 = 文件.name;
  log.info("原始文件名:", 原始文件名);

  const 最后一个点位置 = 原始文件名.lastIndexOf(".");
  const 无后缀文件名 = 最后一个点位置 > 0 ? 原始文件名.slice(0, 最后一个点位置) : 原始文件名;
  const 后缀 = 最后一个点位置 > 0 ? 原始文件名.slice(最后一个点位置) : "";

  if (!允许后缀集合.has(后缀)) {
    const 报错信息 = `不支持的文件后缀：${后缀 || "无后缀"}`;
    log.warn(报错信息);
    throw new HTTPException(400, { message: 报错信息 });
  }

  if (!正则_文件名校验.test(无后缀文件名)) {
    const 报错信息 = `文件名不合法：${无后缀文件名}`;
    log.warn(报错信息);
    throw new HTTPException(400, { message: 报错信息 });
  }

  const 文件内容Buffer = Buffer.from(await 文件.arrayBuffer());

  const 完整哈希 = new Bun.CryptoHasher("sha256").update(文件内容Buffer).digest("hex");
  const 哈希 = 完整哈希.slice(0, 8);

  const 新文件名字 = `${Date.now()}-${无后缀文件名}-${哈希}${后缀}`;

  try {
    await Bun.write(`${const_配置.路径_图标目录}/${新文件名字}`, 文件内容Buffer);
    log.info("图标保存成功:", 新文件名字);
  } catch (e) {
    报错信息 = `图标保存失败`;
    log.error(报错信息, e);
    throw new HTTPException(400, { message: 报错信息 });
  }

  const_图标列表.unshift(新文件名字);
  return c.text(新文件名字);
});

export default app;
