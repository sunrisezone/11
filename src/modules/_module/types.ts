import type { Page } from "playwright";

interface ILogger {
    space: number;
    prefix: string;

    next(): ILogger;

    log(...msg: any[]): void;

    error(...msg: any[]): void;

    warn(...msg: any[]): void;

    info(...msg: any[]): void;

    debug(...msg: any[]): void;
}

interface IModuleParams {
    name: string;
    required?: boolean;

    [key: string]: any;
}

interface IModule {
    parameters: IModuleParams[];

    run({ page, outputs, params, logger }: { page: Page; outputs: any; params: any; logger: ILogger }): Promise<any>;
}

export { IModule, IModuleParams, ILogger, Page };
