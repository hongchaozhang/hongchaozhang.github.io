---
layout: post
title: "Babel工作原理"
date: 2025-03-24 23:20:31 +0800
comments: true
categories: [web, babel]
---

<!-- more -->

Babel is a JavaScript compiler。
主要用于将 ECMAScript 2015+（ES6 及以上）的 JavaScript 代码转换成能够在当前和旧版浏览器环境中兼容运行的代码版本。

# 配置

Babel 的配置文件通常是`.babelrc.json`或`babel.config.json`，可以在其中配置需要使用的插件和预设:

```
{
  "presets": [...],
  "plugins": [...]
}
```

甚至可以直接写在`package.json`中：

```
{
  ...,
  "babel": {
    "presets": [...],
    "plugins": [...]
  },
  ...
}
```

更加灵活的，可以在`webpack.config.js`中访问 Node.js 的 APIs：

```
module.exports = function (api) {
  api.cache(true);

  const presets = [ ... ];
  const plugins = [ ... ];

  if (process.env["ENV"] === "prod") {
    plugins.push(...);
  }

  return {
    presets,
    plugins
  };
}
```

# 工作流程

![babel workflow](/images/babel-workflow.png)

Babel 的编译过程与大多数编程语言的编译器类似，分为三个主要阶段：解析（Parsing）、转换（Transformation）和生成（Code Generation）

## 解析（Parsing）

这一阶段将代码字符串解析成抽象语法树（AST，Abstract Syntax Tree）[2](https://developer.aliyun.com/article/1303957)[3](https://blog.csdn.net/ByteDanceTech/article/details/126900235)。AST 是源代码的抽象语法结构的树状表示，树上的每个节点都表示源代码中的一种结构[2](https://developer.aliyun.com/article/1303957)。
解析过程又分为两个步骤：

-   分词：将整个代码字符串分割成语法单元数组：tokenizer，keyword
-   语法分析：建立分析语法单元之间的关系[2](https://developer.aliyun.com/article/1303957)

例如，一个简单的`console.log('zcy');`会被解析成包含程序结构、表达式语句、调用表达式等节点的 AST[2](https://developer.aliyun.com/article/1303957)。

```
{
  "type": "Program",
  "body": [
    {
      "type": "ExpressionStatement",
      "expression": {
        "type": "CallExpression",
        "callee": {
          "type": "MemberExpression",
          "computed": false,
          "object": {
            "type": "Identifier",
            "name": "console"
          },
          "property": {
            "type": "Identifier",
            "name": "log"
          }
        },
        "arguments": [
          {
          "type": "Literal",
          "value": "zcy",
          "raw": "'zcy'"
          }
        ]
      }
    }
  ],
  "sourceType": "script"
}
```

## 转换（Transformation）

这一阶段对 AST 进行转换操作[2](https://developer.aliyun.com/article/1303957)[3](https://blog.csdn.net/ByteDanceTech/article/details/126900235)。转换通常通过 Babel plugin（插件）或者 preset（预设）实现，每个插件可以访问 AST 并对其进行修改，例如将箭头函数的节点转换为普通函数节点。

### plugin（插件）

Babel 本身只是一个编译器，可以理解为一个框架，就像一个纯函数`const babel = code => code`一样，只负责解析然后生成代码。要实现具体的转换功能，需要添加和使用插件（plugins）。
例如，要将箭头函数转换为普通函数，可以使用官方提供的`@babel/plugin-transform-arrow-functions`插件[1](https://www.xuwenchao.site/blogs/babel.html)。每个插件负责特定类型的语法转换，开发者可以根据需要添加相应的插件。

### presets（预设）

如果要编译一个完整的应用，单独配置每个所需的插件会非常繁琐。为了解决这个问题，Babel 引入了 presets（预设）的概念[1](https://www.xuwenchao.site/blogs/babel.html)。
presets 可以理解为 plugins 和部分配置的集合，使用预设可以避免单独配置每个 plugin 和参数，直接使用已经组合好的配置即可[1](https://www.xuwenchao.site/blogs/babel.html)。常见的预设包括`@babel/preset-env`、`@babel/preset-react`等。

## 生成（Code Generation）

最后一个阶段是根据转换后的 AST 生成新的代码字符串。这一过程包括将 AST 中的每个节点映射回字符串形式，并生成源码映射（source maps）。

# 结论

Babel 作为现代前端开发的重要工具，为开发者提供了使用最新 JavaScript 特性的能力，同时保证了代码在各种浏览器环境中的兼容性。深入理解 Babel 的基本概念、工作流程和使用方法，对于前端开发者提升开发效率和代码质量有着重要意义。

从入门的基本使用，到进阶的插件开发，再到专业的性能优化，Babel 的学习是一个循序渐进的过程。随着对 Babel 的不断深入学习和实践，开发者能够更加灵活地利用这一工具，构建更加现代化、高效的前端应用。

# 应用场景

-   编辑器
-   LSP language server protocol
-   语法高亮，自动补全
-   静态代码分析
-   代码转换
-   代码压缩和优化
