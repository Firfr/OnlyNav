import { Hono } from "hono";
import fn创建日志实例 from "../../工具/日志";
import { fn删除, fn更新, fn添加, fn获取当前最大ID, fn获取所有导航数据 } from "../../数据/导航";
import { HTTPException } from "hono/http-exception";
import { t_分类, t_子分类, t_导航和层级 } from "@公共代码/类型";
import { fn基础属性校验 } from "@公共代码/导航数据校验";
import { fn不可更新字段校验, fn存在检测, fn是否存在子内容 } from "../../工具/操作校验";

const log = fn创建日志实例("api/cate");
const 类型 = "分类";

const app = new Hono();

app.get("/all", (c) => {
  log.info(`获取所有分类`);

  const 所有数据 = fn获取所有导航数据().values();
  const 返回值: t_分类[] = [];

  for (const 数据 of 所有数据) {
    if (数据.类型 === 类型) {
      返回值.push(数据);
    }
  }

  返回值.sort((前, 后) => 前.排序 - 后.排序);

  return c.json(返回值);
});

app.get("/:ID", (c) => {
  const ID = Number(c.req.param("ID"));
  log.info(`获取 ID 为 [${ID}] 的 ${类型}`);

  const 分类数据 = structuredClone(fn获取所有导航数据().get(ID));
  fn存在检测(ID, 类型, 分类数据);

  return c.json(分类数据);
});

app.get("/:ID/sub", async (c) => {
  const ID = Number(c.req.param("ID"));
  log.info(`获取 ID 为 ${ID} 的 ${类型} 的所有子内容`);

  const 所有数据 = fn获取所有导航数据();
  const 返回值: t_子分类[] = [];

  const 分类数据 = structuredClone(所有数据.get(ID));
  fn存在检测(ID, 类型, 分类数据);

  for (const 数据 of 所有数据.values()) {
    if (数据.父级ID === ID) {
      返回值.push(数据 as t_子分类);
    }
  }

  返回值.sort((前, 后) => 前.排序 - 后.排序);

  return c.json(返回值);
});

app.post("/", async (c) => {
  log.info(`增加 ${类型}`);
  let 报错信息 = "";
  let 请求体: Partial<t_分类> = {};

  try {
    请求体 = await c.req.json();
  } catch (e) {
    报错信息 = "请求体不是 JSON 对象";
    log.warn(报错信息);
    throw new HTTPException(400, { message: 报错信息 });
  }

  if (Object.keys(请求体).length === 0) {
    报错信息 = "无更新内容，不添加。";
    log.warn(报错信息);
    throw new HTTPException(422, { message: 报错信息 });
  }

  const ID = fn获取当前最大ID() + 1;
  请求体.ID = ID;
  请求体.父级ID = 0;
  请求体.排序 = ID;
  请求体.类型 = 类型;

  const 属性校验 = fn基础属性校验(请求体 as t_分类);
  if (!属性校验.状态) {
    报错信息 = `新增分类 ${属性校验.信息}`;
    log.warn(报错信息);
    throw new HTTPException(400, { message: 报错信息 });
  }

  请求体.名称 = [...请求体.名称!.trim()].slice(0, 20).join("");
  if (typeof 请求体.描述 === "string") {
    请求体.描述 = [...请求体.描述.trim()].slice(0, 200).join("");
  }

  const 添加结果 = await fn添加(请求体 as t_分类);
  if (!添加结果.状态) {
    throw new HTTPException(400, { message: 添加结果.信息 });
  }

  log.info(`添加分类成功，分类 ID [${ID}]`);
  log.debug(`分类添加数据：`, JSON.stringify(请求体, null, 2));

  return c.json(请求体);
});

app.patch("/:ID", async (c) => {
  const ID = Number(c.req.param("ID"));
  log.info(`更新 ID 为 [${ID}] 的 ${类型}`);
  let 报错信息 = "";

  const 原数据 = structuredClone(fn获取所有导航数据().get(ID));
  fn存在检测(ID, 类型, 原数据);

  let 请求体: Partial<t_分类> = {};

  try {
    请求体 = await c.req.json();
  } catch (e) {
    报错信息 = "请求体不是 JSON 对象";
    log.warn(报错信息);
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

  const 新数据 = { ...原数据, ...请求体 } as t_分类;

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

  const 分类删除 = await fn删除(ID);
  if (!分类删除.状态) {
    log.warn(分类删除.信息);
    throw new HTTPException(500, { message: 分类删除.信息 });
  }

  报错信息 = `删除 ID [${ID}] 的 ${类型} 成功`;
  log.debug(报错信息);
  return c.text(报错信息);
});

export default app;
