import Module from "../_module";

const builder = new Module();

builder.parameters = [
    {
        name: "builder",
        required: true,
        example: [{ bsn: "", snA: "", content: "" }],
    },
];

builder.run = async ({ page, outputs, params, logger }) => {
    const log = (...args: any[]) => logger.log("\u001b[95m[回文]\u001b[m", ...args);
    const error = (...args: any[]) => logger.error("\u001b[95m[回文]\u001b[m", ...args);

    if (!outputs.login || !outputs.login.success) throw new Error("使用者未登入，無法發佈勇者大聲說");

    const { builder } = params;
    if (builder.length < 1) return { success: false };

    for (let i = 0; i < builder.length; i++) {
        try {
            const { bsn, snA, content } = builder[i];
            log(`正嘗試在 https://forum.gamer.com.tw/C.php?bsn=${bsn}&snA=${snA} 回文`);
            await page.goto(`https://forum.gamer.com.tw/post1.php?bsn=${bsn}&snA=${snA}&type=2`);
            await page.waitForTimeout(2000);

            // 備份詢問
            if (await page.$("dialog")) {
                await page.click("dialog button");
            }
            await page.waitForTimeout(300);

            // 提示
            await page.evaluate(() => {
                // @ts-ignore
                if (onTipsClick) onTipsClick();
            });
            await page.waitForTimeout(300);

            // 切換模式
            await page.evaluate(() => {
                // @ts-ignore
                if (document.querySelector("#source").style.display === "none") bahaRte.toolbar.alternateView(true);
            });
            await page.waitForTimeout(300);

            // 輸入內容
            await page.$eval("#source", (elm: HTMLInputElement) => {
                elm.value = "";
            });
            await page.type("#source", replace(content), { delay: 11 });
            await page.waitForTimeout(300);

            // 發送
            await page.evaluate(() => {
                // @ts-ignore
                Forum.Post.post();
            });
            await page.waitForTimeout(300);
            await page.click("form[method=dialog] button[type=submit]");
            await page.waitForTimeout(5000);

            log(`已在 https://forum.gamer.com.tw/C.php?bsn=${bsn}&snA=${snA} 回文`);
            if (i + 1 < builder.length) {
                // 巴哈 1 分鐘發文限制
                log(`等待發文冷卻 1 分鐘`);
                await page.waitForTimeout(60 * 1000);
            }
        } catch (err) {
            error(err);
        }
    }

    return { success: true };
};

function replace(str: string) {
    const t = time();
    const rules: [RegExp, string][] = [
        [/\$time\$/g, `$year$/$month$/$day$ $hour$:$minute$:$second$`],
        [/\$year\$/g, t[0]],
        [/\$month\$/g, t[1]],
        [/\$day\$/g, t[2]],
        [/\$hour\$/g, t[3]],
        [/\$minute\$/g, t[4]],
        [/\$second\$/g, t[5]],
    ];

    for (let i = 0; i < rules.length; i++) str = str.replace(rules[i][0], rules[i][1]);

    return str;
}

function time(): string[] {
    const date = new Date().toLocaleString("en", { timeZone: "Asia/Taipei" }).split(", ");
    let [month, day, year] = date[0].split("/");
    let [hour, minute, second] = date[1].match(/\d{1,2}/g);

    if (+hour === 12 && date[1].toLowerCase().includes("am")) hour = String(+hour - 12);
    if (+hour < 12 && date[1].toLowerCase().includes("pm")) hour = String(+hour + 12);
    return [year, month, day, hour, minute, second];
}

export default builder;
