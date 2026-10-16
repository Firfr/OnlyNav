export const env_日志等级 = (Bun.env.LOG_LEVEL || "").toLowerCase();

export const 日志等级对照 = {
  trace: { 名称: "跟踪", 权重: 10, 颜色: "\x1b[90m" },
  debug: { 名称: "调试", 权重: 20, 颜色: "\x1b[36m" },
  info: { 名称: "信息", 权重: 30, 颜色: "\x1b[32m" },
  warn: { 名称: "警告", 权重: 40, 颜色: "\x1b[33m" },
  error: { 名称: "错误", 权重: 50, 颜色: "\x1b[31m" },
  fatal: { 名称: "程序崩溃", 权重: 60, 颜色: "\x1b[35m" },
} as const;

const 设置等级 =
  env_日志等级 in 日志等级对照
    ? 日志等级对照[env_日志等级 as keyof typeof 日志等级对照]
    : 日志等级对照.info;

const 显示时间 = 设置等级.权重 <= 20;

const 时间格式化器 = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/**
 * 创建一个自定义日志工具实例
 * @参数 文件路径 可选参数，指定当前日志输出所属的文件路径，用于调试定位
 * @返回 包含日志输出方法的工具对象：trace(跟踪)、debug(调试)、info(信息)、warn(警告)、error(错误)、fatal(程序崩溃)
 * @描述
 * 日志规则：
 * 1. 根据环境变量 LOG_LEVEL 控制日志输出级别 默认 info
 * 2. TRACE / DEBUG 级别会自动显示时间戳，其他级别不显示时间
 * 3. 日志级别自动转为中文显示
 * 4. 支持可选传入文件路径，方便定位日志来源
 */
const fn创建日志实例 = (文件路径?: string) => {
  // 修改：接收任意数量的参数
  const fn执行日志输出 = (
    调用级别: (typeof 日志等级对照)[keyof typeof 日志等级对照],
    ...args: any[]
  ) => {
    if (设置等级.权重 > 调用级别.权重) {
      return;
    }

    const 路径展示 = 文件路径 ? ` [${文件路径}]` : "";

    let 前缀 = "";

    // 调试模式：带时间
    if (显示时间) {
      const 标准时间 = 时间格式化器.format(new Date());
      前缀 = `[${标准时间}] ${调用级别.颜色}[${调用级别.名称}]\x1b[0m${路径展示}`;
    }
    // 普通模式：无时间
    else {
      前缀 = `[${调用级别.名称}]${路径展示} `;
    }

    // 将前缀作为第一个参数，后续参数原样透传
    // 这样既保留了自定义格式，又利用了 console.log 对对象/数组的原生美化输出
    console.log(前缀, ...args);
  };

  // 对外暴露的日志方法，修改为接受可变参数
  return {
    // 跟踪 trace
    trace: (...args: any[]) => fn执行日志输出(日志等级对照.trace, ...args),
    // 调试 debug
    debug: (...args: any[]) => fn执行日志输出(日志等级对照.debug, ...args),
    // 信息 info
    info: (...args: any[]) => fn执行日志输出(日志等级对照.info, ...args),
    // 警告 warn
    warn: (...args: any[]) => fn执行日志输出(日志等级对照.warn, ...args),
    // 错误 error
    error: (...args: any[]) => fn执行日志输出(日志等级对照.error, ...args),
    // 崩溃 fatal
    fatal: (...args: any[]) => fn执行日志输出(日志等级对照.fatal, ...args),
  };
};

export default fn创建日志实例;
