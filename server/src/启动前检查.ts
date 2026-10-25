import { accessSync, constants, existsSync, mkdirSync, readdirSync } from "node:fs";

import fn创建日志实例 from "./工具/日志";
import { t_配置 } from "./类型";
import { fn校验密码, fn校验用户名, fn正整数校验 } from "./工具/常用校验";
import { t_导航和层级 } from "@公共代码/类型";
import { dirname, join } from "node:path";
import { fn校验所有数据 } from "../../公共代码/导航数据校验";
const log = fn创建日志实例("启动前检查.ts");

let 配置: t_配置 = {
  用户名: "",
  密码: "",
  长期登录凭据: "",
  数据目录: "/data",
  JWT: "firfe_only_nav_jwt_1234",
  普通登录过期时间: 1,
  普通登录设备数量: 1,
  长期登录过期时间: 30,
  长期登录设备数量: 3,
};

log.info("========= 检测必要的配置 ==========");

//#region 数据目录
const Env_数据目录 = Bun.env.DATA_PATH;
if (Env_数据目录) {
  log.info(`  数据目录 地址 [${Env_数据目录}]`);
  配置.数据目录 = Env_数据目录;
} else {
  log.info(`  数据目录 未设置，使用默认目录 [${配置.数据目录}]`);
}

try {
  mkdirSync(配置.数据目录, { recursive: true });
} catch (e) {
  const err = e as NodeJS.ErrnoException;
  log.fatal(`❌ 数据目录 [${配置.数据目录}] 创建失败: ${err.message}`);
  process.exit(1);
}

try {
  accessSync(配置.数据目录, constants.R_OK | constants.W_OK);
} catch (e) {
  const err = e as NodeJS.ErrnoException;
  if (err.code === "EACCES") {
    log.fatal(`❌ 数据目录 [${配置.数据目录}] 无读写权限`);
  } else {
    log.fatal(`❌ 数据目录 [${配置.数据目录}] 权限检测失败: ${err.message}`);
  }
  process.exit(1);
}
//#endregion

//#region 用户名
const Env_用户名 = Bun.env.USER;
const 用户名校验 = fn校验用户名(Env_用户名);
if (!用户名校验.状态) {
  log.fatal(`❌ 用户名错误 ${用户名校验.信息}`);
  process.exit(1);
}
配置.用户名 = Env_用户名!;
//#endregion

//#region 密码
const Env_密码 = Bun.env.PASS;
const 密码校验 = fn校验密码(Env_密码);
if (!密码校验.状态) {
  log.fatal(`❌ 密码错误 ${密码校验.信息}`);
  process.exit(1);
}
配置.密码 = Env_密码!;
//#endregion

//#region 超长凭据
const Env_长期登录凭据 = Bun.env.LONG_PASS;
if (Env_长期登录凭据) {
  const 长期登录凭据校验 = fn校验密码(Env_长期登录凭据);
  if (!长期登录凭据校验.状态) {
    log.fatal(`❌ 长期登录凭据错误 ${长期登录凭据校验.信息}`);
    process.exit(1);
  }
  配置.长期登录凭据 = Env_长期登录凭据!;
  log.info(`  长期登录凭据 已设置，长期登录功能 开启`);
} else {
  log.info(`  长期登录凭据 未设置，长期登录功能 关闭`);
}
//#endregion

//#region JWT
const Env_JWT = Bun.env.JWT;
if (Env_JWT) {
  if (/\s/.test(Env_JWT)) {
    log.fatal(`❌ JWT 错误 不能包含空格`);
    process.exit(1);
  }

  if (Env_JWT.length < 10) {
    log.fatal(`❌ JWT 错误 长度必须大于等于 10`);
    process.exit(1);
  }
  配置.JWT = Env_JWT!;
} else {
  log.info(`  JWT 未设置，使用默认值 ${配置.JWT}`);
}
//#endregion

//#region 普通过期
const Env_普通登录过期时间 = Bun.env.STD_EXP;
if (Env_普通登录过期时间) {
  const 转数字 = Number(Env_普通登录过期时间);
  if (Number.isNaN(转数字) || 转数字 < 0.05) {
    log.fatal(`❌ 普通登录过期时间 错误 不是 ≥ 0.05 的有效数字 (${Env_普通登录过期时间})`);
    process.exit(1);
  }
  log.info(`  普通登录过期时间  ${转数字} 天`);
  配置.普通登录过期时间 = 转数字;
} else {
  log.info(`  普通登录过期时间 未设置，使用默认值 ${配置.普通登录过期时间} 天`);
}
//#endregion

