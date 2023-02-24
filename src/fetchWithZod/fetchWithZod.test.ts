import { fetchWithZod } from "./fetchWithZod.js";
import { z } from "zod";

test("fetchWithZod test", async () => {
    const todoSchema = z.object({
        userId: z.number(),
        id: z.number(),
        title: z.string(),
        completed: z.boolean(),
    });
    const data = await fetchWithZod("https://jsonplaceholder.typicode.com/todos/1", todoSchema);
    expect(data.get()).toEqual({
        userId: 1,
        id: 1,
        title: "delectus aut autem",
        completed: false,
    });
});

test("fetchWithZod fail test", async () => {
    const todoSchema = z.object({
        userId: z.number(),
        id: z.string(),
        title: z.string(),
        completed: z.boolean(),
    });
    const data = await fetchWithZod("https://jsonplaceholder.typicode.com/todos/1", todoSchema);
    expect(data.isError()).toEqual(true);
});
