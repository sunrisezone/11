import Logger from "./logger";
import type { Page, LaunchOptions } from "playwright";

export type BrowserType = "firefox" | "chromium" | "webkit";

export interface BrowserConfig extends LaunchOptions {
    /**
     * 瀏覽器種類
     */
    type?: BrowserType;
}

export interface BahamutAutomationConfig {
    /**
     * 依序執行的內建模組名稱，或為外部模組的絕對路徑
     */
    modules: string[];

    /**
     * 各模組參數聯合參數池
     */
    params: { [key: string]: any };

    /**
     * 自動化實體使用之瀏覽器的啟動設定
     */
    browser: BrowserConfig;
}

export interface ModuleParams {
    name: string;
    required?: boolean;

    [key: string]: any;
}

export interface Module {
    parameters: ModuleParams[];

    run({ page, outputs, params, logger }: { page: Page; outputs: any; params: any; logger: Logger }): Promise<any>;
}
