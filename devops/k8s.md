# K8s

Kubernetes(K8s) 是一个开源的容器编排平台，可以自动完成在部署、管理和扩展容器化应用过程中涉及的许多手动操作。

## 核心概念

### Pod

K8s 最小调度和管理单元。像一个“逻辑主机”，包含一个或多个紧密关联的 Docker，共享网络和存储。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp
spec:
  containers:
  - name: webapp
    image: my-webapp:latest
    # 可以通过 localhost:6379 访问 Redis
    # 代码中直接连接 localhost:6379
    env:
    - name: REDIS_HOST
      value: "localhost"  # 或者 "127.0.0.1"
    - name: REDIS_PORT
      value: "6379"
  - name: redis
    image: redis:alpine
    # Redis 在容器内监听 6379
    ports:
    - containerPort: 6379
```

Pod 内的 Docker 容器可以像访问本机一样访问其他 Docker 容器的端口。

直接管理 Pod 不常见，一般通过 Deployment 配置来管理。

### Deployment

Pod 的声明式更新控制器。定义 Pod 的模板和副本数量，负责创建、更新、回滚和扩缩容 Pod 集合。

```yaml
# deployment.yaml - 管理 Pod 副本，提供自愈、滚动更新
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deployment
  labels:
    app: myapp
spec:
  replicas: 3  # 要运行3个相同的Pod副本
  selector:
    matchLabels:
      app: myapp  # 这个选择器必须匹配下面template中的labels
  template:  # 这里就是Pod的定义模板
    metadata:
      labels:
        app: myapp
        version: v1
    spec:
      containers:
      - name: nginx
        image: nginx:1.20
        ports:
        - containerPort: 80
        env:
        - name: NGINX_ENV
          value: "production"
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
        livenessProbe:  # 健康检查
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 10

```

1 个 Deployment 对应 1 组相似的 Pod，并打上标签供 Service 使用。

### Service

网络抽象层。为 Deployment（一组动态变化的 Pod） 提供一个稳定的访问入口（IP/DNS）和负载均衡。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp  # 选择所有带有app=myapp标签的Pod
  ports:
  - name: http
    port: 80        # Service对内的端口
    targetPort: 80  # Pod容器的端口
    protocol: TCP
  # 默认type: ClusterIP，只能在集群内访问
  # 如果要外部访问，可以改为NodePort或LoadBalancer
  type: ClusterIP
```

可以通过标签关联 1 个或者多个 Deployment，同样 1 个 Deployment 也可能被多个 Service 关联。

同一命名空间（namespace）内，其他服务可以通过 `http://myapp-service` 或者 `http://myapp-service:80` 访问这个 myapp-service 服务。

### Ingress

HTTP/HTTPS 流量路由规则。定义如何将外部 HTTP(S) 请求路由到集群内部不同的 Service。需要 Ingress Controller 来实现。

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
  annotations:
    # 以下注解根据你的Ingress Controller而定
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "false"
spec:
  rules:
  - host: myapp.example.com  # 你的域名
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp-service  # 指向之前创建的Service
            port:
              number: 80
```

### 其他概念

#### Namespace

命名空间，隔离 Service、Deployment 等资源。

跨命名空间访问服务可以指定服务路径实现，比如 `http://<service-name>.<namespace>.svc.cluster.local`。

#### ConfigMap

一般用于配置文件，可以供 Pod 或者 Deployment 按需引用，可作为环境变量或者文件挂载。

文件挂载可以热更新，可能有分钟级的延迟。

## 流量路径

```
外部用户
    ↓ 访问 https://www.example.com
[ Ingress Controller (如 Nginx) ] ← 遵循 → [ Ingress (路由规则) ]
    ↓ 将请求路由到对应的 Service
[ Service (my-svc) ] ← 通过标签选择器发现 → [ Deployment ]
    ↓ 负载均衡，选择一个 Pod          ↓ 管理着 Pod 的副本集
[ Pod ] (运行你的容器)              [ Pod, Pod, ...] (多个副本)
    ↓
[ Docker 容器 ] (运行你的应用代码)
```

## 常用命令

启动 K8s 服务：

```bash
kubectl apply -f app.yaml # 包含 Deployment、Service、Ingress 等配置
```

查看资源状态：

```bash
kubectl get all
kubectl get deployments
kubectl get pods
kubectl get services
kubectl get ingress
```

查看容器日志：

```bash
kubectl logs <pod-name>
```

## Helm

Helm 是 K8s 的包管理器，用于管理 K8s 配置文件的更新、部署等。

使用 Chart.yaml 模板语法，抽象 K8s 的 yaml 配置。

