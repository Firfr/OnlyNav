import { t_成功返回, t_返回 } from "@公共代码/类型";
import { const_配置, const_初始数据 } from "../启动前检查";
import fn创建日志实例 from "../工具/日志";
import { HTTPException } from "hono/http-exception";

const log = fn创建日志实例("数据/凭据");

const 普通凭据列表 = structuredClone(const_初始数据.普通凭据);

const fn普通凭据保存 = async (): Promise<t_成功返回<string>> => {
  try {
    await Bun.write(const_配置.路径_普通凭据, JSON.stringify(普通凭据列表, null, 2));
    return { 状态: true, 内容: "普通凭据 写入本地成功" };
  } catch (e) {
    const err = e as Error;
    log.error(`普通凭据 写入失败`, err.message);
    throw new HTTPException(500, { message: "服务器内部出错，请查看日志！" });
  }
};

export const fn普通凭据 = {
  查找(凭据: string): boolean {
    return 普通凭据列表.includes(凭据);
  },

  async 新增(凭据: string): Promise<t_返回<string>> {
    if (普通凭据列表.includes(凭据)) {
      return { 状态: false, 信息: "凭据 存在" };
    }

    // 删除第一个
    普通凭据列表.shift();
    // 在末尾添加
    普通凭据列表.push(凭据);

    await fn普通凭据保存();
    return { 状态: true, 内容: "凭据 添加后 保存成功" };
  },

  async 删除(凭据: string): Promise<t_返回<string>> {
    const 索引 = 普通凭据列表.indexOf(凭据);
    if (索引 > -1) {
      普通凭据列表.splice(索引, 1);
      普通凭据列表.push("");
    } else {
      return { 状态: false, 信息: "凭据 不存在" };
    }

    await fn普通凭据保存();
    return { 状态: true, 内容: "凭据 添加后 保存成功" };
  },
};

const 超长凭据列表 = structuredClone(const_初始数据.超长凭据);

const fn超长凭据保存 = async (): Promise<t_成功返回<string>> => {
  try {
    await Bun.write(const_配置.路径_超长凭据, JSON.stringify(超长凭据列表, null, 2));
    return { 状态: true, 内容: "超长凭据 写入本地成功" };
  } catch (e) {
    const err = e as Error;
    log.error(`超长凭据 写入失败`, err.message);
    throw new HTTPException(500, { message: "服务器内部出错，请查看日志！" });
  }
};

export const fn超长凭据 = {
  查找(凭据: string): boolean {
    return 超长凭据列表.includes(凭据);
  },

  async 新增(凭据: string): Promise<t_返回<string>> {
    if (超长凭据列表.includes(凭据)) {
      return { 状态: false, 信息: "超长凭据 存在" };
    }

    // 删除第一个
    超长凭据列表.shift();
    // 在末尾添加
    超长凭据列表.push(凭据);

    await fn超长凭据保存();
    return { 状态: true, 内容: "超长凭据添加后 保存成功" };
  },

  async 删除(凭据: string): Promise<t_返回<string>> {
    const 索引 = 超长凭据列表.indexOf(凭据);
    if (索引 > -1) {
      超长凭据列表.splice(索引, 1);
      超长凭据列表.push("");
    } else {
      return { 状态: false, 信息: "超长凭据 不存在" };
    }

    await fn超长凭据保存();
    return { 状态: true, 内容: "超长凭据 添加后 保存成功" };
  },
};
