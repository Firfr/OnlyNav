import { ref_是内网 } from "../全局共享数据";

const 内外网标识颜色 = {
  同类型: "rgba(0, 255, 255, 1)",
  不同类型: "rgba(0, 255, 255, 0.6)",
};
export const fn内外网标识颜色 = (网络类型: string) => {
  if (ref_是内网.value) {
    if (网络类型 === "内网") {
      return 内外网标识颜色.同类型;
    }
    return 内外网标识颜色.不同类型;
  }
  if (网络类型 === "外网") {
    return 内外网标识颜色.同类型;
  }
  return 内外网标识颜色.不同类型;
};
