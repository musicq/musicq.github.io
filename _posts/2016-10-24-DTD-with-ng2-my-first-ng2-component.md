---
layout: post
title:  "《Angular2 从开发到部署系列》之「第一个 Angular2 应用」"
date:   2016-10-20
tag:
    - Angular2
comments: true
share: true
---

# 前言
> 抱歉隔了很久才更新。。。
>
> 在学习之前，我给大家推荐点学习资料
>
> [Angular2官网](https://angular.io/) 官网的文档写的其实很详细了，而且[中文文档](https://angular.cn/)也同步进行翻译，想要学好 Angular2 就一定要多看文档，这次 Angular2 团队下了很大功夫在文档方面，写的相当详细和全面。
>
> [ng-book 2](https://www.ng-book.com/2/) 这本书介绍的很全面，比较适合入门，但是是英文版的，目前 Angular2 中文官网的雪狼大叔组织了一批同学正在翻译这本书，相信很快便能在书店买到了。
>
> [@AngularClass](https://github.com/AngularClass) 这是一个一帮牛人组成的队伍，专门教学 Angular 的一些课程，他们在 github 上有很多的开源，我们这篇的 webpack 打包，就是参考他们的 [angular2-webpack-starter](https://github.com/AngularClass/angular2-webpack-starter)。
>
> ...网上还有很多的资料，学习要善用 [Google](https://www.google.com) 和 [stackoverflow](http://stackoverflow.com/)。

# 第一个 Angular2 应用
在 Angular2 中，很重要的一个方法就是 [`@component`](https://angular.io/docs/ts/latest/api/core/index/Component-decorator.html)，你或许会觉得它很像 Angular1 中的 `directive`，其实他就是一个 [`@Directive`](https://angular.io/docs/ts/latest/api/core/index/Directive-decorator.html) 加上一个 view。接下来跟着我一步步写一个 Angular2 的应用吧。

## 第一个 Angular2 组件
进入我们之前搭建好的项目目录，然后建立一个 src 文件夹，并在里面再建立一个 app 文件夹，这里面用来存放我们的全部 Angular2 代码。

```shell
cd awesome-start

mkdir -p src/app
```

在 src 目录下，我们要建立几个文件。

- `index.html` 入口页
- `main.ts` 应用启动文件
- `polyfills.ts` 添加一些浏览器不支持 api 的填充
- `vendor.ts` 引入第三方引入库
- `app/app.module.ts` 应用根模块
- `app/app.component.ts` 应用根组件
- `app/app.component.html` 应用根组件模板
- `app/app.component.css` 应用根组件样式

是不是觉得这么多文件，看着都迷糊。别怕，其实这样写是方便我们组织我们的项目，使每个文件的用途更加清晰，也更利于后期的维护。另外，在文件的命名上，我们发现有 `.component.ts`、`.module.ts` 这样的命名，这是一种[以特性来命名的方式](https://angular.cn/docs/ts/latest/guide/style-guide.html#!#naming)，这样的好处就是你能清楚地知道这个文件是干什么的。是不是你看一眼`app.component.ts`这个文件就知道他里面应该是一个组件呢？这也是官方推崇的一种命名方式，建议大家使用这样的命名方式来开发你的应用。

Ok，接下来，我们就要开始写组件了。

打开 `app/app.component.ts` 文件，加入下面的代码

```typescript
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {}

```

这里都是些什么鬼？

其实正如你所见，一个 component，就是一个 class，不过稍微有些不同的是，这个 class 是带有一个 `@Component` [装饰器](https://www.typescriptlang.org/docs/handbook/decorators.html)的。装饰器是一个 es6 的新特性，这里我们其实可以看做一个将要传给 AppComponent 这个 class 的元数据。

`selector` 就是我们组件的名字，你可以使用 css 选择器的方式来命名你的组建，例如

```javascript
// 选择带有不带有 attr 属性的 a 标签
selector: 'a:not([attr])'
```

`templateUrl` 存放组建的模板 url
`styleUrls` 存放组建样式 url，注意这是一个数组

接下来为我们的组件加点内容，打开 `app/app.component.html`

```html
<main>
    <h1>哎呦~不错哦！</h1>
</main>
```

好了，这样我们的第一个组件写好了，是不是并不复杂。接下来我们就在入口页面里面引用它，打开 `index.html`

```html
<!doctype html>
<html>
<head>
    <base href="<%= webpackConfig.metadata.baseUrl %>">

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <title><%= webpackConfig.metadata.title %></title>

    <meta name="description" content="<%= webpackConfig.metadata.title %>">
</head>
<body>

    <!-- 组件入口 -->
    <app-root>Loading...</app-root>

    <% if (webpackConfig.metadata.isDevServer && webpackConfig.metadata.HMR !== true) { %>
    <!-- Webpack Dev Server reload -->
    <script src="/webpack-dev-server.js"></script>
    <% } %>
</body>
</html>
```

你可能会很迷惑，怎么这么多乱起八糟的，别怕，那些东西你都不需要关心，只需要关心 `body` 标签里的 `app-root` 就行，因为他就是我们所写的组件，angular 会找到他，然后把它渲染出来。

OK，入口文件也写好了，是不是可以运行了？一般这种设问句的答案99%都是否定的。虽然我们写好了组件（AppCompnent），并且使用了它（<app-root>），但是我们的应用依然不能运行，因为我们还需要一个引导方法启动我们的程序（如果它能自己启动，那就相当智能了...）。

## 写一个 NgModule

使用过 Angular1 的会知道，在 Angular1 中有一个模块化的方法 `angular.module`，同样在2中也有一个类似的方法 [`NgModule`](https://angular.cn/docs/ts/latest/guide/ngmodule.html)。Angular2 的各个模块都封装在这样一个个 NgModule 中，例如我们熟悉的一些模板指令 `ngIf`、`ngFor` 这些都存放在 `commonModule` 里面，如果想要使用这些指令的时候，我们首先就要先引入 commonModule 这个模块，不然 Angular2 会不认识（虽然是亲生的）这些指令，并抛给你一堆错误。接下来我们看看怎样写一个 NgModule。

打开 `app.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

/* import 根组件 */
import { AppComponent } from './app.component';

@NgModule({
    imports: [
        BrowserModule
    ],
    declarations: [
        AppComponent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
```

`BrowserModule` 这个模块，是所有在浏览器启动的 Angular2 应用所必须的。

`declarations` 在这 module 里面，我们引入了之前写的 AppComponent，并且在 `declarations` 里面声明了它，这是必要的，如果我们不提前声明我们的组件，那么 Angular2 会不认识我们写的组件，这样就不会把他渲染出来。不止组件，我们写的 `@Pipe` `@Directive` 这些都需要提前在 declarations 里面声明出来。

`bootstrap` 在这里面把我们需要启动的根组件声明出来，Angular2 会从启动 bootstrap 里面的组件。

## 启动应用

就快完成了，再坚持一下，打开 `main.ts`

```typescript
/**
 * @import 启动模块
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

/**
 * @import 根模块
 */
import { AppModule } from './app/app.module';

if (process.env.ENV === 'production') enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule);
```

这个文件就是我们应用的启动文件了，它会引导启动我们的应用。

好了，一切准备就绪，接下来我们就可以运行我们的应用了。

```shell
npm start
```

打开 http://localhost:3000，恭喜你，我们的应用成功启动了。

好吧，很丑，不建议的话，可以在 `app.component.css` 里面给我们的应用润色一下。自己动手尝试一下吧，写几个组件练练手。这会比你一直看效果更好。
