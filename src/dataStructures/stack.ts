export class Stack<T> {
    #items: T[] = [];
    push(item: T): void {
        this.#items.push(item);
    }
    pop(): T | undefined {
        return this.#items.pop();
    }
    peek(): T | undefined {
        return this.#items[this.#items.length - 1];
    }
    get length(): number {
        return this.#items.length;
    }
    isEmpty(): boolean {
        return this.#items.length === 0;
    }
    [Symbol.iterator](): Iterator<T> {
        return this.#items[Symbol.iterator]();
    }
}
