# Changelogs

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
