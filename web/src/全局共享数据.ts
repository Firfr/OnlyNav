import { ref, reactive, computed } from "vue";
import type {
  t_分类,
  t_子分类,
  t_导航,
  t_导航和层级,
  t_层级,
  t_层级类型,
  t_文件夹,
  t_登录状态,
} from "@公共代码/类型";
import type { t_操作方式, t_数据格式化, t_设置_功能_名称 } from "./类型";
import { 默认值_分类, 默认值_子分类, 默认值_导航, 默认值_文件夹 } from "./工具/默认值";
import type { FormItemRule } from "element-plus";

export const 本地存储前缀 = "firfe_nav_";

export const ref_是内网 = ref(
  localStorage.getItem(`${本地存储前缀}是内网`) === "true" ? true : false,
);

export const rea_登录信息 = reactive<t_登录状态>({
  状态: false,
  登录方式: "-",
  过期时间: "-",
});

export const 按钮名称本地存储名称 = `${本地存储前缀}设置-功能`;
export const 设置_子分类_选中分类ID = `${本地存储前缀}设置-子分类-选中分类ID`;
export const 设置_文件夹_选中层级ID数组 = `${本地存储前缀}设置-文件夹-选中层级ID数组`;

export const 长按毫秒数 = 1000;

export const ref_当前选择设置 = ref<t_设置_功能_名称>(
  (localStorage.getItem(按钮名称本地存储名称) as t_设置_功能_名称) || "",
);
export const ref_首次打开设置 = ref(false);

export const ref_显示设置 = ref(false);

export const ref_图标列表 = ref<string[]>([]);

export const ref_所有导航数据 = ref<t_导航和层级[]>([]);
export const cmp_数据格式化 = computed<t_数据格式化>(() => {
  const 返回值: t_数据格式化 = {
    分类列表: [],
    Map_全部数据: new Map<number, t_导航和层级>(),
    Map_层级数据: new Map<number, t_导航和层级[]>(),
  };

  for (const 元素 of ref_所有导航数据.value) {
    返回值.Map_全部数据.set(元素.ID, 元素);

    const 父级ID = 元素.父级ID;
    let 层级数组 = 返回值.Map_层级数据.get(父级ID);
    if (!层级数组) {
      层级数组 = [];
      返回值.Map_层级数据.set(父级ID, 层级数组);
    }
    层级数组.push(元素);

    if (元素.类型 === "分类") {
      返回值.分类列表.push(元素);
    }
  }

  返回值.分类列表.sort((前, 后) => 前.排序 - 后.排序);

  for (const 层级数据 of 返回值.Map_层级数据.values()) {
    层级数据.sort((前, 后) => 前.排序 - 后.排序);
  }

  return 返回值;
});

export const rea_弹窗_操作 = reactive<{
  显示: boolean;
  操作: t_操作方式 | "";
  类型: t_层级类型 | "导航" | "";
  父级类型: t_层级类型 | "";
  层级: t_层级[];
  当前: t_导航和层级;
}>({
  显示: false,
  操作: "",
  类型: "",
  父级类型: "",
  层级: [],
  当前: { ...默认值_导航 },
});
export const fn弹窗_操作_清空 = () => {
  rea_弹窗_操作.显示 = false;
  rea_弹窗_操作.操作 = "";
  rea_弹窗_操作.类型 = "";
  rea_弹窗_操作.父级类型 = "";
  rea_弹窗_操作.层级 = [];
  rea_弹窗_操作.当前 = { ...默认值_导航 };
};

export const rea_弹窗_文件夹 = reactive<{
  显示: boolean;
  分类: t_分类;
  子分类: t_子分类;
  文件夹: t_文件夹;
  导航列表: t_导航[];
}>({
  显示: false,
  分类: { ...默认值_分类 },
  子分类: { ...默认值_子分类 },
  文件夹: { ...默认值_文件夹 },
  导航列表: [],
});

export const rea_上下文菜单_导航 = reactive<{
  X: number;
  Y: number;
  显示菜单: boolean;
  父级类型: "子分类" | "文件夹";
  分类: t_分类;
  子分类: t_子分类;
  文件夹: t_文件夹;
  导航: t_导航;
}>({
  X: -1,
  Y: -1,
  显示菜单: false,
  父级类型: "子分类",
  分类: { ...默认值_分类 },
  子分类: { ...默认值_子分类 },
  文件夹: { ...默认值_文件夹 },
  导航: { ...默认值_导航 },
});

export const rea_上下文菜单_文件夹 = reactive<{
  X: number;
  Y: number;
  显示菜单: boolean;
  分类: t_分类;
  子分类: t_子分类;
  文件夹: t_文件夹;
}>({
  X: -1,
  Y: -1,
  显示菜单: false,
  分类: { ...默认值_分类 },
  子分类: { ...默认值_子分类 },
  文件夹: { ...默认值_文件夹 },
});

type t_规则名称 = "名称" | "描述" | "图标类型" | "图标地址" | "图标内容" | "网址";
export const rul_全局校验规则: { [k in t_规则名称]: FormItemRule[] } = {
  名称: [
    { required: true, message: "名称不能为空！", trigger: "blur" },
    { whitespace: true, message: "不能输入纯空格", trigger: "blur" },
    {
      pattern: /^[^\s\uFEFF\xA0\u200B](?:.*[^\s\uFEFF\xA0\u200B])?$/,
      message: "首尾不能包含空格！",
      trigger: "blur",
    },
    { max: 20, message: "长度不能超过 20 个字符！", trigger: "blur" },
  ],
  描述: [
    { whitespace: true, message: "不能输入纯空格", trigger: "blur" },
    { max: 200, message: "长度不能超过 200 个字符！", trigger: "blur" },
  ],
  图标类型: [
    { required: true, message: "请输入图标类型", trigger: "blur" },
    {
      type: "enum",
      enum: ["无", "字符", "图片"],
      message: "只能从 无、字符、图片 中选择",
      trigger: "blur",
    },
  ],
  图标内容: [
    { required: true, message: "请输入表情符号", trigger: "blur" },
    { whitespace: true, message: "不能输入纯空格", trigger: "blur" },
    { pattern: /\S/, message: "不能包含空白字符", trigger: "blur" },
    { min: 1, max: 2, message: "字符串长度不能超过两个！", trigger: "blur" },
  ],
  图标地址: [
    { required: true, message: "请输入图标地址！", trigger: "blur" },
    { whitespace: true, message: "不能输入纯空格", trigger: "blur" },
    { pattern: /\S/, message: "不能包含空白字符！", trigger: "blur" },
    { min: 1, message: "请输入图标地址！", trigger: "blur" },
  ],
  网址: [
    { whitespace: true, message: "不能输入纯空格", trigger: "blur" },
    {
      pattern: /^[^\s\uFEFF\xA0\u200B](?:.*[^\s\uFEFF\xA0\u200B])?$/,
      message: "首尾不能包含空格！",
      trigger: "blur",
    },
  ],
};
