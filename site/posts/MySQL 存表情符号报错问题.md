---
createTime: 2020-12-23 00:12:10
tags:
  - Mysql
---

```bash
Incorrect string value: '\xF0\x9F\x98\x84 \xF0...' for column 'xxx'
```

在没有做任何配置情况下，MySQL 是不能存表情符号的

正常的汉字一般不会超过 3 个字节，为什么为出现 4 个字节呢？实际上是它对应的是智能手机输入法中的表情。那为什么会报错呢？因为 MySQL 中的 utf-8 并不是真正意义上的 utf-8，它只能存储 1~3 个字节长度的 utf-8 编码，如果想存储 4 个字节的必须用 **utf8mb4** 类型。而要使用 utf8mb4 类型，首先要保证 MySQL 版本要不低于 MySQL 5.5.3。

如下两个配置：

1. 首先数据表中，**可能会有表情符号的字段**，需要使用 utf8mb4 字符集，其次使用 utf8mb4_general_ci 排序规则
2. 在连接数据库的配置中，加入 charset:'utf8mb4'
