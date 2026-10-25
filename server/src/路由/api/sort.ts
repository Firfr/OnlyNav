import { Hono } from "hono";
import { fn获取所有导航数据, fn更新 } from "../../数据/导航";
import fn创建日志实例 from "../../工具/日志";
import { HTTPException } from "hono/http-exception";
import { fn正整数校验 } from "../../工具/常用校验";
import { t_层级, t_层级类型, t_所有类型 } from "@公共代码/类型";

const log = fn创建日志实例("api/sort.ts");

const app = new Hono();

app.post("/:父级类型", async (c) => {
  const 路径参数_父级类型 = c.req.param("父级类型");
  let 父级类型 = "";
  switch (路径参数_父级类型) {
    case "all":
      父级类型 = "全部数据";
      break;
    case "cate":
      父级类型 = "分类";
      break;
    case "sub-cate":
      父级类型 = "子分类";
      break;
    case "folder":
      父级类型 = "文件夹";
      break;

    default:
      const 信息 = "要排序数据的父级类型不支持！";
      log.warn(信息);
      throw new HTTPException(400, { message: 信息 });
  }

  let 信息 = "";

  let 请求体: { ID: number; 排序: number }[] = [];
  try {
    请求体 = await c.req.json();
  } catch (e) {
    信息 = "请求体不是 JSON 对象";
    log.warn(信息);
    throw new HTTPException(400, { message: 信息 });
  }

  if (!Array.isArray(请求体)) {
    信息 = "请求体不是数组";
    log.warn(信息);
    throw new HTTPException(400, { message: 信息 });
  }
  if (请求体.length < 2) {
    const 信息 = "请求体至少需要 2 项否则排序无意义!";
    log.warn(信息);
    throw new HTTPException(400, { message: 信息 });
  }

  const 所有数据 = fn获取所有导航数据();
  const 父级ID = structuredClone(所有数据.get(请求体[0].ID)?.父级ID);
  let 当前类型 = new Set<t_所有类型>();
  for (let 索引 = 0; 索引 < 请求体.length; 索引++) {
    const 项 = 请求体[索引];
    if (typeof 项 !== "object" || 项 === null) {
      信息 = `第 ${索引 + 1} 项不是对象`;
      log.warn(信息);
      throw new HTTPException(400, { message: 信息 });
    }

    const { ID, 排序 } = 项 as Record<string, unknown>;
    if (ID === undefined) {
      信息 = `第 ${索引 + 1} 项的 ID 缺失`;
      log.warn(信息);
      throw new HTTPException(400, { message: 信息 });
    }
    if (!fn正整数校验(ID).状态) {
      信息 = `第 ${索引 + 1} 项的 ID 必须是正整数，当前值：${String(ID)}`;
      log.warn(信息);
      throw new HTTPException(400, { message: 信息 });
    }

    if (排序 === undefined) {
      信息 = `第 ${索引 + 1} 项的 排序 缺失`;
      log.warn(信息);
      throw new HTTPException(400, { message: 信息 });
    }
    if (!fn正整数校验(排序).状态) {
      信息 = `第 ${索引 + 1} 项的 排序 必须是正整数，当前值：${String(排序)}`;
      log.warn(信息);
      throw new HTTPException(400, { message: 信息 });
    }

    const 元数据 = structuredClone(所有数据.get(请求体[索引].ID));
    if (!元数据) {
      信息 = `第 ${索引 + 1} 项 ID 为 [${请求体[索引].ID}] 的数据不存在！`;
      log.warn(信息);
      throw new HTTPException(400, { message: 信息 });
    }
    if (父级ID !== 元数据.父级ID) {
      信息 = `第 ${索引 + 1} 项 ID 为 [${请求体[索引].ID}] 与其他数据不在同一个父级下！`;
      log.warn(信息);
      throw new HTTPException(400, { message: 信息 });
    }

    当前类型.add(元数据.类型);
  }

  switch (父级类型) {
    case "全部数据":
      if (当前类型.size !== 1 || !当前类型.has("分类")) {
        const 信息 = `[${[...当前类型].join(", ")}] 不是 [${父级类型}] 的直接子元素`;
        log.warn(信息);
        throw new HTTPException(400, { message: 信息 });
      }
      break;
    case "分类":
      if (当前类型.size !== 1 || !当前类型.has("子分类")) {
        const 信息 = `[${[...当前类型].join(", ")}] 不是 [${父级类型}] 的直接子元素`;
        log.warn(信息);
        throw new HTTPException(400, { message: 信息 });
      }
      break;
    case "子分类":
      if (当前类型.size > 2 || !(当前类型.has("导航") || 当前类型.has("文件夹"))) {
        const 信息 = `[${[...当前类型].join(", ")}] 不是 [${父级类型}] 的直接子元素`;
        log.warn(信息);
        throw new HTTPException(400, { message: 信息 });
      }
      break;
    case "文件夹":
      if (当前类型.size !== 1 || !当前类型.has("导航")) {
        const 信息 = `[${[...当前类型].join(", ")}] 不是 [${父级类型}] 的直接子元素`;
        log.warn(信息);
        throw new HTTPException(400, { message: 信息 });
      }
      break;
  }

  for (let 索引 = 0; 索引 < 请求体.length; 索引++) {
    const 项 = 请求体[索引];

    if (所有数据.get(项.ID)?.排序 === 项.排序) {
      log.trace(`ID [${项.ID}] 排序 ${项.排序} 未改变，跳过`);
      continue;
    }

    const 修改结果 = await fn更新(项.ID, { 排序: 项.排序 });
    if (修改结果.状态) continue;

    const 信息 = "服务器出错，请查看日志";
    log.warn(信息, 修改结果.信息);
    throw new HTTPException(400, { message: 信息 });
  }

  信息 = `[${父级类型}] 中 ${请求体.length} 个数据排序成功`;
  log.info(信息);
  return c.text(信息);
});

export default app;
