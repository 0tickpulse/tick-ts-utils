import { Optional } from "../index.js";
import { Queue } from "./queue.js";
import { Stack } from "./stack.js";

/**
 * A graph is a data structure that consists of a finite (and possibly mutable) set of vertices or nodes or points, together with a set of unordered pairs of these vertices for an undirected graph or a set of ordered pairs for a directed graph.
 * These pairs are known as edges, arcs, or lines for an undirected graph and as arrows, directed edges, directed arcs, or directed lines for a directed graph. The vertices may be part of the graph structure, or may be external entities represented by integer indices or references.
 * Graphs are one of the prime objects of study in discrete mathematics.
 * This class allows the developer to model a graph using a simple adjacency list. It is not intended to be a fully-featured graph library, but rather a simple way to model a graph for use in algorithms.
 * It supports directed and undirected graphs, and allows the developer to specify the type of the vertices and edges.
 *
 * @example
 * ```ts
 * const currencies = new Graph<string, number>();
 * currencies.addVertex("USD");
 * currencies.addVertex("EUR");
 * currencies.addVertex("GBP");
 * currencies.addVertex("JPY");
 * currencies.addEdge("USD", "EUR", 0.85);
 * currencies.addEdge("USD", "GBP", 0.75);
 * currencies.addEdge("USD", "JPY", 110);
 * const eurValue = 3;
 * const edges = currencies.shortestPath("USD", "EUR");
 * ```
 *
 * @category Data Structures
 */
export class Graph<TVertex, TEdge = never> {
    #vertices = new Set<TVertex>();
    /**
     * The edges of the graph. The key is the vertex, and the value is a map of the edges from that vertex.
     * The key of the inner map is the vertex that the edge is going to, and the value is the edge.
     */
    #edges = new Map<TVertex, Map<TVertex, TEdge>>();
    constructor(public readonly directed = true) {}
    /**
     * Adds a vertex to the graph.
     *
     * @param vertex The vertex to add.
     * @returns `true` if the vertex was added, `false` if it was already in the graph.
     */
    addVertex(vertex: TVertex): boolean {
        if (this.#vertices.has(vertex)) {
            return false;
        }
        this.#vertices.add(vertex);
        this.#edges.set(vertex, new Map());
        return true;
    }

    /**
     * Adds an edge to the graph.
     *
     * @param from  The vertex to add the edge from.
     * @param to    The vertex to add the edge to.
     * @param value The value of the edge.
     * @returns `true` if the edge was added, `false` if it was already in the graph.
     */
    addEdge(from: TVertex, to: TVertex, value: TEdge): boolean {
        if (!this.#vertices.has(from) || !this.#vertices.has(to)) {
            throw new Error("Cannot add an edge to a vertex that is not in the graph.");
        }
        if (this.#edges.get(from)?.has(to)) {
            return false;
        }
        this.#edges.get(from)?.set(to, value);
        if (!this.directed) {
            this.#edges.get(to)?.set(from, value);
        }
        return true;
    }

    /**
     * Adds an non-directed edge to the graph. This is equivalent to calling `addEdge` twice, once for each vertex.
     *
     * @param vertex1 The vertex to add the edge from.
     * @param vertex2 The vertex to add the edge to.
     * @param value   The value of the edge.
     */
    addUndirectedEdge(vertex1: TVertex, vertex2: TVertex, value: TEdge): void {
        this.addEdge(vertex1, vertex2, value);
        this.addEdge(vertex2, vertex1, value);
    }

    /**
     * Removes a vertex from the graph.
     *
     * @param vertex The vertex to remove.
     * @returns `true` if the vertex was removed, `false` if it was not in the graph.
     */
    removeVertex(vertex: TVertex): boolean {
        if (!this.#vertices.has(vertex)) {
            return false;
        }
        this.#vertices.delete(vertex);
        this.#edges.delete(vertex);
        for (const edges of this.#edges.values()) {
            edges.delete(vertex);
        }
        return true;
    }

    /**
     * Removes an edge from the graph.
     *
     * @param from The vertex to remove the edge from.
     * @param to   The vertex to remove the edge to.
     * @returns `true` if the edge was removed, `false` if it was not in the graph.
     * @throws An error if either vertex is not in the graph.
     */
    removeEdge(from: TVertex, to: TVertex): boolean {
        if (!this.#vertices.has(from) || !this.#vertices.has(to)) {
            throw new Error("Cannot remove an edge to a vertex that is not in the graph.");
        }
        if (!this.#edges.get(from)?.has(to)) {
            return false;
        }
        this.#edges.get(from)?.delete(to);
        if (!this.directed) {
            this.#edges.get(to)?.delete(from);
        }
        return true;
    }

