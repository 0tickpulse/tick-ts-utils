# Changelogs

## 4.2.1

- improved `Optional#map` typing

## 4.2.0

- Added a `Color` class.
- Fixed some code formatting issues.

## 4.1.2

- `Result#ifOkOrElse`'s second argument now accepts a function that takes the error as the first argument.

## 4.1.1

- Forgot to build before publishing

## 4.1.0

- New math category wih functions `randomBoolean`, `randomInt`, `randomFloat`, `randomElement`, and `sum`
- New `Result#tryAsync` method

## 4.0.0

- Removed the logger. It was too buggy and doesn't fit in with the rest of the library.

## 3.3.3

- Removed `"type": "module"` from `package.json` to fix CommonJS support.

## 3.3.2

- Now uses CommonJS by default, but still supports ES modules.

## 3.3.1

- Experimental CommonJS support fix 1

## 3.3

- Experimental CommonJS support

## 3.2

- `deepEquals` now properly checks for `equal` methods on objects.
- `deepEquals` now matches property descriptors.
- New comparison functions and `Comparable` interface.
- `Duration` now implements `Comparable` and `DeepEquals`.
- `Duration#compareUnit` documentation changed.
- `Match` now has a `getAllMatches` method to get all matches instead of just the first one.
- New internal `hasFunctionWithArity` function, cleans up some code.
- `Result` now has documentation.
- `Result#getOrElse`, `Result#getErrorOrElse`, `Result#getOrElseGet`, and `Result#getErrorOrElseGet` now allow you to pass functions that return any value.
- `Optional.empty` now returns a singleton instance of `Optional` instead of a new instance every time.

## 3.1.7

- Cleans up the compiled folder a bit.

## 3.1.6

- Fixed minor issue with `Logger#logError`.

## 3.1.5

- Made `Optional#otherwise` more lenient with its type parameter. Previously, it would only accept a value with the same type as the Option's type itself. Now, it accepts any value.

  ```ts
  const optional = Optional.of(1);
  const result = optional.otherwise("Hello") // this would error before, but now it doesn't
  ```

## 3.1.4

(Wow pi version)

- `Optional` now has a toString method (improves logging and stuff).

## 3.1.3

- Improved IntelliSense for duration units.

## 3.1.2

- Minor fixes to logger.

## 3.1.1

- `Logger#setOutputStream`, `Logger#log`, and `Logger#logError` now return `this` for method chaining
- Added `Logger#logError`

## 3.1.0

- Adds a logger

## 3.0.3

- Minor change to ansiCode typing
- Adds namespace support
- Adds `Result#getAsOptional`, which converts a `Result` to an `Optional`
