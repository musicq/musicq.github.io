---
layout: post
title:  "如何使用 ionic 在真实设备上部署 app"
date:   2017-07-07
---

> 本文所用的机器是 `iOS`，所以很可能并不适用于`android`。

在官方的 [Deploying](http://ionicframework.com/docs/intro/deploying/) 章节已经介绍了怎样部署一个应用到设备上，但是很可能在这个途中会遇到一些令人抓狂的错误。

请收拾好心情，满怀希望的重新踏上 [`ionic`](http://ionicframework.com/) 旅途。

ionic 提供了很多命令，它本身也集成了 [`cordova`](http://cordova.apache.org/) 的命令。所以你可以在应用中同时使用 ionic 和 cordova（一般来说，ionic 集成的 cordova 命令都是以 `ionic cordova + cmd` 组成的）。如果在你运行一些命令后，出现了失败的字样，而又抓不到头脑的时候，你可以 `--verbose` 参数来详细了解一下错误原因。

## 开始一个新应用
```bash
$ ionic start myApp sidemenu # 创建一个带有左侧菜单的空白应用
```
应用创建完成了，我们可以现在浏览器中运行一下，看看整体是什么样的。

```bash
$ cd myApp && ionic serve # 启动浏览器运行模式
```
默认运行地址是 http://localhost:8100/，打开浏览器可以看到一个带有边栏的应用页面。

很好！我们已经成功完成了一个 ionic 应用了！

## 运行在真实设备
我们已经成功在浏览器中运行了我们的 app，但是这不是我们的最终目的，因为我们想要它能够在我们的真实设备上运行才是一个完整的应用。

> 接下来需要我们有一台 Mac，一台 iOS 设备

使用 USB 将 iOS 设备与电脑连接。然后我们需要在终端运行下面命令
```bash
$ ionic cordova run ios -lcs --device --verbose # 这条命令会首先帮助我们生成 iOS 工程文件，然后开始运行应用。
```
在这个过程中我们很可能会遇到下面的报错

```accesslog
Check dependencies
Signing for "MyApp" requires a development team. Select a development team in the project editor.
Code signing is required for product type 'Application' in SDK 'iOS 10.3'

** ARCHIVE FAILED **


The following build commands failed:
	Check dependencies
(1 failure)
Error: Error code 65 for command: xcodebuild with args: -xcconfig,/Users/musicqpee/myApp/platforms/ios/cordova/build-debug.xcconfig,-workspace,MyApp.xcworkspace,-scheme,MyApp,-configuration,Debug,-destination,generic/platform=iOS,-archivePath,MyApp.xcarchive,archive,CONFIGURATION_BUILD_DIR=/Users/musicqpee/myApp/platforms/ios/build/device,SHARED_PRECOMPS_DIR=/Users/musicqpee/myApp/platforms/ios/build/sharedpch


[ERROR] Cordova encountered an error.
        You may get more insight by running the Cordova command above directly.

[DEBUG] !!! ERROR ENCOUNTERED !!!
[ERROR] An error occurred while running cordova run ios --device (exit code 1).
```

这段报错里面最重要的是 **`ARCHIVE FAILED`** 这个信息。这条信息意味着我们没有一个有效的证书。在 iOS 开发中，有一个重要的证书 **`provisioning profile`**，他是苹果给开发者使用在真实设备上的一个配置，每一个应用都需要这个配置文件才能够运行在 iOS 设备中。既然知道了原因，就有解决办法了。

首先我们先确保我们有一个 Apple ID，如果没有请[申请](https://appleid.apple.com/account#!&page=create)一个，作为 Apple 用户，Apple ID 是必不可少的。

然后我们需要下载最新版的 [xcode](https://developer.apple.com/cn/xcode/)。

如果你已经准备好这两样东西了，我们就可以进行下一步了。

> 1. 启动 xcode
> 2. 打开 xcode -> Preferences -> Accounts
> 3. 点击左边栏下面的 `+` 号，选择 `Add Apple ID`，将我们的 Apple ID 添加进去。

一切顺利的话，我们就将我们的Apple ID 添加进去了。（如果你遇到了一些麻烦，请 Google 搜索一下相关问题）

接下来进入到我们的项目中的 `./myApp/platforms/ios` 目录下，会看到一个 `.xcodeproj` 后缀的文件，使用 xcode 打开它（默认会使用 xcode）。

打开文件后，xcode 会启动，我们会在窗口的左边栏看到我们的项目，点击项目，中间窗口会出现项目的配置项。在 `General -> Signing` 项中，我们看到 `Status` 可能会显示一个红色的感叹号（如果没有的话似乎一切正常），并且显示

```plain
Signing for "MyApp" requires a development team.
Select a development team in the project editor.
```

这是因为我们没有选择一个合适的 Team 才会出现这个错误，在 `Team` 项选择我们刚刚添加好的 Apple ID 就可以了。然而你可能还会收到另一个报错

```plain
Failed to create provisioning profile.
The app ID "io.ionic.starter" cannot be registered to your development team. Change your bundle identifier to a unique string to try again.

No profiles for 'io.ionic.starter' were found
Xcode couldn't find a provisioning profile matching 'io.ionic.starter'.
```

根据报错我们看到是 `io.ionic.starter` 这个东西不能被注册导致的。解决这个问题，我们需要做一些事情。

首先，将 `General -> Identity -> Bundle Identifier` 改成我们自己的域名，如：`com.example`。改完之后我们看到之前的报错已经消失了。接下来，我们还需要对根目录下的 `config.xml` 文件做一些修改，打开 `config.xml` 文件，我们可以看到这样一句话

```xml
<widget id="io.ionic.starter" version="0.0.1" ...>
...
```

没错，这里的 id 我们也需要改成我们对应 `Bundle Identifier` 的值。**如果这项不做修改，我们后面构建应用的时候，`Bundle Identifier` 还是会被改回来，导致启动失败**。

好了，似乎一切都准备妥当了。接下来我们尝试启动应用。

```bash
# 注意启动应用需要在应用的根目录下
$ ionic cordova run ios -lcs --device --verbose
```
果然没这么简单，我们还是失败了，看看报错信息

```plain
error: process launch failed: Security
(lldb)     safequit

Application has not been launched

Error: Error code 1 for command: ios-deploy with args: --justlaunch,--no-wifi,-d,-b,/Users/musicqpee/myApp/platforms/ios/build/device/MyApp.app


[ERROR] Cordova encountered an error.
        You may get more insight by running the Cordova command above directly.

[DEBUG] !!! ERROR ENCOUNTERED !!!
[ERROR] An error occurred while running cordova run ios --device (exit code 1).
```

其实这是因为我们的开发者账户并没有受到设备的信任，所以我们需要在设备上添加上我们的信任证书。

> 1. 打开 iOS 设备
> 2. 设置 -> 通用 -> 设备管理
> 3. 进入对应的账户，点击信任

再运行一次程序

```bash
$ ionic cordova run ios -lcs --device --verbose
```

好的，程序启动成功啦！撒花~

一般来说，到上面那一步，程序就应该能正常启动了，但是如果你用的是 `xcode 8.3.3` `iOS 10.3`，那么应该还没有结束，因为你很可能会遇到下面这种错误

```plain
unable to locate DeviceSupport directory
```

这是因为没有找到对应的 iOS 版本，网上有一个很好的解决方法：https://github.com/phonegap/ios-deploy/issues/292#issuecomment-307334866，按照此方案即可轻松解决这个问题。


## 写一个详情页面

奇怪，可能是我生成的项目有问题，我发现我的列表页点进去还是列表，这不符合常理，那我就自己写一个详情页好了。

运行

```bash
$ ionic generate page detail # 生成一个页面
```

修改下面几个地方

**app.module.ts** 片段
```typescript
// 引入 detail 页
import { DetailPage } from '../pages/detail/detail';

@NgModule({
  declarations: [
	...
    DetailPage
  ],
  ...
  entryComponents: [
    ...
    DetailPage
  ],
  ...
})
```

**list.ts** 片段
```typescript
itemTapped(event, item) {
  // 点击条目有，进入详情页
  this.navCtrl.push(DetailPage, {
    item: item
  });
}
```

**detail.ts** 片段
```typescript
export class DetailPage {
  item: {title: string, note: string, icon: string};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // 获取跳转过来的参数
    this.item = navParams.get('item');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

}
```

**detail.html** 片段
```xml
<ion-content padding>
  <!-- 为详情页增加一些内容 -->
  <h3 text-center *ngIf="item">
    {{item.title}}
    <ion-icon [name]="item.icon"></ion-icon>
  </h3>
  <h4 text-center *ngIf="item">
    You navigated here from <b>{{item.title}}</b>
  </h4>
</ion-content>
```

保存，看看我们的应用是不是已经更新啦！

到此为止我们已经成功完成了一个 ionic 应用，并且真实运行在了一台设备当中！接下来就可以发挥你的想象力，运用 js 去完成一个 App 啦~

Happy Coding!