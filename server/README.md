## 参数

## API

- API 结构
  - `/` 前端
  - `/api` 后端
    - `POST` `/api/login` 登录
    - `GET` `/api/nav` 所有导航 (未登录返回公开的)
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

- `GET` `/api/auth`
- 请求成功后内容格式
  ```TypeScript
  interface t_返回内容 {
    "登录方式": "长期登录" | "普通登录";
  	"过期时间": string; // 示例：2026年07月07日 06:59:55
  }
  ```

### 登录

- `POST` `/api/login`
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
  - Cookie `firfe_nav_token_long` 长期登录值为 `true`

### 退出

- `GET` `/api/logout`
- 请求成功后内容 `退出成功`

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

- 请求成功后内容 `毫秒时间戳-原文件名`

### 图标列表

- `GET` `/api/icon/list`
- 请求成功后内容格式

  ```TypeScript
  type t_返回内容 = string[];
  ```

  - 列表为字符串数组，每一项都是服务器存储的图标名称，格式为 `毫秒时间戳-原文件名`
  - 返回数据按照时间戳降序排列

### 获取图标

- `GRT` `/api/icon/file/:图标名称`
- 请求成功后返回的为对应的图片内容，不是统一的 json 格式

## 导航

> 返回的数据列表都根据 `排序` 字段从小到大进行了排序。

### 所有导航

- `GET` `/api/all_nav`
- 未登录时，仅返回子分类属性 `"公开"=true` 的导航
- 请求成功后内容格式

  ```TypeScript
  import type { t_导航和层级 } from "../公共代码/类型.ts"

  type t_返回内容 = t_导航和层级[];
  ```

### 分类

#### 查看所有分类列表

- `GET` `/api/cate/all`
- 请求成功后内容格式

  ```TypeScript
  import type { t_分类 } from "../公共代码/类型.ts"

  type t_返回内容 = t_分类[];
  ```

#### 查看指定分类

- `GET` `/api/cate/:ID`
- 请求成功后内容格式

  ```TypeScript
  import type { t_分类 } from "../公共代码/类型.ts"

  type t_返回内容 = t_分类;
  ```

#### 查看子内容列表

- `GET` `/api/cate/:ID/sub`
- 请求成功后内容格式

  ```TypeScript
  import type { t_子分类 } from "../公共代码/类型.ts"
  type t_返回内容 = t_子分类[];
  ```

#### 添加

- `POST` `/api/cate`
- 请求体格式

  ```TypeScript
  import type { t_分类 } from "../公共代码/类型.ts"
  type 请求体 = Omit<t_分类, "ID" | "排序" | "类型" | "父级ID">;
  ```

- 请求成功后内容格式

  ```TypeScript
  import type { t_分类 } from "../公共代码/类型.ts"
  type t_返回内容 = t_分类;
  ```

#### 更新

- `PATCH` `/api/cate/:ID`
- 请求体格式

  ```TypeScript
  import type { t_分类 } from "../公共代码/类型.ts"
  type 请求体 = Omit<t_分类, "ID" | "类型" | "父级ID">;
  ```

- 请求成功后内容格式

  ```TypeScript
  import type { t_分类 } from "../公共代码/类型.ts"
  type t_返回内容 = t_分类;
  ```

#### 删除

- `DELETE` `/api/cate/:ID`
- 请求成功后内容 `"删除分类 ${分类ID} 成功"`

### 子分类

#### 查看指定子分类

- `GET` `/api/sub_cate/:ID`
- 请求成功后内容格式

  ```TypeScript
  import type { t_子分类 } from "../公共代码/类型.ts"

  type t_返回内容 = t_子分类;
  ```

#### 查看子内容列表

- `GET` `/api/sub_cate/:ID/sub`
- 请求成功后内容格式

  ```TypeScript
  import type { t_文件夹, t_导航 } from "../公共代码/类型.ts"
  type t_返回内容 = (t_文件夹 | t_导航)[];
  ```

