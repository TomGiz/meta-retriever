export enum LogLevel {
    Trace = 1,
    Debug = 2,
    Info = 3,
    Warning = 4,
    Error = 5,
    Fatal = 6,
}
export default interface Logger {
    setLogLevel(lvl: LogLevel): void;
    trace(message: string): void;
    info(message: string): void;
}