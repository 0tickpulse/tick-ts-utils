import { z } from "zod";
import { Result } from "../resultsAndOptionals/results.js";

/**
 * An implementation of a type-safe fetch making use of the Zod library for validation.
 * This function will return a {@link Result} object, which can be used to check if the request was successful and that the validation was successful.
 *
 * @example
 * ```ts
 * // This example makes use of jsonplaceholder.typicode.com, which is a fake online REST API for testing and prototyping.
 * const data = await fetchWithZod("https://jsonplaceholder.typicode.com/todos/1", z.object({
 *     userId: z.number(),
 *     id: z.number(),
 *     title: z.string(),
 *     completed: z.boolean(),
 * }));
 * expect(data.get()).toEqual({
 *     userId: 1,
 *     id: 1,
 *     title: "delectus aut autem",
 *     completed: false,
 * });
 * ```
 *
 * @param url    The URL to fetch.
 * @param schema The schema to validate the response against.
 * @returns A {@link Result} object containing the parsed data if the request was successful and the validation was successful, or the ZodError if either of those failed.
 * @category Typeguarding
 */
export async function fetchWithZod<T>(url: string, schema: z.ZodSchema<T>): Promise<Result<T, z.ZodError>>;
/**
 * An implementation of a type-safe fetch making use of the Zod library for validation.
 * This overload of the function allows you to pass in a {@link RequestInit} object, which can be used to configure the request.
 *
 * @param url    The URL to fetch.
 * @param init   The {@link RequestInit} object to configure the request.
 * @param schema The schema to validate the response against.
 * @returns A {@link Result} object containing the parsed data if the request was successful and the validation was successful, or the ZodError if either of those failed.
 * @category Typeguarding
 */
export async function fetchWithZod<T>(url: string, init: RequestInit, schema: z.ZodSchema<T>): Promise<Result<T, z.ZodError>>;
export async function fetchWithZod<T>(url: string, arg2: z.ZodSchema<T> | RequestInit, arg3?: z.ZodSchema<T>): Promise<Result<T, z.ZodError>> {
    const schema = arg3 ?? (arg2 as z.ZodSchema<T>);
    const init = arg3 ? (arg2 as RequestInit) : undefined;
    return fetch(url, init)
        .then((response) => response.json())
        .then((data) => {
            try {
                return Result.ok<T, z.ZodError>(schema.parse(data));
            } catch (error) {
                return Result.error<T, z.ZodError>(error as z.ZodError);
            }
        });
}
