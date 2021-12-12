(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{402:function(t,e,a){t.exports=a.p+"assets/img/https.d725e9d1.png"},467:function(t,e,a){"use strict";a.r(e);var v=a(54),_=Object(v.a)({},(function(){var t=this,e=t.$createElement,v=t._self._c||e;return v("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[v("h1",{attrs:{id:"协议"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#协议"}},[t._v("#")]),t._v(" 协议")]),t._v(" "),v("h2",{attrs:{id:"http"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#http"}},[t._v("#")]),t._v(" HTTP")]),t._v(" "),v("p",[t._v("应用层协议，基于传输层的tcp协议。")]),t._v(" "),v("p",[t._v("HTTP1.1默认keep-alive，可基于一次tcp（3次握手4次挥手）来发多次http请求。")]),t._v(" "),v("h3",{attrs:{id:"内容"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#内容"}},[t._v("#")]),t._v(" 内容")]),t._v(" "),v("p",[t._v("内容由version + header + body三部分组成。")]),t._v(" "),v("p",[t._v("req格式： 版本&路径+换行+头部+换行+body，例子："),v("code",[t._v("HTTP/1.1 /index.html GET\\r\\nConnection: keep-alive")]),t._v("。")]),t._v(" "),v("p",[t._v("res格式：版本&状态码+换行+头部+换行+body，例子："),v("code",[t._v("HTTP/1.1 200 OK\\r\\nContent-type: text/plain\\r\\n\\r\\nsome text here")])]),t._v(" "),v("h3",{attrs:{id:"状态码"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#状态码"}},[t._v("#")]),t._v(" 状态码")]),t._v(" "),v("p",[t._v("状态码12345对应含义：1未完成；2成功；3重定向、未修改等；4客户端错误；5服务端错误。")]),t._v(" "),v("h3",{attrs:{id:"header"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#header"}},[t._v("#")]),t._v(" header")]),t._v(" "),v("p",[t._v("content-type/accept-encoding/user-agent/cookie/access-control-allow-origin/cache-control/etag/connection")]),t._v(" "),v("h3",{attrs:{id:"缓存相关"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#缓存相关"}},[t._v("#")]),t._v(" 缓存相关")]),t._v(" "),v("p",[t._v("强缓存(cache-control的max-age)、协商缓存（etag/last-modified）、不缓存等。")]),t._v(" "),v("h3",{attrs:{id:"跨域相关"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#跨域相关"}},[t._v("#")]),t._v(" 跨域相关")]),t._v(" "),v("p",[t._v("access-control-allow-origin/access-control-allow-methods、OPTIONS类型（简单请求和复杂请求）")]),t._v(" "),v("p",[t._v("cookie：同源、cookie安全（same-site、http-only、csp策略）等。")]),t._v(" "),v("h3",{attrs:{id:"biz-code-in-http-header-vs-body"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#biz-code-in-http-header-vs-body"}},[t._v("#")]),t._v(" biz code in HTTP header vs body")]),t._v(" "),v("p",[t._v("可以类比TCP/QUIC，在 直接利用现有协议/在协议下层自定义封装 之间的取舍。")]),t._v(" "),v("h2",{attrs:{id:"tcp-udp"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#tcp-udp"}},[t._v("#")]),t._v(" TCP/UDP")]),t._v(" "),v("p",[t._v("都基于IP的传输层协议，传输数据给应用层协议使用。网络层IP+传输层端口来表示唯一连接。")]),t._v(" "),v("p",[t._v("因为两者都基于网络层的IP协议，都可能会出现丢包或乱序。而TCP与UDP不同的是，它在协议层封装了滑动窗口（超时重传来控制顺序、控制并发数来合理利用带宽）来解决这些问题。基于UDP也同样可以在应用层自行封装实现TCP的功能，比如QUIC。")]),t._v(" "),v("h2",{attrs:{id:"https"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#https"}},[t._v("#")]),t._v(" HTTPS")]),t._v(" "),v("p",[t._v("HTTP是明文传输，且没有对来源校验，通信内容易受中间人的监视和篡改。所以需要对通信内容加密来解决问题，其中最关键的是保证密钥的正确和安全。")]),t._v(" "),v("p",[t._v("HTTPS引入了数字证书（CA）来解决问题。CA是一个权威机构，负责给受信的网站颁发证书，证书包含一对公私钥，私钥由网站保管，公钥对外公开。现代浏览器会内置CA的信息。")]),t._v(" "),v("p",[t._v("HTTP：IP -> TCP -> HTTP")]),t._v(" "),v("p",[t._v("HTTPS: IP -> TCP -> "),v("strong",[t._v("SSL/TLS")]),t._v(" -> HTTP")]),t._v(" "),v("blockquote",[v("p",[t._v("公钥私钥涉及非对称加密的知识，相关内容详见"),v("a",{attrs:{href:"/web/safe?id=%E5%86%85%E5%AE%B9%E5%8A%A0%E5%AF%86"}},[t._v("【内容加密】")])])]),t._v(" "),v("h3",{attrs:{id:"建立连接过程"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#建立连接过程"}},[t._v("#")]),t._v(" 建立连接过程")]),t._v(" "),v("p",[t._v("HTTPS首次建立连接（TLS1.2的握手）过程如下：")]),t._v(" "),v("p",[v("img",{attrs:{src:a(402),alt:"HTTPS"}})]),t._v(" "),v("ol",[v("li",[v("p",[t._v("Client发起请求")])]),t._v(" "),v("li",[v("p",[t._v("Server收到请求，返回明文证书内容（包含网站信息、签发机构CA信息、证书有效期等）和证书签名（对"),v("strong",[t._v("证书内容hash")]),t._v("用CA私钥加密后得到的签名）")])]),t._v(" "),v("li",[v("p",[t._v("Client收到证书后，从"),v("strong",[t._v("内置的CA证书表")]),t._v("中，取出和Server证书对应的CA公钥，解密签名，将签名数据与证书内容比对，若一致，则说明此签名一定是CA私钥持有方签发的，即可认为此证书来源可信（这步的关键之处在于CA公钥是从本地直接取得的，保证公钥绝对可信）")])]),t._v(" "),v("li",[v("p",[t._v("Client"),v("strong",[t._v("生成对称密钥key")]),t._v("，将key用CA公钥加密后发给Server，这个加密能确保没有CA私钥的人无法拿到key")])]),t._v(" "),v("li",[v("p",[t._v("Server收到加密内容后，用CA私钥解密出key，之后双方即可用这个key来进行加密通信")])])]),t._v(" "),v("p",[t._v("以上过程的关键是取证书信息和公钥这一步，并非从请求中获取（因为这步也可能被篡改），而是从浏览器内置的CA获取，保证证书和公钥的绝对正确。")]),t._v(" "),v("p",[t._v("TLS1.2需要2个RTT（证书确认、密钥确认），会话恢复时需要1RTT（跳过证书确认）；TLS1.3需要1个RTT（证书+加密一起确认），会话恢复时0RTT（直接在首次数据请求同时协商密钥）。加上TCP连接本身的一个RTT，所以整个HTTPS（基于TLS1.2的话）建立连接需要3个RTT。")]),t._v(" "),v("h2",{attrs:{id:"http2"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#http2"}},[t._v("#")]),t._v(" HTTP2")]),t._v(" "),v("p",[t._v("相比HTTP的改进点：")]),t._v(" "),v("ol",[v("li",[v("p",[t._v("编码方式：文本 => 二进制")])]),t._v(" "),v("li",[v("p",[t._v("多路复用：一个tcp连接中同时发起多个http请求，而不是一个http请求完毕才能发下一个。")])])]),t._v(" "),v("p",[t._v("引入帧和流的概念。每个帧会带上自己属于哪个流的信息，因此不同流中的帧可以并行发送，即可以在同一个tcp连接中并发多个http请求，解决http1.1的头部阻塞问题。但tcp包丢失时导致的阻塞问题依然在，这点在HTTP3/QUIC中解决。")]),t._v(" "),v("ol",{attrs:{start:"3"}},[v("li",[t._v("头部压缩：客户端/服务端都维护一个headers索引表，请求不再每次都带上完整headers。")])]),t._v(" "),v("p",[t._v("hpack算法")]),t._v(" "),v("ol",{attrs:{start:"4"}},[v("li",[t._v("主动推送：可以在客户端请求html时，把相关css、js也一并推送（需要服务端配置）")])]),t._v(" "),v("h3",{attrs:{id:"区分http"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#区分http"}},[t._v("#")]),t._v(" 区分HTTP")]),t._v(" "),v("p",[t._v("HTTP2的headers风格是（冒号+）全小写+连字符，比如"),v("code",[t._v(":method")]),t._v("、"),v("code",[t._v("user-agent")]),t._v("等，HTTP1的风格是首字母大写+连字符。")]),t._v(" "),v("p",[t._v("HTTP2必须基于HTTPS，虽然HTTP2协议本身并不要求HTTPS，但各浏览器的实现都要求HTTP2必须用HTTPS。")]),t._v(" "),v("h2",{attrs:{id:"http3-quic"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#http3-quic"}},[t._v("#")]),t._v(" HTTP3(QUIC)")]),t._v(" "),v("p",[t._v("QUIC，基于UDP，自行实现类似TCP的数据可靠性。相当于在会话层/应用层实现部分传输层的功能。")]),t._v(" "),v("p",[t._v("HTTP2基于TCP的问题：TCP建立连接需要1RTT，且切换网络时需要重建连接；弱网环境下，TCP的重传导致拥塞等。")]),t._v(" "),v("p",[t._v("初次建立连接只需1RTT（UDP的0RTT+证书等配置确认1RTT），首次数据请求时协商密钥；会话恢复只需0RTT（跳过配置确认），直接发起数据请求（首次请求同时协商密钥）。")]),t._v(" "),v("h2",{attrs:{id:"websocket"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#websocket"}},[t._v("#")]),t._v(" websocket")]),t._v(" "),v("p",[t._v("和http一样基于tcp，http协议的升级")]),t._v(" "),v("p",[t._v("tcp连接（连接实例称为socket）建立后，客户端发送http格式的报文"),v("code",[t._v("{ Connection: Upgrade, Upgrade: websocket, ... }")]),t._v("，服务端如果支持，也返回类似的确认报文，双方都对这个socket做好全双工通信的准备，即websocket连接建立。")]),t._v(" "),v("h3",{attrs:{id:"socket"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#socket"}},[t._v("#")]),t._v(" socket")]),t._v(" "),v("p",[t._v("套接字，可以理解为一个连接的实例，\n比如说服务端客户端建立起一个tcp连接，那么两端各会有一个socket实例，可以对其调用各种方法来收发信息。")]),t._v(" "),v("h2",{attrs:{id:"rpc"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#rpc"}},[t._v("#")]),t._v(" RPC")]),t._v(" "),v("p",[t._v("远程过程调用(Remote Procedure Call)，指从一台计算机通过网络远程调用另一台计算机上的程序。因为调用方与被调用方不共享同一内存空间，不像本地调用函数时传参一样简单，需要解决寻址、序列化与反序列化等问题。")]),t._v(" "),v("p",[t._v("RPC框架是为解决调用问题所涉及的一整套方案，不单属于某一层的协议。框架需要包括寻址协议、序列化协议、传输协议，应用在企业内部一般还需包括日志记录、服务治理、容灾等常用功能。从定义上说，基于HTTP的WEB服务也可以算是RPC的一种实现。")]),t._v(" "),v("h2",{attrs:{id:"七层模型"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#七层模型"}},[t._v("#")]),t._v(" 七层模型")]),t._v(" "),v("p",[t._v("应用：http")]),t._v(" "),v("p",[t._v("会话：ssl/tls")]),t._v(" "),v("p",[t._v("传输：tcp/udp")]),t._v(" "),v("p",[t._v("网络：ip")])])}),[],!1,null,null,null);e.default=_.exports}}]);