import { Hono } from "hono";
import fn创建日志实例 from "../../工具/日志";
import {
  fn导航_删除,
  fn导航_更新,
  fn导航_添加,
  fn获取当前最大ID,
  fn获取所有导航数据,
} from "../../数据/导航";
import { HTTPException } from "hono/http-exception";
import { t_导航 } from "@公共代码/类型";
import {
  fn初步属性值校验,
  fn初步属性校验,
  fn更新初步属性值校验,
  fn更新初步属性校验,
} from "@公共代码/导航数据校验";

const log = fn创建日志实例("api/nav");

const app = new Hono();
let 报错信息 = "";

app.get("/:ID", async (c) => {
  const ID = Number(c.req.param("ID"));
  log.info(`获取指定导航 ${ID}`);

  const 导航数据 = fn获取所有导航数据().find((元素) => 元素.ID === ID && 元素.类型 === "导航");

  if (!导航数据) {
    报错信息 = `未找到 ID 为 ${ID} 的 导航`;
    log.warn(报错信息);
    throw new HTTPException(404, { message: 报错信息 });
  }

  return c.json(导航数据);
});

app.post("/super/:ID", async (c) => {
  const 父级ID = Number(c.req.param("ID"));
  log.info(`在ID为 ${父级ID} 得到内容下增加一个导航`);

  const 父级数据 = fn获取所有导航数据().find(
    (元素) => 元素.ID === 父级ID && (元素.类型 === "子分类" || 元素.类型 === "文件夹"),
  );

  if (!父级数据) {
    报错信息 = `未找到 ID 为 ${父级ID} 的 子分类 或 文件夹，无法添加导航`;
    log.warn(报错信息);
    throw new HTTPException(404, { message: 报错信息 });
  }

  let 请求体: Partial<t_导航> = {};

  try {
    请求体 = await c.req.json();
  } catch (e) {
    报错信息 = "请求体不是 JSON 对象";
    log.error(报错信息);
    throw new HTTPException(400, { message: 报错信息 });
  }

  const ID = fn获取当前最大ID() + 1;
  请求体.ID = ID;
  请求体.父级ID = 父级ID;
  请求体.排序 = ID;
  请求体.类型 = "导航";

  const 属性校验 = fn初步属性校验("导航", 请求体);
  if (!属性校验.状态) {
    报错信息 = `新增导航 ${属性校验.信息}`;
    log.error(报错信息);
    throw new HTTPException(400, { message: 报错信息 });
  }

  const 属性值校验 = fn初步属性值校验(请求体 as t_导航);
  if (!属性值校验.状态) {
    报错信息 = `新增导航 ${属性值校验.信息}`;
    log.error(报错信息);
    throw new HTTPException(400, { message: 报错信息 });
  }

  await fn导航_添加(请求体 as t_导航);

  log.info(`在 ID 为 ${父级ID} 的${父级数据.类型}中添加导航成功，ID ${ID}`);
  log.debug(`导航添加数据：`, JSON.stringify(请求体));

  return c.json(请求体);
});

app.patch("/:ID", async (c) => {
  const ID = Number(c.req.param("ID"));
  log.info(`修改 ID 为 ${ID} 的导航`);

  const 原始数据 = fn获取所有导航数据().find(
    (元素) => 元素.ID === ID && 元素.类型 === "导航",
  ) as t_导航;

  if (!原始数据) {
    报错信息 = `未找到 ID 为 ${ID} 的 数据`;
    log.warn(报错信息);
    throw new HTTPException(404, { message: 报错信息 });
  }

  let 请求体: Partial<t_导航> = {};

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

  const 属性校验 = fn更新初步属性校验("导航", 请求体);
  if (!属性校验.状态) {
    报错信息 = `更新导航 ${ID} 属性出错 ${属性校验.信息}`;
    log.error(报错信息);
    throw new HTTPException(400, { message: 报错信息 });
  }

  const 属性值校验 = fn更新初步属性值校验(请求体);
  if (!属性值校验.状态) {
    报错信息 = `更新导航 ${ID} 属性值出错 ${属性值校验.信息}`;
    log.error(报错信息);
    throw new HTTPException(400, { message: 报错信息 });
  }

  if ("内网地址" in 请求体) {
    if (!请求体.内网地址 && !原始数据.外网地址) {
      throw new HTTPException(422, {
        message: `更新导航 ${ID} 属性值出错 "内网地址" 和 "外网地址" 不能同时为空`,
      });
    }
  }

  if ("外网地址" in 请求体) {
    if (!请求体.外网地址 && !原始数据.内网地址) {
      throw new HTTPException(422, {
        message: `更新导航 ${ID} 属性值出错 "内网地址" 和 "外网地址" 不能同时为空`,
      });
    }
  }

  const 更新数据 = await fn导航_更新(ID, 请求体);

  if (!更新数据.状态) {
    报错信息 = `更新导航 ${ID} 出错 ${更新数据.信息}`;
    log.error(报错信息);
    throw new HTTPException(500, { message: 报错信息 });
  }

  return c.json(更新数据.内容);
});

app.delete("/:ID", async (c) => {
  const ID = Number(c.req.param("ID"));
  log.info(`删除指定导航 ${ID}`);

  const 导航索引 = fn获取所有导航数据().findIndex((元素) => 元素.ID === ID && 元素.类型 === "导航");
  if (导航索引 === -1) {
    报错信息 = `未找到 ID 为 ${ID} 的 导航`;
    log.warn(报错信息);
    throw new HTTPException(404, { message: 报错信息 });
  }

  const 导航删除 = await fn导航_删除(ID);

  if (!导航删除.状态) {
    log.warn(导航删除.信息);
    throw new HTTPException(500, { message: 导航删除.信息 });
  }

  log.debug(`删除导航 ${ID} 成功,被删除数据：`, JSON.stringify(导航删除.内容));
  return c.text("删除成功");
});

export default app;
