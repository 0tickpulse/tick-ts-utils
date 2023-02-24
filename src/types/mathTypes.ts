type Int = number;

type Length<T extends readonly unknown[]> = T extends { length: infer L extends number } ? L : 0;

export type Or<T extends boolean, U extends boolean> = T extends true ? true : U extends true ? true : false;

export type IsDecimal<T extends number> = `${T}` extends `${number}.${number}` ? true : false;

export type TupleBuilder<TLength extends Int, TExisting extends readonly unknown[] = []> = IsDecimal<TLength> extends true
    ? []
    : Length<TExisting> extends TLength
    ? TExisting
    : TupleBuilder<TLength, [...TExisting, unknown]>;

export type Equals<T extends number, U extends number> = T extends U ? (U extends T ? true : false) : false;

export type IsGreaterThanOrEqual<T extends Int, U extends Int> = Equals<T, U> extends true
    ? true
    : `${Subtract<T, U>}` extends `-${number}`
    ? false
    : true;

export type IsGreater<T extends Int, U extends Int> = Equals<T, U> extends true
    ? false
    : `${Subtract<T, U>}` extends `-${number}`
    ? false
    : true;

export type IsLessThanOrEqual<T extends Int, U extends Int> = Equals<T, U> extends true
    ? true
    : `${Subtract<T, U>}` extends `-${number}`
    ? true
    : false;

export type IsLessThan<T extends Int, U extends Int> = Equals<T, U> extends true
    ? false
    : `${Subtract<T, U>}` extends `-${number}`
    ? true
    : false;

/**
 * Flips the sign of an integer.
 */
export type Flip<T extends Int> = T extends 0 ? 0 : `${T}` extends `-${infer R}` ? ParseStringToInt<R> : ParseStringToInt<`-${T}`>;

/**
 * Parses a string into an integer. If the string is not an integer, it returns 0.
 */
export type ParseStringToInt<T extends string> = T extends `${Int}` ? (T extends `${infer N extends Int}` ? N : 0) : 0;

export type Add<T extends Int, U extends Int> = Or<IsDecimal<T>, IsDecimal<U>> extends true ? 0 : Length<[...TupleBuilder<T>, ...TupleBuilder<U>]>;
export type Subtract<T extends Int, U extends Int> = Equals<T, U> extends true
    ? 0
    : TupleBuilder<T> extends [...TupleBuilder<U>, ...infer R]
    ? Length<R>
    : Flip<Subtract<U, T>>;

export type Multiply<T extends Int, U extends Int> = Equals<T, 0> extends true
    ? 0
    : Equals<U, 0> extends true
    ? 0
    : Equals<T, 1> extends true
    ? U
    : Equals<U, 1> extends true
    ? T
    : Add<T, Multiply<T, Subtract<U, 1>>>;

export type Divide<T extends Int, U extends Int> = Equals<T, 0> extends true
    ? 0
    : Equals<U, 0> extends true
    ? 0
    : Equals<T, U> extends true
    ? 1
    : Equals<U, 1> extends true
    ? T
    : IsLessThan<T, U> extends true
    ? 0
    : Add<1, Divide<Subtract<T, U>, U>>;

export type Modulo<T extends Int, U extends Int> = Subtract<T, Multiply<Divide<T, U>, U>>;

export type Power<T extends Int, U extends Int> = Equals<U, 0> extends true ? 1 : Multiply<T, Power<T, Subtract<U, 1>>>;

export type Absolute<T extends Int> = `${T}` extends `-${infer R}` ? ParseStringToInt<R> : T;

export type Min<T extends Int, U extends Int> = IsLessThan<T, U> extends true ? T : U;

export type Max<T extends Int, U extends Int> = IsLessThan<T, U> extends true ? U : T;

export type Truncate<T extends number> = `${T}` extends `${infer R}.${number}` ? ParseStringToInt<R> : T;

export namespace tests {
    export type TestLength = Length<[1, 2, 3, 4, 5]>;
    //   ^?
    export type TestOr = Or<true, false>;
    //   ^?
    export type TestIsDecimal = IsDecimal<1.5>;
    //   ^?
    export type TestTupleBuilder = TupleBuilder<5>;
    //   ^?
    export type TestEquals = Equals<5, 5>;
    //   ^?
    export type TestIsGreaterThanOrEqual = IsGreaterThanOrEqual<5, 5>;
    //   ^?
    export type TestIsGreater = IsGreater<5, 5>;
    //   ^?
    export type TestIsLessThanOrEqual = IsLessThanOrEqual<5, 5>;
    //   ^?
    export type TestIsLessThan = IsLessThan<5, 5>;
    //   ^?
    export type TestFlip = Flip<5>;
    //   ^?
    export type TestParseStringToInt = ParseStringToInt<'5'>;
    //   ^?
    export type TestAdd = Add<5, 3>;
    //   ^?
    export type TestSubtract = Subtract<5, 2>;
    //   ^?
    export type TestSubtractNegative = Subtract<2, 5>;
    //   ^?
    export type TestMultiply = Multiply<5, 5>;
    //   ^?
    export type TestDivide = Divide<5, 2>;
    //   ^?
    export type TestModulo = Modulo<5, 2>;
    //   ^?
    export type TestPower = Power<4, 2>;
    //   ^?
    export type TestAbsolute = Absolute<-5>;
    //   ^?
    export type TestMin = Min<5, 2>;
    //   ^?
    export type TestMax = Max<5, 2>;
    //   ^?
    export type TestTruncate = Truncate<5.5>;
    //   ^?
}
