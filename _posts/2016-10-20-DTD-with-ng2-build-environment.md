---
layout: post
title:  "《Angular2 从开发到部署系列》之「环境搭建」"
date:   2016-10-20
---

#环境搭建

> 如果你已经迫不及待想要跳过教程直接开始自己折腾了，[这里](https://github.com/musicq/angular2-webpack-express-starter)已经有一份现成的项目备份了。你可以运行下列命令立刻开始自己第一个 Angular2之旅。
> ```shell
> # 下载项目
> git clone https://github.com/musicq/angular2-webpack-express-starter.git
>
> # 安装依赖
> npm install
>
> # 启动
> npm start
> ```

## 环境要求
- node v4.5.0+

之所以选择 4.x.x 的版本是因为我们要搭建的 Angular2 的应用是想要一个能够较为稳定的环境，而且并不需要太多 node 新版本的功能，只需要用到一些 es6 的新特性就够了。如果你追求新的更酷的 node 新特性，也可以使用 6.x.x 以上的版本。

## 创建项目
首先为我们的应用起一个你喜欢的名字，这里我想为它起名为 `awesome-start`。

```shell
cd ~

# 创建项目目录
mkdir awesome-start && cd awesome-start

# 初始化项目
npm init -y
```
到目前为止我们已经成功创建了我们的项目，Angular2 并不像 Angular1 那样有一个单独的 js 文件，他是通过 `npm` 安装的，所以为了能够让我们的应用能够跑起来，我们需要往项目里面添加一些列的配置文件来搭建我们的 Angular2 应用。

## 配置文件
有很多种方法能够把 Angular2 跑起来，官方的 [git@quickstart](https://github.com/angular/quickstart/blob/master/README.md) 是一种最为快捷的方法，只需要把他 clone 下来，安装后直接启动就行了。这个项目用来学习 ng2 很好，如果想要用在产品和中大型应用开发的话，还是不太合适。我们这里使用的是 [webpack](https://webpack.github.io/) 来打包我们的应用。

为了能够配置好我们的项目，你需要在项目中加入以下几个文件

- `package.json` 此文件在我们初始化时已经自动添加了
- `tsconfig.json` 定义了 TypeScript 编译器如何从项目源文件生成 JavaScript 代码
- `webpack.config.js` webpack 入口文件，用来告诉 webpack 如何打包我们的应用

完整的代码可以在 [这里@package.json](https://github.com/musicq/angular2-webpack-express-starter/blob/master/package.json) 找到，为了节约篇幅，这里只列出主要的几项内容。

```json
// @angular2 的依赖包

"dependencies": {
    "@angular/common": "^2.1.0",
    "@angular/compiler": "^2.1.0",
    "@angular/core": "^2.1.0",
    "@angular/forms": "^2.1.0",
    "@angular/http": "^2.1.0",
    "@angular/platform-browser": "^2.1.0",
    "@angular/platform-browser-dynamic": "^2.1.0",
    "@angular/platform-server": "^2.1.0",
    "@angular/router": "^3.1.0",

    "core-js": "^2.4.1",
    "reflect-metadata": "^0.1.8",
    "rxjs": "5.0.0-beta.12",
    "zone.js": "^0.6.25"
}
```

上面的依赖是几乎每一个 Angular2 应用必须的内容。将 [完整的 package.json](https://github.com/musicq/angular2-webpack-express-starter/blob/master/package.json) 全部安装好之后我们就可以进入下一步了。

```shell
# 安装依赖
npm install
```

## webpack 打包配置
到这里，我们已经把我们整个应用主要的依赖全部安装完成了。接下来我们只要专心写配置和内容就好了。

我们想要让我们的程序能够不管在正式环境还是开发环境都能很方便的切换，所以我们需要两份甚至更多的 webpack 配置文件（测试环境）来应对更多的场景需求。

[@webpack.config.js](https://github.com/musicq/angular2-webpack-express-starter/blob/master/webpack.config.js)

这是 webpack 的入口文件，我们根据不同的环境切换不同的打包规则。
```javascript
switch (process.env.NODE_ENV) {
	case 'prod':
	case 'production':
		module.exports = require('./config/webpack.prod')({env: 'production'});
		break;
	case 'dev':
	case 'development':
	default:
		module.exports = require('./config/webpack.dev')({env: 'development'});
}
```

[@webpack.common.js](https://github.com/musicq/angular2-webpack-express-starter/blob/master/webpack.config.js) webpack 通用配置截取

```javascript
{
    ...,

    entry: {
		polyfills: './src/polyfills',
		vendor: './src/vendor',
		main: './src/main',
	},

    resolve: {
		extensions: ['', '.ts', '.js']
	},

	module: {
		loaders: [
			{
				test: /\.ts$/,
				loaders: [
					'awesome-typescript-loader',
					'angular2-template-loader',
					// 使 angular2 支持 webpack 1.x 懒加载
					'angular2-router-loader'
				],
				exclude: [/\.(spec|e2e)\.ts$/]
			},
			{ // 处理全局样式
				test: /\.css$/,
				exclude: helpers.root('src', 'app'),
				loader: ExtractTextPlugin.extract('style', 'css?sourceMap', 'postcss')
			},
			{ // 处理组件内样式
				test: /\.css$/,
				include: helpers.root('src', 'app'),
				loaders: ['to-string-loader', 'css-loader', 'postcss']
			},
			{
				test: /\.html$/,
				loader: 'raw-loader',
				exclude: [helpers.root('src/index.html')]
			},
			{
				test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
				loader: 'file?name=assets/[name].[hash].[ext]'
			}
		],
    ...
}
```

[@webpack.dev.js](https://github.com/musicq/angular2-webpack-express-starter/blob/master/config/webpack.dev.js) webpack 开发环境打包配置截取。

很多同学往往都会同时做 node 跟前端开发，改了前端代码要刷新一次浏览器，改了后端代码又要重启一次浏览器，真的费时费力还没效率，所以为了能够让我们两端都能够不用手动刷新，我们在 webpack 的开发环境配置时加入一个代理，代理我们后端的地址，这样就避免了前后端不能同时一起开发的问题，还能应用 webpack-dev-server 特点实时刷新浏览器。

```javascript
devServer: {
	port: METADATA.port,
	host: METADATA.host,
	historyApiFallback: true,
	stats: 'minimal',
	watchOptions: {
		aggregateTimeout: 300,
		poll: 1000
    },
	outputPath: helpers.root('dist'),
    // 将 node 服务转接到 4000 端口
    // 这样就可以同时获得 webpack-dev-server 的实时刷新
    // 也能同时调试接口
    proxy: {
    	'/api': {
          	target: 'http://localhost:4000'
    	}
    }
},
```

[@webpack.prod.js](https://github.com/musicq/angular2-webpack-express-starter/blob/master/config/webpack.prod.js) webpack 正式环境打包配置截取。

```javascript
output: {

	path: helpers.root('dist'),

	/**
	 * 插入文件的访问路径
	 * Example:
	 * [webpack.config.js] publicPaht: '/dist'
	 * [index.html] <script src="/dist/a.js"></script>
	 */
	publicPath: '/',

	filename: '[name].[chunkhash].bundle.js',

	sourceMapFilename: '[name].[chunkhash].bundle.map',

	chunkFilename: '[id].[chunkhash].chunk.js'
},
```

## 可执行脚本
在我们的 [package.json](https://github.com/musicq/angular2-webpack-express-starter/blob/master/package.json) 中有一个 `script` 字段，这里面有我们程序可执行的一系列脚本。

```json
"scripts": {
    "start": "concurrently \"npm run start:hmr\" \"npm run dev:server\"",
    "start:hmr": "npm run server:dev:hmr",
    "server": "npm run server:dev",
    "server:dev": "webpack-dev-server --progress --profile --watch --content-base dist/",
    "server:dev:hmr": "npm run server:dev -- --inline --hot",
    "server:prod": "pm2 start process.yml",
    "dev:server": "NODE_ENV=development nodemon --use_strict bin/www",
    "build:prod": "npm run clean && webpack --progress --profile --bail",
    "lint": "tslint \"src/**/*.ts\" -t verbose",
    "clean": "npm run rimraf -- dist",
    "rimraf": "rimraf"
}
```

- `start: ` **「开发环境」** 启动我们的程序，同时启动前端和后端，并且为热更新
- `start:hmr: ` **「开发环境」** 启动 webpack 打包前端程序并启动前端，端口为 3000
- `dev:server: ` **「开发环境」** 启动 node 服务，端口为 4000
- `build:prod: ` **「正式环境」** 打包应用，准备部署
- `lint: ` **「开发环境」** 测验 TypeScript 代码是否符合我们自定义的规范


## 小结
本章我们介绍了一个 Angular2 应用的环境配置。很麻烦是不是，没错，由于 Angular2 这次的完全组件化，我们只能从 npm 安装它，这就使得对 node 不熟悉的同学更头疼了，再加上前端一堆繁琐复杂的打包和任务工具，使得这个配置又增加了很大的复杂度。复杂是一件好事，因为他说明前端正向着工程化进展。不过对于首次接触的同学来说真的是很难找到入手点，没关系，你完全可以不管这些配置怎么样，直接用官方提供的 [git@quickstart](https://github.com/angular/quickstart/blob/master/README.md) 来进行你的 Angular2 的学习，等你熟练了，再慢慢重构自己的项目，使得它能够更加健壮。

或者，你也可以选择我的这套方案，使用方法很简单，你只要照着 [这份 README](https://github.com/musicq/angular2-webpack-express-starter/blob/master/README.md) 做就可以了。如果一切都很顺利的话，当你安装完成后，只要运行 `npm start`，你的程序就能跑起来了。

如果失败了，也别怕，你可以在 [这里](https://github.com/musicq/angular2-webpack-express-starter/issues) 提出你的问题，我会在看到后第一时间尽力为你解答。

Ok，下面一章我们就要讲如何开始一个 Angular2 组件了。

> 祝你有一个好的开始！
