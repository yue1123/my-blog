---
createTime: 2020-12-23 14:25:38
tags:
  - nginx
---

## 发现问题

项目中有个上传图片的功能，开发的时候测试没有问题，但是上线了后，上传超过 1m 的文件就会报 <code>413 Request Entity Too Large</code>(请求体太大).后台我是用 node.js 写的，允许最大文件大小是 <code>50m</code>，所以在开发的时候测试没有问题，唯一的问题就是上线时，用了 <code>ngnix</code> 做代理转发，413 是 <code>nginx</code> 抛出的错误，问题找到了，就很好解决了。

## 解决问题

修改-nginx-配置，打开 nginx 主配置文件 `nginx.conf`，找到 `http{}` 段并修改以下内容：

```shell
# 允许客户端请求体最大大小

client_max_body_size 10m;
```

测试 nginx 配置：

```shell
# 出现 successful 就表示没问题

nginx -t
```

nginx 重新加载配置：

```shell
nginx -s reload
```

重新发起请求，不出意外，应该没有问题。
