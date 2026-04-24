# 数据库

## 概览

| 类型 | 代表 | 一句话 |
|------|------|--------|
| 关系型 | MySQL | 表 + SQL，强一致、事务成熟，Web 业务常用 |
| 关系型（对象-关系） | PostgreSQL | 功能强大的 SQL，JSON / GIS / 扩展丰富 |
| 键值 / 内存 | Redis | 内存为主，极快读写，丰富数据结构 |
| 文档型 | MongoDB | JSON 式文档，灵活 schema，水平扩展友好 |
| 搜索 / 倒排索引 | Elasticsearch | 全文检索 + 日志分析，近实时、聚合强 |
| 列式 OLAP | ClickHouse | 列式存储 + 向量化，海量数据聚合查询性能极强 |

下文按「简介 → 适用场景 → 语法 / 机制」展开，便于对照选型。

---

## MySQL

### 简介

开源关系型数据库（RDBMS），用**表、行、列**建模，通过 **SQL** 访问。支持事务（ACID）、索引、主从复制等，是 Web 业务系统最常用的**主库**方案之一。

### 适用场景

- **核心业务数据**：订单、用户、账务等需要强一致与复杂查询的场景。
- **多表关联与报表**：JOIN、聚合、窗口函数等 SQL 能力成熟。
- **事务要求高**：转账、库存扣减等需要 InnoDB 事务保证。
- **团队以 SQL 为主**：生态、工具、运维经验都较统一。

不太适合：单表数据量极大且难以分库分表时，需配合分片中间件或考虑分布式数据库；以非结构化数据为主、schema 频繁变动时，文档库更顺手。

### 语法要点

建模层次：**库（database）→ 表（table）→ 行 / 列**。典型操作：`CREATE DATABASE` / `CREATE TABLE`、`INSERT`、`UPDATE`、`DELETE`、`SELECT`，以及索引、约束、事务控制（`BEGIN` / `COMMIT` / `ROLLBACK`）等。

### 分库分表

单实例 MySQL 在存储容量、连接数、写 QPS 上都有上限，单表行数过大也会让 B+ 树变深、索引效率下降。**分库分表**是把数据按某种规则拆到多个库 / 多张表上，以突破单机瓶颈。

按维度分为：

- **垂直拆分**（按字段 / 业务）
  - **垂直分表**：把一张大表按字段拆小，冷热字段或大字段（如 `TEXT` / `BLOB`）单独成表，减小主表行宽。
  - **垂直分库**：按业务域拆库，如用户库、订单库、商品库，降低单库压力、便于独立部署。
- **水平拆分**（按行 / 数据量）
  - **水平分表**：多张表结构相同，按路由键把行分散进去，如 `order_0 … order_15`。
  - **水平分库**：把分表再分散到多个库 / 多台实例上，真正扩展写入能力。实际方案常水平分库 + 水平分表一起做。

常见**路由策略**：

- **Hash 取模**：`shard = hash(key) % N`，分布均匀，但扩容需大规模迁移。
- **范围分片**：按时间 / ID 区间切，按时间归档方便，但易出现热点分片。
- **一致性哈希**：扩容只影响相邻分片，适合分片数动态变化。
- **路由表 / 基因法**：用映射表或把分片键"基因"编码进主键，支持非分片键查询。

**常见中间件 / 方案**：ShardingSphere（JDBC / Proxy 两种形态）、Vitess（YouTube 开源，K8s 友好）、云厂商分布式 DB（TiDB、PolarDB-X、OceanBase 等，通常无需手工分片）。

**带来的复杂度**（选型时要权衡）：

- **跨库 JOIN / 聚合困难**：通常靠冗余字段、在应用层聚合或宽表预计算绕开。
- **分布式事务**：跨分片写要用 XA、TCC、Seata 或最终一致性方案，性能和复杂度都上去。
- **全局唯一 ID**：不能再依赖自增主键，改用雪花算法（Snowflake）、号段模式、UUID 等。
- **跨分片排序 / 分页**：`ORDER BY ... LIMIT` 需从各分片拉数据归并，深分页代价高。
- **扩容与再分片**：数据迁移、双写、切流量，工程量大；选路由策略时就要提前考虑。

> 实践建议：单表在千万到亿级、或写入成为瓶颈时再考虑分库分表；能用读写分离 + 归档 + 索引优化解决的，优先做这些。若业务已经足够大、且团队有运维能力，直接上 TiDB / OceanBase 等分布式数据库，比自建分片中间件更省心。

### Binlog

**Binary Log**，MySQL Server 层的逻辑日志，按时间顺序记录所有修改数据的操作（DDL + DML，不含 `SELECT`），所有存储引擎通用。注意与 InnoDB 的 **redo log** 区分：redo log 是引擎层的物理日志，只服务于**崩溃恢复**；binlog 面向外部消费，是复制与数据同步的基础设施。

