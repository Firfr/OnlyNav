import { Hono } from "hono";
import 中间件_登录状态检查 from "../中间件/登录状态检查";
import 路由_认证 from "./api/auth";
import 路由_所有导航 from "./api/all-nav";
import 路由_图标 from "./api/icon";
import 路由_分类 from "./api/cate";
import 路由_子分类 from "./api/sub-cate";
import 路由_文件夹 from "./api/folder";
import 路由_导航 from "./api/nav";
import 路由_排序 from "./api/sort";

const apiRouter = new Hono();

apiRouter.use(中间件_登录状态检查);

apiRouter.route("/auth", 路由_认证);
apiRouter.route("/icon", 路由_图标);
apiRouter.route("/all-nav", 路由_所有导航);
apiRouter.route("/cate", 路由_分类);
apiRouter.route("/sub-cate", 路由_子分类);
apiRouter.route("/folder", 路由_文件夹);
apiRouter.route("/nav", 路由_导航);
apiRouter.route("/sort", 路由_排序);

export default apiRouter;