//#region 普通设备
const Env_普通登录设备数量 = Bun.env.STD_DEV;
if (Env_普通登录设备数量) {
  const 普通登录设备数量校验 = fn正整数校验(Number(Env_普通登录设备数量));
  if (!普通登录设备数量校验.状态) {
    log.fatal(`❌ 普通登录过期时间 错误 ${普通登录设备数量校验.信息}`);
    process.exit(1);
  }
  log.info(`  普通登录设备数量  ${普通登录设备数量校验.内容} 台`);
  配置.普通登录过期时间 = 普通登录设备数量校验.内容;
} else {
  log.info(`  普通登录设备数量 未设置，使用默认值 ${配置.普通登录过期时间} 台`);
}
//#endregion

//#region 超长过期
const Env_长期登录过期时间 = Bun.env.LNG_EXP;
if (Env_长期登录过期时间) {
  const 转数字 = Number(Env_长期登录过期时间);
  if (Number.isNaN(转数字) || 转数字 < 10) {
    log.fatal(`❌ 长期登录过期时间 错误 不是 ≥ 10 的有效数字 (${Env_长期登录过期时间})`);
    process.exit(1);
  }
  log.info(`  长期登录过期时间  ${转数字} 天`);
  配置.长期登录过期时间 = 转数字;
} else {
  log.info(`  长期登录过期时间 未设置，使用默认值 ${配置.长期登录过期时间} 天`);
}
//#endregion

//#region 超长设备
const Env_长期登录设备数量 = Bun.env.LNG_DEV;
if (Env_长期登录设备数量) {
  const 长期登录设备数量校验 = fn正整数校验(Number(Env_长期登录设备数量));
  if (!长期登录设备数量校验.状态) {
    log.fatal(`❌ 长期登录设备数量 错误 ${长期登录设备数量校验.信息}`);
    process.exit(1);
  }
  log.info(`  长期登录设备数量  ${长期登录设备数量校验.内容} 台`);
  配置.长期登录设备数量 = 长期登录设备数量校验.内容;
} else {
  log.info(`  长期登录设备数量 未设置，使用默认值 ${配置.长期登录设备数量} 台`);
}
//#endregion

log.info("========== 配置检测完成 ==========");

export const const_配置 = {
  ...配置,
  路径_导航数据: `${配置.数据目录}/导航.json`,
  路径_普通凭据: `${配置.数据目录}/凭据.json`,
  路径_超长凭据: `${配置.数据目录}/超长凭据.json`,
  路径_个性配置: `${配置.数据目录}/个性配置.json`,
  路径_图标目录: `${配置.数据目录}/图标`,
  Cookie_名称_令牌: "firfe_nav_token",
  Cookie_名称_长期登录标识: "firfe_nav_token_long",
} as const;

//#region 导航数据
const 导航数据 = Bun.file(const_配置.路径_导航数据);

if (!existsSync(const_配置.路径_导航数据)) {
  try {
    await Bun.write(const_配置.路径_导航数据, JSON.stringify([], null, 2));
    log.info(`导航数据文件不存在，已创建: ${const_配置.路径_导航数据}`);
  } catch (e) {
    const 错误信息 = e instanceof Error ? e.message : String(e);
    log.fatal(`无法创建导航数据文件 [${const_配置.路径_导航数据}]: ${错误信息}`);
    process.exit(1);
  }
}

let 导航数据_内容: t_导航和层级[];
try {
  导航数据_内容 = await 导航数据.json();
} catch (e) {
  const err = e instanceof Error ? e.message : String(e);
  log.fatal(`❌ 读取导航数据失败 [${const_配置.路径_导航数据}]: ${err}`);
  process.exit(1);
}

const 校验结果 = fn校验所有数据(导航数据_内容);
if (!校验结果.状态) {
  log.fatal(校验结果.信息);
  process.exit(1);
}
//#endregion

//#region 登录凭据
const 普通凭据 = Bun.file(const_配置.路径_普通凭据);

if (!existsSync(const_配置.路径_普通凭据)) {
  try {
    await Bun.write(const_配置.路径_普通凭据, JSON.stringify([], null, 2));
    log.info(`普通登录凭据文件不存在，已创建: ${const_配置.路径_普通凭据}`);
  } catch (e) {
    const 错误信息 = e instanceof Error ? e.message : String(e);
    log.fatal(`无法创建普通登录凭据文件 [${const_配置.路径_普通凭据}]: ${错误信息}`);
    process.exit(1);
  }
}

