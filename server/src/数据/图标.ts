import { readdirSync } from "node:fs";
import { const_配置 } from "../启动前检查";

export const const_图标列表: string[] = readdirSync(const_配置.路径_图标目录).sort((前, 后) => {
  const 前_时间戳 = Number(前.split("-")[0]) || 0;
  const 后_时间戳 = Number(后.split("-")[0]) || 0;
  return 后_时间戳 - 前_时间戳;
});
