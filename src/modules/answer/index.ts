import node_fetch from "node-fetch";
import countapi from "countapi-js";
import Module from "../_module";

const answer = new Module();

answer.parameters = [
    {
        name: "answer_max_attempts",
        required: false,
    },
];

answer.run = async ({ page, outputs, params, logger }) => {
    const log = (...args: any[]) => logger.log("\u001b[95m[動畫瘋答題]\u001b[m", ...args);

    if (!outputs.login || !outputs.login.success) throw new Error("使用者未登入，無法答題");

    let reward = 0;
    let question: { question?: string; token?: string; a1?: string; a2?: string; a3?: string; a4?: string; error?: number; msg?: string } = {};
    log(`開始執行`);

    const max_attempts = +params.answer_max_attempts || 3;
    for (let attempts = 0; attempts < max_attempts; attempts++) {
        try {
            log("正在檢測答題狀態");
            await page.goto("https://ani.gamer.com.tw/");
            await page.waitForTimeout(200);

            question = await page.evaluate(() => {
                return fetch("/ajax/animeGetQuestion.php?t=" + Date.now()).then((r) => r.json());
            });

            if (question.question) {
                const options = [null, question.a1, question.a2, question.a3, question.a4];

                log("尚未回答今日題目，嘗試答題中");
                log(`今天的問題：${question.question}`);
                log(`選項：${options.filter(Boolean).join(", ")}`);

                log(`正在尋找答案`);
                let token = question.token;
                let sn = await node_fetch("https://api.gamer.com.tw/mobile_app/bahamut/v1/home.php?owner=blackXblue&page=1")
                    .then((r) => r.json())
                    .then((d) => d.creation[0].sn);
                let ans = await node_fetch("https://api.gamer.com.tw/mobile_app/bahamut/v1/home_creation_detail.php?sn=" + sn)
                    .then((r) => r.json())
                    .then(
                        (d) =>
                            d.content
                                .match(/<body[\s\w"-=]*>([\s\S]*)<\/body>/)[0]
                                .match(/A[:：](\d)/gi)[0]
                                .match(/\d/)[0],
                    )
                    .then(parseInt);

                log(`答案是 ${ans}. ${options[ans]} ！`);
                log(`正在嘗試回答`);
                let result = await page.evaluate(
                    async ({ ans, token }) => {
                        const r = await fetch("/ajax/animeAnsQuestion.php", {
                            headers: {
                                accept: "*/*",
                                "content-type": "application/x-www-form-urlencoded",
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin",
                            },
                            method: "POST",
                            body: encodeURI(`token=${token}&ans=${ans}&t=${Date.now()}`),
                        });
                        return r.json();
                    },
                    { ans, token },
                );

                if (result.error) log("回答問題時發生錯誤 " + result.msg + " \u001b[91m✘\u001b[m");
                if (result.ok) {
                    log("已回答問題 " + result.gift + " \u001b[92m✔\u001b[m");
                    reward = +result.gift.match(/\d{2,4}/)[0];
                }
            } else if (question.error === 1 && question.msg === "今日已經答過題目了，一天僅限一次機會") {
                log("今日已經答過題目了 \u001b[92m✔\u001b[m");
            } else {
                log("發生未知錯誤：" + question.msg + " \u001b[91m✘\u001b[m");
            }

            await page.waitForTimeout(1000);
            break;
        } catch (err) {
            logger.error(err);
            log("發生錯誤，重試中 \u001b[91m✘\u001b[m");
        }
    }
    log(`執行完畢 ✨`);

    if (reward) countapi.update("Bahamut-Automation", "answer", reward);

    return {
        answered: question.error === 1 || reward ? true : false,
        reward,
        report,
    };
};

function report({ reward, answered }: { reward: number; answered: boolean }) {
    let body = "# 動畫瘋答題\n\n";

    if (reward) body += `✨✨✨ 獲得 ${reward} 巴幣 ✨✨✨\n`;
    if (answered) body += `🟢 今日已答題\n`;
    else body += `❌ 今日尚未答題\n`;

    body += "\n";
    return body;
}

export default answer;
