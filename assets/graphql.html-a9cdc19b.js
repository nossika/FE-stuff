import{_ as e,p as n,q as t,a1 as i}from"./framework-5866ffd3.js";const a={},s=i(`<h1 id="graphql" tabindex="-1"><a class="header-anchor" href="#graphql" aria-hidden="true">#</a> GraphQL</h1><h2 id="query-mutation" tabindex="-1"><a class="header-anchor" href="#query-mutation" aria-hidden="true">#</a> Query/Mutation</h2><p>GraphQL客户端使用Query/Mutation获取数据，请求参数(同时也是返回的数据结构)根据Schema来组装</p><p>query</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>query {
	viewer { // 对象
		name, // string数据
		respos (first: 10, after: &quot;cursorString&quot;) { // 对象数据，需要另开connection，返回respo列表，first：列表数量；after：分页标记；以及其他支持的查询条件
			edges {
				cursor // 分页标记
				node { // 每条数据的结构
					name
				}
			}
			pageInfo { // 分页相关信息
				hasNextPage
			}
			} 
			respo (name: &quot;aaa&quot;) { // connection，返回指定name的respo或者null
				createdAt
			}
	}
}

variables { // 定义变量。在上面用$something使用
	&quot;something&quot;: {
			&quot;name&quot;: &quot;bbb&quot;
	}
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="schema" tabindex="-1"><a class="header-anchor" href="#schema" aria-hidden="true">#</a> Schema</h2><p>GraphQL服务端使用Schema定义数据的组成、结构</p><h2 id="resolver" tabindex="-1"><a class="header-anchor" href="#resolver" aria-hidden="true">#</a> Resolver</h2><p>GraphQL服务端使用Resolver定义Schema中的数据(字段)如何获取</p>`,9),r=[s];function d(l,c){return n(),t("div",null,r)}const v=e(a,[["render",d],["__file","graphql.html.vue"]]);export{v as default};
