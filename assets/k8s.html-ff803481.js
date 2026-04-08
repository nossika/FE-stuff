import{_ as n,p as s,q as a,a1 as e}from"./framework-5866ffd3.js";const t={},p=e(`<h1 id="k8s" tabindex="-1"><a class="header-anchor" href="#k8s" aria-hidden="true">#</a> K8s</h1><p>Kubernetes(K8s) 是一个开源的容器编排平台，可以自动完成在部署、管理和扩展容器化应用过程中涉及的许多手动操作。</p><h2 id="核心概念" tabindex="-1"><a class="header-anchor" href="#核心概念" aria-hidden="true">#</a> 核心概念</h2><h3 id="pod" tabindex="-1"><a class="header-anchor" href="#pod" aria-hidden="true">#</a> Pod</h3><p>K8s 最小调度和管理单元。像一个“逻辑主机”，包含一个或多个紧密关联的 Docker，共享网络和存储。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> myapp
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">containers</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> webapp
    <span class="token key atrule">image</span><span class="token punctuation">:</span> my<span class="token punctuation">-</span>webapp<span class="token punctuation">:</span>latest
    <span class="token comment"># 可以通过 localhost:6379 访问 Redis</span>
    <span class="token comment"># 代码中直接连接 localhost:6379</span>
    <span class="token key atrule">env</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> REDIS_HOST
      <span class="token key atrule">value</span><span class="token punctuation">:</span> <span class="token string">&quot;localhost&quot;</span>  <span class="token comment"># 或者 &quot;127.0.0.1&quot;</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> REDIS_PORT
      <span class="token key atrule">value</span><span class="token punctuation">:</span> <span class="token string">&quot;6379&quot;</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> redis
    <span class="token key atrule">image</span><span class="token punctuation">:</span> redis<span class="token punctuation">:</span>alpine
    <span class="token comment"># Redis 在容器内监听 6379</span>
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">6379</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Pod 内的 Docker 容器可以像访问本机一样访问其他 Docker 容器的端口。</p><p>直接管理 Pod 不常见，一般通过 Deployment 配置来管理。</p><h3 id="deployment" tabindex="-1"><a class="header-anchor" href="#deployment" aria-hidden="true">#</a> Deployment</h3><p>Pod 的声明式更新控制器。定义 Pod 的模板和副本数量，负责创建、更新、回滚和扩缩容 Pod 集合。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># deployment.yaml - 管理 Pod 副本，提供自愈、滚动更新</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> myapp<span class="token punctuation">-</span>deployment
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> myapp
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">3</span>  <span class="token comment"># 要运行3个相同的Pod副本</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> myapp  <span class="token comment"># 这个选择器必须匹配下面template中的labels</span>
  <span class="token key atrule">template</span><span class="token punctuation">:</span>  <span class="token comment"># 这里就是Pod的定义模板</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> myapp
        <span class="token key atrule">version</span><span class="token punctuation">:</span> v1
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx
        <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span><span class="token number">1.20</span>
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
        <span class="token key atrule">env</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> NGINX_ENV
          <span class="token key atrule">value</span><span class="token punctuation">:</span> <span class="token string">&quot;production&quot;</span>
        <span class="token key atrule">resources</span><span class="token punctuation">:</span>
          <span class="token key atrule">requests</span><span class="token punctuation">:</span>
            <span class="token key atrule">memory</span><span class="token punctuation">:</span> <span class="token string">&quot;64Mi&quot;</span>
            <span class="token key atrule">cpu</span><span class="token punctuation">:</span> <span class="token string">&quot;250m&quot;</span>
          <span class="token key atrule">limits</span><span class="token punctuation">:</span>
            <span class="token key atrule">memory</span><span class="token punctuation">:</span> <span class="token string">&quot;128Mi&quot;</span>
            <span class="token key atrule">cpu</span><span class="token punctuation">:</span> <span class="token string">&quot;500m&quot;</span>
        <span class="token key atrule">livenessProbe</span><span class="token punctuation">:</span>  <span class="token comment"># 健康检查</span>
          <span class="token key atrule">httpGet</span><span class="token punctuation">:</span>
            <span class="token key atrule">path</span><span class="token punctuation">:</span> /
            <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">80</span>
          <span class="token key atrule">initialDelaySeconds</span><span class="token punctuation">:</span> <span class="token number">5</span>
          <span class="token key atrule">periodSeconds</span><span class="token punctuation">:</span> <span class="token number">10</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>1 个 Deployment 对应 1 组相似的 Pod，并打上标签供 Service 使用。</p><h3 id="service" tabindex="-1"><a class="header-anchor" href="#service" aria-hidden="true">#</a> Service</h3><p>网络抽象层。为 Deployment（一组动态变化的 Pod） 提供一个稳定的访问入口（IP/DNS）和负载均衡。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> myapp<span class="token punctuation">-</span>service
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> myapp  <span class="token comment"># 选择所有带有app=myapp标签的Pod</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> http
    <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">80</span>        <span class="token comment"># Service对内的端口</span>
    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">80</span>  <span class="token comment"># Pod容器的端口</span>
    <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
  <span class="token comment"># 默认type: ClusterIP，只能在集群内访问</span>
  <span class="token comment"># 如果要外部访问，可以改为NodePort或LoadBalancer</span>
  <span class="token key atrule">type</span><span class="token punctuation">:</span> ClusterIP
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以通过标签关联 1 个或者多个 Deployment，同样 1 个 Deployment 也可能被多个 Service 关联。</p><p>同一命名空间（namespace）内，其他服务可以通过 <code>http://myapp-service</code> 或者 <code>http://myapp-service:80</code> 访问这个 myapp-service 服务。</p><h3 id="ingress" tabindex="-1"><a class="header-anchor" href="#ingress" aria-hidden="true">#</a> Ingress</h3><p>HTTP/HTTPS 流量路由规则。定义如何将外部 HTTP(S) 请求路由到集群内部不同的 Service。需要 Ingress Controller 来实现。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Ingress
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> myapp<span class="token punctuation">-</span>ingress
  <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
    <span class="token comment"># 以下注解根据你的Ingress Controller而定</span>
    <span class="token key atrule">nginx.ingress.kubernetes.io/rewrite-target</span><span class="token punctuation">:</span> /
    <span class="token key atrule">nginx.ingress.kubernetes.io/ssl-redirect</span><span class="token punctuation">:</span> <span class="token string">&quot;false&quot;</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">rules</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> myapp.example.com  <span class="token comment"># 你的域名</span>
    <span class="token key atrule">http</span><span class="token punctuation">:</span>
      <span class="token key atrule">paths</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">path</span><span class="token punctuation">:</span> /
        <span class="token key atrule">pathType</span><span class="token punctuation">:</span> Prefix
        <span class="token key atrule">backend</span><span class="token punctuation">:</span>
          <span class="token key atrule">service</span><span class="token punctuation">:</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> myapp<span class="token punctuation">-</span>service  <span class="token comment"># 指向之前创建的Service</span>
            <span class="token key atrule">port</span><span class="token punctuation">:</span>
              <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">80</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="其他概念" tabindex="-1"><a class="header-anchor" href="#其他概念" aria-hidden="true">#</a> 其他概念</h3><h4 id="namespace" tabindex="-1"><a class="header-anchor" href="#namespace" aria-hidden="true">#</a> Namespace</h4><p>命名空间，隔离 Service、Deployment 等资源。</p><p>跨命名空间访问服务可以指定服务路径实现，比如 <code>http://&lt;service-name&gt;.&lt;namespace&gt;.svc.cluster.local</code>。</p><h4 id="configmap" tabindex="-1"><a class="header-anchor" href="#configmap" aria-hidden="true">#</a> ConfigMap</h4><p>一般用于配置文件，可以供 Pod 或者 Deployment 按需引用，可作为环境变量或者文件挂载。</p><p>文件挂载可以热更新，可能有分钟级的延迟。</p><h2 id="流量路径" tabindex="-1"><a class="header-anchor" href="#流量路径" aria-hidden="true">#</a> 流量路径</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>外部用户
    ↓ 访问 https://www.example.com
[ Ingress Controller (如 Nginx) ] ← 遵循 → [ Ingress (路由规则) ]
    ↓ 将请求路由到对应的 Service
[ Service (my-svc) ] ← 通过标签选择器发现 → [ Deployment ]
    ↓ 负载均衡，选择一个 Pod          ↓ 管理着 Pod 的副本集
[ Pod ] (运行你的容器)              [ Pod, Pod, ...] (多个副本)
    ↓
[ Docker 容器 ] (运行你的应用代码)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="常用命令" tabindex="-1"><a class="header-anchor" href="#常用命令" aria-hidden="true">#</a> 常用命令</h2><p>启动 K8s 服务：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl apply <span class="token parameter variable">-f</span> app.yaml <span class="token comment"># 包含 Deployment、Service、Ingress 等配置</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>查看资源状态：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get all
kubectl get deployments
kubectl get pods
kubectl get services
kubectl get ingress
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查看容器日志：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl logs <span class="token operator">&lt;</span>pod-name<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="helm" tabindex="-1"><a class="header-anchor" href="#helm" aria-hidden="true">#</a> Helm</h2><p>Helm 是 K8s 的包管理器，用于管理 K8s 配置文件的更新、部署等。</p><p>使用 Chart.yaml 模板语法，抽象 K8s 的 yaml 配置。</p>`,39),l=[p];function i(c,o){return s(),a("div",null,l)}const r=n(t,[["render",i],["__file","k8s.html.vue"]]);export{r as default};
