import { Hono } from "hono";
import fn创建日志实例 from "../../工具/日志";
import { fn删除, fn更新, fn添加, fn获取当前最大ID, fn获取所有导航数据 } from "../../数据/导航";
import { HTTPException } from "hono/http-exception";
import { t_文件夹 } from "@公共代码/类型";
import { fn基础属性校验 } from "@公共代码/导航数据校验";
import { fn不可更新字段校验, fn存在检测, fn是否存在子内容 } from "../../工具/操作校验";

const log = fn创建日志实例("api/folder");
const 类型 = "文件夹";

const app = new Hono();

app.get("/:ID", (c) => {
  const ID = Number(c.req.param("ID"));
  log.info(`获取 ID 为 [${ID}] 的 ${类型}`);

  const 文件夹数据 = structuredClone(fn获取所有导航数据().get(ID));
  fn存在检测(ID, 类型, 文件夹数据);

  return c.json(文件夹数据);
});

app.get("/:ID/sub", (c) => {
  const ID = Number(c.req.param("ID"));
  log.info(`获取 ID 为 [${ID}] 的 ${类型} 的所有子内容`);

  const 所有数据 = fn获取所有导航数据();
  const 返回值: t_文件夹[] = [];

  const 文件夹数据 = structuredClone(所有数据.get(ID));
  fn存在检测(ID, 类型, 文件夹数据);

  for (const 数据 of 所有数据.values()) {
    if (数据.父级ID === ID) {
      返回值.push(数据 as t_文件夹);
    }
  }

  返回值.sort((前, 后) => 前.排序 - 后.排序);

  return c.json(返回值);
});

app.post("/:父级ID", async (c) => {
  const 父级ID = Number(c.req.param("父级ID"));
  log.info(`在 ID 为 [${父级ID}] 的分类中添加 ${类型}`);
  let 报错信息 = "";

  fn存在检测(父级ID, "子分类", structuredClone(fn获取所有导航数据().get(父级ID)));

  let 请求体: Partial<t_文件夹> = {};

  try {
    请求体 = await c.req.json();
  } catch (e) {
    报错信息 = "请求体不是 JSON 对象";
    log.error(报错信息);
    throw new HTTPException(400, { message: 报错信息 });
  }

  if (Object.keys(请求体).length === 0) {
    报错信息 = "无更新内容，不添加。";
    log.warn(报错信息);
    throw new HTTPException(422, { message: 报错信息 });
  }

  const ID = fn获取当前最大ID() + 1;
  请求体.ID = ID;
  请求体.父级ID = 父级ID;
  请求体.排序 = ID;
  请求体.类型 = 类型;

  const 属性校验 = fn基础属性校验(请求体 as t_文件夹);
  if (!属性校验.状态) {
    报错信息 = `在 ID 为 [${父级ID}] 的子分类中增加 ${类型} 属性出错 ${属性校验.信息}`;
    log.error(报错信息);
    throw new HTTPException(400, { message: 报错信息 });
  }

  if (typeof 请求体.名称 === "string") {
    请求体.名称 = [...请求体.名称!.trim()].slice(0, 20).join("");
  }
  if (typeof 请求体.描述 === "string") {
    请求体.描述 = [...请求体.描述.trim()].slice(0, 200).join("");
  }

  const 添加结果 = await fn添加(请求体 as t_文件夹);
  if (!添加结果.状态) {
    throw new HTTPException(400, { message: 添加结果.信息 });
  }

  log.info(`在 ID 为 [${父级ID}] 的子分类中增加 ${类型} 成功，${类型} ID [${ID}]`);
  log.debug(`${类型} 添加数据：`, JSON.stringify(请求体, null, 2));

  return c.json(请求体);
});

