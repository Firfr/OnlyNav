export interface t_分类层级更新信息 {
  名称?: string;
  描述?: string;
  图标类型?: "无" | "图片" | "表情符号";
  图标地址?: string;
  图标内容?: string;
}

export interface t_配置 {
  数据目录: string;
  用户名: string;
  密码: string;
  长期登录凭据: string;
  JWT: string;
  普通登录过期时间: number;
  普通登录设备数量: number;
  长期登录过期时间: number;
  长期登录设备数量: number;
}
