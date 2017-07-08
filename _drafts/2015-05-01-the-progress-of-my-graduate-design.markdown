---
layout: post
title:  "我的建站过程"
date:   2015-05-01 22:21:00
categories: jekyll update
---

在学习了 `node` 之后终于有机会可以自己建设一个比较像样的网站了，那我就来说说我的建站过程吧。

我想要讲的尽可能详细...所以可能有很多人看的会比较不耐烦（会有人看吗...），而且其实我也接触node不多，所以可能会有很多地方会不太成熟，或者繁琐，还请大家不吝赐教~，我会在以后不断地学习中，不断完善更新。

_**项目地址 (https://github.com/musicq/graduate_design)**_ [`嘲笑我`](https://github.com/musicq/musicq.github.io/issues?q=is%3Aissue+is%3Aopen)



# **NodeJs 建站**

相信 [NodeJs](https://nodejs.org/) 对于很多接触不管是前端还是后端的人来说都不算是一个陌生的名词。它可以帮助前端来做自己的后端，因为可能在实际的业务开发过程中，我们会发现，后端的开发总是很慢，当然，后端的大神们都需要考虑很多因素来维护网站的稳定。但是这对前端来说就不太好了，因为我们的很多开发都需要依赖到后端的支持，像是用 `ajax` 拿数据（*当然，这个东西你只需要跟后端商量好接口跟数据格式，就可以不管后端，自己开发了*），所以可能如果我们等后端完全搞好在开始做相对应的部分，我们就不能按照规定的时间完成了，到时项目就会被延期，甚至给公司带来一定的损失...这很尴尬。所以这种时候，就是 `node` 的表现时候了。


#### _**目录结构**_

在开始一个项目前，我们需要考虑我们的项目目录结构是什么样的，可能你曾经看过一些人分享的项目目录结构，但是我感觉这东西其实不必太拘泥，只要条理够清晰就好。以下是我的目录结构

```
  dist/
    css/
      a.min.css
      b.min.css
      ...
    js/
      a.min.js
      b.min.js
      ...
  modules/
    module1.js
    module2.js
    ...
  public/
    css/
      common/
        a.css
        b.css
      unique/
        c.css
        d.css
    js/
      libs/
        jquery.js
      plugin/
        plugin1.js
        plugin2.js
        ...
      unique/
        a.js
        b.js
        ...
    images/
      a.png
      ...
  routes/
    route.js
  views/
    _layout
      default.jade
    temps/
      collection.jade
      detail.jade
    index.jade
  main.js
```

好长啊...

没关系，觉得不好看的话，就去 [Github](https://github.com/musicq/graduate_design) 上面看看好了.


#### _**配置文件**_

接下来呢，我们需要一个启动文件，这里就是我们的 `main.js` 这个文件。 那么这个文件都需要写些什么东西呢？

别急，在写入东西前，我们还有一个问题需要解决，那就是我们的各个模块应该怎样引入呢？

这里我们需要考虑一下整个项目将来的维护性，还有就是可读性。所以如果我们把所有的配置代码都写到一个 `main.js` 里面，这里面就会变得乱七八糟，看的心烦，写的更心烦。所以我们来看看应该怎样配置这个 `main.js`。

```javascript
/* 引入需要的模块 */
var express = require('express');
var path = require('path');
var db = require('cloud/modules/db.js');

/* 引入路由模块 */
var routes = require('cloud/routes/route');
var app = express();

/* 数据查询 把路由传入 */
var db = db.db( routes, app );

/* 设置 路径 跟 模板 */
app.set('views', 'cloud/views');
app.set('view engine', 'jade');

/* 设置引用的 js & css 路径 */
app.use(express.static(path.join(__dirname, '/dist')));

/* 启动服务器 */
app.listen();
```

我们一点点来看，首先需要依赖两个 `node` 的模块，第一个就是大名鼎鼎的 [express](http://expressjs.com/) ，第二个则是 `node` 自带的模块。对于 `express` 我们需要手动安装一下

> npm install express

安装好了后，会发现目录中出现了一个 `node_modules` 的目录，这个目录是存放我们需要依赖的一些 `node` 插件的。

安好了，我们就把他引入进来，用 `require` 方法就可以了，简单方便。下面的这个 `db` 模块先不要管，我们后面会谈到。

接下来，我们需要设置一个 *模板引擎* 跟 *模板的存放路径*。用 `express` 的 `set` 方法，我们这里的模板引擎用的是 `jade`，node 支持的模板引擎还有 [EJS](http://www.embeddedjs.com/)，你可以选择你喜欢的模板语言来写。默认的路径就是你后面的路由都是从这个默认路径下面找。既然模板路径有了，那 `js` 跟 `css` 的默认路径当然也不能少了。

OK，都好了，接下来，我们就需要启动服务器了，`app.listen(3000)` 这句是必不可少的，不然你的服务器就没办法起了。


#### _**路由配置**_

这样就结束了吗？当然没有，我们还没有设置路由了。

为了便于管理和维护，我们把路由放到一个单独的文件 `route.js` 中。然后把它引入进来。那这个文件里是怎样的呢？我们来看看

```javascript
var search_data = require('cloud/modules/search_data');  // 引入搜索模块

function router( route, _mock_db ){
  /* 首页 */
  route.get('/home', function( req, res ){
    var deposit_data = _mock_db.data.deposit_id;

    res.render('index',{
      deposit_data: deposit_data
    });
  });

  /**
   * 矿石标本集合页
   * params @[deposit_id] 矿床的 id
   * params @[this_deposit_data] 该矿床的数据
   */
  route.get('/collection/:deposit_id', function( req, res ){
    var deposit_id = String( req.params.deposit_id ),
        this_deposit_data = _mock_db.data.deposit_id[deposit_id]; // 得到这个矿床的数据

    res.render('temps/collection', {
      this_deposit_detail_data: this_deposit_data,
      this_deposit_id: deposit_id
    });
  });

  /**
   * 矿床详情页
   * params @[sample_id] 矿石标本的 id
   * params @[deposit_id] 矿床的 id
   */
  route.get('/detail/:id', function( req, res ){

    var sample_id = String(req.params.id),
        deposit_id = req.query.deposit_id;

    // 运行 search_info 方法，并且传送给 search_info 这个模块对应的 deposit_id [矿床 id] 和 sample_id [矿石标本 id]
    var this_deposit_data = _mock_db.data.deposit_id[ deposit_id ].SAMPLES,
        search_info = search_data.deposit_detail_data( this_deposit_data, sample_id );

    // 发送属于这一矿石标本的详细信息
    res.render('temps/detail',{
      this_deposit_detail_data : search_info
    });
  });

  /* 矿床信息数据 */
  route.get('/api/info', function( req, res ){
    res.send( _mock_db );
  });
}

exports.router = router;
```

我们一点点来看。

首先引入 `search_data` 模块。然后就是我们的路由配置的方法了，先别管这里，看看最后，一句话 **exports.router = router;**，这句话的意思就是把这个方法作为一个模块返回出去，这样我们就能在其他地方同样用 `require` 方法引入了。

就下来看看路由是怎么写的。因为有了 `express` 这个神器，我们配置起路由来简直不能再简单了

```javascript
  route.get('这里是路由的路径', function( req, res ){
    // 这是 render 一个文件的路径
    res.render('文件的路径',{
      some_params: some_params_value // 出入的模板参数
    });
  });

  // 除了可以 render 一个文件以外，还可以直接 send 一些参数
  route.get('/api/info', function( req, res ){
    res.send( some_params );
  });
```

这里的最后面的 **/api/info** 中我就是直接 `send` 一份数据给一个路径，这个地址就是我面后面用 `ajax` 的 `url` 地址。

我们还可以发现，在第二个详情页（detail）跟集合页（collection）中都存在 `:params` 这种参数。这也很好理解，我们的一个模板不是只对应一个路径，而是一系列路径，只不过是里面的数据不同罢了，如果有100个商品，那我们还要一个个去写路由不是累劈了嘛。所以我们只需要根据对应的路径传入对应的数据就好了。

另外我们也看到这里的 `route` 方法是接收两个参数的 `route` 跟 `_mock_db`，别急，我们先往下看。


#### _**数据配置**_

我们在前面的 `main.js` 里面看到了 `db` 这个模块，现在我们就来看看这个模块是干什么用的。


#### module [db]

```javascript
function db( routes, app  ){
  var Deposits = AV.Object.extend("Deposits");
  
  var query = new AV.Query(Deposits);

  query.get("553f96e3e4b0982012ecfb39", {
    success: function( data ) {
      // 得到数据，并且格式化
      var db = JSON.parse(data._hashedJSON._data);
      // 路由
      routes.router( app, db );
    },
    error: function(object, error) {
      console.log(error);
    }
  });

}

exports.db = db;
```

你可能会问这 `AV.Object` 是什么东西，这个先别着急，我们先看看它是怎么工作的。

他的原理并不复杂，我们看到他接收了两个参数，分别是 `routes` 跟 `app`。这两个参数是在 `main.js` 中传入的，分别代表了 *路由* 模块跟 *express* 模块。他们怎么工作呢？

我们看在 `succes` 这个方法里面我面调用到了 `routes` 这个模块，并且传入了 两个参数 `app` 跟 `db`。

`db` 可以理解为从数据库中得到的数据，我们把它传入 `routes` 中，这样就可以在 `routes` 里面调用这些数据了。

好了，我们再回头看看 `routes.js` 中的代码，我们看到的 `_mock_db` 参数，就是数据，然后根据不同的页面路由，处理并且传入对应的数据，这样，整个流程就通了。


#### module [search_data]

接下来稍微看下另一个模块

```javascript
/**
 * 通过 
 * `矿石标本id [sample_id]` & `矿床id [_deposit_id]` 两个参数
 * 找到对应的 `矿石标本数据 [_deposit_id_data]`
 * params@ [sample_id]  要查询的矿石标本的 id
 * params@ [deposit_data] 要查询的矿石标本所属矿床的数据（包括这个矿床中的所有样本数据）
 */
function deposit_detail_data( deposit_data, sample_id  ){

  // 得到想要查询的矿石标本的数据
  for ( var o in deposit_data){
    var o_deposit_id_data = deposit_data[o];

    if(sample_id == o_deposit_id_data.sample_id){
      // 返回需要查询的标本的信息
      return deposit_data[o];
    }
  }

}

exports.deposit_detail_data = deposit_detail_data;
```

它的功能就是将 数据 跟 样本的ID 传入，然后根据这个 ID 找到对应的一些列数据。


OK，到这里呢，基本上的所有关于 `node` 的配置就完成了。最后我们只需要在终端中输入

> node main.js

服务器就会启动了，然后访问 *localhost:3000* 就会进入我们自己的网站了。至于为什么端口号是 *3000*，是因为 `node` 默认的就是 *3000*，当然我们可以更改端口号，以避免跟我们自己的项目冲突。




# **模板的设计**

我不知道大家是怎样接触前端，又是为什么喜欢前端的呢？反正对于我来说，是因为我觉得前端最大的魅力就是我们可以根据自己喜欢的风格设计出各式各样狂拽炫酷吊炸天的页面，所以写模板对我来说其实是很爽的。

但是写一个模板其实也不是就拿来之后一股脑的什么都不想，就开始自顾自海的写起来。我们也需要考虑一些问题。比如哪些东西是必要的，哪些是需要被复写的。所以简单的来说，我们可以将模板分为两个部分，分别是 `layout` 跟 单独的页面模板。

`layout` 顾名思义就是我们需要继承的布局模板，这样，我们就不必在每一个页面都重复写上好多的 `head` 的文件跟需要引用的公用脚本文件了。

至于 `jade` 的模板语言我就不在这里讲了，大家自行 谷歌/百度 一下，稍微看看就好了。也可以参考我的模板的写法。



# **用 LeanCloud 作为后端支持**

不知道大家有没有听过或者用过 [LeanCloud](https://leancloud.cn)，简单来说，我感觉就是一个后端支持的网站。我们可以把我们写的 `Node` 项目直接放到它上面去托管。这样即使我们没有自己的域名也可以使用它的二级域名来自定义属于自己的域名。

感觉使用起来其实挺麻烦的，因为有好多的限制，我一开始配置也弄了好久。我就来说说刚开始配置时需要注意的东西吧。

我们刚开始使用时，可以下载一个它的 `Demo` 文件，这个文件其实是一个 `node` 项目。最主要的不是这个，而是它的 **目录结构** 。我们一定要按照它规定的目录结构来架构我们的项目，不然你会发现即使本地跑起来什么问题也没有，但是只要一部署就失败。这个当时弄得我也是不要不要的。

没办法，自己选的坑，就要尽力把它填平了。

我来说一下目录结构需要怎么组织

```
  cloud/
    我们上面的项目目录结构放到这里面
  config/
    global.json
  node_modules/
    ...
  public/
    index.html
```

这是一个标准的目录结构，至少是我实验出来的。需要注意的是，我们的项目目录需要放到这个 `cloud` 下面，而且我们的启动文件 `main.js` 也一定要放到这里面，不然是启动不了的。

另外，更需要注意的是于 `cloud` 的同级目录 `public` 下面方的文件使我们的首页文件，而且一定要是 `html` 文件，如果你觉得你的首页用 HTML 太麻烦，也可以跟我一样，直接加一段跳转的代码，把它跳到我们的真正主页。

这里面的 `config` 目录下存放的使我们的 app 的一些信息，这写信息是跟我们在 `LeanCloud` 上面创建的这个应用对应的。另外有一个重要的 `MasterKey` 好像是，这个 Key 是我们用来部署代码所需要的 **通行证**，所以很重要。

另外还需要说一点就是 `LeanCloud` 是不支持本地文件读取的，就是利用 `node` 的 `fs` 模块读取文件是会失败的，且部署也不会成功，即使本地运行没有问题，所以建议使用自己的数据库来储存我们的数据，或者也可以通过 `LeanCloud` 的 `Class` 表来存我们的数据，这里的存储在 `LeanCloud` 上又详细的说明，我也是用的这个方法来存数据的。就是上面我们看到的 `db` 模块中的方法。

好了，都弄好了，这下我们的网站算是搭的八九不离十了。



# **前端自动化工具--Grunt**

当然如果你追求极致的话，你可能还会为我们线上的代码进行压缩合并，来为我们的网站提速。这要怎么做呢，总不能自己一个个空格去删吧。这不跟累傻小子似的。

没关系，有问题就有解决它的办法。

你可能自然地会想到前端自动化神器--[Grunt](http://www.gruntjs.com)。

没错，但是这东西其实我也不是很会用，也是刚刚学习使用的，但是确实能很方便的解决我们的问题。

首先呢，我们需要安装这个东西，可以在终端输入下面来安装

> npm install grunt

但是只是安装这个还不够，他只是提供了一个平台，要是西安我们的目的，还需要安装很多插件，我们这里用到的插件有下面几个

| 插件名字 | 插件作用 |
| :----- |:------- |
| clean  | 清除文件 |
| copy   | 拷贝文件 |
| concat | 合并文件 |
| jshint | 校验文件 |
| uglify | 压缩 js 文件 |
| cssmin | 压缩 css 文件 |

<br>

安装方法直接在终端输入（多个插件用空格分开，grunt 插件的形式都是 `grunt-contrib-插件名字` 的形式的，这里的示例只安装了 clean 跟 copy 两个插件，其他的可以自己试试安装）

> grunt install grunt-contrib-clean grunt-contrib-copy --save-dev

安装好后，还没完，我们要把它用起来，使用 Grunt 我们需要一个入口文件 `Gruntfile.js`

```javascript
module.exports = function(grunt) {

  // var config = {
  //   src: 'cloud',
  //   dist: 'cloud/dist'
  // }

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    // config: config,

    concat: {
      generated: {
        files: [
          // js
          // default.js
          {
            dest: '.tmp/concat/js/default.js',
            src: [
              'cloud/public/js/libs/jquery.js',
              'cloud/public/js/plugin/lighterWoo.js',
              'cloud/public/js/unique/default.js'
            ]
          },
          // index.js
          {
            dest: '.tmp/concat/js/index.js',
            src: [
              'cloud/public/js/unique/index.js'
            ]
          },
          // detail.js
          {
            dest: '.tmp/concat/js/detail.js',
            src: [
              'cloud/public/js/plugin/jquery.sliderPro.min.js',
              'cloud/public/js/unique/detail.js'
            ]
          },
          // collection
          {
            dest: '.tmp/concat/js/collection.js',
            src: [
              'cloud/public/js/unique/collection.js'
            ]
          },

          // css
          // default
          {
            dest: '.tmp/concat/css/default.css',
            src: [
              'cloud/public/css/common/bootstrap.min.css',
              'cloud/public/css/common/lighterWoo.css',
              'cloud/public/css/common/default.css',
            ]
          },
          // index
          {
            dest: '.tmp/concat/css/index.css',
            src: [
              'cloud/public/css/unique/index.css'
            ]
          },
          // detail
          {
            dest: '.tmp/concat/css/detail.css',
            src: [
              'cloud/public/css/common/slider-pro.min.css',
              'cloud/public/css/unique/detail.css'
            ]
          },
          // collection
          {
            dest: '.tmp/concat/css/collection.css',
            src: [
              'cloud/public/css/unique/collection.css'
            ]
          }
        ]
      }
    },

    uglify: {
      generated: {
        files: [
          // default
          {
            dest: 'cloud/dist/js/default.min.js',
            src: [ '.tmp/concat/js/default.js' ]
          },
          // index
          {
            dest: 'cloud/dist/js/index.min.js',
            src: [ '.tmp/concat/js/index.js' ]
          },
          // detail
          {
            dest: 'cloud/dist/js/detail.min.js',
            src: [ '.tmp/concat/js/detail.js' ]
          },
          // collection
          {
            dest: 'cloud/dist/js/collection.min.js',
            src: [ '.tmp/concat/js/collection.js' ]
          }
        ]
      }
    },

    cssmin: {
      generated: {
        files: [
          // default
          {
            dest: 'cloud/dist/css/default.min.css',
            src: '.tmp/concat/css/default.css'
          },
          // index
          {
            dest: 'cloud/dist/css/index.min.css',
            src: '.tmp/concat/css/index.css'
          },
          // detail
          {
            dest: 'cloud/dist/css/detail.min.css',
            src: '.tmp/concat/css/detail.css'
          },
          // collection
          {
            dest: 'cloud/dist/css/collection.min.css',
            src: '.tmp/concat/css/collection.css'
          }
        ]
      }
    },

    copy: {
      files: [
      ] 
    },

    clean: [
      '.tmp/',
      'cloud/dist/'
    ]

  });

  // Load the plugin that provides the "uglify" task.
  // grunt.loadNpmTasks('grunt-contrib-copy');
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-contrib-clean');
  // grunt.loadNpmTasks('grunt-contrib-concat');
  // grunt.loadNpmTasks('grunt-contrib-cssmin');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadNpmTasks('grunt-usemin');
  // grunt.loadNpmTasks('grunt-filerev');

  // Default task(s).
  grunt.registerTask('build', [
    // 'useminPrepare',
    'clean',
    'copy',
    'concat:generated',
    'cssmin:generated',
    'uglify:generated'
    // 'filerev',
    // 'usemin'
  ]);

};
```

这么长~要死人啦...

不要害怕。这些东西其实都是重复的，没有多复杂。

首先我们需要把所有需要运行的东西，都放到

```javascript
module.exports = function(grunt){

}
```

这个函数里面，并且传入 `grunt`。接下来就是要把我们需要用的的插件都引进来了，grunt 引入插件的方法是这样的

```javascript
grunt.loadNpmTasks('grunt-contrib-copy');
```

我们会发现，每一个插件都需要引，写起来确实挺麻烦的，于是有个国外的 25 岁大神就开发了这个 `load-grunt-tasks` 这个插件（它是 node 插件），只需要把它引入进来，他就会根据我们都用到了哪些东西来帮我们自动生成这些任务。

接下来我们就需要把我们用到的任务都写到这里面

```javascript
grunt.initConfig({

})
```

注意这是一个 `json` 文件。

里面任务的配置方法，还请看这个任务的开发者的 `Github` 或者官网，来了解。

另外，我们可以再外部声明一个 `config` （或其他）变量来储存我们的起始路径，再在下面用配置路径时，就可以用下面这种方法来写

```javascript
var config = {
  app: 'app',
  dist: 'dist'
}

grunt.initConfig({
  copy: {
    files: [
      src: '<%= config.app %>/index.js',
      dest: '<%= config.dist %>/index.js'
    ] 
  },
})
```

都配置好了，我们就可以在终端里面输入

> grunt concat # concat 为需要运行的任务的名字

这种形式来运行这个任务。

我们当然想要把这个过程变得更简便一些，只需一句话，就能把所有任务都运行了。这种时候，就需要用到下面的方法了

```javascript
grunt.registerTask('build', [
  // 'useminPrepare',
  'clean',
  'copy',
  'concat:generated',
  'cssmin:generated',
  'uglify:generated'
  // 'filerev',
  // 'usemin'
]);
```

这里我们只需要在在里面注册我们需要运行的任务后，在终端运行

> grunt build

就可以直接把注册在下面全部的任务都运行了。

怎么样，Grunt 用起来还是比较简单的吧，最重要的是，它把我们需要的做的一些琐碎的事情都处理了，可以解决我们很多时间。



# **结束语**

好了，说了这么多，整个网站搭建的过程我也都讲得差不多了，当然还是有很多不足，我会慢慢积累经验，不断完善的。

欢迎大家来 [吐槽我](https://github.com/musicq/musicq.github.io/issues?q=is%3Aissue+is%3Aopen)，或者来给我讲讲你当时建站发生的有趣的事情。

那就这样，じゃな〜