let 普通凭据_内容: string[];
try {
  普通凭据_内容 = await 普通凭据.json();
} catch (e) {
  const err = e instanceof Error ? e.message : String(e);
  log.fatal(`❌ 读取普通登录凭据失败 [${const_配置.路径_普通凭据}]: ${err}`);
  process.exit(1);
}

if (!Array.isArray(普通凭据_内容) || !普通凭据_内容.every((item) => typeof item === "string")) {
  log.warn(`[${const_配置.路径_普通凭据}] 内容 不是字符串数组，已重置为空数组`);
  普通凭据_内容 = [];
}

if (普通凭据_内容.length > 配置.普通登录设备数量) {
  普通凭据_内容 = 普通凭据_内容.slice(0, 配置.普通登录设备数量);
} else {
  const 需要补齐的数量 = 配置.普通登录设备数量 - 普通凭据_内容.length;
  普通凭据_内容 = 普通凭据_内容.concat(new Array(需要补齐的数量).fill(""));
}
//#endregion

//#region 超长凭据
let 超长凭据_内容: string[] = [];
if (配置.长期登录凭据) {
  const 超长凭据 = Bun.file(const_配置.路径_超长凭据);

  if (!existsSync(const_配置.路径_超长凭据)) {
    try {
      await Bun.write(const_配置.路径_超长凭据, JSON.stringify([], null, 2));
      log.info(`长期登录凭据文件不存在，已创建: ${const_配置.路径_超长凭据}`);
    } catch (e) {
      const 错误信息 = e instanceof Error ? e.message : String(e);
      log.fatal(`无法创建长期登录凭据文件 [${const_配置.路径_超长凭据}]: ${错误信息}`);
      process.exit(1);
    }
  }

  try {
    超长凭据_内容 = await 超长凭据.json();
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    log.fatal(`❌ 读取长期登录凭据失败 [${const_配置.路径_超长凭据}]: ${err}`);
    process.exit(1);
  }

  if (!Array.isArray(超长凭据_内容) || !超长凭据_内容.every((item) => typeof item === "string")) {
    log.warn(`[${const_配置.路径_超长凭据}] 内容 不是字符串数组，已重置为空数组`);
    超长凭据_内容 = [];
  }

  if (超长凭据_内容.length > 配置.长期登录设备数量) {
    超长凭据_内容 = 超长凭据_内容.slice(0, 配置.长期登录设备数量);
  } else {
    const 需要补齐的数量 = 配置.长期登录设备数量 - 超长凭据_内容.length;
    超长凭据_内容 = 超长凭据_内容.concat(new Array(需要补齐的数量).fill(""));
  }
}
//#endregion

//#region 个性配置
// 预留将来使用
// const 个性配置 = Bun.file(const_配置.路径_个性配置);
//#endregion

//#region 图标
try {
  mkdirSync(const_配置.路径_图标目录, { recursive: true });
} catch (e) {
  const err = e as NodeJS.ErrnoException;
  log.fatal(`❌ 图标目录 [${const_配置.路径_图标目录}] 创建失败: ${err.message}`);
  process.exit(1);
}

try {
  accessSync(const_配置.路径_图标目录, constants.R_OK | constants.W_OK);
} catch (e) {
  const err = e as NodeJS.ErrnoException;
  if (err.code === "EACCES") {
    log.fatal(`❌ 图标目录 [${const_配置.路径_图标目录}] 无读写权限`);
  } else {
    log.fatal(`❌ 图标目录 [${const_配置.路径_图标目录}] 权限检测失败: ${err.message}`);
  }
  process.exit(1);
}

try {
  const 图标列表 = readdirSync(const_配置.路径_图标目录, { withFileTypes: true });

  for (const 图标 of 图标列表) {
    if (!图标.isFile()) continue;
    const 图标路径 = join(const_配置.路径_图标目录, 图标.name);
    accessSync(图标路径, constants.R_OK | constants.W_OK);
  }
} catch (e) {
  const err = e as NodeJS.ErrnoException;
  log.fatal(`❌ 图标目录 中存在不可读文件: ${err.message}`);
  process.exit(1);
}
//#endregion

export const const_初始数据 = {
  全部导航映射: 校验结果.内容,
  普通凭据: 普通凭据_内容,
  超长凭据: 超长凭据_内容,
};
