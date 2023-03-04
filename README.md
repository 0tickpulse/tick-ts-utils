# 🚀 Tick TS Utils

A large repository of utility things for JavaScript and TypeScript that are made for my use.

## 📦 Installation

```bash
npm install tick-ts-utils
pnpm install tick-ts-utils
yarn add tick-ts-utils
```

## 📖 Usage

After installing the package, you can import the functions you want to use.

```ts
import { emptyFunction } from "tick-ts-utils";

await someAsyncFunction().catch(emptyFunction);
```

You can also import `tick-ts-utils/out/namespaced.js` to import all functions under a namespace.

```ts
import { functions } from "tick-ts-utils/out/namespaced.js";

await someAsyncFunction().catch(functions.emptyFunction);
```

This can be useful if you want better IntelliSense.

## [📝 License](./LICENSE)

## [📄 Changelog](./CHANGELOG.md)
