type t_日志级别标识 = "trace" | "debug" | "info" | "warn" | "error" | "fatal";
type t_日志级别数值 = 10 | 20 | 30 | 40 | 50 | 60;

const let_中文级别对照表 = {
  10: "跟踪",
  20: "调试",
  30: "信息",
  40: "警告",
  50: "错误",
  60: "程序崩溃",
} as const;

const let_级别数值对照表 = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
} as const;

const const_环境日志原始值 = Bun.env.LOG_LEVEL || "";
const const_环境日志级别 = (const_环境日志原始值.toLowerCase() || "info") as t_日志级别标识;

export const const_当前启用级别数值 = let_级别数值对照表[const_环境日志级别] || 30;

console.log();
console.log(`当前日志级别：${let_中文级别对照表[const_当前启用级别数值]}`);
console.log();

const let_是否显示时间 = const_当前启用级别数值 <= 20;

/**
 * 创建一个自定义日志工具实例
 * @参数 文件路径 可选参数，指定当前日志输出所属的文件路径，用于调试定位
 * @返回 包含日志输出方法的工具对象：trace(跟踪)、debug(调试)、info(信息)、warn(警告)、error(错误)、fatal(程序崩溃)
 * @description
 * 日志规则：
 * 1. 根据环境变量 LOG_LEVEL 控制日志输出级别
 * 2. TRACE / DEBUG 级别会自动显示时间戳，其他级别不显示时间
 * 3. 日志级别自动转为中文显示
 * 4. 支持可选传入文件路径，方便定位日志来源
 */
const fn创建日志实例 = (文件路径?: string) => {
  // 修改：接收任意数量的参数
  const fn执行日志输出 = (级别数值: t_日志级别数值, ...args: any[]) => {
    if (const_当前启用级别数值 > 级别数值) {
      return;
    }

    const 中文级别名称 = let_中文级别对照表[级别数值];
    const 路径展示 = 文件路径 ? ` [${文件路径}]` : "";

    let 前缀 = "";

    // 调试模式：带时间
    if (let_是否显示时间) {
      const 标准时间格式 = new Date().toISOString().replace("T", " ").split(".")[0];
      前缀 = `[${标准时间格式}] [${中文级别名称}]${路径展示}：`;
    }
    // 普通模式：无时间
    else {
      前缀 = `[${中文级别名称}]${路径展示} `;
    }

    // 将前缀作为第一个参数，后续参数原样透传
    // 这样既保留了自定义格式，又利用了 console.log 对对象/数组的原生美化输出
    console.log(前缀, ...args);
  };

  // 对外暴露的日志方法，修改为接受可变参数
  return {
    // 跟踪 trace
    trace: (...args: any[]) => fn执行日志输出(10, ...args),
    // 调试 debug
    debug: (...args: any[]) => fn执行日志输出(20, ...args),
    // 信息 info
    info: (...args: any[]) => fn执行日志输出(30, ...args),
    // 警告 warn
    warn: (...args: any[]) => fn执行日志输出(40, ...args),
    // 错误 error
    error: (...args: any[]) => fn执行日志输出(50, ...args),
    // 崩溃 fatal
    fatal: (...args: any[]) => fn执行日志输出(60, ...args),
  };
};

export default fn创建日志实例;
