import { ref, reactive } from "vue";
import { fn发送请求 } from "./工具/请求";
import {
  fn默认值_导航,
  fn默认值_层级,
  type t_分类,
  type t_子分类,
  type t_导航,
  type t_导航和层级,
  type t_文件夹,
  type t_返回,
} from "@公共代码/类型";
import { fn获取登录状态 } from "./工具/工具";

export const ref_是内网 = ref(localStorage.getItem(`firfe_nav_是内网`) === "true" ? true : false);

export const ref_搜索关键词 = ref("");

export const ref_是否登录 = ref(false);
export const rea_登录信息 = reactive({ 登录方式: "-", 过期时间: "-" });

export const ref_是否首次打开设置 = ref(true);
export const ref_是否显示设置组件 = ref(false);

export const ref_所有导航数据 = ref<t_导航和层级[]>([]);
export const fn重新获取导航数据 = async () => {
  const 获取所有导航数据 = await fn发送请求("GET", "/all_nav");
  if (!获取所有导航数据.状态) return;
  ref_所有导航数据.value = 获取所有导航数据.内容;
  fn获取登录状态();
};
export const ref_所有导航Map = ref<Map<number, t_导航和层级>>(new Map<number, t_导航和层级>());
export const ref_导航层级Map = ref<Map<number, t_导航和层级[]>>(new Map<number, t_导航和层级[]>());
export const ref_分类列表 = ref<t_分类[]>([]);

export const cmp_所有导航Map = readonly(ref_所有导航Map);
export const cmp_导航层级Map = readonly(ref_导航层级Map);
export const cmp_分类列表 = readonly(ref_分类列表);

watch(
  ref_所有导航数据,
  () => {
    ref_所有导航Map.value.clear();
    ref_导航层级Map.value.clear();
    ref_分类列表.value = [];

    const 所有导航数据 = ref_所有导航数据.value;
    if (!所有导航数据.length) return;
    const 所有导航排序后 = [...所有导航数据].sort((a, b) => a.排序 - b.排序);

    for (const 元素 of 所有导航排序后) {
      ref_所有导航Map.value.set(元素.ID, 元素);

      const 父级ID = 元素.父级ID;
      let 层级数组 = ref_导航层级Map.value.get(父级ID);
      if (!层级数组) {
        层级数组 = [];
        ref_导航层级Map.value.set(父级ID, 层级数组);
      }
      层级数组.push(元素);

      if (元素.类型 === "分类") {
        ref_分类列表.value.push(元素 as t_分类);
      }
    }
  },
  { immediate: true, deep: true },
);

export const ref_是否显示文件夹 = ref(false);
export const rea_文件夹层级数据 = reactive({
  分类: fn默认值_层级("分类"),
  子分类: fn默认值_层级("子分类"),
  文件夹: fn默认值_层级("文件夹"),
});

export const rea_图标列表 = reactive<{ key: string; 文件名: string }[]>([]);
export const fn获取图标列表 = async () => {
  const 获取图标列表 = await fn发送请求("GET", "/icon/list");
  if (!获取图标列表.状态) return;
  rea_图标列表.length = 0;
  rea_图标列表.push(
    ...获取图标列表.内容.map((文件名: string) => ({
      key: 文件名,
      文件名: 文件名,
    })),
  );
};

export const ref_是否显示_层级或导航_删除 = ref(false);
export const ref_是否显示_层级或导航_操作 = ref(false);
export const rea层级与导航数据 = reactive<{
  类型: "分类" | "子分类" | "文件夹" | "子分类_导航" | "文件夹_导航" | "";
  操作方式: "添加" | "编辑" | "查看" | "删除" | "";
  当前数据: t_分类 | t_子分类 | t_文件夹 | t_导航;
  分类: t_分类;
  子分类: t_子分类;
  文件夹: t_文件夹;
  导航: t_导航;
}>({
  类型: "",
  操作方式: "",
  当前数据: fn默认值_层级("分类"),
  分类: fn默认值_层级("分类"),
  子分类: fn默认值_层级("子分类"),
  文件夹: fn默认值_层级("文件夹"),
  导航: fn默认值_导航(),
});

