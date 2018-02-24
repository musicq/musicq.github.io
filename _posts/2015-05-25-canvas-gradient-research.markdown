---
layout: post
title:  Canvas 中的渐变研究
date: 2015-05-25
comments: true
share: true
---

最近在学习 Canvas，发现挺有意思的，虽然只是学了皮毛...不过今天在学到**渐变**的时候就被难到了，起初自己写的渐变根本就没有渐变，完全就是一个颜色，而且讲解里面的坐标代表什么都没有说的很清楚，果然这种东西还是需要自己来动手研究才有收获。于是我就花了一段时间专门研究了一下，可算让我弄得差不多了。总觉得自己研究懂了，不记下来过不了多久还是会忘，所以就分享一下。

我们的 HTML 都用这个

```html
<canvas id="cvs" width="800" height="600"></canvas>
```

## 线性渐变 LinearGradient

Canvas 里面的渐变分为两种，线性渐变和放射性渐变。我们先来看看线性渐变是怎样的。

首先我们先要创建一个线性渐变，线性渐变接受 4 个参数

```javascript
ctx.createLinearGradient(x1, y1, x2, y2);
```

```javascript
var ctx = document.getElementById('cvs').getContext('2d');
// 创建一个线性渐变
var lg = ctx.createLinearGradient(0, 10, 0, 100);
lg.addColorStop(0, '#F36661');
lg.addColorStop(1, '#F3F23E');

ctx.beginPath();
// 将线性渐变赋予填充色
ctx.fillStyle = lg;
ctx.fillRect(10, 10, 200, 150);
ctx.closePath();
```

得到的渐变如下图所示，是一个纵向的渐变。

![纵向渐变]({{site.imgurl}}2015-05-25/zxjb.png)

`createLinearGradient` 这个函数接收 4 个参数，分别为 x1,y1,x2,y2。这四个参数分别意味着渐变的起点（x1,y1）和终点（x2,y2）。

它的渐变方向就是我们写的线代里面算的斜率。即

> k=(y2-y1)/(x2-x1)

需要注意的是 canvas 的坐标是从左上角开始的，这里就是垂直向下方向。如果我们想要 45° 的话，那么可以写成下面这样

```javascript
ctx.createLinearGradient(0, 0, 100, 100);
```

这样算出 k=1，就是 45°，斜向右下的。换算角度应该是 arctan(k) 这样好像， 数学忘得快，大概是这样。那么你应该会发现这样的话，下面这两个东西是等价的。

```javascript
ctx.createLinearGradient(0, 0, 0, 100);

ctx.createLinearGradient(50, 0, 50, 100);
```

没错，这两个就是一样的。实际上在水平方向上，x 轴的取值并不重要，只要保证 x1 跟 x2 是相等的就好了，竖直方向同理，保证 y1 跟 y2 相等。那么在水平方向 y1 跟 y2 到底有什么用呢？实际上在这里，**y2-y1 的差值就是过度那段的长度**。渐变肯定是有一个过渡阶段的，从一种纯颜色过渡到另一种纯颜色，这里面的过度段的长短就是这里 y2-y1 的差值。我们把这个过度再改改就能看出来了。

![线性渐变]({{site.imgurl}}2015-05-25/xxjb.png)

这张图的中间部分有一个很明显的过度段。他的代码如下

```javascript
// 渐变
ctx.createLinearGradient(0,100,0,150);
...
// 图形
ctx.fillRect(200,10,300,250);
```

可以看出来他的过渡段只有 150-100=50 这么长，而我们的图形有 250 的宽度，所以两边被纯色填充。这段距离的长度，就是这两个点之间的距离，即

> ![两点距离]({{site.imgurl}}2015-05-25/ldjl.png)

可能有很多同学刚开始写的时候发现为什么我的图形只有一种颜色？其实就是因为我们图形的位置没有放到过度段的那个位置上，而是放到了两边纯色的地方。

知道了方向，知道了过度的距离，我们就能画出多种漂亮的线性渐变了。

## 放射性渐变 RadialGradient

放射性渐变要比线性渐变复杂得多。从它接受的参数就能看出来，居然有 6 个参数。

```javascript
ctx.createRaidalGradient(x1, y1, r1, x2, y2, r2);
```

先来看看这些参数分别代表什么，这里的 6 个参数其实也是两组坐标 (x1,y1,r1) 和 (x2,y2,r2)。第一组就是里面过度圆的圆心和半径，第二组是外层过度圆的圆心和半径。这样分开就很容易理解了。接下来看看它们要怎么用。

```javascript
ctx.beginPath();
var rg = ctx.createRadialGradient(350, 300, 50, 350, 300, 200);
rg.addColorStop(0, '#F36661');
rg.addColorStop(0.3, '#F3F23E');
rg.addColorStop(0.6, '#03B2F3');
rg.addColorStop(1, 'rgba(255,255,0,.1)');

ctx.fillStyle = rg;
ctx.arc(350, 300, 250, 0, 2 * Math.PI);
ctx.fill();
ctx.closePath();
```

![同心放射性渐变]({{site.imgurl}}2015-05-25/txfsxjb.jpg)

从图中可以看出来，两个渐变圆的圆心是重合的，且内圆的半径是 50，外圆的半径为 200，我加了 4 个过度颜色，从 **红-黄-蓝-浅黄**。我们可以看到绘制的圆形圆心也和过度圆的圆心重合，并且半径（250）大于过渡圆的半径（200），所以多出来的那 50 单位的区域被最后的过渡色，也就是浅黄色填充。这是很正常的一种情况。

那么如果我的两个渐变圆的半径不重合会怎么样呢？来看看下面这张图

```javascript
ctx.beginPath();
var rg = ctx.createRadialGradient(350, 300, 50, 200, 300, 200);
rg.addColorStop(0, '#F36661');
rg.addColorStop(0.3, '#F3F23E');
rg.addColorStop(0.6, '#03B2F3');
rg.addColorStop(1, 'rgba(255,255,0,.1)');

ctx.fillStyle = rg;
ctx.arc(350, 300, 250, 0, 2 * Math.PI);
ctx.fill();
ctx.closePath();
```

![不同心放射性渐变]({{site.imgurl}}2015-05-25/btxfsxjb.png)

这张图标示的两个渐变圆的圆形并不处于同一个位置，内圆圆心为 (350,300)，半径 50，外圆圆心为 (200,300)，半径 200。这种情况是一个极限情况，就是两个圆刚好处于 **内切状态**。这种情况下 两圆的圆心距离加上内圆的半径刚好等于外圆的半径，即

![内切]({{site.imgurl}}2015-05-25/nq.png)

如果外圆的圆心再向左偏一点就会变成下图这样。

![相交或不相交]({{site.imgurl}}2015-05-25/xjhbxj.png)

会发现这货已经完全变了样了，渐变的方向已经反了，把原先外层的颜色变成了内层的颜色，而且还变成这种扇形了，它的角度实际上就是两个圆的公共切线的交角。这个角度有兴趣的同学可以自己推导一下，不难，但是感觉不会很有用...两个圆离得越远，越近于平行，有兴趣可以试试，如果离得相当远，那就变成一个两端有点圆乎乎的长方形了。注意这种方法得到的扇形两边的线会有很大的锯齿。

渐变其实一开始没弄懂是感觉挺复杂的，参数都不知道改怎么填，其实理解了还是挺容易的。
