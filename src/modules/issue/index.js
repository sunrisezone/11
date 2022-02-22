const { Octokit } = require("@octokit/core");
const github = require("@actions/github");

exports.parameters = [
    {
        name: "gh_pat",
        required: true,
    },
    {
        name: "gh_labels",
        required: false,
    },
];

const DEFAULT_LABELS = ["自動化報告"];

let octokit, context;

exports.run = async ({ params, outputs, logger }) => {
    const log = (...args) => logger.log("\u001b[95m[GitHub Issue]\u001b[m", ...args);
    const error = (...args) => logger.error("\u001b[95m[GitHub Issue]\u001b[m", ...args);

    if (!outputs.report) {
        error("請設定 report 模組");
        return;
    }

    if (!params.gh_pat) {
        error("請設定 GitHub Personal Access Token (gh_pat)");
        return;
    }

    if (!params.gh_pat) {
        error("請設定 GitHub Personal Access Token (gh_pat)");
        return;
    }

    if ((await outputs.report.text()).length == 0) {
        log("沒有報告內容");
        return;
    }

    const labels = params.gh_labels || DEFAULT_LABELS;

    // 設定 Octokit 及獲取 GitHub 資料
    octokit = new Octokit({ auth: params.gh_pat });
    context = github.context;

    if (outputs.issue && outputs.issue.number) {
        await updateIssue(outputs.issue.number, outputs.report).then(() => {
            log("Report Updated.");
        });
        return outputs.issue;
    } else {
        let res = await createIssue(outputs.report, labels);
        if (res && res.data && res.data.number) log(`Report: https://github.com/${context.repo.owner}/${context.repo.repo}/issues/${res.data.number}`);

        return { number: res.data.number };
    }
};

async function createIssue(report, labels) {
    const title = report.title;
    const body = await report.markdown();

    let res = await octokit.request("POST /repos/{owner}/{repo}/issues", {
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: title,
        body: body,
        labels: labels.map((x) => replace_time_var(x.trim())),
    });

    return res;
}

async function updateIssue(number, report) {
    const body = await report.markdown();

    await octokit.request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: number,
        body: body,
    });
}

function replace_time_var(str) {
    const t = time();
    const rules = [
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

function time() {
    const date = new Date().toLocaleString("en", { timeZone: "Asia/Taipei" }).split(", ");
    let [month, day, year] = date[0].split("/");
    let [hour, minute, second] = date[1].match(/\d{1,2}/g);

    if (+hour === 12 && date[1].toLowerCase().includes("am")) hour = String(+hour - 12);
    if (+hour < 12 && date[1].toLowerCase().includes("pm")) hour = String(+hour + 12);
    return [year, month, day, hour, minute, second];
}
