import{_ as e,p as n,q as i,a1 as s}from"./framework-5866ffd3.js";const a="/FE-stuff/assets/cas-ba7610e7.png",d={},r=s('<h1 id="权限-认证" tabindex="-1"><a class="header-anchor" href="#权限-认证" aria-hidden="true">#</a> 权限 &amp; 认证</h1><h2 id="oauth2-0" tabindex="-1"><a class="header-anchor" href="#oauth2-0" aria-hidden="true">#</a> OAuth2.0</h2><p>用户、业务站点、账号站点</p><p>1、用户进入业务站点的某页面，需要账号站点的数据，业务调用账号站点api，如果未登陆或者token过期，跳转2，否则跳转6</p><p>2、业务站点把用户重定向到账号站点，并带上redirect参数</p><p>3、用户在账号站点操纵，完成登陆，服务器生成token</p><p>4、账号站点根据redirect参数，回到业务站点的页面，并带上token参数</p><p>5、业务站点得到token，与业务用户绑定，将用户重定向到最初的页面</p><p>6、此时业务站点已有token，带上token向账号站点发起请求，获取数据</p><p>此过程中，用户的账号密码信息只在账号站点提供的页面操作，完全不经过业务站点，可保证用户的信息安全。</p><h2 id="集中式认证服务-cas" tabindex="-1"><a class="header-anchor" href="#集中式认证服务-cas" aria-hidden="true">#</a> 集中式认证服务（CAS）</h2><p><img src="'+a+`" alt="event loop"></p><ul><li><p>当Client没有Server的有效session，也没有CAS的有效session：1 -&gt; 11。</p></li><li><p>当Client没有Server的有效session，但有CAS的有效session（比如之前登录过Server A，现在要登录Server B，Server A和B共用一套CAS）：1、2、3(带CAS的session)、6（验证session有效，直接生成ticket）、7、8、9、10、11</p></li><li><p>当Client有Server的有效session：11</p></li></ul><p>实际场景中一条链路上可能有多层的Server，可以把此架构中的Client和Server看成整体，作为上层的Client，继续往下层的Server拓展。</p><h2 id="登陆" tabindex="-1"><a class="header-anchor" href="#登陆" aria-hidden="true">#</a> 登陆</h2><p>登陆的一种实现：</p><p>Client</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>gen randomKey

encodeKey = psw

H(id+randomKey)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Server</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>decodeKey = psw

decode id + randomKey

encodeKey = randomKey

gen syncKey

H(syncKey)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Client</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>decodeKey = randomKey

decode syncKey
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>票据的一种实现：</p><p>登陆后，服务端生成票据，传给客户端保存，票据中记录登陆序列。若客户端数据泄露被copy进行登陆，服务端序列增加，下次客户端再次登陆，则因为序列对不上要求客户端输入密码重新登陆，重新生成票据。</p>`,24),l=[r];function t(c,o){return n(),i("div",null,l)}const p=e(d,[["render",t],["__file","auth.html.vue"]]);export{p as default};
