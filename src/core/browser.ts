import EventEmitter from "events";
import playwright from "playwright";
import Logger from "./logger";
import type { BrowserType, BrowserConfig } from "./types";

const BRWOSER_TYPES = ["chromium", "firefox", "webkit"];

const DEFAULT_BROWSER_CONFIG: BrowserConfig = {
    headless: true,
    firefoxUserPrefs: {
        "dom.webaudio.enabled": false,
        "media.volume_scale": 0,
    },
};

class Browser extends EventEmitter {
    private browser: playwright.Browser = null;
    private context: playwright.BrowserContext = null;
    private user_agent: string = "";

    constructor(public browser_type: BrowserType, public browser_config: BrowserConfig, private logger: Logger = null) {
        super();
        if (!BRWOSER_TYPES.includes(browser_type)) {
            browser_type = "firefox";
        }

        this.setup();
    }

    info(...arg: any[]) {
        if (this.logger) {
            this.logger.info(...arg);
        }
    }

    async setup() {}

    async launch(): Promise<this> {
        if (!this.browser) {
            this.info("使用瀏覽器", this.browser_type);

            const target = playwright[this.browser_type];

            this.browser = await target.launch({
                ...DEFAULT_BROWSER_CONFIG,
                ...this.browser_config,
            });

            this.emit("launched", this.browser);
        }

        if (!this.context) {
            const temp_page = await this.browser.newPage();
            this.user_agent = (await temp_page.evaluate(() => navigator.userAgent)).replace("Headless", "") + " BA/1";
            await temp_page.close();

            this.info("User-Agent:", this.user_agent);

            this.context = await this.browser.newContext({ userAgent: this.user_agent });

            this.emit("context_created", this.context);
        }

        return this;
    }

    async close(): Promise<this> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.context = null;
            this.user_agent = "";

            this.emit("closed");
        }
        return this;
    }

    async new_page(): Promise<playwright.Page> {
        if (!this.context) throw new Error("No Context.");

        const page = await this.context.newPage();

        this.emit("new_page", page);

        return page;
    }
}

export default Browser;
