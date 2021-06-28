---
title: Event loop 的执行顺序
date: '2021-06-28'
description: '你真的了解事件循环的执行顺序吗？'
---

很多文章都在讲时间循环，但是大部分只停留在概念上，真正遇到考题可能就晕了。这篇文章就是想从实战角度，体验一下什么是时间循环。

下面是一道很常见的面试题，我将它稍微改造变成了一个很复杂异步代码例子，你能看出他的运行结果吗？

```javascript
async function a1() {
  console.log('a1 start')
  const r = await a2()

  console.log(r)
  console.log('a1 end')
}

async function a2() {
  console.log('a2 start')
  const r = await a3()

  console.log(r)
  return 'a2 end'
}

async function a3() {
  console.log('a3 start')
  return 'a3 end'
}

console.log('script start')
setTimeout(() => {
  console.log('setTimeout')
})

a1()

new Promise(resolve => {
  console.log('promise 1')
  resolve()
  console.log('promise 2')
  reject()
})
  .then(() => {
    console.log('promise 3')
  })
  .then(() => {
    console.log('promise 4')
    throw new Error('err')
  })
  .catch(() => {
    console.log('err')
  })

console.log('script end')
```

这题乍一看很乱，但是别忘了事件循环其实不过就是栈和队列，清楚了栈和队列我们就能很轻易的解决这个问题了，还要记得代码是一块一块执行的。

做题之前，先明确几个概念。

事件循环分为三个部分，暂且把它们记成 Task, Micro 和 Macro。

- Task: 主栈，任何代码都是在主站内完成执行的
- Micro: 微队列，用来保存 Promise 或 Mutation Observer 的任务
- Macro: 宏队列，用来保存 setTimeout 等宏任务

它们的执行顺序遵循如下原则：

1. 如果 Task 有任务，则循环执行栈(FILO)内任务
2. 如果 Task 没有任务，从 Micro 队列中取出一个任务，放到主栈执行，继续 1 步骤
3. 如果主栈和 Micro 队列都没有任务，执行 Macro 队列的第一个任务，回到 1 步骤

下面先来看几个特定的例子

```javascript
let p = new Promise(resolve => {
  console.log(1)
  resolve()
}).then(() => console.log(2))

console.log(3)
```

很多人第一直觉是 Promise 内的任务是 Micro，所以应该先输出 3，再输出 1，最后输出 2，这个认知是不正确的。

`new Promise()` 内的代码其实是同步执行的，并不会将其放入到 Micro 队列，而是遇到 resolve 或者 reject 时，才开始在 Micro 中放入任务。

所以他的运行规则如果下

| Task            | Micro     | Macro |
| --------------- | --------- | ----- |
| consolle.log(1) | resolve() |       |
| consolle.log(3) |           |       |

执行完 Task 栈内的任务后，开始执行 resolve 的任务

| Task      | Micro | Macro |
| --------- | ----- | ----- |
| resolve() |       |       |

resolve 的任务就是 then 内的 callback

| Task           | Micro | Macro |
| -------------- | ----- | ----- |
| console.log(2) |       |       |

所以这段代码的结果就是

```
1
3
2
```

在此基础上，可以稍作一点变形，会跟让人发懵。

```javascript
let p = new Promise(resolve => {
  console.log(1)
  resolve()
  console.log(4)
  reject()
})
  .then(() => console.log(2))
  .catch(() => console.log(5))

console.log(3)
```

这里看到 Promise 主体内的代码在 resolve 之后还有一个 `console.log`，关键最后还有一个 `reject`。

其实这些都是烟雾弹，我们只要记住几个原则：

1. 代码是一块一块执行的
2. Promise 的状态一单 fullfilled，就不可更改

所以上面的代码结果如下

```
1
4
3
2
// 5 不会被输出，因为 promise 已经被 resolve 了
```

下面再来看一个 async/await 的例子

```javascript
async function a1() {
  console.log('a1 start')
  const r = await a2()
  console.log(r)
  console.log('a1 end')
}

async function a2() {
  console.log('a2 start')
  return 'a2 end'
}

a1()
console.log('start')
```

这题的输出可能有点反直觉，但是只要遵循上面给出的描述，就能很容易的解决。

可以考虑将 async/await 转换成 Promise 这种比较熟悉的形式

```javascript
async function a1() {
  return new Promise(resolve => {
    console.log('a1 start')
    a2().then(r => {
      console.log(r)
      console.log('a1 end')
    })
  })
}

async function a2() {
  return new Promise(resolve => {
    console.log('a2 start')
    resolve('a2 end')
  })
}

a1()
console.log('start')
```

由此就可能比较轻易的看出来他的运行逻辑了。

第一步，将任务放入主栈

| Task | Micro | Macro |
| ---- | ----- | ----- |
| a1() |       |       |

第二步，运行 a1，得出

| Task                    | Micro | Macro |
| ----------------------- | ----- | ----- |
| console.log('a1 start') |       |       |
| a2()                    |       |       |

清空主栈，输出 `a1 start`，然后将 a2 运行并入栈

| Task                    | Micro             | Macro |
| ----------------------- | ----------------- | ----- |
| console.log('a2 start') | resolve('a2 end') |       |

清空主栈，输出 `a2 start`

由于 a2 中包含 resolve 属于 Micro task，将 resolve 压入到 Micro 中

然后就没有可以再同步嵌套下去的任务了，可以继续往下走

| Task                 | Micro             | Macro |
| -------------------- | ----------------- | ----- |
| console.log('start') | resolve('a2 end') |       |

清空主栈，遇到 console.log('start') 时，输出 `start`。

最后主栈已经没有任何任务存在，这时就需要将 Micro 队列的任务出队了

| Task              | Micro | Macro |
| ----------------- | ----- | ----- |
| resolve('a2 end') |       |       |

这里的 `resolve('a2 end')` 就可以解析成下面的方法

| Task                                           | Micro | Macro |
| ---------------------------------------------- | ----- | ----- |
| (r) => {console.log(r); console.log('a1 end')} |       |       |

其中 r 就是 resolve 的值 'a2 end'，所以会输出

```
a2 end
a1 end
```

所以最终结果就为

```
a1 start
a2 start
start
a2 end
a1 end
```

根据上述的执行顺序，再回头看第一题的，只需要注意一点即可，即`Macro 需要在 Micro 都执行完成之后才继续执行`。

得到结果如下

```
script start
a1 start
a2
a3
promise 1
promise 1.1
script end
a3 end
promise 2
a2 end
a1 end
promise 3
err
setTimeout
```
