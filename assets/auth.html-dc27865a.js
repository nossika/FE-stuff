import{_ as e,p as s,q as r,a1 as t}from"./framework-5866ffd3.js";const o="/FE-stuff/assets/cas-ba7610e7.png",a={},n=t('<h1 id="登录-身份验证" tabindex="-1"><a class="header-anchor" href="#登录-身份验证" aria-hidden="true">#</a> 登录 &amp; 身份验证</h1><h2 id="oauth2-0" tabindex="-1"><a class="header-anchor" href="#oauth2-0" aria-hidden="true">#</a> OAuth2.0</h2><p>用户、业务站点、账号站点</p><p>1、用户进入业务站点的某页面，需要账号站点的数据，业务调用账号站点api，如果未登陆或者token过期，跳转2，否则跳转6</p><p>2、业务站点把用户重定向到账号站点，并带上redirect参数</p><p>3、用户在账号站点操纵，完成登陆，服务器生成token</p><p>4、账号站点根据redirect参数，回到业务站点的页面，并带上token参数</p><p>5、业务站点得到token，与业务用户绑定，将用户重定向到最初的页面</p><p>6、此时业务站点已有token，带上token向账号站点发起请求，获取数据</p><p>此过程中，用户的账号密码信息只在账号站点提供的页面操作，完全不经过业务站点，可保证用户的信息安全。</p><h2 id="集中式认证服务-cas" tabindex="-1"><a class="header-anchor" href="#集中式认证服务-cas" aria-hidden="true">#</a> 集中式认证服务（CAS）</h2><p><img src="'+o+'" alt="event loop"></p><ul><li><p>当Client没有Server的有效session，也没有CAS的有效session：1 -&gt; 11。</p></li><li><p>当Client没有Server的有效session，但有CAS的有效session（比如之前登录过Server A，现在要登录Server B，Server A和B共用一套CAS）：1、2、3(带CAS的session)、6（验证session有效，直接生成ticket）、7、8、9、10、11</p></li><li><p>当Client有Server的有效session：11</p></li></ul><p>实际场景中一条链路上可能有多层的Server，可以把此架构中的Client和Server看成整体，作为上层的Client，继续往下层的Server拓展。</p><h2 id="用户凭据存储" tabindex="-1"><a class="header-anchor" href="#用户凭据存储" aria-hidden="true">#</a> 用户凭据存储</h2><p>http 是无状态协议，如果需要用户身份，则必须每次请求都将身份信息带上。</p><h3 id="凭据存储位置-cookie-vs-storage" tabindex="-1"><a class="header-anchor" href="#凭据存储位置-cookie-vs-storage" aria-hidden="true">#</a> 凭据存储位置：cookie vs storage</h3><p>登录后，用户凭据可以被存储在浏览器的不同位置：</p><ul><li><p>cookie：存储在网站 cookie，浏览器提供的内置能力，每次发起请求都会自动带上，可通过控制 http 响应的字段来自动设置，简单易用；仅能在同域名场景下使用，需要注意防范 csrf 问题。</p></li><li><p>storage：包含 localStorage、页面内存等其他存储，需要手动管理存储，需要在请求时手动拼到某个 header 里；可跨域使用，无 csrf 问题。</p></li></ul><h3 id="身份数据获取-session-vs-token" tabindex="-1"><a class="header-anchor" href="#身份数据获取-session-vs-token" aria-hidden="true">#</a> 身份数据获取：session vs token</h3><p>登录后，用户的身份信息可以存在服务端或客户端：</p><ul><li><p>session：即存储在服务端，客户端只会拿到 session id，每次请求带上这个 id，服务端再根据 id 去查询对应用户身份。用户控制力强，可随时对用户续期或过期；但有服务压力，每次都需要查询用户身份，需要有一个中心服务。</p></li><li><p>token：即存储在客户端，身份数据以密文+签名存储，客户端无法篡改，每次请求带上 token，服务端只保存解密方法，可直接解密出身份数据，不需要额外查询。性能优，减少服务端存储和查询压力；但用户控制力弱，主动废弃一个有效 token 较难；且有冗余网络请求，因为每次请求都携带了完整用户信息。</p></li></ul><p>实际应用中一般是 cookie-session 或者 storage-token 的配对。</p><h3 id="refresh-token" tabindex="-1"><a class="header-anchor" href="#refresh-token" aria-hidden="true">#</a> refresh token</h3><p>用上述 token 方式存储身份数据会带来一些问题，由于有效 token 废弃难度大，如果设置长的有效期，则泄露的后果会很严重；如果设置短的有效期，则用户需要经常登录，破坏用户体验。</p><p>双 token 是一种兼顾安全和体验的 token 使用方式，将 token 分为日常请求使用的 access token（有效期短）和凭据续期用的 refresh token（有效期稍长）。</p><p>客户端平时请求仅带 access token，它带有访问所需的用户数据。</p><p>如果 access token 处于有效期内，则服务端直接放行；若 access token 过期，服务端会要求客户端发送 refresh token。</p><p>如果这个 refresh token 处于有效期内，则服务端签发新的 access token，客户端使用新 access token 重新发起请求，整个过程可以是自动完成，对用户无感；若 refresh token 已过期，则服务端会要求用户重新去登陆。</p><p>因此服务端只需要维护 refresh token 的状态。refresh token 也可能是以 session 方式管理，如果需要使用户过期，删除此 session 即可。</p>',30),i=[n];function p(h,c){return s(),r("div",null,i)}const l=e(a,[["render",p],["__file","auth.html.vue"]]);export{l as default};