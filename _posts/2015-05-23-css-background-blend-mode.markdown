---
layout: post
title:  "CSS颜色混合模式"
categories: jekyll update
---
<style>
  .blend-mode{
    background: url({{site.imgurl}}2015-05-23/sakura.jpg) no-repeat center center rgba(56, 93, 110, 1);
    width: 410px;
    height: 410px;
    margin: 0 auto;
    background-size: contain;
    background-blend-mode: normal;
  }
  @media screen and (max-width: 400px){
    .blend-mode{
      width: 280px;
      height: 280px;
    }
  }
  circle{
    mix-blend-mode: difference;
  }
</style>

很多同学都喜欢用修图软件，把自己P的美美的，现在市面上也有很多的修图软件供我们使用，像女生的必备神器-美图秀秀，还有不久前被墙的图片社交软件 instagram 等等。这些修图工具都会具备一些滤镜功能，把图片变得更好看。

我之前在公司实习时市场部也曾提过一个需求，就是能不能把移动端的一个活动页面的上传图片做一些滤镜效果的处理呢？当时我只不过在旁边听着（就是没我什么事儿），想这个好像不能吧，但是如果真的需要的话也有解决办法，就是用一张 PNG 的图片叠在需要处理的图片上面。现在想想其实还是有好多种能实现滤镜的方法的，像用渐变做滤镜啊、canvas 的滤镜啊、filter 的滤镜啊，都可以。

但是呢，今天在网上看到一个 css 属性 - `background-blend-mode`，是一种**颜色混合模式**的属性，很厉害，能用来当成很强大的滤镜用了都。我们先来体验下这货。

<div class="blend-mode" style="background-blend-mode: hard-light;"></div>
<br>
再来看看原图

<div class="blend-mode"></div>
<br>

还不错吧，下面让我们们来看看它的用法。由于这个属性是背景属性，所以用的时候我们需要将我们的图片作为背景图片来加载。像这样

```html
<div class="blend-mode"></div>
```

```css
.blend-mode{
  background: url(http://image.tencent.com/assets/img/img_soruce/IMG20150523/20150523192948-LQenkhMUNU.jpg) no-repeat center center rgba(193, 226, 222, 1);
  width: 410px;
  height: 410px;
  margin: 0 auto;
  background-size: contain;
  background-blend-mode: luminosity;
}
```

**需要注意的是：**我们的背景图片中必须要有**两个元素**，因为如它的名称所示，**颜色混合模式**，指的就是在两个东西混合后的颜色中做文章，所以我们可以在背景图中声明两个图片，或者一个图片一个颜色这样来混合。

来看看都有哪些效果

