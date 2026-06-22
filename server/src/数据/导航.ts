import { readFileSync } from "node:fs";
import { const_数据目录 } from "../配置读取";
import { t_分类, t_子分类, t_导航, t_导航和层级, t_文件夹, t_返回 } from "@公共代码/类型";
import {
  fnID校验_分类,
  fnID校验_子分类,
  fnID校验_文件夹,
  fn校验所有数据,
} from "@公共代码/导航数据校验";
import fn创建日志实例 from "../工具/日志";

const log = fn创建日志实例("数据/导航");

const 所有导航数据: t_导航和层级[] = JSON.parse(readFileSync(const_数据目录.导航, "utf-8"));

const 校验结果 = fn校验所有数据(所有导航数据);
if (!校验结果.状态) {
  throw new Error(校验结果.信息);
}
log.info("导航数据校验通过");

export const fn获取所有导航数据 = () => 所有导航数据;
export const fn获取公开导航数据 = () => {
  const map = new Map(所有导航数据.map((元素) => [元素.ID, 元素]));
  const fn是否公开 = (元素: t_导航和层级) => {
    if (!元素.公开) return false;
    const 父级元素 = map.get(元素.父级ID);
    if (父级元素) return 父级元素.公开;
    return 元素.公开;
  };
  return 所有导航数据.filter(fn是否公开);
};
export const fn获取所有ID集合 = () => new Set<number>(所有导航数据.map((元素) => 元素.ID));
export const fn获取当前最大ID = () => Math.max(0, ...fn获取所有ID集合());

// #region 导航
export const fn导航_添加 = async (导航: t_导航): Promise<t_返回> => {
  所有导航数据.push(导航);
  await Bun.write(const_数据目录.导航, JSON.stringify(所有导航数据, null, 2));
  log.debug("添加导航数据成功，数据：", JSON.stringify(导航));
  return { 状态: true, 信息: "添加导航成功", 内容: 导航 };
};

export const fn导航_更新 = async (导航ID: number, 更新信息: Partial<t_导航>): Promise<t_返回> => {
  const 原数据索引 = 所有导航数据.findIndex((元素) => 元素.ID === 导航ID && 元素.类型 === "导航");
  if (原数据索引 === -1) {
    return { 状态: false, 信息: `ID 为 ${导航ID} 的导航不存在` };
  }
  (所有导航数据[原数据索引] as unknown) = { ...所有导航数据[原数据索引], ...更新信息 };

  await Bun.write(const_数据目录.导航, JSON.stringify(所有导航数据, null, 2));
  log.debug(`导航 ${导航ID} 数据更新成功，更新部分数据：`, JSON.stringify(更新信息));
  return { 状态: true, 信息: `导航 ${导航ID} 数据更新成功`, 内容: 所有导航数据[原数据索引] };
};

export const fn导航_删除 = async (ID: number): Promise<t_返回> => {
  const 数据索引 = 所有导航数据.findIndex((元素) => 元素.ID === ID && 元素.类型 === "导航");
  if (数据索引 === -1) return { 状态: false, 信息: `ID 为 ${ID} 的导航不存在` };

  const 要删除数据 = 所有导航数据[数据索引];

  所有导航数据.splice(数据索引, 1);

  await Bun.write(const_数据目录.导航, JSON.stringify(所有导航数据, null, 2));

  log.debug("删除导航数据成功，被删除数据：", JSON.stringify(要删除数据));
  return { 状态: true, 信息: "删除成功", 内容: 要删除数据 };
};
// #endregion

