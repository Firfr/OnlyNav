import { createApp } from "vue";
import "./style.css";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "lxgw-wenkai-webfont/style.css";
import { fn剪切板写入 } from "./工具/全局-写入剪切板";
import Vue_根组件 from "./根组件.vue";

const app = createApp(Vue_根组件);
window.fn剪切板写入 = fn剪切板写入;
app.mount("#id_app");
