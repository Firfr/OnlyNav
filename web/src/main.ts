import { createApp } from "vue";
import "./style.css";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "lxgw-wenkai-webfont/style.css"
// import "default-passive-events";
import { fn剪切板写入 } from "./工具/全局-写入剪切板";
import Vue_根组件 from "./根组件.vue";
import 路由 from "./路由";

const app = createApp(Vue_根组件);
app.config.globalProperties.fn剪切板写入 = fn剪切板写入;
app.use(路由);
app.mount("#id_app");
