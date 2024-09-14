# Docker

## 常用命令

构建镜像：
```
docker build -t <image>:<tag> -f <path/to/Dockerfile> .
docker build -t my-app:latest -f ./Dockerfile .
```


按镜像启动容器：
```bash
docker run -p <local_port>:<docker_expose_port> <image>
docker run -p 8080:8000 my-app
```

命令行调试容器：
```bash
docker run --platform <platform> -it <image> /bin/sh
docker run --platform linux/amd64 -it my-app /bin/sh
```

推送镜像：
```
docker push <image>:<tag>
docker push my-app:latest
```

涉及远程资源获取或更新的操作，需要先执行docker login。

## 概念

### 仓库 registry

服务器上集中存储镜像的地方，一个仓库通常会包含有多个镜像，以不同tag名来区分。以node仓库为例，它有node:10.15.3-alpine、node:11.13.0-alpine等镜像。

### 镜像 image

定义了将要运行的程序、配置、资源等的打包文件，是一个静态的定义，可以根据一个镜像来运行多个容器。镜像可以从远程仓库拉取，也可从本地自己构建。

从仓库拉取镜像（registry_url未指定时从默认镜像源拉取；tag_name未指定时，默认为latest标签）：

```
docker pull [registry_url]<registry_name>[:tag_name]
```

根据本地Dockerfile构建镜像：

```
docker build <dockerfile_path> -t <image_name>
```

列出已安装的镜像：

```
docker image ls
```

删除某镜像：

```
docker image rm <image_id>
```

### 容器 container

程序运行的地方，通过镜像来创建，容器可以被创建、启动、停止、删除等。镜像和容器的关系可理解为面向对象编程中类和实例的关系。

运行容器：

```
docker run -p <outer_port>:<inner_port> <image_name>
```

查看所有容器（-a表示包括已停止容器）：

```
docker container ls -a
```

停止容器（容器停止后默认不会被自动删除，因为可能还要查看日志文件）：

```
docker container stop <container_id>
```

删除容器：

```
docker container rm <container_id>
```


## Dockerfile

Dockerfile可用来自定义一个镜像。

在程序目录下创建一个Dockerfile，在Dockerfile中声明此程序的相关配置，然后docker build这个Dockerfile，即可生成一个docker镜像。

以一个node程序的Dockerfile为例子：

```
FROM node:latest
COPY . /app
WORKDIR /app
RUN npm install
CMD node index.js
EXPOSE 8888
```

- FROM node:latest

指定程序运行的上层环境为node:latest

- COPY . /app

把当前路径的全部文件复制到docker镜像的/app

- WORKDIR /app

指定工作区路径为/app

- RUN npm install

容器启动前准备，执行npm install

- CMD node index.js

容器启动后，在工作区路径执行node index.js

- EXPOSE 8888

对外暴露8888端口


## 镜像分层
  
在构建镜像时，Dockerfile 中的一条指令会对应创建一个镜像层，下次构建会尽量复用之前的镜像层，来加速构建和节省空间。

如果检测到某一层的结果有变动，则 docker 会复用之前的层，但重新构建变动层及其之后的层。
