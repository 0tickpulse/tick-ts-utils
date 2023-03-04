import { emphasize } from "emphasize";
import { access, readFile } from "fs/promises";
import StackTrace, { StackFrame } from "stacktrace-js";
import { fileURLToPath } from "url";
import { appendFile, mkdir, writeFile, stat, rm } from "fs/promises";
import { Optional, foregroundColor, codes } from "../index.js";
import { format } from "util";

type LogLevel = "info" | "warn" | "error" | "debug";

/**
 * An experimental logger that logs to a given output stream as well as - optionally - a file.
 * Every log message has a timestamp and a log level.
 *
 * @category Logging
 */
export class Logger {
    #logPath: Optional<string> = Optional.empty();
    #hasCheckedPath = false;
    #outputStream: NodeJS.WritableStream = process.stdout;

    levels: Record<LogLevel, Record<"color" | "prefix", string>> = {
        error: { color: foregroundColor(255, 0, 0), prefix: foregroundColor(255, 0, 0) + codes.bold + "ERROR " + codes.intensityReset },
        info: { color: foregroundColor(0, 255, 0), prefix: foregroundColor(0, 255, 0) + codes.bold + "INFO " + codes.reset },
        warn: { color: foregroundColor(255, 255, 0), prefix: foregroundColor(255, 255, 0) + codes.bold + "WARN  " + codes.reset },
        debug: { color: foregroundColor(128, 128, 128), prefix: foregroundColor(128, 128, 128) + codes.bold + "DEBUG " + codes.reset },
    };

