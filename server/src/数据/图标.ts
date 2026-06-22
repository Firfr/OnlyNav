import { readdirSync } from "node:fs";
import { const_数据目录 } from "../配置读取";

export const const_图标列表: string[] = readdirSync(const_数据目录.图标).sort(
  (a, b) => -a.localeCompare(b),
);


