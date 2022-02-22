import type { Page, ElementHandle } from "playwright";
import Module from "../_module";

interface MatchRule {
    title?: string;
    sender?: string;
    before?: string;
    after?: string;
}

interface Mail {
    id: string;
    sender: string;
    title: string;
    time: Date;
    checkbox: ElementHandle<HTMLInputElement>;
}

const m_del_mail = new Module();

m_del_mail.parameters = [
    {
        name: "del_mail_match",
        required: true,
    },
];

m_del_mail.run = async ({ page, outputs, params, logger }) => {
    const log = (...args: any[]) => logger.log("\u001b[95m[站內信清除]\u001b[m", ...args);
    const warn = (...args: any[]) => logger.warn("\u001b[95m[站內信清除]\u001b[m", ...args);
    const error = (...args: any[]) => logger.error("\u001b[95m[站內信清除]\u001b[m", ...args);

    if (!outputs.login || !outputs.login.success) throw new Error("使用者未登入");

    const del_mail_match = params.del_mail_match as MatchRule[];
    if (del_mail_match.length < 1) return { success: false };

    await Promise.all([page.waitForResponse("https://mailbox.gamer.com.tw/ajax/inboxList.php"), page.goto("https://mailbox.gamer.com.tw/?l=1")]);

    log("正在搜集站內信... ");
    let mails = filtered_mails(await get_mails(page), del_mail_match).map((mail) => mail.id);
    while ((await page.$$(".nextPage")).length > 0 && mails.length < 10000) {
        log(`已搜集 ${mails.length} 封符合條件的站內信`);
        await Promise.all([page.waitForResponse("https://mailbox.gamer.com.tw/ajax/inboxList.php"), page.click(".nextPage")]);
        mails = [...mails, ...filtered_mails(await get_mails(page), del_mail_match).map((mail) => mail.id)];
    }
    log(`已搜集 ${mails.length} 封符合條件的站內信`);

    const csrf = await (await page.$("#delFrm input[name='csrfToken']")).getAttribute("value");

    for (let i = 0; i < mails.length; i += 100) {
        log(`正在刪除第 ${i + 1} 到 ${Math.min(i + 100, mails.length)} 封站內信...`);
        const res = await delete_mails(page, mails.slice(i, i + 100), csrf);

        if (res.code === 0) {
            log(`已成功刪除第 ${i + 1} 到 ${Math.min(i + 100, mails.length)} 封站內信`);
        } else {
            error(`刪除第 ${i + 1} 到 ${Math.min(i + 100, mails.length)} 封站內信失敗 (${res.code})`);
        }
    }

    return { success: true, deleted: mails.length };
};

async function get_mails(page: Page): Promise<Mail[]> {
    const Mails: Mail[] = [];
    const mails = (await page.$$(".readR, .readU")) as ElementHandle<HTMLElement>[];

    for (const mail of mails) {
        const sender = (await (await mail.$(".ML-tb1B")).textContent()).trim();
        const title = (await (await mail.$(".mailTitle")).textContent()).trim();
        const time = new Date((await (await mail.$("[nowrap='nowrap']")).textContent()).trim());
        const checkbox = (await mail.$("input[type='checkbox']")) as ElementHandle<HTMLInputElement>;
        const id = await checkbox.getAttribute("value");

        Mails.push({ id, sender, title, time, checkbox });
    }

    return Mails;
}

function filtered_mails(mails: Mail[], matches: MatchRule[]): Mail[] {
    const filtered: Mail[] = [];

    for (const mail of mails) {
        const { sender, title, time } = mail;

        for (const match of matches) {
            let passed = true;
            const { title: title_match, sender: sender_match, before: before_match, after: after_match } = match;

            if (title_match && !title.includes(title_match)) passed = false;
            if (sender_match && !sender.includes(sender_match)) passed = false;
            if (before_match && time.getTime() > new Date(before_match).getTime()) passed = false;
            if (after_match && time.getTime() < new Date(after_match).getTime()) passed = false;

            if (passed) {
                filtered.push(mail);
                break;
            }
        }
    }

    return filtered;
}

async function delete_mails(page: Page, mails: string[], csrf: string) {
    return page.evaluate(
        async ({ mails, csrf }) => {
            const res = await fetch("https://mailbox.gamer.com.tw/ajax/inboxDel.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
                body: `csrfToken=${csrf}${mails.map((id) => `&del%5B%5D=${id}`).join("")}`,
            });
            return await res.json();
        },
        { mails, csrf },
    );
}

export default m_del_mail;
