FROM docker.code.firfe.work/oven/bun:1.3.11 AS build

WORKDIR /app

# 设置环境变量
ENV BUN_INSTALL_REGISTRY="http://npm.firfe.de5.net"

COPY 公共代码 /app/公共代码

# 复制前端依赖文件并安装
COPY web/package.json web/bun* /app/web/
RUN cd /app/web && bun install

# 复制后端依赖文件并安装
COPY server/package.json server/bun* /app/server/
RUN cd /app/server && bun install

# 复制所有源代码文件
COPY server /app/server
COPY web /app/web

# 编译前端和后端
RUN cd /app/web && bun run build
RUN cd /app/server && bun run build

FROM docker.code.firfe.work/oven/bun:1.3.11-alpine

COPY --from=build --chmod=744 /app/web/dist /app/web
COPY --from=build --chmod=755 /app/server/dist/index.js /app/index.js

ENV LOG_LEVEL=info DATA_PATH=/data PORT=5191

EXPOSE 5191
ENTRYPOINT ["bun","/app/index.js"]

LABEL 项目作者="B站 秦曱凧"
LABEL 主页="https://github.com/Firfr/OnlyNav"
LABEL 版本="1.0.0"

# firfe/only_nav:1.0.0