#### 添加

- `POST` `/api/sub_cate`
- 请求体格式

  ```TypeScript
  import type { t_子分类 } from "../公共代码/类型.ts"
  type 请求体 = Omit<t_子分类, "ID" | "排序" | "类型" | "父级ID">;
  ```

- 请求成功后内容格式

  ```TypeScript
  import type { t_子分类 } from "../公共代码/类型.ts"
  type t_返回内容 = t_子分类;
  ```

#### 更新

- `PATCH` `/api/sub_cate/:ID`
- 请求体格式

  ```TypeScript
  import type { t_子分类 } from "../公共代码/类型.ts"
  type 请求体 = Omit<t_子分类, "ID" | "类型" | "父级ID">;
  ```

- 请求成功后内容格式

  ```TypeScript
  import type { t_子分类 } from "../公共代码/类型.ts"
  type t_返回内容 = t_子分类;
  ```

#### 删除

- `DELETE` `/api/sub_cate/:ID`
- 请求成功后内容 `"删除子分类 ${子分类ID} 成功"`

### 文件夹

#### 查看指定文件夹

- `GET` `/api/folder/:ID`
- 请求成功后内容格式

  ```TypeScript
  import type { t_文件夹 } from "../公共代码/类型.ts"

  type t_返回内容 = t_文件夹;
  ```

#### 查看子内容列表

- `GET` `/api/folder/:ID/sub`
- 请求成功后内容格式

  ```TypeScript
  import type { t_导航 } from "../公共代码/类型.ts"
  type t_返回内容 = t_导航[];
  ```

#### 添加

- `POST` `/api/folder`
- 请求体格式

  ```TypeScript
  import type { t_文件夹 } from "../公共代码/类型.ts"
  type 请求体 = Omit<t_文件夹, "ID" | "排序" | "类型" | "父级ID">;
  ```

- 请求成功后内容格式

  ```TypeScript
  import type { t_文件夹 } from "../公共代码/类型.ts"
  type t_返回内容 = t_文件夹;
  ```

#### 更新

- `PATCH` `/api/folder/:ID`
- 请求体格式

  ```TypeScript
  import type { t_文件夹 } from "../公共代码/类型.ts"
  type 请求体 = Omit<t_文件夹, "ID" | "类型" | "父级ID">;
  ```

- 请求成功后内容格式

  ```TypeScript
  import type { t_文件夹 } from "../公共代码/类型.ts"
  type t_返回内容 = t_文件夹;
  ```

#### 删除

- `DELETE` `/api/folder/:ID`
- 请求成功后内容 `"删除文件夹 ${文件夹ID} 成功"`

### 导航

#### 查看指定导航

- `GET` `/api/nav/:ID`
- 请求成功后内容格式

  ```TypeScript
  import type { t_导航 } from "../公共代码/类型.ts"

  type t_返回内容 = t_导航;
  ```

#### 添加

- `POST` `/api/nav`
- 请求体格式

  ```TypeScript
  import type { t_导航 } from "../公共代码/类型.ts"
  type 请求体 = Omit<t_导航, "ID" | "排序" | "类型" | "父级ID">;
  ```

- 请求成功后内容格式

  ```TypeScript
  import type { t_导航 } from "../公共代码/类型.ts"
  type t_返回内容 = t_导航;
  ```

#### 更新

- `PATCH` `/api/nav/:ID`
- 请求体格式

  ```TypeScript
  import type { t_导航 } from "../公共代码/类型.ts"
  type 请求体 = Omit<t_导航, "ID" | "类型" | "父级ID">;
  ```

- 请求成功后内容格式

  ```TypeScript
  import type { t_导航 } from "../公共代码/类型.ts"
  type t_返回内容 = t_导航;
  ```

#### 删除

- `DELETE` `/api/nav/:ID`
- 请求成功后内容 `"删除导航 ${导航ID} 成功"`
