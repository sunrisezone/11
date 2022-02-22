# Line Notify Module

1. 需使用 Bahamut Automation 1.0.0+
2. 在 `.github/workflows/automation.yml` 中 `modules` 參數中加上 `line_notify` ，記得要確認是否每個模組都有用 `,` 隔開
3. 在 Line 裡面，加入好友 `@LineNotify` 官方帳號
4. 至 [Line Notify](https://notify-bot.line.me/my/) 新增一筆存取權杖，並複製權杖代碼
5. 在 Secrets `parameters` 參數中加上 `line_notify_token`，值為權杖代碼
