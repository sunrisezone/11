module.exports = {
    modules: [
        "report", // report generating functions
        "ad_handler", // ad handling functions
        "login", // login into Bahamut
        "sign", // daily sign
        "guild", // guild sign
        "answer", // anime answer
        "lottery", // fuli lottery
        "sayloud", // sayloud sender
        "builder", // reply bot
        "logout", // logout from Bahamut
        "telegram", // send report to telegram
        "discord", // send report to discord
        "line_notify", // send report to line notify
        "issue", // send report to github issue
    ],
    params: {
        username: "", // your username
        password: "", // your password
        tg_id: "", // telegram channel id
        dc_url: "", // discord webhook url
        line_notify_token: "", // line notify token
        lottery_max_attempts: 20,
        builder: [
            { bsn: "60076", snA: "6515182", content: "$year$/$month$/$day$ $hour$:$minute$ OK!" },
            { bsn: "60111", snA: "120687", content: "$month$/$day$ $hour$:$minute$ Test! Test!" },
        ],
        sayloud: [{ to: "所有人", text: "$year$/$month$/$day$ OK! https://forum.gamer.com.tw/C.php?bsn=60076&snA=6515182" }],
    },
    browser: {
        type: "firefox", // firefox, chromium, webkit, firefox is suggested
        headless: true, // turn off when debugging
    },
};
