---
layout: post
title:  "Javascript 中的 setTimeout 与 (sleep) 的区别"
date:   2015-04-14 09:13:03
categories: jekyll update
---

今天在学习node的时候看到一个很有意思的延迟执行方法。它是为了模拟服务器的阻塞，代码如下：

```javascript
  function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
  }

  sleep(5000);
  console.log('执行完毕~');
```

这是一个很有意思的方法，它会一直等到5秒后才会打印出`执行完毕`。

你也许会说这根`setTimeout`不是一样吗？ 其实不是这样的

如果你把这段代码写在一个HTML文件里，并且在加载HTML文档时就加载这段代码的话，如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <p>Hello <span id="span"></span></p>
  <script type="text/javascript">
  var span = document.getElementById('span');
  var c = '';

  function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
  }

  sleep(3000);
  c = 'world~';
  console.log(c);
  span.innerHTML = c;
  
  </script>
</body>
</html>
```

你会发现页面并不会显示出来，而是一直在加载，直到5秒后才能正常显示页面内容。

而如果你使用`setTimeout`的话

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <p>Hello <span id="span"></span></p>
  <script type="text/javascript">
  var span = document.getElementById('span');
  var c = '';
  setTimeout(function(){
    c = 'world~';
  span.innerHTML = c;
  },5000);  
  </script>
</body>
</html>
```

那结果会是页面很快就出现，但是要等到5秒后才会显示`world`出来。

我认为这个问题是原因是，在浏览器加载HTML文档时，它会从上到下依次加载文件，当它加载到`script`标签时，会判断里面有没有可能影响dom元素的语句存在，而`sleep`这个方法是一直在执行，它会阻塞下面的语句执行，所以浏览器只能等到执行完毕后再执行下面的语句。这样就会造成整个页面要有很长时间的空白。

而`setTimeout`方法的原理则完全不同，它是会执行后，然后紧接着执行下面的语句。也就是说，不会等待里面的语句执行完才执行后面的语句。就好像我去放置一个定时炸弹，放好后，按下开关，定时器会立刻启动，然后在一定时间后爆炸，那我在按下开关后就会赶紧离开，这样才能活下来，不可能等到炸弹炸了，才跑，那肯定跪了。

所以你会发现下面的代码中`world`是不会显示出来的

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <style type="text/css">
    body{background: #ccc;}
  </style>
</head>
<body>
  <p>Hello <span id="span"></span></p>
  <script type="text/javascript">
  var span = document.getElementById('span');
  var c = '';
  setTimeout(function(){
    c = 'world~';
    console.log(c);
  },5000);
  
  console.log(c);
  span.innerHTML = c;
  
  </script>
</body>
</html>
```