主要用途：

- **主从复制**：从库拉取主库 binlog 重放，实现读写分离、高可用、跨机房同步。
- **时间点恢复（PITR）**：`全量备份 + 之后的 binlog 重放` 恢复到任意时刻，比单靠全量备份精细得多。
- **数据订阅 / CDC**：Canal、Debezium、Maxwell 等工具伪装成从库订阅 binlog，把变更实时同步到 Kafka / ES / ClickHouse / Redis，是**缓存更新、搜索同步、数仓接入**的标准做法。

---

## PostgreSQL

### 简介

开源**对象-关系型**数据库（ORDBMS），常简称 **pgsql / Postgres**。在标准 SQL 之上扩展了大量能力：**JSONB**（原生 JSON 列与索引）、**数组 / 自定义类型 / 枚举**、**窗口函数 / CTE / 递归查询**、**全文检索**、**PostGIS 地理空间**，并通过扩展机制（`CREATE EXTENSION`）接入向量检索（pgvector）、时序（TimescaleDB）等。

与 MySQL 的主要差异：

- **SQL 特性更完整**：对标准 SQL 支持更全面，复杂查询 / 分析能力更强。
- **事务与一致性**：基于 MVCC 实现多版本并发控制，DDL 也可放入事务中回滚。
- **JSONB**：既保留关系模型，又能像文档库一样存储 / 查询半结构化数据。
- **扩展生态**：PostGIS、pgvector、TimescaleDB 等让一库承担多种职责。
- **复制 / 高可用**：原生流复制 + 逻辑复制，社区高可用方案成熟（Patroni 等）。

### 适用场景

- **复杂业务与分析混合**：报表、BI、复杂 JOIN / 窗口函数较多时体验优于 MySQL。
- **半结构化字段**：既要关系表又要灵活字段时，用 JSONB 一张表搞定，避免引入额外文档库。
- **地理 / 位置服务**：PostGIS 几乎是行业标准。
- **AI / 向量检索**：用 pgvector 作为嵌入向量存储与近邻检索。
- **时序与 IoT**：搭配 TimescaleDB 处理大规模时序数据。
- **对数据一致性与 SQL 表达力要求高的中后台系统**。

不太适合：极高写入吞吐、海量简单 KV 读写（Redis / 专用 KV 更合适）；需要大规模水平扩展时，要借助 Citus 等分片方案或改用分布式数据库。

### 语法要点

整体 SQL 与 MySQL 接近，常见差异：

- 官方客户端是 `psql`：`\l` 列库、`\c dbname` 切库、`\dt` 列表。
- 自增主键使用 `SERIAL` / `BIGSERIAL` 或 `GENERATED AS IDENTITY`，没有 `AUTO_INCREMENT`。
- 字符串字面量用单引号 `'...'`；未加引号的标识符会被折叠为小写，需保留大小写时用双引号 `"..."`。
- JSONB 查询示例：

```
-- 建表：一列关系字段 + 一列 JSONB
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 取 JSON 字段：-> 返回 jsonb，->> 返回 text
SELECT payload->'device'->>'os' AS os FROM events WHERE user_id = 1;

-- 条件过滤 + JSONB 索引
CREATE INDEX idx_events_payload ON events USING GIN (payload);
SELECT * FROM events WHERE payload @> '{"level":"error"}';
```

---

## Redis

### 简介

开源**内存**键值存储，常用于缓存、会话、分布式锁、轻量消息队列等。值支持多种数据结构（字符串、哈希、列表、集合、有序集合等），读写延迟极低。持久化提供两种机制：**RDB**（定时快照）与 **AOF**（追加写操作日志），可单独或组合使用，在启动恢复速度与数据丢失窗口之间取舍。

### 适用场景

- **缓存**：热点数据、页面片段、接口结果，减轻 MySQL 等后端压力。
- **会话 / 限流 / 分布式锁**：短期键、`EXPIRE`、`SET NX` 等模式。
- **排行榜与计数**：有序集合（`ZADD` / `ZRANGE`）、原子自增。
- **简单消息与任务队列**：`List` 作队列、`Stream` 作带消费组的日志流、`Pub/Sub` 作即时广播（见下文）。

不太适合：大体积冷数据全量放内存成本高；需要复杂即席分析查询时不如 SQL 或专用分析引擎；强一致跨键事务不是 Redis 强项。

### 语法要点

通过 `redis-cli` 或各语言客户端连接后直接操作键值，命令按数据结构分类（大小写不敏感）。常用命令：