// #region 文件夹
export const fn文件夹_删除 = async (ID: number): Promise<t_返回> => {
  const ID校验 = fnID校验_文件夹(所有导航数据, ID);
  if (!ID校验.状态) return { 状态: false, 信息: ID校验.信息 };

  const 数据索引 = 所有导航数据.findIndex((元素) => 元素.ID === ID && 元素.类型 === "文件夹");
  if (数据索引 === -1) return { 状态: false, 信息: `ID 为 ${ID} 的文件夹不存在` };

  const 要删除数据 = 所有导航数据[数据索引];
  const 直接子内容集合 = 所有导航数据.filter((元素) => 元素.父级ID === ID);

  for (const 子内容 of 直接子内容集合) {
    const 删除子内容 = await fn导航_删除(子内容.ID);
    if (!删除子内容.状态) {
      return { 状态: false, 信息: `ID 为 ${ID} 的文件夹\n  ${删除子内容.信息}` };
    }
  }

  所有导航数据.splice(数据索引, 1);

  await Bun.write(const_数据目录.导航, JSON.stringify(所有导航数据, null, 2));

  log.debug("删除文件夹数据成功，被删除数据：", JSON.stringify(要删除数据));
  return { 状态: true, 信息: "删除成功", 内容: 要删除数据 };
};

export const fn文件夹_添加 = async (文件夹数据: t_文件夹): Promise<t_返回> => {
  所有导航数据.push(文件夹数据);
  await Bun.write(const_数据目录.导航, JSON.stringify(所有导航数据, null, 2));
  log.debug("添加文件夹数据成功，数据：", JSON.stringify(文件夹数据));
  return { 状态: true, 信息: "添加分类成功", 内容: 文件夹数据 };
};

export const fn文件夹_更新 = async (
  文件夹ID: number,
  更新信息: Partial<t_文件夹>,
): Promise<t_返回> => {
  const 原数据索引 = 所有导航数据.findIndex(
    (元素) => 元素.ID === 文件夹ID && 元素.类型 === "文件夹",
  );
  if (原数据索引 === -1) {
    return { 状态: false, 信息: `ID 为 ${文件夹ID} 的文件夹不存在` };
  }
  (所有导航数据[原数据索引] as unknown) = { ...所有导航数据[原数据索引], ...更新信息 };

  await Bun.write(const_数据目录.导航, JSON.stringify(所有导航数据, null, 2));
  log.debug(`文件夹 ${文件夹ID} 数据更新成功，更新部分数据：`, JSON.stringify(更新信息));
  return { 状态: true, 信息: `文件夹 ${文件夹ID} 数据更新成功`, 内容: 所有导航数据[原数据索引] };
};
// #endregion

// #region 子分类
export const fn子分类_删除 = async (ID: number): Promise<t_返回> => {
  const ID校验 = fnID校验_子分类(所有导航数据, ID);
  if (!ID校验.状态) return { 状态: false, 信息: ID校验.信息 };

  const 数据索引 = 所有导航数据.findIndex((元素) => 元素.ID === ID && 元素.类型 === "子分类");
  if (数据索引 === -1) return { 状态: false, 信息: `ID 为 ${ID} 的子分类不存在` };

  const 要删除数据 = 所有导航数据[数据索引];
  const 直接子内容集合 = 所有导航数据.filter((元素) => 元素.父级ID === ID);

  for (const 子内容 of 直接子内容集合) {
    if (子内容.类型 === "导航") {
      const 删除子内容 = await fn导航_删除(子内容.ID);
      if (!删除子内容.状态) {
        return { 状态: false, 信息: `ID 为 ${ID} 的子分类\n  ${删除子内容.信息}` };
      }
      continue;
    }
    const 删除子内容 = await fn文件夹_删除(子内容.ID);
    if (!删除子内容.状态) {
      return { 状态: false, 信息: `ID 为 ${ID} 的子分类\n  ${删除子内容.信息}` };
    }
  }

  所有导航数据.splice(数据索引, 1);

  await Bun.write(const_数据目录.导航, JSON.stringify(所有导航数据, null, 2));

  log.debug("删除子分类数据成功，被删除数据：", JSON.stringify(要删除数据));
  return { 状态: true, 信息: "删除成功", 内容: 要删除数据 };
};

