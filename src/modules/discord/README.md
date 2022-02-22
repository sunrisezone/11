# Telegram Module

1. 需使用 Bahamut Automation v0.6.11+
2. 在 `.github/workflows/automation.yml` 中 `modules` 參數中加上 `discord` ，記得要確認是否每個模組都有用 `,` 隔開
3. 在 discord 中案齒輪設定文字頻道(需要有 **管理頻道** 的權限) -> 整合 -> Webhook -> 新 Webhook，並複製 Webhook 網址
4. 在 Secrets `parameters` 參數中加上 `dc_url`，其值為 Webhook 網址
