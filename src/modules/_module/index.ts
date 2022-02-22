import { IModule, IModuleParams, ILogger, Page } from "./types";

class Module implements IModule {
    parameters: IModuleParams[] = [];

    run({ page, outputs, params, logger }: { page: Page; outputs: any; params: any; logger: ILogger }): Promise<any> {
        throw new Error("Module not implemented.");
    }
}

export default Module;
export { Module, IModuleParams, ILogger, Page };