    /**
     * Removes an non-directed edge from the graph. This is equivalent to calling `removeEdge` twice, once for each vertex.
     *
     * @param vertex1 The vertex to remove the edge from.
     * @param vertex2 The vertex to remove the edge to.
     * @returns `true` if the edge was removed, `false` if it was not in the graph.
     * @throws An error if either vertex is not in the graph.
     */
    removeUndirectedEdge(vertex1: TVertex, vertex2: TVertex): boolean {
        return this.removeEdge(vertex1, vertex2) && this.removeEdge(vertex2, vertex1);
    }

    /**
     * Gets the value of an edge.
     *
     * @param from The vertex to get the edge from.
     * @param to   The vertex to get the edge to.
     */
    getEdgeValue(from: TVertex, to: TVertex): Optional<TEdge> {
        return Optional.of(this.#edges.get(from)?.get(to));
    }

    /**
     * Gets the vertices in the graph.
     */
    get vertices(): IterableIterator<TVertex> {
        return this.#vertices.values();
    }

    /**
     * Gets the edges in the graph.
     */
    get edges(): IterableIterator<[TVertex, TVertex, TEdge]> {
        const result: [TVertex, TVertex, TEdge][] = [];
        for (const [from, edges] of this.#edges) {
            for (const [to, value] of edges) {
                result.push([from, to, value]);
            }
        }
        return result.values();
    }

    /**
     * Performs a breadth-first search on the graph.
     *
     * @param start   The vertex to start the search from.
     * @param visitor A function that is called for each vertex as it is visited.
     *                This visitor function should return `true` or nothing to continue the search, or `false` to stop the search.
     * @throws An error if the start vertex is not in the graph.
     */
    breadthFirstSearch(start: TVertex, visitor: (vertex: TVertex, edge: Optional<TEdge>) => boolean | void): void {
        if (!this.#vertices.has(start)) {
            throw new Error("Cannot start a breadth-first search from a vertex that is not in the graph.");
        }
        const visited = new Set<TVertex>();
        const queue: [TVertex, Optional<TEdge>][] = [[start, Optional.empty()]];
        while (queue.length > 0) {
            console.log(queue);
            const [vertex, edge] = queue.shift()!;
            if (visited.has(vertex)) {
                console.log("skipping", vertex);
                continue;
            }
            if (visitor(vertex, edge) === false) {
                console.log("stopping");
                return;
            }
            visited.add(vertex);
            console.log("visiting", vertex);
            console.log(this.#edges);
            for (const [to, value] of this.#edges.get(vertex) ?? []) {
                queue.push([to, Optional.of(value)]);
            }
        }
    }

    /**
     * Performs a depth-first search on the graph.
     * This is a recursive implementation that uses a stack to keep track of the current path.
     *
     * @param start   The vertex to start the search from.
     * @param visitor A function that is called for each vertex as it is visited.
     *                This visitor function should return `true` or nothing to continue the search, or `false` to stop the search.
     * @throws An error if the start vertex is not in the graph.
     */
    depthFirstSearch(start: TVertex, visitor: (vertex: TVertex, edge: Optional<TEdge>) => boolean | void): void {
        if (!this.#vertices.has(start)) {
            throw new Error("Cannot start a depth-first search from a vertex that is not in the graph.");
        }
        const visited = new Set<TVertex>();
        const stack: [TVertex, Optional<TEdge>][] = [[start, Optional.empty()]];
        while (stack.length > 0) {
            const [vertex, edge] = stack.pop()!;
            if (visited.has(vertex)) {
                continue;
            }
            if (visitor(vertex, edge) === false) {
                return;
            }
            visited.add(vertex);
            for (const [to, value] of this.#edges.get(vertex) ?? []) {
                stack.push([to, Optional.of(value)]);
            }
        }
    }

    toString() {
        let result = "Graph {\n";
        for (const [from, edges] of this.#edges) {
            for (const [to, value] of edges) {
                result += `    ${from} -> ${to} (${value})\n`;
            }
        }
        result += "}";
        return result;
    }
}
const currencies = new Graph<string, number>();
currencies.addVertex("USD");
currencies.addVertex("EUR");
currencies.addVertex("GBP");
currencies.addVertex("JPY");
currencies.addUndirectedEdge("USD", "EUR", 0.85);
currencies.addUndirectedEdge("USD", "GBP", 0.75);
currencies.addUndirectedEdge("USD", "JPY", 110);
const eurValue = 3;
let temp = eurValue;
const vertices = [];
console.log(currencies.toString());
// convert to GBP
console.log(`${eurValue} EUR = ${temp} GBP`);
