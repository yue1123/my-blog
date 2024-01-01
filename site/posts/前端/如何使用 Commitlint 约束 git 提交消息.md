---
createTime: 2020-12-24 01:14:48
tags:
  - 工程化
coverImg: https://commitlint.js.org/assets/commitlint.svg
---

## 前言

一个项目中，可能有很多小伙伴一同参与开发，编写好代码后，经常基于在 Git 中提交我们的更改，因此我们在提交信息随便写点什么就提交上去了。例如：aaa,commit,日期时间等等。显然这不是一个好的做法，我们应该尽量编写能说明这次提交内容的提交信息，以便于他人 codereview 或者代码回滚时能理解这次修改

## 什么是 Commitlint ?

**commitlint** 负责用于对 commit message 进行格式校验，检查您的提交信息并确保它们遵循一组规则。

它是一个 husky 预提交钩子运行,在提交之前运行，如果没有通过校验的话就并阻止提交。

## 什么是 husky ?

简单来说，就是 Git 的钩子，能够在特定事件发生之前或之后执行特定脚本代码功能

> [git 官网对 husky 的介绍](https://git-scm.com/docs/githooks)

## 如何使用

我们需要安装 commitlint CLI 和 commitlint 配置

> 本文使用的是: [Conventional Commits Config](https://www.conventionalcommits.org/)

```shell
npm install --save-dev @commitlint/config-conventional @commitlint/cli
# OR
pnpm add -D @commitlint/config-conventional @commitlint/cli
```

接着再新建一个`commitlint.config.js`的配置文件

> 更多配置请参考[commitlint 文档](https://commitlint.js.org/#/)

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能 feature
        'fix', // 修复 bug
        'docs', // 文档注释
        'style', // 代码格式(不影响代码运行的变动)
        'refactor', // 重构(既不增加新功能，也不是修复bug)
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回退
        'build' // 打包
      ]
    ]
  }
}
```

或者使用命令行生产配置文件

```bash
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

现在我们还需要安装 husky 来运行 commitlint

```bash
npm install husky --save-dev
# OR
pnpm add -D husky
```

添加 husky 预提交钩子

```bash
npx husky add .husky/commit-msg "npx --no -- commitlint --edit $1"
```

## 提交

现在，让我们编写一个不遵循规范的提交信息试试

```bash
git commit -m '123'
```

![image1648307177052.png](/image1648307177052.png)

不出意外，你应该会看到这样的错误输出。如果提交成功了，说明您可能那个地方出错了，再次检查确认

最后，该试试正确的提交信息了！！

```bash
git commit -m 'feat: new feature'
```

![image1648307421063.png](/image1648307421063.png)

至此，大功告成
