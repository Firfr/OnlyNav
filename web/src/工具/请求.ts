import type { t_返回 } from "@公共代码/类型";
import { ref_是否登录 } from "../全局响应式数据";

const const_接口前缀 = "/api";
const fn错误消息提示 = (信息: string) => {
  ElMessage.error({
    message: 信息,
    placement: "bottom-right",
    duration: 5000,
  });
};

function fn是否登录(请求路径: string, 状态码: number, 响应数据: any) {
  if (请求路径 === "/auth") return true;
  if (状态码 === 401) {
    fn错误消息提示(`${请求路径} ${响应数据.信息}`);
    ref_是否登录.value = false;
    return false;
  }
  return true;
}

/**
 * 发送请求
 * @参数 请求路径 接口后缀路径（自动拼接 /api 前缀）
 * @参数 请求体 发送给后端的 JSON 参数对象
 * @返回 统一封装结果对象
 */
export async function fn发送请求(
  请求方法: "POST" | "GET" | "PUT" | "DELETE" | "PATCH",
  请求路径: string,
  请求体?: { [key: string]: any },
): Promise<t_返回> {
  try {
    const 完整请求地址 = const_接口前缀 + 请求路径;

    const 请求配置: RequestInit = {
      method: 请求方法,
    };

    if (请求体) {
      请求配置.headers = { "Content-Type": "application/json" };
      请求配置.body = JSON.stringify(请求体);
    }

    const 响应 = await fetch(完整请求地址, 请求配置);

    const 响应数据 = await 响应.json();
    const 是否登录 = fn是否登录(请求路径, 响应.status, 响应数据);
    if (!是否登录) return { 状态: false, 信息: `未登录` };

    if (!响应.ok) {
      throw new Error(`错误: ${响应.status} ${响应数据.信息}`);
    }

    return 响应数据;
  } catch (错误信息) {
    console.error("请求异常", 错误信息);
    if (请求路径 !== "/auth") {
      fn错误消息提示(`请求 ${请求路径} 出错 ${错误信息}`);
    }
    return { 状态: false, 信息: `请求失败，${错误信息}` };
  }
}
