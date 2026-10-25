import { t_全部数据映射, t_导航和层级, t_所有类型 } from "@公共代码/类型";
import { HTTPException } from "hono/http-exception";
import fn创建日志实例 from "./日志";

const log = fn创建日志实例("工具/操作校验.ts");

export const fn不可更新字段校验 = (请求体: Partial<t_导航和层级>) => {
  let 报错信息 = "";
  if ("ID" in 请求体) {
    报错信息 = `属性 "ID" 不可更新。`;
    log.warn(报错信息);
    throw new HTTPException(422, { message: 报错信息 });
  }

  if ("类型" in 请求体) {
    报错信息 = `属性 "类型" 不可更新。`;
    log.warn(报错信息);
    throw new HTTPException(422, { message: 报错信息 });
  }

  if ("父级ID" in 请求体) {
    报错信息 = `属性 "父级ID" 不可更新。`;
    log.warn(报错信息);
    throw new HTTPException(422, { message: 报错信息 });
  }
};

export const fn存在检测 = (ID: number, 类型: t_所有类型, 数据: t_导航和层级 | undefined) => {
  let 报错信息 = "";
  if (!数据) {
    报错信息 = `未找到 ID 为 [${ID}] 的 数据`;
    log.warn(报错信息);
    throw new HTTPException(404, { message: 报错信息 });
  }

  if (数据.类型 !== 类型) {
    报错信息 = `未找到 ID 为 [${ID}] 的 ${类型}`;
    log.warn(报错信息);
    throw new HTTPException(404, { message: 报错信息 });
  }
};

export const fn是否存在子内容 = (ID: number, 所有数据映射: t_全部数据映射): boolean => {
  for (const 数据 of 所有数据映射.values()) {
    if (数据.父级ID === ID) {
      return true;
    }
  }
  return false;
};
