import Logger, { LogLevel } from "./logger";


export class NullLogger implements Logger {
    setLogLevel(lvl: LogLevel): void {
    }
    trace(message: string): void {
    }
    info(message: string): void {
    }
}