app.patch("/:ID", async (c) => {
  const ID = Number(c.req.param("ID"));
  log.info(`更新 ID 为 [${ID}] 的 ${类型}`);
  let 报错信息 = "";

  const 原数据 = structuredClone(fn获取所有导航数据().get(ID));
  fn存在检测(ID, 类型, 原数据);

  let 请求体: Partial<t_文件夹> = {};

  try {
    请求体 = await c.req.json();
  } catch (e) {
    报错信息 = "请求体不是 JSON 对象";
    log.error(报错信息);
    throw new HTTPException(400, { message: 报错信息 });
  }

  if (Object.keys(请求体).length === 0) {
    报错信息 = "无更新内容，不更新。";
    log.warn(报错信息);
    throw new HTTPException(422, { message: 报错信息 });
  }

  fn不可更新字段校验(请求体);

  if (typeof 请求体.名称 === "string") {
    请求体.名称 = [...请求体.名称!.trim()].slice(0, 20).join("");
  }
  if (typeof 请求体.描述 === "string") {
    请求体.描述 = [...请求体.描述.trim()].slice(0, 200).join("");
  }

  const 新数据 = { ...原数据, ...请求体 } as t_文件夹;

  const 属性校验 = fn基础属性校验(新数据);
  if (!属性校验.状态) {
    报错信息 = `更新 ID 为 [${ID}] 的 ${类型} 属性出错 ${属性校验.信息}`;
    log.warn(报错信息);
    throw new HTTPException(400, { message: 报错信息 });
  }

  const 更新数据 = await fn更新(ID, 新数据);
  if (!更新数据.状态) {
    报错信息 = `更新 ID 为 [${ID}] 的 ${类型} 出错 ${更新数据.信息}`;
    log.warn(报错信息);
    throw new HTTPException(500, { message: 报错信息 });
  }

  return c.json(新数据);
});

app.delete("/:ID", async (c) => {
  const ID = Number(c.req.param("ID"));
  log.info(`删除 ID 为 [${ID}] 的 ${类型}`);
  let 报错信息 = "";

  const 所有数据 = fn获取所有导航数据();

  fn存在检测(ID, 类型, structuredClone(所有数据.get(ID)));

  if (fn是否存在子内容(ID, 所有数据)) {
    报错信息 = `ID 为 [${ID}] 的 ${类型} 存在子内容，不可删除！`;
    log.warn(报错信息);
    throw new HTTPException(409, { message: 报错信息 });
  }

  const 子分类删除 = await fn删除(ID);
  if (!子分类删除.状态) {
    log.warn(子分类删除.信息);
    throw new HTTPException(500, { message: 子分类删除.信息 });
  }

  报错信息 = `删除 ID [${ID}] 的 ${类型} 成功`;
  log.debug(报错信息);
  return c.text(报错信息);
});

app.patch("/:ID/move/:新父级ID", async (c) => {
  const ID = Number(c.req.param("ID"));
  const 新父级ID = Number(c.req.param("新父级ID"));
  log.info(`移动 ID 为 [${ID}] 的 ${类型} 移动到 ID 为 [${新父级ID}] 的 新父级`);
  let 信息 = "";

  const 所有数据 = fn获取所有导航数据();

  const 原数据 = structuredClone(所有数据.get(ID)) as t_文件夹;
  fn存在检测(ID, 类型, 原数据);

  const 父级数据 = structuredClone(所有数据.get(新父级ID));

  if (!父级数据) {
    信息 = `未找到 ID 为 [${新父级ID}] 的 新父级数据`;
    log.warn(信息);
    throw new HTTPException(404, { message: 信息 });
  }

  if (父级数据.类型 !== "子分类") {
    信息 = `未找到 ID 为 [${新父级ID}] 的 子分类，无法移动`;
    log.warn(信息);
    throw new HTTPException(404, { message: 信息 });
  }

  原数据.父级ID = 新父级ID;

  const 更新数据 = await fn更新(ID, { 父级ID: 新父级ID });
  if (!更新数据.状态) {
    信息 = `移动 ID 为 [${ID}] 的 ${类型} 出错 ${更新数据.信息}`;
    log.warn(信息);
    throw new HTTPException(500, { message: 信息 });
  }

  log.info(`移动 ID 为 [${ID}] 的 ${类型} 移动到 ID 为 [${新父级ID}] 的 新父级 成功`);
  return c.json(原数据);
});

export default app;
