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
  排序: number;
  名称: string;
  描述: string;
};

export type t_分类 = t_基础信息<"分类">;
export type t_子分类 = t_基础信息<"子分类">;
export type t_文件夹 = t_基础信息<"文件夹">;
export const fn默认值_层级 = <T extends t_层级类型>(层级: T): t_基础信息<T> => {
  return {
    公开: false,
    类型: 层级,
    ID: -1,
    父级ID: -1,
    排序: -1,
    名称: "",
    描述: "",
    图标类型: "无",
  };
};

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
export const fn默认值_导航 = (): t_导航 => {
  return {
    公开: false,
    类型: "导航",
    ID: -1,
    父级ID: -1,
    排序: -1,
    名称: "",
    描述: "",
    图标类型: "无",
    内网地址: "",
    外网地址: "",
  };
};

export type t_导航和层级 = t_导航 | t_分类 | t_子分类 | t_文件夹;

interface t_返回_失败 {
  状态: false;
  信息: string;
}

interface t_返回_成功 {
  状态: true;
  信息?: string;
  内容: any;
}

export type t_返回 = t_返回_失败 | t_返回_成功;

export interface t_账号设置 {
  用户名: string;
  密码: string;
  JWT_密钥: string;
  长期登录秘钥?: string;
  过期时间: number;
  普通凭据登录数量: number;
  超长凭据过期时间: number;
  超长凭据登录数量: number;
}
