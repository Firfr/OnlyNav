import { Hono } from "hono";
import 中间件_登录状态检查 from "../中间件/登录状态检查";
import 登录 from "./api/login";
import 所有导航 from "./api/all_nav";
import 图标 from "./api/icon";
import 分类 from "./api/cate";
import 子分类 from "./api/sub_cate";
import 文件夹 from "./api/folder";
import 导航 from "./api/nav";
import { getCookie } from "hono/cookie";
import { fn普通凭据, fn超长凭据 } from "../数据/凭据";

const apiRouter = new Hono();

apiRouter.route("/login", 登录);
apiRouter.use(中间件_登录状态检查);
apiRouter.get("/logout", (c) => {
  c.header("Cache-Control", "no-cache, no-store, must-revalidate");
  c.header("Pragma", "no-cache");
  c.header("Expires", "0");
  const 令牌 = getCookie(c, "firfe_nav_token") as string;
  const 是否超长凭据 = getCookie(c, "firfe_nav_token_long") === "true" ? true : false;
  if (是否超长凭据) {
    fn超长凭据.删除(令牌);
  } else {
    fn普通凭据.删除(令牌);
  }
  return c.text("退出成功");
});

apiRouter.get("/auth", (c) => {
  c.header("Cache-Control", "no-cache, no-store, must-revalidate");
  c.header("Pragma", "no-cache");
  c.header("Expires", "0");
  const 登录方式 = getCookie(c, "firfe_nav_token_long") === "true" ? "长期登录" : "普通登录";
  return c.json({ 登录方式: 登录方式, 过期时间: c.get("过期时间") });
});

apiRouter.route("/icon", 图标);
apiRouter.route("/all_nav", 所有导航);
apiRouter.route("/cate", 分类);
apiRouter.route("/sub_cate", 子分类);
apiRouter.route("/folder", 文件夹);
apiRouter.route("/nav", 导航);

export default apiRouter;
