import { t_导航和层级, t_成功返回, t_返回 } from "@公共代码/类型";
import { const_配置, const_初始数据 } from "../启动前检查";
import fn创建日志实例 from "../工具/日志";
import { HTTPException } from "hono/http-exception";

const log = fn创建日志实例("数据/导航");

const Map_所有导航数据 = structuredClone(const_初始数据.全部导航映射);

export const fn获取所有导航数据 = () => Map_所有导航数据;
export const fn获取公开导航数据 = () => {
  const 公开缓存 = new Map<number, boolean>();

  const fn是否有效公开 = (ID: number): boolean => {
    const 已缓存 = 公开缓存.get(ID);
    if (已缓存 !== undefined) return 已缓存;

    const 数据 = Map_所有导航数据.get(ID);
    if (!数据 || !数据.公开) {
      公开缓存.set(ID, false);
      return false;
    }

    const 结果 = 数据.类型 === "分类" ? true : fn是否有效公开(数据.父级ID);
    公开缓存.set(ID, 结果);
    return 结果;
  };

  const 公开数据: t_导航和层级[] = [];
  for (const 数据 of Map_所有导航数据.values()) {
    if (fn是否有效公开(数据.ID)) 公开数据.push(数据);
  }
  return 公开数据;
};
export const fn获取所有ID集合 = () => new Set<number>(Map_所有导航数据.keys());
export const fn获取当前最大ID = () => Math.max(0, ...fn获取所有ID集合());

const fn数据保存 = async (): Promise<t_成功返回<string>> => {
  try {
    const 转数组 = [...Map_所有导航数据.values()].sort((前, 后) => 前.ID - 后.ID);
    await Bun.write(const_配置.路径_导航数据, JSON.stringify(转数组, null, 2));
    return { 状态: true, 内容: "导航数据写入本地成功" };
  } catch (e) {
    const err = e as Error;
    log.error(`导航数据 [${const_配置.路径_导航数据}] 写入失败`, err.message);
    throw new HTTPException(500, { message: "服务器内部出错，请查看日志！" });
  }
};

export const fn添加 = async (数据: t_导航和层级): Promise<t_返回<string>> => {
  if (Map_所有导航数据.has(数据.ID)) {
    const 信息 = `ID 为 [${数据.ID}] 的 ${数据.类型} 已经存在！`;
    log.warn(信息);
    return { 状态: false, 信息: 信息 };
  }

  数据.名称 = 数据.名称.trim();
  数据.描述 = 数据.描述.trim();

  Map_所有导航数据.set(数据.ID, 数据);

  await fn数据保存();
  return { 状态: true, 内容: `ID 为 [${数据.ID}] 的 ${数据.类型} 添加成功` };
};

export const fn更新 = async (
  ID: number,
  更新信息: Partial<t_导航和层级>,
): Promise<t_返回<string>> => {
  const 原数据 = Map_所有导航数据.get(ID) as t_导航和层级;

  if (!原数据) {
    const 信息 = `ID 为 [${ID}] 的数据不存在！`;
    log.warn(信息);
    return { 状态: false, 信息: 信息 };
  }

  if ("名称" in 更新信息) {
    更新信息.名称 = 更新信息.名称!.trim();
  }
  if ("描述" in 更新信息) {
    更新信息.描述 = 更新信息.描述!.trim();
  }

  Map_所有导航数据.set(ID, { ...原数据, ...更新信息 } as t_导航和层级);

  await fn数据保存();
  return { 状态: true, 内容: `ID 为 [${ID}] 的 ${原数据.类型} 更新成功` };
};

export const fn删除 = async (ID: number): Promise<t_返回<string>> => {
  if (!Map_所有导航数据.has(ID)) {
    const 信息 = `ID 为 [${ID}] 的数据 不存在！`;
    log.warn(信息);
    return { 状态: false, 信息: 信息 };
  }

  Map_所有导航数据.delete(ID);

  await fn数据保存();
  return { 状态: true, 内容: `ID 为 [${ID}] 的数据 删除成功` };
};