*注：以下内容转自 [CSS颜色混合模式](http://www.webhek.com/css-blend-mode#comment-644), 在 [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/blend-mode) 上有更详细的介绍*


#### **Multiply 正片叠底**

Multiply 正片叠底,正如名称示意的，用混合颜色来增重基色，产生一种更深的颜色。用黑色正片叠底的结果是黑色，用白色正片叠底的结果是图片没有任何变化。

<div class="blend-mode" style="background-blend-mode: multiply;"></div>
<br>

#### **Screen 滤色**

Screen 滤色是两个像素色的逆向正片叠底。滤色和正片叠底正好相反，使用白色进行虑色会产生白色，使用黑色虑色的结果是图像没有变化。

<div class="blend-mode" style="background-blend-mode: screen;"></div>
<br>

#### **Overlay 叠加**

Overlay 叠加是一种复杂的混合模式。颜色变深的程度依赖于基色：浅色变的更浅，深色变得更深。

<div class="blend-mode" style="background-blend-mode: overlay;"></div>
<br>

#### **Darken 变暗**

Darken 变暗, 让图片更暗。它会选择使用两个重叠的像素中颜色更深的那个。

<div class="blend-mode" style="background-blend-mode: darken;"></div>
<br>

#### **Lighten 变亮**

跟变暗相反，lighten 变亮模式会选择另个叠加的像素中颜色较轻的那个。

<div class="blend-mode" style="background-blend-mode: lighten;"></div>
<br>

#### **Color dodge 颜色减淡**

Color dodge 颜色减淡减小对比度使基色变亮以反映混合色。

<div class="blend-mode" style="background-blend-mode: color-dodge;"></div>
<br>

#### **Color burn 颜色加深**

Color burn 颜色加深 跟颜色减淡相反，通过增加对比度使基色变暗以反映混合色。

<div class="blend-mode" style="background-blend-mode: color-burn;"></div>
<br>

#### **Hard light 强光模式**

Hard light 强光模式“强光”模式将产生一种强光照射的效果。如果“混合色”颜色“基色”颜色的像素更亮一些，那么“结果色”颜色将更亮；如果“混合色”颜色比“基色”颜色的像素更暗一些，那么“结果色”将更暗。

<div class="blend-mode" style="background-blend-mode: hard-light;"></div>
<br>

#### **Soft light 柔光模式**

Soft light 柔光模式跟强光模式类似，“柔光”模式会产生一种柔光照射的效果。如果“混合色”颜色比“基色颜色的像素更亮一些，那么“结果色”将更亮；如果“混合色”颜色比“基色”颜色的像素更暗一些，那么“结果色”颜色将更暗，使图像的亮度反差增大。

<div class="blend-mode" style="background-blend-mode: soft-light;"></div>
<br>

#### **Difference 差值模式**

Difference 差值模式 “差值”模式是将从图像中“基色”颜色的亮度值减去“混合色”颜色的亮度值，如果结果为负，则取正值，产生反相效果。由于黑色的亮度值为0，白色的亮度值为255，因此用黑色着色不会产生任何影响，用白色着色则产生被着色的原始像素颜色的反相。

<div class="blend-mode" style="background-blend-mode: difference;"></div>
<br>

#### **Exclusion 排除模式**

Exclusion 排除模式与“差值”模式相似，但是具有高对比度和低饱和度的特点。比用“差值”模式获得的颜色要柔和、更明亮一些。

<div class="blend-mode" style="background-blend-mode: exclusion;"></div>
<br>

#### **Hue 色相模式**

Hue 色相模式只用“混合色”颜色的色相值进行着色，而使饱和度和亮度值保持不变。当“基色”颜色与“混合色”颜色的色相值不同时，才能使用描绘颜色进行着色

<div class="blend-mode" style="background-blend-mode: hue;"></div>
<br>

#### **Saturation 饱和度模式**

Saturation 饱和度模式, “饱和度”模式的作用方式与“色相”模式相似，它只用“混合色”颜色的饱和度值进行着色，而使色相值和亮度值保持不变。当“基色”颜色与“混合色”颜色的饱和度值不同时，才能使用描绘颜色进行着色处理

<div class="blend-mode" style="background-blend-mode: saturation;"></div>
<br>

#### **Color 颜色模式**

Color 颜色模式能够使用“混合色”颜色的饱和度值和色相值同时进行着色，而使“基色”颜色的亮度值保持不变。“颜色”模式模式可以看成是“饱合度”模式和“色相”模式的综合效果。该模式能够使灰色图像的阴影或轮廓透过着色的颜色显示出来，产生某种色彩化的效果。

<div class="blend-mode" style="background-blend-mode: color;"></div>
<br>

#### **Luminosity 亮度模式**

Luminosity 亮度模式能够使用“混合色”颜色的亮度值进行着色，而保持“基色”颜色的饱和度和色相数值不变。其实就是用“基色”中的“色相”和“饱和度”以及“混合色”的亮度创建“结果色”。此模式创建的效果是与“颜色”模式创建的效果相反

<div class="blend-mode" style="background-blend-mode: luminosity;"></div>
<br>
<br>
<br>

每个模式都有自己的算法，我们可以根据需要来运用这些样式。另外一个，如果你觉得这样还是不够方便，你可能想要用到 `img` 标签来存放图片，这样的话用 **background-blend-mode** 这个属性就没有用了，这要怎么办呢。别急，还有一个属性我们没用了，那就是**mix-blend-mode**。

**mix-blend-mode** 在 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/mix-blend-mode) 的描述是这样的：

>  `mix-blend-mode` 这个属性是用来一个元素内容应该怎样和它下面的元素的内容及这个元素的背景进行混合

也就是说用这个属性也是需要两个元素才能展现出它的效果。效果如下：

<svg>
  <circle cx="40" cy="40" r="40" fill="red"></circle>
  <circle cx="80" cy="40" r="40" fill="green"></circle>
  <circle cx="60" cy="80" r="40" fill="blue"></circle>
</svg>

它的值跟 **background-blend-mode** 是一样的，乃们可以自己试一下。或者看看 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/mix-blend-mode) 上的例子，但是我感觉有点问题，就是我得到的样子跟 MDN 描述的还是有很大差别的，我也不晓得是什么原因，我回头再研究研究看看。

<br>

**注意下这两个属性的兼容性**

*Partial in Safari refers to not supporting the `hue`, `saturation`, `color`, and `luminosity` blend modes.*

*Enabled in Chrome through the "experimental Web Platform features" flag in chrome://flags*

**background-blend-mode 兼容性**
![background-blend-mode 兼容性]({{site.imgurl}}2015-05-23/background-blend-mode.png)

**mix-blend-mode 兼容性**
![mix-blend-mode 兼容性]({{site.imgurl}}2015-05-23/mix-blend-mode.png)