```
# 通用：过期 / 查找 / 删除
SET key val [EX seconds] [NX]     # 写入，NX 只在不存在时写（常用于分布式锁）
GET key                           # 读
DEL key                           # 删除
EXISTS key                        # 是否存在
EXPIRE key seconds                # 设置过期时间
TTL key                           # 查询剩余有效期

# Hash（哈希）：适合对象字段
HSET key f1 v1 f2 v2              # 批量设置字段
HGET key f1                       # 取某个字段
HGETALL key                       # 取全部字段

# List（列表）：双端队列，适合轻量队列
LPUSH key v1 v2                   # 左侧入队（RPUSH 从右侧）
LPOP key                          # 左侧出队（RPOP 从右侧）
LRANGE key start stop             # 按索引范围读取

# Set（集合）：自动去重
SADD key v1 v2                    # 添加成员
SMEMBERS key                      # 列出全部成员
SINTER key1 key2                  # 交集（并集 SUNION、差集 SDIFF）

# Sorted Set（有序集合）：带分值排序，适合排行榜
ZADD key score1 m1 score2 m2      # 添加 / 更新成员分值
ZRANGE key start stop [WITHSCORES]      # 按排名区间取
ZRANGEBYSCORE key min max               # 按分值区间取
ZRANK key m1                            # 查询成员排名
```

事务通过 `MULTI / EXEC` 将多条命令打包执行（不支持回滚，且执行期间不会被其他命令打断）；更复杂的原子逻辑一般用 **Lua 脚本**（`EVAL`）。

### 发布 / 订阅（Pub/Sub）

客户端 `SUBSCRIBE channel` 订阅频道，其他客户端 `PUBLISH channel message` 推送消息。**消息不持久化**：订阅前或断连期间产生的消息不会补发；需要可靠投递时改用 Stream、List 或专门的消息队列。

---

## MongoDB

### 简介

开源**文档型**数据库，数据以 **BSON/类 JSON 文档**为单位存储在**集合**中，无固定表结构要求（灵活 schema）。默认数据**持久化到磁盘**；也可选用内存引擎等部署形态。支持副本集、分片集群，适合数据模型嵌套多、字段变化频繁的场景。

### 适用场景

- **内容 / 目录 / 配置**：文档结构差异大，用嵌套文档比多表 JOIN 更自然。
- **物联网、日志、事件流**：高写入、按时间或设备分片扩展。
- **快速迭代产品**：schema 频繁调整，减少迁表成本（仍需索引与数据治理）。
- **地理空间、聚合管道**：内置 `$geoNear`、聚合管道等能力。

不太适合：重度依赖多文档 ACID 事务的业务（4.0+ 已支持多文档事务，但性能与运维成本高于关系库）；团队只熟悉 SQL 且报表均为关系模型时，MySQL / PostgreSQL 更省事。

### 语法要点

建模层次：**库（database）→ 集合（collection）→ 文档（document）**。操作通过 `mongosh` 或各语言驱动以**方法调用**而非 SQL 表达，例如 `db.users.insertOne({...})`、`db.users.find({ age: { $gt: 18 } })`、`db.users.updateOne(...)`、聚合用 `db.coll.aggregate([...])`。索引通过 `createIndex` 创建，支持复合索引、TTL、地理索引等。

---

## Elasticsearch

### 简介

基于 **Lucene** 的开源分布式**搜索引擎**，常简称 **ES**。核心能力是**倒排索引**下的全文检索与打分排序，同时提供丰富的聚合（aggregation）能力，常用于日志分析与搜索场景。数据以 **JSON 文档**形式写入，按 **index（索引）→ shard（分片）→ document（文档）** 组织，天然分布式、近实时（写入到可检索通常在秒级）。

周边常称 **ELK / Elastic Stack**：**Elasticsearch（存储 + 检索）+ Logstash / Beats（采集）+ Kibana（可视化）**。

### 适用场景

- **全文检索**：商品 / 内容 / 文档搜索，支持分词、相关性打分、高亮、拼写纠错、同义词等。
- **日志与可观测性**：应用日志、Nginx 日志、审计日志集中检索与分析（ELK 经典组合）。
- **聚合分析 / 仪表盘**：按维度分桶、时间序列聚合，配合 Kibana 做运营 / 运维大盘。
- **多条件复杂查询**：布尔组合、范围、地理位置（geo）、嵌套文档等。
- **向量检索**：较新版本支持 kNN 近邻检索，可用于语义搜索。

不太适合：作为业务主库（非事务型，不建议作为唯一数据源）；频繁更新同一文档的重写场景（成本较高）；强一致的跨文档事务。

### 语法要点

通过 **HTTP + JSON** 的 REST API 访问，Kibana 里常用 **Dev Tools** 直接写请求。

