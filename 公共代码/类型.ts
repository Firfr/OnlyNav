interface t_图标_无 {
  图标类型: "无";
  图标地址?: string;
  图标内容?: string;
}
interface t_图标_图片 {
  图标类型: "图片";
  图标地址: string;
  图标内容?: string;
}
interface t_图标_文字 {
  图标类型: "文字";
  图标地址?: string;
  图标内容: string;
}

export type t_图标 = t_图标_无 | t_图标_图片 | t_图标_文字;

export type t_层级类型 = "分类" | "子分类" | "文件夹";
export type t_所有类型 = t_层级类型 | "导航";

export type t_基础信息<T extends t_所有类型> = t_图标 & {
  公开: boolean;
  类型: T;
  ID: number;
  父级ID: number;
  名称: string;
  描述: string;
  排序: number;
};

export type t_分类 = t_基础信息<"分类">;
export type t_子分类 = t_基础信息<"子分类">;
export type t_文件夹 = t_基础信息<"文件夹">;

interface t_地址_内网 {
  内网地址: string;
  外网地址?: string;
}
interface t_地址_外网 {
  内网地址?: string;
  外网地址: string;
}
type t_地址 = t_地址_内网 | t_地址_外网;

export type t_导航 = t_基础信息<"导航"> & t_地址;

export type t_层级 = t_分类 | t_子分类 | t_文件夹;
export type t_导航和层级 = t_导航 | t_分类 | t_子分类 | t_文件夹;

export type t_全部数据映射 = Map<number, t_导航和层级>;

export interface t_成功返回<T = any> {
  状态: true;
  信息?: string;
  内容: T;
}

// 定义失败类型（状态=false，没有 内容）
interface 失败返回 {
  状态: false;
  信息: string;
}

// 最终返回类型 = 成功 | 失败
export type t_返回<T = any> = t_成功返回<T> | 失败返回;

export interface t_登录状态 {
  状态: boolean;
  登录方式: string;
  过期时间: string;
}
