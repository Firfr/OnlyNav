# 只有导航

关于可私有部署的个人导航项目，我体验过很多。 但是遇到了各种问题，不符合我的实际需求：

无关功能太多，花里胡哨； 分类层级太少，不能嵌套；导航必须设置图标；没有对普通登录和重启登录区分。

于是我决定根据我本人的需求开发一个自己的导航项目：**只有导航**。

正如项目的名字 **只有导航** 一样，只专注于个人网址的收藏和展示。 让网址收藏不在局限于浏览器的收藏夹！提供多层级设置，方便对不同的导航进行聚合分类。

当前项目的背景图片来自微软 Bing 官方提供的API接口，每次刷新都会返回一张随机壁纸。

- 仓库
  - GitHub仓库 https://github.com/Firfr/OnlyNav
  - Gitee仓库 https://gitee.com/firfe/OnlyNav
  - DockerHub https://hub.docker.com/r/firfe/only_nav

有问题请提 issue 或在我的B站留言。

欢迎关注我B站账号 [秦曱凧](https://space.bilibili.com/17547201) (读作 qín yuē zhēng)

有需要帮忙部署这个项目的朋友,一杯奶茶,即可程远程帮你部署，需要可联系。  
微信号 `E-0_0-`  
闲鱼搜索用户 `明月人间`  
或者邮箱 `firfe163@163.com`  
如果这个项目有帮到你。欢迎start。也厚颜期待您的打赏。

## 支持我

|            支付宝打赏             |           微信打赏            |
| :-------------------------------: | :---------------------------: |
| ![支付宝](图片/收款码-支付宝.jpg) | ![微信](图片/收款码-微信.png) |

有购买服务区需求的朋友可以通过下面的通过连接来购买服务器支持我

- [腾讯云](https://curl.qcloud.com/RJz7oNIa)
- [阿里云](https://www.aliyun.com/minisite/goods?userCode=napc1zre)
- [雨云](https://www.rainyun.com/MTA0OTAwMw==_)

## 镜像

从阿里云或华为云镜像仓库拉取镜像，注意填写镜像标签，镜像仓库中没有`latest`标签

容器内部端口`5191`。

- 国内仓库
  - AMD64镜像
    ```bash
    swr.cn-north-4.myhuaweicloud.com/firfe/only_nav:1.0.0
    ```
  - ARM64镜像
    ```bash
    swr.cn-north-4.myhuaweicloud.com/firfe/only_nav:1.0.0-arm64
    ```
- DockerHub仓库
  - AMD64镜像
    ```bash
    firfe/only_nav:1.0.0
    ```
  - ARM64镜像
    ```bash
    firfe/only_nav:1.0.0-arm64
    ```

## 部署

初次部署会自动生成配置文件，账号密码就在文件 `账号设置.json` 中。

完整配置文件 `账号设置.json` 示例：

```json
{
  "用户名": "用户名",
  "密码": "密码",
  "JWT_密钥": "JWT_密钥",
  "过期时间": 3,
  "普通凭据登录数量": 3,
  "超长凭据过期时间": 30,
  "超长凭据登录数量": 3,
  "长期登录秘钥": "长期登录秘钥"
}
```

上面涉及时间的单位为天。

### docker run 命令部署

```bash
docker run -dit \
--name only_nav \
--network bridge \
--log-opt max-size=1m \
--log-opt max-file=1 \
-p 5191:5191 \
-v ./data:/data \
firfe/only_nav:1.0.0
```

### compose 文件部署 👍推荐

```yaml
name: only_nav
services:
  only_nav:
    container_name: only_nav
    image: swr.cn-north-4.myhuaweicloud.com/firfe/only_nav:1.0.0
    network_mode: bridge
    restart: always
    logging:
      options:
        max-size: 1m
        max-file: "1"
    ports:
      - 5191:5191
    volumes:
      - ./data:/data
```

## 效果截图

|   ![导航](图片/导航.jpg)   |        ![关于](图片/关于.jpg)        |
| :------------------------: | :----------------------------------: |
|   ![分类](图片/分类.jpg)   |      ![子分类](图片/子分类.jpg)      |
| ![文件夹](图片/文件夹.jpg) | ![文件夹-导航](图片/文件夹-导航.jpg) |
|   ![图标](图片/图标.jpg)   |        ![添加](图片/添加.jpg)        |
|   ![删除](图片/删除.jpg)   |        ![编辑](图片/编辑.jpg)        |
