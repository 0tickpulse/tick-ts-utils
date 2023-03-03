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
export async function fetchWithZod<T>(url: string, schema: z.ZodSchema<T>): Promise<Result<T, z.ZodError>> {
    return fetch(url)
        .then((response) => response.json())
        .then((data) => {
            try {
                return Result.ok<T, z.ZodError>(schema.parse(data));
            } catch (error) {
                return Result.error<T, z.ZodError>(error as z.ZodError);
            }
        });
}
