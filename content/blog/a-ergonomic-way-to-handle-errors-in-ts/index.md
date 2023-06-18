---
title: A More Ergonomic Approach to Handling Errors in TypeScript
date: '2023-06-18'
description: 'Have you ever annoyed by the errors everywhere?'
---

## Introduction

Have you ever been annoyed by encountering errors everywhere while working with JavaScript? Error handling is an essential aspect of software development, and in the JavaScript world, the most common approach to handling errors is by using `try/catch` blocks. However, this style can become cumbersome and lead to code that is harder to read and maintain, especially when dealing with asynchronous actions.

In this article, we will explore a more ergonomic way to handle errors in TypeScript by leveraging a library called `unwrapit`. This library introduces a concept similar to Rust's `Result` type, which provides a cleaner and more structured approach to dealing with errors.

## The Traditional `try/catch` Approach

Let's start by examining the traditional `try/catch` approach in JavaScript. When encountering an error, we wrap the code inside a `try` block and catch the error in the corresponding `catch` block. Here's an example:

```ts
try {
  JSON.parse('{a: true}')
} catch (e) {
  console.error(e) // Uncaught SyntaxError: Expected property name or '}' in JSON
}
```

This approach works for both synchronous and asynchronous code. For example:

```ts
try {
  await Promise.reject('async error')
} catch (e) {
  console.error(e) // async error
}
```

However, when dealing with a sequence of asynchronous actions, this style can quickly become cumbersome. Consider the following example:

```ts
function handler() {
  try {
    await queryDB()
    await sendRequest()
    await writeDB()
    return 'ok'
  } catch (e) {
    if (isQueryDBError(e)) return {err: 'query DB error'}
    if (isSendReqError(e)) return {err: 'send request error'}
    if (isWriteDB(e)) return {err: 'write DB error'}
  }
}
```

In this case, the `try/catch` blocks introduce additional indentation, and error handling requires manual checks and conditionals. This can make the code harder to read and maintain.

## Introducing `unwrapit`

To address these issues and provide a more ergonomic way of handling errors in TypeScript, we can leverage the `unwrapit` library. Inspired by Rust's `Result` type, `unwrapit` introduces a similar concept in JavaScript.

I have developed a small library called `unwrapit` that brings the Rust `Result` type into JavaScript. You can find the library on GitHub at https://github.com/musicq/unwrapit.

## Using `unwrapit` for Error Handling

Let's explore how to use `unwrapit` to handle errors more ergonomically. First, we need to wrap our functions that might produce errors using the `wrap` function provided by `unwrapit`.

As an example, let's take the `parseJson` function we discussed earlier:

```ts
import {wrap} from 'unwrapit'

function parseJson(jsonString: string) {
  return JSON.parse(jsonString)
}

const parseJsonWrapper = wrap(parseJson)
```

By wrapping the `parseJson` function, we transform its return type into a `Result<any, unknown>`, where `any` represents the type of the value returned on success, and `unknown` represents the type of the error.

## Handling Errors with `unwrap` and `ok`/`err` Functions

When using a function wrapped with `unwrapit`, it is recommended to first check the result using conditional statements. Here's an example:

```ts
const result = parseJsonWrapper('{a: true}')

if (!result.ok) {
  console.error(result.error)
  return
}

console.log(result.value)
```

> [Try in TSPlayground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgdygQzHAvnAZlCEOAcgFcA7VDYGYgKDtwoGMZgJy4w0oBnAUwBSvDgAoIALji8YUYOQDmASkR04cKPxikonQQGUA8gDkAdNz79xSulgZ1mHGVx4DhHAOrowYflDgAvCjeohZuIuQ2jCxsHHAgaPKiKghqcI7kzprwQWFCEV4YvlCixAhoUrKk-FjEUerAuHCiAITZphAA1ilp6hkiADb8pn4EJe2j0Dbq6tk65Gl2af0QQ6YDEAqi7QBuaAPVNksJSUpAA)

In this example, we check the `ok` property of the `result` object. If it's `false`, we know that an error occurred, and we can access the error via the `error` property. Otherwise, we can safely access the value using the `value` property.

Alternatively, `unwrapit` provides the `unwrap` method, which can be used to directly extract the value from the `Result` or throw an error if an error occurred:

```ts
const result = parseJsonWrapper('{a: true}').unwrap() // Throws an error since `{a: true}` is not a valid JSON string
```

The `unwrap` method simplifies error handling by throwing an error when an error occurs, allowing you to catch it using a `try/catch` block.

Additionally, you can manually create `Result` instances using the `ok` and `err` functions provided by unwrapit. Here's an example:

```ts
import {ok, err} from 'unwrapit'

function parseJson(jsonString: string) {
  try {
    return ok(JSON.parse(jsonString))
  } catch (error) {
    return err(error)
  }
}

const result = parseJson('{a: true}').unwrap()
```

> [Try in TSPlayground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbwgawDRwKZSgXzgMyghDgHIBXAOwHcoBDMYGUgKBfyoGMZgJK4wdKAGcMAKWF8AFBABccYTCjBKAcwCUiFnDhKAnlp06oGGOSj8UUsQGUA8gDkAdIJEYZ69drh5OdGJwAFnBSGJoI3sam5vxYUKFeOjgsySycfIpwJvAAvAJCohLSpAh08krkGDik6k5UtAxS6kA)

In this case, we wrap the successful value using `ok` and wrap the error using `err.

## Conclusion

In this article, we explored a more ergonomic way to handle errors in TypeScript by utilizing the `unwrapit` library. By introducing a concept similar to Rust's `Result` type, `unwrapit` provides a cleaner and more structured approach to error handling. With `unwrapit`, you can easily determine whether a function might throw errors, handle errors with conditional statements or the `unwrap` method, and create `Result` instances manually using `ok` and `err` functions.

To learn more about `unwrapit` and explore its detailed usage, I encourage you to refer to the [README](https://github.com/musicq/unwrapit) on the GitHub repository.

Remember, by adopting a more ergonomic error handling approach, you can make your TypeScript code more readable, maintainable, and less error-prone.
