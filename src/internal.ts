export function hasFunctionWithArity<T, Params extends readonly unknown[], K extends string>(object: T, name: K, arity: number): object is T & {K: (...args: Params) => unknown} {
    return (
        object !== null &&
        object !== undefined &&
        typeof object === "object" &&
        name in object &&
        typeof (object as unknown as Record<string, (...args: Params[]) => unknown>)[name] === "function" &&
        (object as unknown as Record<string, (...args: Params[]) => unknown>)[name].length === arity
    );
}
