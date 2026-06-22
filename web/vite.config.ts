import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import path from "path";
import { ElementPlusResolver, NaiveUiResolver } from "unplugin-vue-components/resolvers";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  resolve: {
    alias: [
      {
        find: "@公共代码",
        replacement: path.resolve(__dirname, "../公共代码"),
      },
    ],
  },

  server: {
    host: "0.0.0.0",
    port: 1234,
    proxy: {
      "/api": {
        target: "http://192.168.13.4:5191",
        changeOrigin: true,
        secure: false,
      },
      "/login": {
        target: "http://192.168.13.4:5191",
        changeOrigin: true,
        secure: false,
      },
      "/seting": {
        target: "http://192.168.13.4:5191",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  plugins: [
    vue(),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        {
          "naive-ui": ["useDialog", "useMessage", "useNotification", "useLoadingBar"],
        },
      ],
      dts: "src/auto-import.d.ts",
      resolvers: [ElementPlusResolver()],
    }),

    Components({
      dts: "src/components.d.ts",
      resolvers: [
        ElementPlusResolver(),
        // 👇 关键配置：自定义 Resolver 自动识别 ElIcon 前缀并从官方包中按需导入
        (name) => {
          if (name.startsWith("ElIcon")) {
            return {
              name: name.slice(2), // 去掉 'ElIcon' 前缀，例如 ElIconCircleCloseFilled -> CircleCloseFilled
              from: "@element-plus/icons-vue",
            };
          }
        },
        NaiveUiResolver(),
      ],
    }),
  ],
});
