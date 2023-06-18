---
title: Angular 变更检测
date: '2018-02-24T22:12:03.284Z'
description: 'Angular 到底是如何进行变更检测的？'
---

## Angular1 vs Angular 变更检测

Angular1.x 是一个很强大的框架，它独特的双向绑定，能让我们在开发中获得巨大的便利，这得益于它的双向绑定机制（two-way data binding）。但是由于这个特性的原因，导致它的变更检查很难进行，因为它没法保证你子节点的变更检查一定在你父节点检查完之后才去进行。我们很可能会遇到子节点变更了父节点或者树中的其它节点，这样就会导致可能我父节点属性可能刚刚计算完，但是你子节点变了，我的属性又需要重新计算了，这就会导致我的变更检查需要循环重复运行好几次才能稳定下来。

但是在 Angular 中，它已经改成单项数据流的方式（unidirectional）。每一次的变更检查都是自顶向下，这就使得它的变更检查只需运行一次就能稳定下来。

![angular1-vs-angular2](./angular1-vs-angular2.jpg)

## Angular 怎样去做变更检测

在看 angular 的变更检测前，我们看一下 react 是怎样做变更检测的

> 完全是出于个人理解，如果有任何错误，请指正

### react

```javascript
class MyApp extends React.Component {
  constructor() {
    super();
    this.state = {
      name: 'react'
    };
  }

  click() {
    // 调用 setState 去变更 name 属性
    this.setState({ name: 'angular' });
  }

  render() {
    return (
      <h1>{this.state.name}</h1>
      <button onClick={() => this.click()}>Change Name</button>
    );
  }
}
```

从这个例子可以看到，我们想要通过点击一个按钮去改变 name 属性。首先我们需要在 state 中定义出这个属性，然后在想要变更此属性的时候，显示的去调用 react 提供的 setState 接口，这样我们就通知了 react 我们有一个 name 的属性改变了，需要更新视图，随后 react 接管了全部，在合适的时机更新了视图，一切都搞定。

那在 angular 中是怎样的呢？

### angular

首先我们同样写一个组件。

```typescript
@Component({
  selector: 'my-app',
  template: `
    <h1>{{ name }}</h1>
    <button (click)="click()">Change Name</button>
  `,
})
export class MyAppComponent {
  name: 'angular'

  constructor() {}

  click() {
    this.name = 'react'
  }
}
```

同样的例子可以看到，程序中并没有显示的调用任何接口去通知 angular 哪个属性发生了改变，需要去更新，抛开 `@Component` 不看的话，下面的部分完全是一个普通的类，没有任何特别。那它是如何知道有哪些属性发生了变化，需要去更新呢？

其实 angular 为了了解每一个组件模型中的视图绑定属性是否发生变化，会在运行时为每一个组件创建一个 change detectors 类，并且关联到它负责检测的组件上，它就像下面这样

> 声明：这些代码都是表意的，而不是 angular 真正运行时创建的样子，只是为了解释说明

```typescript
class MyAppComponent_ChangeDetector {
  constructor(public previousName: string) {}

  detectChanges(name: string) {
    if (name !== this.previousName) {
      this.previousName = name
    }
  }
}
```

当 Angular 的变更检测机制想要去了解哪些值发生了变化，它将会运行了 MyAppComponent_ChangeDetector 类中的 detectChanges 方法，如果检测到新旧属性不相等，组件就会更新。我们用一个更复杂些的例子来继续说明。

## Angular 变更检测策略

_app.component.ts_

```typescript
import {Component, ChangeDetectionStrategy} from '@angular/core'
import {Actor} from './actor.model'

export class Actor {
  constructor(public firstName: string, public lastName: string) {}
}

@Component({
  selector: 'app-root',
  template: `
    <h1>MovieApp</h1>
    <p>{{ slogan }}</p>
    <button type="button" (click)="changeActorProperties()">
      Change Actor Properties
    </button>
    <button type="button" (click)="changeActorObject()">
      Change Actor Object
    </button>
    <app-movie [title]="title" [actor]="actor"></app-movie>
  `,
})
export class AppComponent {
  slogan = 'Just movie information'
  title = 'Terminator 1'
  actor = new Actor('Arnold', 'Schwarzenegger')

  changeActorProperties(): void {
    this.actor.firstName = 'Nicholas'
    this.actor.lastName = 'Cage'
  }

  changeActorObject(): void {
    this.actor = new Actor('Bruce', 'Willis')
  }
}
```

