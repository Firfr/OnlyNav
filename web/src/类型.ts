import {
  fn默认值_层级,
  type t_分类,
  type t_基础信息,
  type t_子分类,
  type t_文件夹,
} from "@公共代码/类型";

export type t_操作方式 = "添加" | "编辑" | "查看";

export type t_层级数据 = t_分类 | t_子分类 | t_文件夹;
export type t_层级信息<T> = T & {
  子内容数量: number;
  子内容公开数量: number;
  子内容私有数量: number;
  子分类中导航数量: number;
  子分类中文件夹数量: number;
};
export const fn默认值_层级信息 = <T extends "分类" | "子分类" | "文件夹">(
  层级: T,
): t_层级信息<t_基础信息<T>> => {
  return {
    ...fn默认值_层级(层级),
    子内容数量: -1,
    子内容公开数量: -1,
    子内容私有数量: -1,
    子分类中导航数量: -1,
    子分类中文件夹数量: -1,
  };
};
