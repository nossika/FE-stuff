# 数据库

## MySQL

关系型

### 语法

db、表、行列

## Redis

非关系型/键值型/内存型

持久化方法：RDB定时快照、AOF增量记录操作以还原

### 语法

连接db，直接对键值操作。值的数据类型分为string、hash、list、set、sorted set五种数据，对应不同的操作方式

```
// string

SET key val // 写

GET key // 读

DEL key // 删

EXISTS key // 查找是否存在

EXPIRE key seconds // 给该键设置有效期，过期自动清除

TTL key // 查询该键的剩余有效期

// hash

HSET key field1 val1 field2 val2 // 批量设置哈希表

HGET key field1 // 从哈希表获取某个键的值

HGETALL key // 获取该哈希表的全部键和值

// list

LPUSH key val1 val2 // 向列表头部添加多个成员（RPUSH为尾部）

LPOP key // 移出并返回列表头部元素（RPOP为尾部）

LRANGE key start stop // 获取列表下标从start至stop的一段列表

// set

SADD key val1 val2 // 向集合添加多个成员，自动去重

SPOP key // 移除并返回集合中的一个随机成员

SMEMBERS key // 返回集合中的所有成员

// sorted set

ZADD key score1 member1 score2 member2 // 向有序集合添加多个成员，若成员已存在，则更新分值

ZRANK key member1 // 返回有序集合中指定成员的索引

ZSCORE key member1 // 返回有序集合中指定成员的分值

ZCOUNT key min max // 返回在有序集合中指定分值区间的成员数

ZRANGEBYSCORE key min max  // 返回在有序集合中指定分值区间的成员

ZRANGE key start stop // 返回在有序集合中指定索引区间的成员
```

### 发布/订阅

## MongoDB

非关系型/文档型/内存型

持久化方法：数据库操作按一定频率批量从内存同步到硬盘

### 语法

选取db -> 选取集合 -> 对集合增删改查

```
show dbs // 显示所有db

use db1 // 使用名为db1的数据库（db）

db.createCollection(name, options) // 在db里创建一个集合（col）

show collections // 显示所有col

db.col1.insert(data) // 在名为col1的集合中插入一条json格式的data数据（db.col1表示在col1中进行）

db.col1.update(query, update, options) // 将满足query条件的data以update规则更新

db.col1.remove(query, options) // 删除满足query条件的data

db.col1.find(query, projection) // 查找满足query条件的data

db.col1.find().sort(rule).skip(skipNum).limit(limitNum) // 带排序、跳过、数量的查找

db.col1.aggregate(options) // 聚合查找，类似MySQL的GROUP BY

db.col1.createIndex(keys, options) // 以keys创建索引，提高后续查找效率
```