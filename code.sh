#!/bin/bash

# 定义容器名称，方便后续引用
CONTAINER_NAME="OnlyNav"

# 判断传入的第一个参数
if [ "$1" = "exec" ]; then
  echo "--------------------------------------------------"
  echo "正在进入已运行的容器: $CONTAINER_NAME"
  echo "--------------------------------------------------"

  # 执行进入容器命令
  docker exec -it $CONTAINER_NAME bash

elif [ "$1" = "kill" ]; then
  echo "--------------------------------------------------"
  echo "正在停止并删除容器: $CONTAINER_NAME"
  echo "--------------------------------------------------"

  # 执行强制停止并删除容器命令
  docker kill $CONTAINER_NAME

else
  echo "--------------------------------------------------"
  echo "启动 Bun 容器，在容器中开发前端"
  echo "--------------------------------------------------"

  # 原有的启动容器命令
  docker run -it --rm --name $CONTAINER_NAME \
    --hostname Bun \
    --network host --cpus=2  --memory=2G \
    -e BUN_INSTALL_REGISTRY=http://npm.firfe.de5.net \
    -e LOG_LEVEL=trace \
    -v ./ts-调试/data:/data \
    -w /app -v ./:/app \
    --entrypoint bash \
    docker.code.firfe.work/oven/bun:1.4.3-debian \
    -c 'printf "cd server\ncd web\nbun dev\n" >> ~/.bash_history; exec bash'
fi
