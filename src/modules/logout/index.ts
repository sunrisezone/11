import { Module } from "../_module";

const logout = new Module();

logout.parameters = [];

logout.run = async ({ page, outputs, logger }) => {
    const log = (...args: any[]) => logger.log("\u001b[95m[登出]\u001b[m", ...args);

    if (!outputs.login || !outputs.login.success) throw new Error("使用者未登入，無需登出");

    log(`開始執行帳號登出程序`);
    await page.goto("https://user.gamer.com.tw/logout.php");
    await page.waitForSelector("button.btn");
    await page.click("button.btn");
    await page.waitForSelector("div.TOP-my.TOP-nologin").catch(logger.error);

    log(`帳號登出程序已完成`);
};

export default logout;
