import Logger, { LogLevel } from "./logger";

export class ConsoleLogger implements Logger {
    private _level : LogLevel = LogLevel.Trace;
    setLogLevel(lvl: LogLevel): void {
        this._level = lvl;
    }
    trace(message: string): void {
        this.log(message, LogLevel.Trace);
    }
    info(message: string): void {
        this.log(message, LogLevel.Info);
    }
    private log(message: string, lvl: LogLevel): void {
        if (this._level > lvl) return;
        console.log(message)
    }
}

