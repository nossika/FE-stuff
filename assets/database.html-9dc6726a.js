import{_ as e,p as i,q as n,a1 as d}from"./framework-5866ffd3.js";const s={},a=d(`<h1 id="数据库" tabindex="-1"><a class="header-anchor" href="#数据库" aria-hidden="true">#</a> 数据库</h1><h2 id="mysql" tabindex="-1"><a class="header-anchor" href="#mysql" aria-hidden="true">#</a> MySQL</h2><p>关系型</p><h3 id="语法" tabindex="-1"><a class="header-anchor" href="#语法" aria-hidden="true">#</a> 语法</h3><p>db、表、行列</p><h2 id="redis" tabindex="-1"><a class="header-anchor" href="#redis" aria-hidden="true">#</a> Redis</h2><p>非关系型/键值型/内存型</p><p>持久化方法：RDB定时快照、AOF增量记录操作以还原</p><h3 id="语法-1" tabindex="-1"><a class="header-anchor" href="#语法-1" aria-hidden="true">#</a> 语法</h3><p>连接db，直接对键值操作。值的数据类型分为string、hash、list、set、sorted set五种数据，对应不同的操作方式</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// string

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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="发布-订阅" tabindex="-1"><a class="header-anchor" href="#发布-订阅" aria-hidden="true">#</a> 发布/订阅</h3><h2 id="mongodb" tabindex="-1"><a class="header-anchor" href="#mongodb" aria-hidden="true">#</a> MongoDB</h2><p>非关系型/文档型/内存型</p><p>持久化方法：数据库操作按一定频率批量从内存同步到硬盘</p><h3 id="语法-2" tabindex="-1"><a class="header-anchor" href="#语法-2" aria-hidden="true">#</a> 语法</h3><p>选取db -&gt; 选取集合 -&gt; 对集合增删改查</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>show dbs // 显示所有db

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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,18),l=[a];function r(v,c){return i(),n("div",null,l)}const u=e(s,[["render",r],["__file","database.html.vue"]]);export{u as default};
