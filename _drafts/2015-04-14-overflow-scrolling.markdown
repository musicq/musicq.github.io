---
layout: post
title:  "移动端的各种横向滑动方法对比"
date: 2015-04-14 16:43:21
categories: jekyll update
---

最近在看微博时，看到了 [Github](https://github.com/explore) 有个更新，具体细节我就忘记了，但是我用手机上时发现了一个有意思的东西。就是在官网的`explore`页面的头部有一个滑动的区块。

刚好最近做了一个手机滑动的页面，也用到了类似的东西，我就看了一下它是怎么实现的。原本想说可能用了js来做的，但是这丝滑般的体验也太牛了...

但是一看代码我发现，__这尼玛完全不是一回事儿啊！这货居然是用纯CSS完成的！！！！__

来来来，体验一下这东西 [Demo](/demos/demo-overflow-scrolling.html)

是不是不敢相信？这丝般顺滑的东西居然就是用CSS实现的~ 那具体是怎么实现的呢？我们来看下具体代码

_**CSS部分**_

```css
  .overflow{
    overflow: auto;
    -webkit-overflow-scrolling: touch; /* 去掉这句话在手机上再试试 */
    margin: 10px 0;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    padding: 10px 0;
  }
  ul{
    margin: 0 15px;
    padding: 0;
    list-style-type: none;
    white-space: nowrap;
  }
  li{
    display: inline-block;
    width: 100%;
    margin: 0 5px 0 0;
    padding: 0;
  }
  li a{
    display: table;
    width: 100%;
    height: 250px;
    border-radius: 3px;
    background-size: cover;
    -webkit-tap-highlight-color: transparent;
  }
```

_**HTML部分**_

```html
  <div class="overflow">
    <ul>
      <li>
        <a href="##" style="background-image: url(http://img4q.duitang.com/uploads/people/201503/26/20150326144451_ThA23.thumb.1600_0.jpeg)"></a>
      </li>
      <li>
        <a href="##" style="background-image: url(http://img4q.duitang.com/uploads/files/201503/26/20150326144718_XtXWc.thumb.1600_0.jpeg)"></a>
      </li>
      <li>
        <a href="##" style="background-image: url(http://img4q.duitang.com/uploads/files/201503/26/20150326145005_wmiuM.thumb.1600_0.jpeg)"></a>
      </li>
      <li>
        <a href="##" style="background-image: url(http://img4q.duitang.com/uploads/files/201503/26/20150326145132_225rS.thumb.1600_0.jpeg)"></a>
      </li>
      <li>
        <a href="##" style="background-image: url(http://img4q.duitang.com/uploads/files/201503/26/20150326145245_dcteh.thumb.1600_0.jpeg)"></a>
      </li>
    </ul>
  </div>
```

OK了，全都齐了，直接复制过去就可以看到demo里面的效果了。很简单，但是却很实用。

可能你会说这个看上去很好，但实际用时就不那么方便了...举个简单的例子，在实际工作中我们可能会用到分页的小点点来标示现在处于第几页的状态，用这个CSS来做的话，就需要很多计算位置的逻辑代码，挺不方便的，而且需求又很有可能每一页都显示一张完整的图片，不会像这样出现显示两张图片中间（即相邻两张图片各显示一半）的问题。

这个也确实是，因为我在工作时遇到的需求就是这样的，应该怎么办呢？

别愁，也别怕。套用汪涵的那句话

> 没事儿不去惹事儿，事儿来了也不要怕事儿。

既然有需求，我们就去解决好了。至于怎么解决，当然是使用工具了，选择合适的工具能让你的效率事半功倍。

这里呢，我介绍两个比较靠谱的工具，可能很多人都用过。就是 [swipe.js](https://github.com/thebird/Swipe) 跟 [swiper.js](http://www.idangero.us/swiper/get-started/#.VS1HcxOUev4)

两者比起来都能很好地完成我们想要的效果，而且使用起来也很方便，但是两者的自定义程度却差很大。

`swiper.js`的自定义程度要远高于`swipe.js`。

`swiper.js`有着丰富的[API](http://www.idangero.us/swiper/api/#.VS1HnxOUev4)供我们调用，而且最大的好处就是可以水平、竖直嵌套使用，使内容看起来更丰富。更叼的是他还可以定义成 [**正方体**、**coverflow**、**淡入淡出**](http://www.idangero.us/swiper/demos/#.VS1HwxOUev4) 等亮瞎眼球的样式，简直掉渣天有没有。

相对来说`swipe.js`就没有这么多炫酷的样式了，就是平平淡淡的左右滑动。但是简单的东西往往是舍弃了众多繁冗和凌乱而剩下的最朴实、最干练的部分。`swipe.js`是一个极其轻量级的库，它给出的[API](https://github.com/thebird/Swipe#swipe-api)虽然少的可怜，却实用的很。[堆糖](http://m.duitang.com) 的移动端页面首图就是使用的`swipe.js`。

说了这么多，具体怎么用呢？下面我们一起来看看

**Swiper.js**

看看 [Demo](/demos/demo-swipe.html#swiper)

_**HTML部分**_

```html
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div class="swiper-slide">Slide 1</div>
      <div class="swiper-slide">Slide 2</div>
      <div class="swiper-slide">Slide 3</div>
      <div class="swiper-slide">Slide 4</div>
      <div class="swiper-slide">Slide 5</div>
      <div class="swiper-slide">Slide 6</div>
      <div class="swiper-slide">Slide 7</div>
      <div class="swiper-slide">Slide 8</div>
      <div class="swiper-slide">Slide 9</div>
      <div class="swiper-slide">Slide 10</div><!-- Add Pagination -->
    </div>
    <div class="swiper-pagination"></div>
  </div>
```

_**CSS部分**_

```html
<!-- 注意：CSS需要用到官方的 swiper.css 文件 -->
<link rel="stylesheet" type="text/css" href="/path/to/swiper.css">
```

```css
  .swiper-container {
      width: 100%;
      height: 200px;
  }
  .swiper-slide {
      text-align: center;
      font-size: 18px;
      background: #F6F4E3;
      width: 80%;
      border: 1px solid #ccc;
      height: auto !important;
      /* Center slide text vertically */
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
  }
  .swiper-slide:nth-child(2n) {
      width: 60%;
  }
  .swiper-slide:nth-child(3n) {
      width: 40%;
  }
```

_**JS部分**_

```html
  <script src="/path/to/swiper.js"></script>

  <script type="text/javascript">
    // 初始化
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: 'auto',
        paginationClickable: true,
        spaceBetween: 30
    });
  </script>
```

**Swipe.js**

看看 [Demo](/demos/demo-swipe.html#swipe)

_**HTML部分**_

`注：此 HTML 代码为 堆糖 移动端使用的 HTML 结构`

```html
  <section id="banner-index" class="swipe">
    <div class="swipe-wrap">
      <!-- <div>
        这里面的内容为自定义内容
      </div> -->
      <div>
        <a href="##">
          <img src="http://img4q.duitang.com/uploads/people/201503/25/20150325190813_HkYnS.jpeg"/>
          <span class="backend"></span>
          <span class="desc"><span class="time">2015年03月26日</span>
          <span class="h1">关注微信，AppleWatch任性送！</span>
        </a>
      </div>
      <div>
        <a href="##">
          <img src="http://img4q.duitang.com/uploads/people/201503/25/20150325183530_Juyke.jpeg"/>
          <span class="backend"></span>
          <span class="desc"><span class="time">2015年03月26日</span>
          <span class="h1">早春外套来一发</span>
        </a>
      </div>
      <div>
        <a href="##">
          <img src="http://img4q.duitang.com/uploads/people/201503/24/20150324184910_ZjXAZ.jpeg"/>
          <span class="backend"></span>
          <span class="desc"><span class="time">2015年03月26日</span>
          <span class="h1">【活动】你在看哪本书？</span>
        </a>
      </div>
      <div>
        <a href="##">
          <img src="http://img4q.duitang.com/uploads/item/201503/24/20150324185736_GmcwT.jpeg"/>
          <span class="backend"></span>
          <span class="desc"><span class="time">2015年03月26日</span>
          <span class="h1">野生画手的水彩路</span>
        </a>
      </div>
    </div>

    <!-- 底部指示小点 -->
    <ul class="disc">
      <li class="active"></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </section>
```

_**CSS部分**_

`注：此 CSS 样式为 堆糖 移动端使用的 CSS 样式`

```css
  /* swipe.css */
  .swipe{
    margin-bottom: 30px;
    overflow: hidden;
    visibility: hidden;
    position: relative;
  }
  .swipe a{
    -webkit-tap-highlight-color: transparent;
  }
  #banner-index .disc {
    z-index: 99;
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 7px;
    font-size: 0;
    text-align: center;
  }
  #banner-index .disc li {
    display: inline-block;
    width: 7px;
    height: 7px;
    margin-right: 10px;
    border-radius: 7px;
    background-color: #797071;
  }
  #banner-index .disc .active {
    background-color: #BFBDBD;
  }
  .swipe-wrap {
    overflow: hidden;
    position: relative;
  }
  .swipe-wrap img{
    display: block;
    width: 100%;
  }
  .swipe-wrap span{
    display: block;
  }
  .swipe-wrap>div {
    float: left;
    width: 100%;
    position: relative;
  }
  #banner-index a {
    position: relative;
    display: block;
    padding: 31% 0;
  }
  #banner-index img {
    position: absolute;
    top: 0;
    left: 0;
  }
  #banner-index .backend {
    z-index: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: .2;
    filter: alpha(opacity=20);
  }
  #banner-index .desc {
    position: absolute;
    left: 12px;
    bottom: 25px;
    color: #fff;
  }
  #banner-index .desc .time {
    font-size: 12px;
  }
  #banner-index .desc .h1 {
    font-size: 20px;
  }
```

_**JS部分**_

```javascript
  // 初始化
  window.mySwipe = Swipe(document.getElementById('banner-index'),{
    speed: 400,
    auto: 3000,
    continuous: true,
    callback: function(index, elem) {
      $('ul.disc li').removeClass('active');
      $('ul.disc li').eq(index).addClass('active');
    }
  });
```

总的来说，实现滑动效果的方法多种多样，具体用到哪种还是需要我们来根据具体情况来定，但是可以说无论用哪种方法，都需要对它进行一定程度的自定义，因为插件之所以为插件，就是因为它能够快速解决大多数人的基本需求，但是不可能满足每个人的最终目的。
