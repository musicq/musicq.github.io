---
title: Node ESM vs CJS
date: '2023-03-14'
description: 'How do you define a modern NPM package?'
---

Node uses CJS mode to load modules by default, it treats all the files that with an extension `.js` `.cjs` as commonjs modules. But you can switch to ESM through 2 ways.

1. Change the file extension to `.mjs`
2. Add `"type": "module"` in the package.json

Both ways can let Node to interpret modules as ESM, the difference is only that if you add `"type": "module"` inside the package.json, Node will interpret all `.js` files that belong to this package by using ESM mode.

> Ignore `"type"` or set `"type": "commonjs"` will let Node to use CJS mode.

Which mode to use determines that how Node resolve dependencies. For example, we have a `my-pkg` package as one of our app's dependencies. It structure looks like below

```shell
tree node_modules/my-pkg
# my-pkg/
# ├── dist/
# │   ├── index.cjs
# │   ├── index.d.ts
# │   ├── index.js
# │   └── index.mjs
# └── package.json

cat package.json
# {
#   "name": "my-pkg",
#   "version": "1.0.0",
#   "exports": {
#     ".": {
#       "import": "./dist/index.mjs",
#       "require": "./dist/index.cjs"
#     }
#   }
# }

cat dist/index.cjs
# exports.msg = 'my-pkg - cjs'

cat dist/index.mjs
# export const msg = 'my-pkg - esm'
```

In our app, the structure looks like

```shell
tree .
# app/
# ├── src/
# │   ├── index.cjs
# │   ├── index.js
# │   └── index.mjs
# ├── node_modules
# │   └── my-pkg
# └── package.json

cat package.json
# {
#   "name": "ts-esm",
#   "dependencies": {
#     "my-pkg": "1.0.0"
#   }
# }

cat src/index.mjs
# import {msg} from 'my-pkg'
# console.log(msg)

cat src/index.cjs
# const {msg} = require('my-pkg')
# console.log(msg)
```

Notice that there is a `exports` object in `my-pkg` package.json, this is called [condition exports](https://nodejs.org/dist/latest-v18.x/docs/api/packages.html#conditional-exports). In ESM mode, it will resolve `exports.import`, in CJS mode, it will resolve `exports.require`. This will enable us to create a library that satisfy both CJS and ESM users.

If we run the command

```shell
node src/index.mjs
```

Node will interpret this file by using ESM mode, so it will **import** the `my-pkg/dist/index.mjs`, then prints `my-pkg - esm`.

If we run the command

```shell
node src/index.cjs
```

It will **require** `my-pkg/dist/index.cjs`, then prints `my-pkg - cjs`.

## Cross Import

It's quite common to import some CJS dependencies within a ESM file, Node can do this by default.

Let's change the package.json of `my-pkg` a bit, to refer ESM to a CJS file in condition exports.

```json
{
  "name": "my-pkg",
  "version": "1.0.0",
  "exports": {
    ".": {
      "import": "./dist/index.cjs",
      "require": "./dist/index.cjs"
    }
  }
}
```

Then run the command

```shell
node src/index.mjs
```

It works well and prints `my-pkg - cjs`.

**You cannot require a ESM module within a CJS file.**

## ESM by Default

Usually, we will use some bundler to bundle our codebase, and generate `.js` files instead of `.mjs` files. So what if we want Node to interpret `.js` files as ESM automatically?

To do so, we can define the `"type": "module"` in the library package.json like below

```json
{
  "name": "my-pkg",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  }
}
```

In this way, we don't need to generate extra `.mjs` files. But need to make sure that your `.js` files are using ESM mode.

# Conclusion

I think it's a better idea to **always define `"type": "module"` inside a library package.json**. This won't break how Node interprets CJS, and enable us to ship ESM first-class support libraries while also have the capability to compat with CJS applications.

> playground can check this repo out
>
> https://github.com/musicq/node-esm-vs-cjs
