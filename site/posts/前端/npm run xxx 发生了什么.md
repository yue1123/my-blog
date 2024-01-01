---
createTime: 2022-06-07 14:48:50
tags:
  - npm
---

## 前言

你有好奇过为什么`npm run xxx`就可以正确的运行，而直接运行就提示没有该命令?

## 让我们来揭秘

在运行 `npm run xxx` 时,首先会尝试到当前项目 `package.json` 中的 `scripts` 字段中,查找该命令,如果找到该条命令,则执行该命令

### 那么为什么需要`npm run xxx`,而不是直接运行命令呢?

如果尝试直接运行这条命令,会发现命令行提示找不到该条命令

![image1654584191487.png](/image1654584191487.png)

是因为,项目安装的依赖,只是在当前项目, 而不是操作系统的全局命令.

### 项目中的命令又是从哪儿来的?

我们在项目中 `npm i vue-tsc` 安装依赖时,npm 会解析该依赖的 `package.json`,如果存在 bin 字段,就会在 `node_modules/.bin/` 目录中创建好几个 `vue-tsc` 的可执行文件

如果时 `npm i xxx -g` 全局安装,可执行文件会创建在全局的 `node_modules` 目录中,如果时 windows,会在环境变量中添加该目录

![image1654584219433.png](/image1654584219433.png)

![image1654584233343.png](/image1654584233343.png)

![image1654584242528.png](/image1654584242528.png)

> .bin 目录,不是任何一个 npm 包,该目录下的文件,表示一个个的软连接,打开文件可以看到顶部写着 `#!/bin/sh`,表示一个脚本

### 为什么有三个可执行文件?

区分不同运行环境,选择不同的脚本

```Bash
# unix 系默认的可执行文件，必须输入完整文件名
vue-tsc

# windows cmd 中默认的可执行文件，当我们不添加后缀名时，自动根据 pathext 查找文件
vue-tsc.cmd

# Windows PowerShell 中可执行文件，可以跨平台
vue-tsc.ps1

```

### 结论:

所以,我们使用 `npm run vue-tsc` 来运行命令时,虽然操作系统没有 `vue-tsc` 命令,但是 npm 会到 `./node_modules/.bin` 中找到 `vue-tsc` 文件作为脚本执行,相当于执行了 `./node_modules/.bin/vue-tsc` 脚本,然后脚本会通过 node 运行 `./node_modules/vue-tsc/bin/vue-tsc.js` 这个 js 文件
