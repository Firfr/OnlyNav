## 数据说明

导航和层级信息的所有字段限制

```TypeScript
interface t_导航和层级 {
  公开: boolean;
  类型: "分类" | "子分类" | "文件夹" | "导航";
  ID: number;
  父级ID: number;
  名称: string; // 无格式限制，写入时删除首尾空格，截取前20位
  描述: string; // 无格式限制，写入时删除首尾空格，截取前200位
  排序: number;

  图标类型: "无" | "文字" | "图片";
  图标地址?: string; // 图标类型 为 图片 时必须设置
  图标内容?: string; // 图标类型 为 文字 时必须设置

  // 导航专属 无格式限制，写入时删除首尾空格
  内网地址?: string;
  外网地址?: string;
}
```

## 参数

## API 格式

- API 结构
  - `/` 前端
  - `/api` 后端
    - `GET` `/api/auth/status` 登录状态
    - `GET` `/api/auth/long-login` 是否支持长期登录
    - `POST` `/api/login` 登录
    - `GET` `/api/all-nav` 所有导航 (未登录返回公开的)
    - 其余所有 api 都需要登录
- 统一返回内容格式
  ```TypeScript
  interface t_返回 {
    状态: boolean;  // true 表示成功
    信息?: string;  // 错误时的原因
    内容?: any;     // 成功时返回的具体内容
  }
  ```
  - 状态码
    - 200 成功
    - 400 数据格式错误
    - 401 未登录
    - 404 未找到
    - 422 数据验证错误
    - 500 服务器错误 (发生了意料之外的未主动捕获的错误)

- 下面的文档中，无特殊说明，返回的内容均为请求成功后返回数据中的 `内容` 字段的内容

## 登录

### 登录状态

- `GET` `/api/auth/status`
- 返回内容
  ```TypeScript
  interface t_返回内容 {
    "状态": boolean;
    "登录方式": "长期登录" | "普通登录";
    "过期时间": string; // 示例：2026年07月07日 06:59:55
  }
  ```

### 是否支持长期登录

- `GET` `/api/auth/long-login`
- 返回内容 布尔值(boolean)

### 登录

- `POST` `/api/auth/login`
- 请求体
  ```TypeScript
  interface 请求体 {
    用户名: string;
    盐: string;
    密码: string; // 加盐的 SHA256 密码
    长期登录秘钥:? string; // 加盐的 SHA256 秘钥
      // 不写这个，默认为短期登录
      // 添加后为长期登录
  }
  ```
- 请求成功后内容 `登录成功`
  - Cookie `firfe_nav_token`
  - Cookie `firfe_nav_token_long` 长期登录值为 `"true"`

### 退出

- `post` `/api/auth/logout`
- 返回内容 `退出成功`

## 图标

### 上传

- `POST` `/api/icon`
- 请求体
  ```TypeScript
  interface 请求体 {
    icon: File;
  }
  ```
  - 请求体类型 `from-data`
  - 支持的图片后缀 `.png` `.jpg` `.apng` `.webp` `.svg`
- 返回内容 `毫秒时间戳-文件名-哈希.后缀`

### 图标列表

- `GET` `/api/icon/list`
- 返回内容
  ```TypeScript
  type t_返回内容 = string[];
  ```
  - 字符串数组，每一项都是服务器存储的图标名称
  - 返回数据按照时间戳降序排列

### 获取图标

- `GRT` `/api/icon/file/:图标名称`
- 请求成功后返回的为对应的图片内容，不是统一的 json 格式

### 所有导航

- `GET` `/api/all-nav`
- 未登录时，仅返回属性 `"公开"=true` 的数据，并且同时需要父级也是公开的。
- 返回内容类型 `../公共代码/类型.ts` 中  `t_导航和层级[]`

## 分类

### 查看所有分类列表

- `GET` `/api/cate/all`
- 返回内容类型 `../公共代码/类型.ts` 中  `t_分类`

### 查看指定分类

- `GET` `/api/cate/:ID`
- 返回内容类型 `../公共代码/类型.ts` 中  `t_分类`

### 查看子内容列表

- `GET` `/api/cate/:ID/sub`
- 返回内容类型 `../公共代码/类型.ts` 中  `t_子分类[]`

### 添加

- `POST` `/api/cate`
- 请求体格式
  ```TypeScript
  import type { t_分类 } from "../公共代码/类型.ts"
  type 请求体 = Omit<t_分类, "ID" | "排序" | "类型" | "父级ID">;
  ```
- 返回内容类型 `../公共代码/类型.ts` 中  `t_分类`

### 更新