    async #replaceFile() {
        const path = this.#logPath.get();
        const contents = await readFile(path, "utf-8");
        const lines = contents.split(/\r?\n/);
        const firstLine = lines[0];
        if (firstLine.startsWith("#logtime=")) {
            const time = firstLine.substring("#logtime=".length);
            // put the contents into a new file called <logtime>.log
            // and then discard the old file
            const newLogPath = path.substring(0, path.lastIndexOf("/")) + "/" + time + ".log";
            await rm(path);
            await writeFile(newLogPath, contents);
        }
    }

    async #createIfNotPresent() {
        if (this.#hasCheckedPath) {
            return;
        }
        this.#hasCheckedPath = true;
        if (this.#logPath.isEmpty()) {
            return;
        }
        const path = this.#logPath.get();
        const dir = path.substring(0, path.lastIndexOf("/"));

        const dirExists = await stat(dir);
        if (!dirExists) {
            await mkdir(dir, { recursive: true });
        }
        await this.#replaceFile();
    }

    /**
     * Sets the log path to the given path.
     * Note that this will create the log file if it doesn't exist.
     *
     * @param s The path to the log file.
     * @returns The object itself for method chaining.
     */
    async setLogPath(s: string) {
        this.#hasCheckedPath = false;
        this.#logPath = Optional.of(s);

        if (await this.pathExists()) {
            await this.#replaceFile();
        }

        await this.#write(`#logtime=${new Date().toISOString()}`);
        return this;
    }

    get logPath() {
        return this.#logPath;
    }

    /**
     * Sets the output stream of the logger to the given stream.
     *
     * @param stream The stream to write to.
     * @returns The object itself for method chaining.
     */
    setOutputStream(stream: NodeJS.WritableStream) {
        this.#outputStream = stream;
        return this;
    }

    get outputStream() {
        return this.#outputStream;
    }

    async pathExists() {
        if (this.#logPath.isEmpty()) {
            return false;
        }
        const result = await access(this.#logPath.get())
            .then(() => true)
            .catch(() => false);
        return result;
    }

    /**
     * Writes the given string to the log file. Should not be used directly.
     *
     * @param s The string to write.
     */
    async #write(s: string) {
        await this.#createIfNotPresent();
        this.#logPath.ifPresent(async (f) => await appendFile(f, s + "\n"));
    }

    /**
     * Logs a message with the given log level, making use of [util.format](https://nodejs.org/api/util.html#util_util_format_format_args) to format the message with the given arguments.
     *
     * @param level   The log level.
     * @param message The message to log.
     * @param args    The arguments to format the message with. See [util.format](https://nodejs.org/api/util.html#util_util_format_format_args).
     * @returns The object itself for method chaining.
     */
    log<T>(level: LogLevel, message: T, ...args: unknown[]) {
        const date = new Date();
        // format time as HH:MM:SS
        const time = this.#formatDate(date);
        const formattedMessage = `${time} ${this.levels[level].prefix}${format(message, ...args)}${codes.reset}`;
        this.#outputStream.write(formattedMessage + "\n");
        this.#write(formattedMessage);
        return this;
    }

    /**
     * Logs a message along with a given Error object.
     * This will log the error message (with level "error"), the stack trace, and the source code of the line where the error occurred.
     * Should not be awaited.
     *
     * @param message The message to log.
     * @param error   The error to log.
     * @returns The object itself for method chaining.
     */
    async logError(message: string, error: Error) {
        const stacks = await StackTrace.fromError(error);
        this.log(
            "error",
            message +
                `\n${INDENT}${this.levels.debug.color}Raw error: ${error.message}` +
                "\n" +
                (await this.#getSourceLine(stacks[0])) +
                "\n" +
                stacks.map(this.#formatLine).join("\n"),
        );
        return this;
    }

    #formatDate(date: Date) {
        // YYYY-MM-DD HH:MM:SS
        return `${date.getFullYear()}-${date.getMonth().toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
            .getHours()
            .toString()
            .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
    }

    async #getSourceLine(frame: StackFrame) {
        const { fileName, lineNumber } = frame;
        if (!fileName || !lineNumber) {
            return "(No source)";
        }
        let filePath = fileName;
        try {
            filePath = fileURLToPath(fileName);
        } catch (e) {
            // ignore
        }
        const file = emphasize.highlight("typescript", await readFile(filePath, "utf-8")).value;
        const lines = file.split(/\r?\n/);
        // get line up to 2 lines before and after
        const start = Math.max(0, lineNumber - 1 - 3);
        const end = Math.min(lines.length, lineNumber - 1 + 3);
        const slicedLines = lines.slice(start, end);

        // format:
        //          (unimportant)lineNo (white)| line

        const resultLines: string[] = [];
        for (let i = 0; i < slicedLines.length; i++) {
            const isImportant = lineNumber - 1 === start + i;
            const line = slicedLines[i];
            const lineNo = (start + i + 1).toString().padStart(3, " ");
            const lineColor = isImportant ? this.levels.error.color : this.levels.debug.color;
            resultLines.push(codes.reset + INDENT + lineColor + lineNo + codes.reset + " | " + line);
            if (isImportant && frame.columnNumber !== undefined) {
                const arrow = " ".repeat(INDENT.length + lineNo.length + 3 + frame.columnNumber - 1) + this.levels.error.color + "^^^";
                resultLines.push(arrow + codes.reset + " HERE");
            }
        }

        return resultLines.join("\n");
    }

    #formatLine(frame: StackFrame) {
        const call = INDENT + this.levels.debug.color + "at " + this.levels.error.color + frame.functionName ?? "anonymous";

        const file =
            this.levels.debug.color +
            " (" +
            this.levels.error.color +
            (frame.fileName ?? "unknown").replace(/\/+/g, `${this.levels.debug.color}$&${this.levels.error.color}`) +
            this.levels.debug.color +
            ":" +
            this.levels.error.color +
            (frame.lineNumber ?? "?") +
            this.levels.debug.color +
            ":" +
            this.levels.error.color +
            (frame.columnNumber ?? "?") +
            this.levels.debug.color +
            ")" +
            codes.reset;

        return call + file;
    }
}

const INDENT = " ".repeat(20);