export const fn子分类_添加 = async (子分类数据: t_子分类): Promise<t_返回> => {
  所有导航数据.push(子分类数据);
  await Bun.write(const_数据目录.导航, JSON.stringify(所有导航数据, null, 2));
  log.debug("添加子分类数据成功，数据：", JSON.stringify(子分类数据));
  return { 状态: true, 信息: "添加分类成功", 内容: 子分类数据 };
};

export const fn子分类_更新 = async (
  子分类ID: number,
  更新信息: Partial<t_子分类>,
): Promise<t_返回> => {
  const 原数据索引 = 所有导航数据.findIndex(
    (元素) => 元素.ID === 子分类ID && 元素.类型 === "子分类",
  );
  if (原数据索引 === -1) {
    return { 状态: false, 信息: `ID 为 ${子分类ID} 的子分类不存在` };
  }
  (所有导航数据[原数据索引] as unknown) = { ...所有导航数据[原数据索引], ...更新信息 };

  await Bun.write(const_数据目录.导航, JSON.stringify(所有导航数据, null, 2));
  log.debug(`子分类 ${子分类ID} 数据更新成功，更新部分数据：`, JSON.stringify(更新信息));
  return { 状态: true, 信息: `子分类 ${子分类ID} 数据更新成功`, 内容: 所有导航数据[原数据索引] };
};
// #endregion

// #region 分类
export const fn分类_删除 = async (ID: number): Promise<t_返回> => {
  const ID校验 = fnID校验_分类(所有导航数据, ID);
  if (!ID校验.状态) return { 状态: false, 信息: ID校验.信息 };

  const 数据索引 = 所有导航数据.findIndex((元素) => 元素.ID === ID && 元素.类型 === "分类");
  if (数据索引 === -1) return { 状态: false, 信息: `ID 为 ${ID} 的分类不存在` };

  const 要删除数据 = 所有导航数据[数据索引];
  const 直接子内容集合 = 所有导航数据.filter((元素) => 元素.父级ID === ID);

  for (const 子内容 of 直接子内容集合) {
    const 删除子内容 = await fn子分类_删除(子内容.ID);
    if (!删除子内容.状态) {
      return { 状态: false, 信息: `ID 为 ${ID} 的分类\n  ${删除子内容.信息}` };
    }
  }

  所有导航数据.splice(数据索引, 1);

  await Bun.write(const_数据目录.导航, JSON.stringify(所有导航数据, null, 2));

  log.debug("删除分类数据成功，被删除数据：", JSON.stringify(要删除数据));
  return { 状态: true, 信息: "删除成功", 内容: 要删除数据 };
};

export const fn分类_添加 = async (分类数据: t_分类): Promise<t_返回> => {
  所有导航数据.push(分类数据);
  await Bun.write(const_数据目录.导航, JSON.stringify(所有导航数据, null, 2));
  log.debug("添加分类数据成功，数据：", JSON.stringify(分类数据));
  return { 状态: true, 信息: "添加分类成功", 内容: 分类数据 };
};

export const fn分类_更新 = async (分类ID: number, 更新信息: Partial<t_分类>): Promise<t_返回> => {
  const 原数据索引 = 所有导航数据.findIndex((元素) => 元素.ID === 分类ID && 元素.类型 === "分类");
  if (原数据索引 === -1) {
    return { 状态: false, 信息: `ID 为 ${分类ID} 的分类不存在` };
  }

  (所有导航数据[原数据索引] as unknown) = { ...所有导航数据[原数据索引], ...更新信息 };

  await Bun.write(const_数据目录.导航, JSON.stringify(所有导航数据, null, 2));
  log.debug(`分类 ${分类ID} 数据更新成功，更新部分数据：`, JSON.stringify(更新信息));
  return { 状态: true, 信息: `分类 ${分类ID} 数据更新成功`, 内容: 所有导航数据[原数据索引] };
};
// #endregion