const fn删除本地数据_导航 = (数据: t_导航): t_返回 => {
  const 数据索引 = ref_所有导航数据.value.findIndex(
    (元素) => 元素.ID === 数据.ID && 元素.类型 === "导航",
  );
  if (数据索引 === -1) return { 状态: false, 信息: `ID 为 ${数据.ID} 的导航不存在` };
  ref_所有导航数据.value.splice(数据索引, 1);
  return { 状态: true, 信息: "删除成功", 内容: "" };
};
const fn删除本地数据_文件夹 = (数据: t_文件夹): t_返回 => {
  const 数据索引 = ref_所有导航数据.value.findIndex(
    (元素) => 元素.ID === 数据.ID && 元素.类型 === "文件夹",
  );
  if (数据索引 === -1) return { 状态: false, 信息: `ID 为 ${数据.ID} 的文件夹不存在` };
  const 所有子内容 = ref_所有导航数据.value.filter(
    (元素) => 元素.父级ID === 数据.ID && 元素.类型 === "导航",
  );
  for (const 元素 of 所有子内容) {
    const 删除子元素 = fn删除本地数据_导航(元素 as t_导航);
    if (!删除子元素.状态) {
      return { 状态: false, 信息: `ID 为 ${数据.ID} 的文件夹中\n${删除子元素.信息}` };
    }
  }
  ref_所有导航数据.value.splice(数据索引, 1);
  return { 状态: true, 信息: "删除成功", 内容: "" };
};
const fn删除本地数据_子分类 = (数据: t_子分类): t_返回 => {
  const 数据索引 = ref_所有导航数据.value.findIndex(
    (元素) => 元素.ID === 数据.ID && 元素.类型 === "子分类",
  );
  if (数据索引 === -1) return { 状态: false, 信息: `ID 为 ${数据.ID} 的子分类不存在` };
  const 所有子内容 = ref_所有导航数据.value.filter(
    (元素) => 元素.父级ID === 数据.ID && (元素.类型 === "导航" || 元素.类型 === "文件夹"),
  );
  for (const 元素 of 所有子内容) {
    if (元素.类型 === "导航") {
      const 删除子元素 = fn删除本地数据_导航(元素 as t_导航);
      if (!删除子元素.状态) {
        return { 状态: false, 信息: `ID 为 ${数据.ID} 的子分类中\n${删除子元素.信息}` };
      }
      continue;
    }
    const 删除子元素 = fn删除本地数据_文件夹(元素 as t_文件夹);
    if (!删除子元素.状态) {
      return { 状态: false, 信息: `ID 为 ${数据.ID} 的子分类中\n${删除子元素.信息}` };
    }
  }
  ref_所有导航数据.value.splice(数据索引, 1);
  return { 状态: true, 信息: "删除成功", 内容: "" };
};
const fn删除本地数据_分类 = (数据: t_分类): t_返回 => {
  const 数据索引 = ref_所有导航数据.value.findIndex(
    (元素) => 元素.ID === 数据.ID && 元素.类型 === "分类",
  );
  if (数据索引 === -1) return { 状态: false, 信息: `ID 为 ${数据.ID} 的分类不存在` };
  const 所有子内容 = ref_所有导航数据.value.filter(
    (元素) => 元素.父级ID === 数据.ID && 元素.类型 === "子分类",
  );
  for (const 元素 of 所有子内容) {
    const 删除子元素 = fn删除本地数据_子分类(元素 as t_子分类);
    if (!删除子元素.状态) {
      return { 状态: false, 信息: `ID 为 ${数据.ID} 的分类中\n${删除子元素.信息}` };
    }
  }
  ref_所有导航数据.value.splice(数据索引, 1);
  return { 状态: true, 信息: "删除成功", 内容: "" };
};
export const fn删除本地数据 = (数据: t_分类 | t_子分类 | t_文件夹 | t_导航): t_返回 => {
  switch (数据.类型) {
    case "分类":
      return fn删除本地数据_分类(数据);
    case "子分类":
      return fn删除本地数据_子分类(数据);
    case "文件夹":
      return fn删除本地数据_文件夹(数据);
    case "导航":
      return fn删除本地数据_导航(数据);

    default:
      return { 状态: false, 信息: "未知数据类型" };
  }
};

export const fn修改数据同步到本地 = (ID: number, 数据: any) => {
  const 目标数据 = ref_所有导航数据.value.find((元素) => 元素.ID === ID);
  if (!目标数据) throw new Error(`ID 为 ${数据.ID} 的数据不存在`);
  Object.assign(目标数据, 数据); // 直接修改原对象
};
export const fn增加数据同步到本地 = (数据: any) => {
  ref_所有导航数据.value.push(数据);
};

export const rea_导航右键菜单数据 = reactive<{
  X: number;
  Y: number;
  是否显示菜单: boolean;
  导航类型: "子分类_导航" | "文件夹_导航";
  分类: t_分类;
  子分类: t_子分类;
  文件夹: t_文件夹;
  导航: t_导航;
}>({
  X: -1,
  Y: -1,
  是否显示菜单: false,
  导航类型: "子分类_导航",
  分类: fn默认值_层级("分类"),
  子分类: fn默认值_层级("子分类"),
  文件夹: fn默认值_层级("文件夹"),
  导航: fn默认值_导航(),
});
