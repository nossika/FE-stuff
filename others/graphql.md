
# GraphQL

## Query/Mutation

GraphQL客户端使用Query/Mutation获取数据，请求参数(同时也是返回的数据结构)根据Schema来组装

query

```
query {
	viewer { // 对象
		name, // string数据
		respos (first: 10, after: "cursorString") { // 对象数据，需要另开connection，返回respo列表，first：列表数量；after：分页标记；以及其他支持的查询条件
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
			respo (name: "aaa") { // connection，返回指定name的respo或者null
				createdAt
			}
	}
}

variables { // 定义变量。在上面用$something使用
	"something": {
			"name": "bbb"
	}
}
```

## Schema

GraphQL服务端使用Schema定义数据的组成、结构

## Resolver

GraphQL服务端使用Resolver定义Schema中的数据(字段)如何获取