```
# 建索引（含字段映射）
PUT /articles
{
  "mappings": {
    "properties": {
      "title":   { "type": "text" },
      "tags":    { "type": "keyword" },
      "views":   { "type": "integer" },
      "created": { "type": "date" }
    }
  }
}

# 写入文档
POST /articles/_doc
{ "title": "Elasticsearch 入门", "tags": ["search","log"], "views": 10, "created": "2025-01-01" }

# 全文检索 + 过滤 + 分页
GET /articles/_search
{
  "query": {
    "bool": {
      "must":   [{ "match": { "title": "入门" } }],
      "filter": [{ "term":  { "tags":  "search" } }]
    }
  },
  "from": 0, "size": 10,
  "sort": [{ "views": "desc" }]
}

# 聚合：按 tag 分桶并求平均浏览量
GET /articles/_search
{
  "size": 0,
  "aggs": {
    "by_tag": {
      "terms": { "field": "tags" },
      "aggs":  { "avg_views": { "avg": { "field": "views" } } }
    }
  }
}
```

核心概念速记：

- **text vs keyword**：`text` 会分词用于全文检索；`keyword` 不分词，用于精确匹配 / 聚合 / 排序。
- **query vs filter**：`query` 参与打分（相关性排序），`filter` 不打分但可缓存、更快。
- **mapping**：字段类型与分词器定义，写入前规划好可大幅提升质量。

---

## ClickHouse

### 简介

开源**列式 OLAP 数据库**（Online Analytical Processing），最初由 Yandex 开发并开源，现由 ClickHouse Inc. 维护。核心定位是**对海量数据做聚合分析**，在**大范围扫描 + GROUP BY / 聚合**场景下性能极强。特点：

- **列式存储 + 压缩**：只读所需列，数据压缩比高、IO 少。
- **向量化执行 + 多核并行**：批量按列计算，吞吐高。
- **MergeTree 家族引擎**：按 `ORDER BY`（即主索引）排序落盘，按 `PARTITION BY` 分区，后台合并，适合按时间等维度的大表。
- **SQL 方言**：语法近似标准 SQL，并提供大量聚合 / 数组 / 时间 / 近似计算函数（如 `uniqExact`、`quantile`）。
- 原生**分布式**：通过 `Distributed` 表、分片与副本扩展到集群规模。

### 适用场景

- **日志 / 事件 / 埋点分析**：每天亿级以上的事件数据，按时间 + 维度做 OLAP 查询。
- **用户行为 / 漏斗 / 留存**：大表上做复杂聚合、窗口、分位数计算。
- **监控 / 可观测性后端**：指标与 trace 聚合查询（如部分 APM、Sentry 后端即用 CH）。
- **BI / 报表**：替代传统数仓中 OLAP 层，对接 Superset、Metabase 等。
- **数据湖加速层**：作为 Kafka / 数据湖下游的高速查询层。

不太适合：**高并发小事务 OLTP**（单点更新 / 删除不是强项，缺少成熟事务）；强一致跨行事务；频繁按主键单行点查的业务库。与 MySQL / PostgreSQL 是**互补**关系，常见架构是「MySQL 做业务 + CH 做分析」，中间用 CDC / 同步工具打通。

### 语法要点

SQL 风格接近 MySQL / PostgreSQL，但建表时需要**指定引擎**，常用 `MergeTree`：

```sql
-- 建一张按天分区、按 (user_id, ts) 排序的事件表
CREATE TABLE events (
  ts         DateTime,
  user_id    UInt64,
  event      LowCardinality(String),
  country    LowCardinality(String),
  properties String
)
ENGINE = MergeTree
PARTITION BY toYYYYMMDD(ts)
ORDER BY (user_id, ts);

-- 批量写入（CH 倾向于批量而非单行频繁 INSERT）
INSERT INTO events VALUES
  ('2025-01-01 10:00:00', 1, 'click', 'CN', '{}'),
  ('2025-01-01 10:00:05', 2, 'view',  'US', '{}');

-- 典型聚合：每天各国 UV / PV
SELECT
  toDate(ts)            AS day,
  country,
  count()               AS pv,
  uniqExact(user_id)    AS uv
FROM events
WHERE ts >= now() - INTERVAL 7 DAY
GROUP BY day, country
ORDER BY day, uv DESC;
```

实践要点：

- **排序键（ORDER BY）**就是主索引，决定查询过滤效率；选择最常用的过滤字段。
- **分区（PARTITION BY）**常按时间（天 / 月），便于 TTL 清理和分区裁剪。
- **批量写入**优先：单行逐条 INSERT 会产生大量小 part，性能和稳定性都会变差。
- **物化视图（Materialized View）**：预聚合高频查询，显著降低线上查询成本。
