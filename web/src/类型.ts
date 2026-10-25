import type { t_分类, t_子分类, t_导航和层级, t_文件夹 } from "@公共代码/类型";

export interface t_数据格式化 {
  分类列表: t_分类[];
  Map_全部数据: Map<number, t_导航和层级>;
  Map_层级数据: Map<number, t_导航和层级[]>;
}

export interface t_组件_文件夹_参数 {
  分类: t_分类;
  子分类: t_子分类;
  文件夹: t_文件夹;
}

export type t_操作方式 = "添加" | "查看" | "编辑" | "移动" | "排序" | "删除";

export type t_设置_功能_名称 =
  | ""
  | "图标"
  | "分类"
  | "子分类"
  | "文件夹"
  | "账号"
  | "登录"
  | "关于";
export interface t_设置_功能_列表 {
  名称: t_设置_功能_名称;
  显示: boolean;
}

export type t_层级信息<T> = T & {
  子内容数量: number;
  子内容公开数量: number;
  子内容私有数量: number;
  子分类中导航数量: number;
  子分类中文件夹数量: number;
};
