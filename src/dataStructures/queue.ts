export class Queue<T> {
    #items: T[] = [];
    add(item: T): void {
        this.#items.push(item);
    }
    remove(): T | undefined {
        return this.#items.shift();
    }
    peek(): T | undefined {
        return this.#items[0];
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
