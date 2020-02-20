---
title: How to handle errors gracefully?
date: "2020-01-21"
description: "Have you ever annoyed by the errors everywhere?"
---

When I write an app, I usually separate HTTP requests into some independent files. Then I want to use them as simple as can be in my business code which usually are components. Like the example below.

```js
// service.js
export function getPosts() {
  return fetch("/api/posts/")
    .then(res => res.json())
    .catch(e => {
      logger.error(e)
      throw e
    })
}

// component.js
function fetchPosts() {
  getPosts()
    .then(posts => this.setState({ posts, error: null }))
    .catch(e => this.setState({ posts: [], error: e }))
}
```

That is good in most cases. However, it’s not that simple. Consider that we need to catch the errors everywhere in business code, even if we don't really care about that. Also, you may say "we can just ignore the catch block". But if you do that, you can see the warnings in the console. Like
Uncaught (in promise)
We can solve that by tweaking the service.js file a little bit.

```js
export function getPosts() {
  const defaultValue = []

  return fetch("/api/posts/")
    .then(res => res.json() || defaultValue)
    .catch(e => {
      logger.error(e)
      // Replace throw to return a default value
      return defaultValue
    })
}
```

Then we can just ignore the errors in our business code. Feels like more simple. But if you look close to the service code, you may find that we cannot get the errors in our business code. In some cases, we need an error message to show a better user experience.
Are there any better solutions?
In fact, we can introduce a new data structure to solve that! In functional programming, we are operating with types. We can also consider the errors as a special type. It may look like this

```js
class Err {
  constructor(public message: string, public e: any) {
    logger.error(e);
  }
}
```

If we encapsulate all errors into an Err type, then we can handle it as a normal type.

```js
// service.js
export function getPosts() {
  return (
    fetch("/api/posts/")
      .then(res => res.json())
      // Transform errors to Err type
      .catch(e => new Err(e.message, e))
  )
}
// component.js
async function fetchPosts() {
  const res = await getPosts()
  if (res instanceof Err) {
    // Handle errors here...
  }
}
```

Now we can use services via the simplest way in business code. We can opt in to handle errors, or it’s fine if we just ignore it. We won’t be worried about warning messages in the console anymore.
