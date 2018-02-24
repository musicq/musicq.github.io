---
layout: post
title:  "Mysql 数据乱码"
date:   2015-10-16 16:41:03
tag:
    - mysql
comments: true
share: true
---

这几天在学习 php 时遇到了各种坑，对于我这种新手小白来说，解决每一个问题都需要花上不少时间，真是挺悲哀的。。。不过算了，想起每当解决一个问题时那种长叹一口气时的感觉，也还是挺爽的。

今天就来记录一下 Mysql 插入数据时乱码的问题吧。相信很多同学开始时都会遇到这种情况，真是挺麻烦的一件事。为什么我大中文不是主流语言呢...很多国外的文档都有日文版的，就没有中文的，气死朕了！

## 怎样解决

### 1.创建数据库

```sql
create database mydb;

use mydb;

create table newtable(
    id int not null primary key,
    name char(40) not null,
    address char(100) not null
) default charset = utf8; -- 这句话很重要，声明数据库编码格式

grant select, ineset, update, delete
on mydb.*
to admin@localhost identified by 'password';
```

记得在你想要显示中文的每个 table 后面加上编码。

### 2.php 查询数据库

```php
<?php
    function db_connect() {
        $result = new mysqli('localhost', 'admin', 'password', 'mydb');
        $result->query("SET NAMES UTF8"); # 这句话很重要
        if(!$result) return false;

        return $result;
    }
?>
```

记得加上`$result->query("SET NAMES UTF8");`这个查询条件，表示以 `utf8` 格式查询数据。

### 3.html 部分

在页面也不能随便取值，需要在头部标签`<head>`内加入格式声明`<meta charset='utf-8' />`。

---

这样全部条件都具备了，你可以在数据库中插入一些数据试试，看看是不是不管在数据库中，还是在读取后，中都没有乱码掉。
