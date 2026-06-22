import { readFileSync } from "node:fs";
import { const_数据目录 } from "../配置读取";
import { const_账号设置 } from "./账号设置";
import fn创建日志实例 from "../工具/日志";

const log = fn创建日志实例("数据/凭据");

let 普通凭据列表: string[] = Array(const_账号设置.普通凭据登录数量).fill("");
export const fn普通凭据列表 = () => 普通凭据列表;

const 本地普通凭据列表 = JSON.parse(readFileSync(const_数据目录.凭据, "utf-8"));

if (
  !Array.isArray(本地普通凭据列表) ||
  本地普通凭据列表.length !== const_账号设置.普通凭据登录数量
) {
  log.warn(`${const_数据目录.凭据} 内容格式错误，初始化内容`);
}

if (
  本地普通凭据列表.length === const_账号设置.普通凭据登录数量 &&
  本地普通凭据列表.every((元素: any) => typeof 元素 === "string")
) {
  log.info(`${const_数据目录.凭据} 内容格式正确，使用本地内容`);
  普通凭据列表 = 本地普通凭据列表;
}

export const fn普通凭据 = {
  刷新(凭据: string) {
    const 索引 = 普通凭据列表.indexOf(凭据);
    if (索引 === -1) return;
    if (索引 !== 0) {
      普通凭据列表.splice(索引, 1);
      普通凭据列表.unshift(凭据);
    }
  },

  新增(凭据: string) {
    普通凭据列表.pop();
    普通凭据列表.unshift(凭据);
  },

  删除(凭据: string) {
    const 索引 = 普通凭据列表.indexOf(凭据);
    if (索引 > -1) {
      普通凭据列表.splice(索引, 1);
      普通凭据列表.push("");
    }
  },

  查找(凭据: string): boolean {
    return 普通凭据列表.includes(凭据);
  },
};

let 超长凭据列表: string[] = Array(const_账号设置.超长凭据登录数量).fill("");
export const fn超长凭据列表 = () => 超长凭据列表;

const 本地超长凭据列表 = JSON.parse(readFileSync(const_数据目录.超长凭据, "utf-8"));

if (
  !Array.isArray(本地超长凭据列表) ||
  本地超长凭据列表.length !== const_账号设置.普通凭据登录数量
) {
  log.warn(`${const_数据目录.凭据} 内容格式错误，初始化内容`);
}

if (
  本地超长凭据列表.length === const_账号设置.普通凭据登录数量 &&
  本地超长凭据列表.every((元素: any) => typeof 元素 === "string")
) {
  log.info(`${const_数据目录.凭据} 内容格式正确，使用本地内容`);
  超长凭据列表 = 本地超长凭据列表;
}

export const fn超长凭据 = {
  刷新(凭据: string) {
    const 索引 = 超长凭据列表.indexOf(凭据);
    if (索引 === -1) return;
    if (索引 !== 0) {
      超长凭据列表.splice(索引, 1);
      超长凭据列表.unshift(凭据);
    }
  },

  新增(凭据: string) {
    超长凭据列表.pop();
    超长凭据列表.unshift(凭据);
  },

  删除(凭据: string) {
    const 索引 = 超长凭据列表.indexOf(凭据);
    if (索引 > -1) {
      超长凭据列表.splice(索引, 1);
      超长凭据列表.push("");
    }
  },

  查找(凭据: string): boolean {
    return 超长凭据列表.includes(凭据);
  },
};