_movie.component.ts_

```typescript
import {Component, Input} from '@angular/core'
import {ChangeDetectionStrategy} from '@angular/core'
import {Actor} from './actor.model'

@Component({
  selector: 'app-movie',
  styles: ['div {border: 1px solid black}'],
  template: `
    <div>
      <h3>{{ title }}</h3>
      <p>
        <label>Actor:</label>
        <span>{{ actor.firstName }} {{ actor.lastName }}</span>
      </p>
    </div>
  `,
})
export class MovieComponent {
  @Input() title: string
  @Input() actor: Actor
}
```

对于这个例子来说，我们的 AppComponent 对应的 change detector 类就像下面这样

```typescript
class AppComponent_ChangeDetector {
  constructor(
    public previousSlogan: string,
    public previousTitle: string,
    public previousActor: Actor,
    public movieComponent: MovieComponent,
  ) {}

  detectChanges(slogan: string, title: string, actor: Actor) {
    if (slogan !== this.previousSlogan) {
      this.previousSlogan = slogan
      this.movieComponent.slogan = slogan
    }
    if (title !== this.previousTitle) {
      this.previousTitle = title
      this.movieComponent.title = title
    }
    if (actor !== this.previousActor) {
      this.previousActor = actor
      this.movieComponent.actor = actor
    }
  }
}
```

在这个例子中我们法相，actor 属性是一个 object，detector 类中的对比 `actor !== this.previousActor` 在触发 AppComponent 中的 `changeActorProperties` 方法时，永远都不为 true，因为我们使用的永远是同一个 actor 的引用，但是我们在运行后发现，视图确实更新了，为什么？这就涉及到 Angular 的变更检测策略（Change Detection Strategy）。

回想上面我们改变一个名字，都发生了那些事情？点击按钮，触发了变更的事件，变化的传播通过两部分完成，应用的部分和变更检测的部分。

### 一：应用部分

在我们的应用中，我们只是负责响应事件作出模型的更新，在此场景中，我们对 actor 的 firstName 更 lastName 属性作出了修改。

### 二：变更检测

模型发生了改变，Angular 需要通过变更检测更新视图。Angular 的变更检测是自上而下的（always starts at the root component），在这个场景中，detector 需要去比较三个属性`slogan`、`title`、 `actor`，然后我们会发现 `actor !== this.previousActor` 永远是 false，即使它内部属性确实发生了变化，这是因为 detector 只是做了浅比较（shallow comparison）。在默认策略（default）中，变更检测回去遍历全部的组件树，即使组件并没有发生变化。

接下来变更检测会在到组件层级继续向下移动，进入到 MovieComponent 中，检查模板绑定属性是否发生变化，结果 `title` 属性并无变化，而 `actorFirstName` 和 `actorLastName` 确实发生了变化。最终 Angular 发现了变化，然后它会去更新 DOM 使得 view 与 model 同步。

## 性能问题

组件少的情况没什么问题，但是如果组件多了的话，每一次的变更检测就要去更新全部的组建树，即使我们组件状态没有发生任何变化，这就造成了多余的计算，造成了浪费。假如说我们能够自己控制组件的变更检测，告诉 Angular 我们的组件变化只跟我的 Input 有关，并且我们的 Input 是不可变的（immutalbe），是不是就能避免组件进行多余的计算呢？

换句话说，如果我们每一次更改 actor 内部的属性，都重新构造一个新的实例，而不是原先的实例，那么对于 `actor !== this.previousActor` 来说，就永远会是 true；而另一方面，如果 actor 没有发生任何更改，那么就还是原先的引用，那么相同的比较一定是 false。

然后由于 `actor !== this.previousActor` 永远是 false（因为我们假设我们的 input 是不可变的），我们就能跳过组件内部的检查，是不是就能避免不必要的性能浪费呢！

## Change Detection Strategy: OnPush

这是 Angular 提供的另一种变更检查策略，它意味着组件内部的 Input 是不可变的，如上所述，提升变更检测的性能。

```typescript
@Component({
  // ...
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieComponent {
  // ...
}
```

运行程序后会发现，改变 actor 内部的属性并不会引发视图的更新，而改变 actor 的实例则会引发其更新。因为 `actor !== this.previousActor` 返回了 true。变更检测发现了变化，然后更新 DOM 同步视图与模型。

---

_附上程序代码_

https://stackblitz.com/edit/musicq-angular-change-detection?embed=1&file=app/app.component.ts
