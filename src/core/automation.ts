process.env.TZ = "Asia/Taipei";

import fs from "fs";
import path from "path";
import EventEmitter from "events";
import countapi from "countapi-js";
import Logger from "./logger";
import Browser from "./browser";
import { sleep } from "./utils";
import type { BahamutAutomationConfig, BrowserConfig, Module } from "./types";

const VERSION = get_version();

function get_version(): string {
    try {
        let depth = 5;
        let package_path = path.resolve(__dirname, "package.json");
        while (!fs.existsSync(package_path) && depth-- > 0) {
            package_path = path.resolve(path.dirname(package_path), "..", "package.json");
        }
        return require(package_path).version;
    } catch (err) {
        return "";
    }
}

class BahamutAutomation extends EventEmitter {
    /**
     * 可以使用內建模組或自訂模組 (絕對路徑)
     *
     * @name 套用模組
     */
    modules: string[];

    /**
     * 依照使用模組所需的參數，設定參數
     *
     * @name 模組參數
     */
    params: { [key: string]: any };

    /**
     * 可以設定瀏覽器的種類、偏好等，基本上與 [Playwright 的 LaunchOptions](https://playwright.dev/docs/api/class-browsertype#browser-type-launch) 類似，但加上了 `type` 參數作為瀏覽器的類型
     *
     * @name 瀏覽器設定
     */
    browser_config: BrowserConfig;

    private logger: Logger = new Logger();
    private start_time: number = null;
    private end_time: number = null;
    private browser: Browser;

    /**
     * 建立巴哈姆特自動化實體
     * @param automation_config
     */
    constructor({ modules = [], params = {}, browser = {} }: BahamutAutomationConfig) {
        super();

        this.browser_config = browser;
        this.modules = modules;
        this.params = params;

        this.setup();
    }

    setup(): void {
        const self = this;
        this.on("start", () => {
            self.log("開始執行巴哈姆特自動化 " + VERSION);
            countapi.update("Bahamut-Automation", "run", 1);
        });

        this.on("module_start", (module_name: string, module_path: string) => {
            self.log(`執行 ${module_name} 模組 (${module_path})`);
        });

        this.on("module_loaded", (module_name: string, module: Module) => {
            self.log(`參數: ${module.parameters.map(({ name, required }) => ` ${name}${required ? "*" : ""}`).join(" ") || "無"}`);
        });

        this.on("module_finished", (module_name: string) => {
            self.log(`模組 ${module_name} 執行完畢\n`);
        });

        this.on("module_failed", (module_name: string, err: Error) => {
            self.logger.error(`模組 ${module_name} 執行失敗\n`);
            self.logger.error(err);
        });

        this.on("finished", (outputs: any, time: number) => {
            self.log("巴哈姆特自動化執行完畢");
            self.log(`執行時間: ${second_to_time(time)}`);
            self.log("輸出:", outputs);
        });

        this.on("fatal", (err: Error) => {
            self.logger.error("巴哈姆特自動化執行失敗");
            self.logger.error(err);

            if (self.browser) {
                self.browser.close();
            }
        });
    }

    async run(): Promise<any> {
        try {
            this.start_time = Date.now();

            this.emit("start");

            this.browser = new Browser(this.browser_config.type || "firefox", this.browser_config, this.logger);
            await this.browser.launch();

            this.emit("browser_opened");

            const outputs: any = {};

            for (let module_name of this.modules) {
                try {
                    const is_custom_module = path.isAbsolute(module_name);
                    const module_path = path.resolve(__dirname, "../modules", module_name);

                    module_name = path.basename(module_name);

                    this.emit("module_start", module_name, is_custom_module ? module_path : "Built-in");

                    const module: Module = require(module_path).default || require(module_path);

                    this.emit("module_loaded", module_name, module);

                    const module_page = await this.browser.new_page();

                    const module_params: any = {};
                    for (const { name, required } of module.parameters) {
                        if (this.params[name] !== undefined) {
                            module_params[name] = this.params[name];
                        } else if (required) {
                            await module_page.close();
                            this.emit("module_parameter_error", module_name, name);
                            throw new Error(`模組 ${module_name} 所必須之 ${name} 參數不存在`);
                        }
                    }

                    outputs[module_name] = await module.run({
                        page: module_page,
                        outputs: outputs,
                        params: module_params,
                        logger: this.logger.next(),
                    });

                    await module_page.close();

                    this.emit("module_finished", module_name);
                } catch (err) {
                    this.emit("module_failed", module_name, err);
                }

                await sleep(1000);
            }

            await this.browser.close();

            this.end_time = Date.now();

            const time = Math.floor((this.end_time - this.start_time) / 1000);

            this.emit("finished", JSON.parse(JSON.stringify(outputs)), time);

            return { outputs: JSON.parse(JSON.stringify(outputs)), time };
        } catch (err) {
            this.emit("fatal", err);
            return null;
        }
    }

    private log(...arg: any[]): void {
        this.logger.log(...arg);
        this.emit("log", ...arg);
    }
}

function second_to_time(second: number): string {
    const hour = Math.floor(second / 3600);
    const minute = Math.floor((second - hour * 3600) / 60);
    const second_left = second - hour * 3600 - minute * 60;

    return `${hour} 小時 ${minute} 分 ${second_left} 秒`;
}

export default BahamutAutomation;
