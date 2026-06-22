import { readFileSync, writeFileSync } from "node:fs";
import { const_数据目录 } from "../配置读取";
import { fn普通凭据列表, fn超长凭据列表 } from "../数据/凭据";
import fn创建日志实例 from "../工具/日志";

const log = fn创建日志实例("工具/退出前执行");
console.log();

const fn退出前执行 = () => {
  try {
    writeFileSync(const_数据目录.凭据, JSON.stringify(fn普通凭据列表(), null, 2));
    log.info(`保存 ${const_数据目录.凭据} 成功`);
    log.debug(`内容：${JSON.stringify(fn普通凭据列表(), null, 2)}`);
  } catch (error) {
    log.fatal(`保存 ${const_数据目录.凭据} 失败`);
  }
  try {
    writeFileSync(const_数据目录.超长凭据, JSON.stringify(fn超长凭据列表(), null, 2));
    log.info(`保存 ${const_数据目录.超长凭据} 成功`);
    log.debug(`内容：${JSON.stringify(fn超长凭据列表(), null, 2)}`);
  } catch (error) {
    log.fatal(`保存 ${const_数据目录.超长凭据} 失败`);
  }
};

/**
 * SIGINT
 * 触发：终端按下 Ctrl + C
 * 场景：手动终止程序，最常用退出方式
 */
process.on("SIGINT", () => {
  log.info("[信号] 收到 Ctrl+C 退出");
  fn退出前执行();
  process.exit(0);
});

/**
 * SIGTERM
 * 触发：kill 命令、Docker容器停止、服务器优雅下线、pm2 重启/停止
 * 场景：生产环境容器、进程管理工具下发的终止信号
 */
process.on("SIGTERM", () => {
  log.info("[信号] 收到优雅终止信号 SIGTERM");
  fn退出前执行();
  process.exit(0);
});

/**
 * SIGHUP
 * 触发：关闭终端窗口、SSH 断开会话
 * 场景：远程服务器关掉控制台窗口，进程会收到此信号
 */
process.on("SIGHUP", () => {
  log.info("[信号] 终端会话关闭 SIGHUP");
  fn退出前执行();
  process.exit(0);
});

/**
 * uncaughtException
 * 触发：同步代码未被 try/catch 捕获的致命错误
 * 例：变量未定义、语法错误、同步函数抛错未捕获
 */
process.on("uncaughtException", (err) => {
  log.error("[异常] 未捕获同步致命错误：", err.message);
  fn退出前执行();
  process.exit(1); // 非0标识异常退出
});

/**
 * unhandledRejection
 * 触发：Promise 异步报错，没有 .catch() 也没有 await try/catch
 * 例：接口请求失败、异步函数抛错未处理
 */
process.on("unhandledRejection", (reason, promise) => {
  log.error("[异常] 未捕获 Promise 异步错误：", reason);
  fn退出前执行();
  process.exit(1);
});

/**
 * exit
 * 触发：进程即将真正退出时（无论正常/异常调用process.exit）
 * 注意：
 * 1. 里面不能再写异步代码，不会执行
 * 2. Ctrl+C、kill 走完SIGINT/SIGTERM后也会走到这里，前提是要捕获
 */
process.on("exit", (code) => {
  log.info(`[进程] 即将退出，退出码：${code}`);
});
