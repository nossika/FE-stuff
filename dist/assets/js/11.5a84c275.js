(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{401:function(e,t,s){e.exports=s.p+"assets/img/cas.c566cd85.png"},458:function(e,t,s){"use strict";s.r(t);var a=s(54),n=Object(a.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"权限-认证"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#权限-认证"}},[e._v("#")]),e._v(" 权限 & 认证")]),e._v(" "),a("h2",{attrs:{id:"oauth2-0"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#oauth2-0"}},[e._v("#")]),e._v(" OAuth2.0")]),e._v(" "),a("p",[e._v("用户、业务站点、账号站点")]),e._v(" "),a("p",[e._v("1、用户进入业务站点的某页面，需要账号站点的数据，业务调用账号站点api，如果未登陆或者token过期，跳转2，否则跳转6")]),e._v(" "),a("p",[e._v("2、业务站点把用户重定向到账号站点，并带上redirect参数")]),e._v(" "),a("p",[e._v("3、用户在账号站点操纵，完成登陆，服务器生成token")]),e._v(" "),a("p",[e._v("4、账号站点根据redirect参数，回到业务站点的页面，并带上token参数")]),e._v(" "),a("p",[e._v("5、业务站点得到token，与业务用户绑定，将用户重定向到最初的页面")]),e._v(" "),a("p",[e._v("6、此时业务站点已有token，带上token向账号站点发起请求，获取数据")]),e._v(" "),a("p",[e._v("此过程中，用户的账号密码信息只在账号站点提供的页面操作，完全不经过业务站点，可保证用户的信息安全。")]),e._v(" "),a("h2",{attrs:{id:"集中式认证服务-cas"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#集中式认证服务-cas"}},[e._v("#")]),e._v(" 集中式认证服务（CAS）")]),e._v(" "),a("p",[a("img",{attrs:{src:s(401),alt:"event loop"}})]),e._v(" "),a("ul",[a("li",[a("p",[e._v("当Client没有Server的有效session，也没有CAS的有效session：1 -> 11。")])]),e._v(" "),a("li",[a("p",[e._v("当Client没有Server的有效session，但有CAS的有效session（比如之前登录过Server A，现在要登录Server B，Server A和B共用一套CAS）：1、2、3(带CAS的session)、6（验证session有效，直接生成ticket）、7、8、9、10、11")])]),e._v(" "),a("li",[a("p",[e._v("当Client有Server的有效session：11")])])]),e._v(" "),a("p",[e._v("实际场景中一条链路上可能有多层的Server，可以把此架构中的Client和Server看成整体，作为上层的Client，继续往下层的Server拓展。")]),e._v(" "),a("h2",{attrs:{id:"登陆"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#登陆"}},[e._v("#")]),e._v(" 登陆")]),e._v(" "),a("p",[e._v("登陆的一种实现：")]),e._v(" "),a("p",[e._v("Client")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("gen randomKey\n\nencodeKey = psw\n\nH(id+randomKey)\n")])])]),a("p",[e._v("Server")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("decodeKey = psw\n\ndecode id + randomKey\n\nencodeKey = randomKey\n\ngen syncKey\n\nH(syncKey)\n")])])]),a("p",[e._v("Client")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("decodeKey = randomKey\n\ndecode syncKey\n")])])]),a("p",[e._v("票据的一种实现：")]),e._v(" "),a("p",[e._v("登陆后，服务端生成票据，传给客户端保存，票据中记录登陆序列。若客户端数据泄露被copy进行登陆，服务端序列增加，下次客户端再次登陆，则因为序列对不上要求客户端输入密码重新登陆，重新生成票据。")])])}),[],!1,null,null,null);t.default=n.exports}}]);