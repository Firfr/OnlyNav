import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import fn创建日志实例 from "./工具/日志";
import { fn随机字符串 } from "./工具/其他工具";
import { t_账号设置 } from "@公共代码/类型";

const log = fn创建日志实例("配置读取");

log.info("===== 开始加载配置 =====");
const 日志前缀空格 = " ";

const 环境变量端口 = Bun.env.PORT;
let let_端口 = 5191;
if (typeof 环境变量端口 === "string") {
  const 环境变量端口转数字 = parseInt(环境变量端口, 10);
  if (isNaN(环境变量端口转数字)) {
    throw new Error("环境变量 PORT 不是一个有效的数字");
  }
  if (环境变量端口转数字 >= 1 && 环境变量端口转数字 <= 65535) {
    let_端口 = 环境变量端口转数字;
    log.info(日志前缀空格, `使用从环境变量读取的端口: ${let_端口}`);
  } else {
    throw new Error("❌ 环境变量 PORT 的值超出范围 (1 ~ 65535)");
  }
} else {
  log.info(日志前缀空格, `使用默认端口: ${let_端口}`);
}
const const_端口 = let_端口;

const 环境变量数据目录 = Bun.env.DATA_PATH;
let let_数据目录 = "/data";
if (typeof 环境变量数据目录 === "string") {
  let_数据目录 = 环境变量数据目录;
}
if (!existsSync(let_数据目录)) {
  log.info(日志前缀空格, "数据目录不存在");
  try {
    mkdirSync(let_数据目录, { recursive: true });
    log.info(日志前缀空格, "✅ 数据目录 ${let_数据目录} 已创建");
  } catch (err) {
    throw new Error(`❌ 目录创建失败 ${err instanceof Error ? err.message : err}`);
  }
}
const const_数据目录 = {
  导航: `${let_数据目录}/导航.json` as const,
  账号设置: `${let_数据目录}/账号设置.json` as const,
  个性配置: `${let_数据目录}/个性配置.json` as const,
  凭据: `${let_数据目录}/凭据.json` as const,
  超长凭据: `${let_数据目录}/超长凭据.json` as const,
  图标: `${let_数据目录}/图标` as const,
};

if (!existsSync(const_数据目录.图标)) {
  log.info(日志前缀空格, "图标目录不存在");
  try {
    mkdirSync(const_数据目录.图标, { recursive: true });
    log.info(日志前缀空格, "✅ 图标目录 ${const_数据目录.图标} 已创建");
  } catch (err) {
    throw new Error(`❌ 图标目录创建失败 ${err instanceof Error ? err.message : err}`);
  }
} else {
  log.info(日志前缀空格, `图标目录 ${const_数据目录.图标} 已存在`);
}

const fn文件初步校验 = (文件路径: string, 默认内容: any, 配置名称?: string) => {
  if (!existsSync(文件路径)) {
    log.info(日志前缀空格, `文件 ${文件路径} 不存在`);
    try {
      writeFileSync(文件路径, JSON.stringify(默认内容, null, 2));
      log.info(日志前缀空格, `✅ 创建文件: ${文件路径} 并初始化`);
      if (配置名称 === "账号设置") {
        log.info(日志前缀空格, `使用默认账号设置： ${JSON.stringify(默认内容, null, 2)}`);
      }
    } catch (err) {
      throw new Error(`❌ 创建文件失败 ${文件路径}: ${err instanceof Error ? err.message : err}`);
    }
    return;
  }

  log.info(日志前缀空格, `文件 ${文件路径} 存在，检验是否是合法的 JSON 文件`);
  try {
    const content = readFileSync(文件路径, "utf-8");
    JSON.parse(content);
    log.info(日志前缀空格, `✅ 文件初步验证通过: ${文件路径}`);
  } catch (err) {
    throw new Error(`❌ 文件格式错误 ${文件路径}: 不是合法的 JSON 格式`);
  }
};

const 账号设置默认值: t_账号设置 = {
  用户名: fn随机字符串(),
  密码: fn随机字符串(),
  JWT_密钥: fn随机字符串(32),
  过期时间: 3,
  普通凭据登录数量: 3,
  超长凭据过期时间: 1,
  超长凭据登录数量: 1,
};

fn文件初步校验(const_数据目录.导航, []);
fn文件初步校验(const_数据目录.账号设置, 账号设置默认值, "账号设置");
fn文件初步校验(const_数据目录.个性配置, {});
fn文件初步校验(const_数据目录.凭据, []);
fn文件初步校验(const_数据目录.超长凭据, []);

export { const_端口, const_数据目录 };
log.info("===== 配置加载完毕 =====");
console.log();
