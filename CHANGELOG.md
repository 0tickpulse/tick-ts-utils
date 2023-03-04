# Changelogs

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
