import Module from "../_module";

const sayloud = new Module();

sayloud.parameters = [
    {
        name: "sayloud",
        required: true,
        example: [{ to: "All Users", text: "Hello World!" }],
    },
];

sayloud.run = async ({ page, outputs, params, logger }) => {
    const log = (...args: any[]) => logger.log("\u001b[95m[勇者大聲說]\u001b[m", ...args);
    const warn = (...args: any[]) => logger.warn("\u001b[95m[勇者大聲說]\u001b[m", ...args);

    if (!outputs.login || !outputs.login.success) throw new Error("使用者未登入，無法發佈勇者大聲說");

    const { sayloud } = params;
    if (sayloud.length < 1) return { success: false };

    await page.goto("https://home.gamer.com.tw/homeindex.php");

    // randomly select one item of sayloud
    const item = sayloud[Math.floor(Math.random() * sayloud.length)];
    const to = replace(item.to),
        text = replace(item.text);

    // do some stuff
    const status = await page.evaluate(
        async ({ to, text }) => {
            const form = await fetch("https://home.gamer.com.tw/ajax/sayloud1.php?re=0", {
                method: "POST",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
                body: null,
            }).then((r) => r.text());

            if (form.includes("目前仍有大聲說在放送")) return 2;

            const div = document.createElement("div");
            div.innerHTML = form;
            // @ts-ignore
            const token = div.querySelector("[name=token]").value;

            const send = await fetch("https://home.gamer.com.tw/ajax/sayloud2.php", {
                method: "POST",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
                body: `idType=2&uid=&nick=${to}&token=${token}&content=${encodeURIComponent(text)}`,
            }).then((r) => r.text());

            return send;
        },
        { to, text },
    );

    if (status === 2) {
        warn("目前仍有大聲說在放送");
        return { success: false, reason: "目前仍有大聲說在放送", report: "勇者大聲說： 發送失敗 " };
    } else {
        log("放送成功 時間：" + status);
    }

    return { success: true, time: status, report: "勇者大聲說： 發送成功 " + status };
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

export default sayloud;
