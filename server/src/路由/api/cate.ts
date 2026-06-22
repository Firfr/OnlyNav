import { Hono } from "hono";
import fn创建日志实例 from "../../工具/日志";
import {
  fn分类_删除,
  fn分类_更新,
  fn分类_添加,
  fn获取当前最大ID,
  fn获取所有导航数据,
} from "../../数据/导航";
import { HTTPException } from "hono/http-exception";
import { t_分类, t_导航和层级 } from "@公共代码/类型";
import {
  fnID校验_分类,
  fn初步属性校验,
  fn初步属性值校验,
  fn更新初步属性校验,
  fn更新初步属性值校验,
} from "@公共代码/导航数据校验";

const log = fn创建日志实例("api/cate");

const app = new Hono();
let 报错信息 = "";

app.get("/all", async (c) => {
  log.info(`获取所有分类`);

  return c.json(
    fn获取所有导航数据()
      .filter((元素: t_导航和层级) => 元素.类型 === "分类")
      .sort((a, b) => a.排序 - b.排序),
  );
});

app.get("/:ID", async (c) => {
  const ID = Number(c.req.param("ID"));
  log.info(`获取 ID 为 ${ID} 的分类`);

  const 所有导航数据 = fn获取所有导航数据();

  const ID校验 = fnID校验_分类(所有导航数据, ID);
  if (!ID校验.状态) {
    log.error(ID校验.信息);
    throw new HTTPException(404, { message: ID校验.信息 });
  }

  const 分类数据 = 所有导航数据.find(
    (元素: t_导航和层级) => 元素.ID === ID && 元素.类型 === "分类",
  );

  if (!分类数据) {
    报错信息 = `未找到 ID 为 ${ID} 的 分类`;
    log.error(报错信息);
    throw new HTTPException(404, { message: 报错信息 });
  }

  return c.json(分类数据);
});

app.get("/:ID/sub", async (c) => {
  const ID = Number(c.req.param("ID"));
  log.info(`获取指定分类子内容 ${ID}`);

  const 所有导航数据 = fn获取所有导航数据();

  const ID校验 = fnID校验_分类(所有导航数据, ID);
  if (!ID校验.状态) {
    log.error(ID校验.信息);
    throw new HTTPException(404, { message: ID校验.信息 });
  }

  return c.json(
    所有导航数据
      .filter((元素: t_导航和层级) => 元素.类型 === "子分类" && 元素.父级ID === ID)
      .sort((a, b) => a.排序 - b.排序),
  );
});

app.post("/", async (c) => {
  log.info(`增加分类`);
  let 请求体: Partial<t_分类> = {};

  try {
    请求体 = await c.req.json();
  } catch (e) {
    报错信息 = "请求体不是 JSON 对象";
    log.error(报错信息);
    throw new HTTPException(400, { message: 报错信息 });
  }

  const ID = fn获取当前最大ID() + 1;
  请求体.ID = ID;
  请求体.父级ID = 0;
  请求体.排序 = ID;
  请求体.类型 = "分类";

  const 属性校验 = fn初步属性校验("分类", 请求体);
  if (!属性校验.状态) {
    报错信息 = `新增分类 ${属性校验.信息}`;
    log.error(报错信息);
    throw new HTTPException(400, { message: 报错信息 });
  }

  const 属性值校验 = fn初步属性值校验(请求体 as t_分类);
  if (!属性值校验.状态) {
    报错信息 = `新增分类 ${属性值校验.信息}`;
    log.error(报错信息);
    throw new HTTPException(400, { message: 报错信息 });
  }

  await fn分类_添加(请求体 as t_分类);

  log.info(`添加分类成功，ID ${ID}`);
  log.debug(`分类添加数据：`, JSON.stringify(请求体));

  return c.json(请求体);
});

app.patch("/:ID", async (c) => {
  const ID = Number(c.req.param("ID"));
  log.info(`编辑指定分类 ${ID}`);

  let 请求体: Partial<t_分类> = {};

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

  const 所有导航数据 = fn获取所有导航数据();
  const ID校验 = fnID校验_分类(所有导航数据, ID);
  if (!ID校验.状态) {
    log.warn(ID校验.信息);
    throw new HTTPException(404, { message: ID校验.信息 });
  }

  const 属性校验 = fn更新初步属性校验("分类", 请求体);
  if (!属性校验.状态) {
    报错信息 = `更新分类 ${ID} 出错 ${属性校验.信息}`;
    log.error(报错信息);
    throw new HTTPException(400, { message: 报错信息 });
  }

  const 属性值校验 = fn更新初步属性值校验(请求体);
  if (!属性值校验.状态) {
    报错信息 = `更新分类 ${ID} 出错 ${属性值校验.信息}`;
    log.error(报错信息);
    throw new HTTPException(400, { message: 报错信息 });
  }

  const 更新数据 = await fn分类_更新(ID, 请求体);

  if (!更新数据.状态) {
    报错信息 = `更新分类 ${ID} 出错 ${更新数据.信息}`;
    log.error(报错信息);
    throw new HTTPException(500, { message: 报错信息 });
  }

  return c.json(更新数据.内容);
});

app.delete("/:ID", async (c) => {
  const ID = Number(c.req.param("ID"));
  log.info(`删除指定分类 ${ID}`);

  const ID校验 = fnID校验_分类(fn获取所有导航数据(), ID);
  if (!ID校验.状态) {
    log.warn(ID校验.信息);
    throw new HTTPException(404, { message: ID校验.信息 });
  }

  const 分类删除 = await fn分类_删除(ID);

  if (!分类删除.状态) {
    log.warn(分类删除.信息);
    throw new HTTPException(500, { message: 分类删除.信息 });
  }

  log.debug(`删除分类 ${ID} 成功`);
  return c.text(`删除分类 ${ID} 成功`);
});

export default app;