- `PATCH` `/api/cate/:ID`
- 请求体格式
  ```TypeScript
  import type { t_分类 } from "../公共代码/类型.ts"
  type 请求体 = Omit<t_分类, "ID" | "类型" | "父级ID">;
  ```
- 返回内容类型 `../公共代码/类型.ts` 中  `t_分类`

### 删除

- `DELETE` `/api/cate/:ID`
- 返回内容 `"删除分类 ${分类ID} 成功"`

## 子分类

### 查看指定子分类

- `GET` `/api/sub-cate/:ID`
- 返回内容类型 `../公共代码/类型.ts` 中  `t_子分类`

### 查看子内容列表

- `GET` `/api/sub-cate/:ID/sub`
- 返回内容类型 `../公共代码/类型.ts` 中  `(t_文件夹 | t_导航)[]`

### 添加

- `POST` `/api/sub-cate/:父级ID`
- 请求体格式
  ```TypeScript
  import type { t_子分类 } from "../公共代码/类型.ts"
  type 请求体 = Omit<t_子分类, "ID" | "排序" | "类型" | "父级ID">;
  ```
- 返回内容类型 `../公共代码/类型.ts` 中  `t_子分类`

### 更新

- `PATCH` `/api/sub-cate/:ID`
- 请求体格式
  ```TypeScript
  import type { t_子分类 } from "../公共代码/类型.ts"
  type 请求体 = Omit<t_子分类, "ID" | "类型" | "父级ID">;
  ```
- 返回内容类型 `../公共代码/类型.ts` 中  `t_子分类`

### 删除

- `DELETE` `/api/sub-cate/:ID`
- 返回内容 `"删除子分类 ${子分类ID} 成功"`

## 文件夹

### 查看指定文件夹

- `GET` `/api/folder/:ID`
- 返回内容类型 `../公共代码/类型.ts` 中  `t_文件夹`

### 查看子内容列表

- `GET` `/api/folder/:ID/sub`
- 返回内容类型 `../公共代码/类型.ts` 中  `t_导航[]`

### 添加

- `POST` `/api/folder/:父级ID`
- 请求体格式
  ```TypeScript
  import type { t_文件夹 } from "../公共代码/类型.ts"
  type 请求体 = Omit<t_文件夹, "ID" | "排序" | "类型" | "父级ID">;
  ```
- 返回内容类型 `../公共代码/类型.ts` 中  `t_文件夹`

### 更新

- `PATCH` `/api/folder/:ID`
- 请求体格式
  ```TypeScript
  import type { t_文件夹 } from "../公共代码/类型.ts"
  type 请求体 = Omit<t_文件夹, "ID" | "类型" | "父级ID">;
  ```
- 返回内容类型 `../公共代码/类型.ts` 中  `t_文件夹`

### 删除

- `DELETE` `/api/folder/:ID`
- 返回内容 `"删除文件夹 ${文件夹ID} 成功"`

### 移动

- `PATCH` `/api/folder/:ID/move/:新父级ID`
- 无请求体
- 返回内容类型 `../公共代码/类型.ts` 中  `t_文件夹`

## 导航

### 查看指定导航

- `GET` `/api/nav/:ID`
- 返回内容类型 `../公共代码/类型.ts` 中  `t_导航`

### 添加

- `POST` `/api/nav/:父级ID`
- 请求体格式
  ```TypeScript
  import type { t_导航 } from "../公共代码/类型.ts"
  type 请求体 = Omit<t_导航, "ID" | "排序" | "类型" | "父级ID">;
  ```
- 返回内容类型 `../公共代码/类型.ts` 中  `t_导航`

### 更新

- `PATCH` `/api/nav/:ID`
- 请求体格式
  ```TypeScript
  import type { t_导航 } from "../公共代码/类型.ts"
  type 请求体 = Omit<t_导航, "ID" | "类型" | "父级ID">;
  ```
- 返回内容类型 `../公共代码/类型.ts` 中  `t_导航`

### 删除

- `DELETE` `/api/nav/:ID`
- 返回内容 `"删除导航 ${导航ID} 成功"`

### 移动

- `PATCH` `/api/nav/:ID/move/:新父级ID`
- 无请求体
- 返回内容类型 `../公共代码/类型.ts` 中  `t_导航`

## 排序

- `POST` `/api/sort/:父级类型`
  - 父级类型对照
    - 对分类排序 => `all`
    - 对子分类排序 => `cate`
    - 对子分类内容排序 => `sub-cate`
    - 对文件夹中导航排序 => `folder`
- 请求体格式
  ```TypeScript
  interface t_排序 {
    "ID": number;
    "排序": number; // 正整数
  }[]
- 返回内容 `[父级类型] 中 ${X} 个数据排序成功`
