import type { t_分类, t_子分类, t_导航, t_文件夹 } from "@公共代码/类型";
import type { t_层级信息 } from "../类型";

const 默认值_层级和导航共有 = {
  公开: false,
  ID: -1,
  父级ID: -1,
  排序: -1,
  名称: "",
  描述: "",
  图标类型: "无",
  图标地址: "",
  图标内容: "",
};

export const 默认值_分类: Required<t_分类> = {
  ...(默认值_层级和导航共有 as Required<t_分类>),
  类型: "分类",
};

export const 默认值_子分类: Required<t_子分类> = {
  ...(默认值_层级和导航共有 as Required<t_子分类>),
  公开: false,
};

export const 默认值_文件夹: Required<t_文件夹> = {
  ...(默认值_层级和导航共有 as Required<t_文件夹>),
  类型: "文件夹",
};

export const 默认值_导航: Required<t_导航> = {
  ...(默认值_层级和导航共有 as Required<t_导航>),
  类型: "导航",
  内网地址: "",
  外网地址: "",
};

export const 默认值_信息共有 = {
  子内容数量: -1,
  子内容公开数量: -1,
  子内容私有数量: -1,
  子分类中导航数量: -1,
  子分类中文件夹数量: -1,
};

export const 默认值_分类信息: t_层级信息<Required<t_分类>> = {
  ...默认值_分类,
  ...默认值_信息共有,
};

export const 默认值_子分类信息: t_层级信息<Required<t_子分类>> = {
  ...默认值_子分类,
  ...默认值_信息共有,
};
