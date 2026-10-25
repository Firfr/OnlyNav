import type { t_导航 } from "@公共代码/类型";
import { ref_是内网 } from "../全局共享数据";
import { fn等待 } from "./等待";

const 特殊开头链接 = ["chrome://", "edge://"];

const fn打开链接 = async (链接: string) => {
  if (特殊开头链接.some((开头) => 链接.startsWith(开头))) {
    console.log("当前连接是浏览器设置页面");
    ElMessage(`浏览器设置页面无法通过代码打开\n需要手动打开，正在复制到剪切板。`);
    fn剪切板写入(链接);
    return true;
  }

  if (!/^https?:\/\//i.test(链接)) {
    console.log("当前内容不是有效的链接：", 链接);
    ElMessage(`内容不是有效的链接，\n正在复制到剪切板。`);
    fn剪切板写入(链接);
    return true;
  }

  ElMessage(`打开 导航 ${链接}`);

  await fn等待(0.1);

  window.open(链接, "_blank", "noopener noreferrer");
};
export const fn打开导航 = (导航: t_导航 | string) => {
  if (typeof 导航 === "string") {
    fn打开链接(导航);
    return;
  }
  if (ref_是内网.value) {
    if (导航.内网地址) {
      fn打开链接(导航.内网地址);
      return;
    }
    fn打开链接(导航.外网地址 as string);
    return;
  }
  if (导航.外网地址) {
    fn打开链接(导航.外网地址);
    return;
  }
  fn打开链接(导航.内网地址 as string);
  return;
};
