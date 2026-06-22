import { ref_是否登录, rea_登录信息, cmp_导航层级Map } from "../全局响应式数据";
import type { t_层级信息, t_层级数据 } from "../类型";
import { fn发送请求 } from "./请求";

/**
 * 异步等待指定秒数
 * @参数 秒 - 需要等待的时间，单位：秒
 * @返回 Promise
 */
export const wait = (秒: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 秒 * 1000);
  });
};

export const fn获取登录状态 = async () => {
  const 请求登录状态 = await fn发送请求("GET", "/auth");
  console.log("请求登录状态", 请求登录状态);
  if (请求登录状态.状态) {
    ref_是否登录.value = true;
    rea_登录信息.登录方式 = 请求登录状态.内容.登录方式;
    rea_登录信息.过期时间 = 请求登录状态.内容.过期时间;
  } else {
    ref_是否登录.value = false;
    rea_登录信息.登录方式 = "-";
    rea_登录信息.过期时间 = "-";
  }
};

/**
 * 判断图标地址是否是外部链接，外部连接直接返回，本地图标则补全地址
 * @参数 图标地址
 * @返回 最终的图标地址
 */
export const fn图标地址转换 = (地址: string | undefined) => {
  if (!地址) {
    return 地址;
  }
  if (地址.startsWith("http://") || 地址.startsWith("https://")) {
    return 地址;
  } else {
    return `/api/icon/file/${地址}`;
  }
};

export const fn层级数据转信息 = <T extends t_层级数据>(数据: T): t_层级信息<T> => {
  let 返回数据 = {
    ...数据,
    子内容数量: -1,
    子内容公开数量: -1,
    子内容私有数量: -1,
    子分类中导航数量: -1,
    子分类中文件夹数量: -1,
  };

  const 层级内容列表 = cmp_导航层级Map.value.get(数据.ID);
  if (!层级内容列表) return 返回数据;

  返回数据.子内容数量 = 层级内容列表.length;

  返回数据.子内容公开数量 = 层级内容列表.filter((内容) => 内容.公开).length;
  返回数据.子内容私有数量 = 返回数据.子内容数量 - 返回数据.子内容公开数量;

  if (数据.类型 === "子分类") {
    返回数据.子分类中导航数量 = 层级内容列表.filter((内容) => 内容.类型 === "导航").length;
    返回数据.子分类中文件夹数量 = 返回数据.子内容数量 - 返回数据.子分类中导航数量;
  }

  return 返回数据;
};
