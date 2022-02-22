const fetch = require("node-fetch");

exports.parameters = [
    {
        name: "line_notify_token",
        required: true,
    },
];

exports.run = async ({ outputs, params, logger }) => {
    const log = (...args) => logger.log("\u001b[95m[Line Notify]\u001b[m", ...args);
    const info = (...args) => logger.info("\u001b[95m[Line Notify]\u001b[m", ...args);
    const error = (...args) => logger.error("\u001b[95m[Line Notify]\u001b[m", ...args);

    if (!outputs.report) {
        error("請設定 report 模組");
        return;
    }

    if (!params.line_notify_token) {
        error("請設定 Line Notify Token (line_notify_token)");
        return;
    }

    if ((await outputs.report.text()).length == 0) {
        log("沒有報告內容");
        return;
    }

    const msg = await outputs.report.markdown();

    const body = new URLSearchParams();
    body.append("message", `${outputs.report.title}\n${msg}`);

    const response = await fetch("https://notify-api.line.me/api/notify", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${params.line_notify_token}`,
        },
        body: body,
    }).then((res) => res.json());

    if (response.status === 200) {
        log("已發送 Line Notify");
    } else {
        info(response);
        info(msg);
        error("發送 Line Notify 失敗！");
    }
};
