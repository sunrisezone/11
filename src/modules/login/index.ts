import { authenticator } from "otplib";
import { Module, Page } from "../_module";

const login = new Module();

login.parameters = [
    {
        name: "username",
        required: true,
    },
    {
        name: "password",
        required: true,
    },
    {
        name: "twofa",
        required: false,
    },
    {
        name: "login_max_attempts",
        required: false,
    },
];

login.run = async ({ page, params, logger }) => {
    const log = (...args: any[]) => logger.log("\u001b[95m[登入]\u001b[m", ...args);
    const error = (...args: any[]) => logger.error("\u001b[95m[登入]\u001b[m", ...args);

    let success = false;
    log(`開始執行帳號登入程序`);
    await page.goto("https://www.gamer.com.tw/").catch(error);
    await page.waitForTimeout(1000);

    const max_attempts = +params.login_max_attempts || 3;
    for (let attempts = 0; attempts < max_attempts; attempts++) {
        try {
            log("正在檢測登入狀態");
            await page.goto("https://www.gamer.com.tw/");
            await page.waitForSelector("#topBar_more");
            await page.waitForTimeout(100);

            const not_login_signal = await page.$("div.TOP-my.TOP-nologin");
            if (not_login_signal) {
                log("登入狀態: 未登入");

                await page.goto("https://user.gamer.com.tw/login.php").catch(error);
                log("嘗試登入中");
                if (!params.username || !params.password) throw new Error("帳號或密碼不能為空");
                await page.$eval("input.form-control[type=text]", (elm: HTMLInputElement) => (elm.value = "")).catch(error);
                await page.$eval("input.form-control[type=password]", (elm: HTMLInputElement) => (elm.value = "")).catch(error);
                await page.type("input.form-control[type=text]", params.username, { delay: 101 }).catch(error);
                await page.waitForTimeout(500);
                await page.type("input.form-control[type=password]", params.password, { delay: 101 }).catch(error);
                await page.waitForTimeout(1000);
                await check2FA(page, params, error, log);
                await page.waitForTimeout(500);
                await page.click("a#btn-login").catch(error);
                await page.waitForTimeout(3000);

                if (attempts > 0) log("已嘗試登入，重新檢測登入狀態");
            } else {
                log("登入狀態: 已登入");
                success = true;
                break;
            }
        } catch (err) {
            error(err);
            error("登入時發生錯誤，重新嘗試中");
        }
    }

    log(`帳號登入程序已完成`);

    return { success };
};

async function check2FA(
    page: Page,
    params: { twofa: string },
    error: (...args: any[]) => void,
    log: { (...args: any[]): void; (arg0: string): void },
): Promise<void> {
    let twoFA = await page.$("[name=twoStepAuth][required]");
    if (twoFA) {
        log("有啟用 2FA");
        if (!params.twofa) throw new Error("未提供 2FA 種子碼");
        const code = authenticator.generate(params.twofa);
        await page.type("[name=twoStepAuth]", code, { delay: 10 }).catch(error);
        return;
    } else {
        log("沒有啟用 2FA");
        return;
    }
}

export default login;
