# 站內信刪除模組

- Module Name: `del_mail`

## 參數

必要參數： `del_mail_match`

### 範例

```json
{
    "del_mail_match": [
        { "title": "【勇者福利社】成功獲得抽獎資格通知信" },
        { "sender": "someone" },
        { "sender": "the other", "title": "hello", "before": "2021-12-28 12:34:56" }
    ]
}
```

這樣他會刪除所有：

  1. 標題包含 `【勇者福利社】成功獲得抽獎資格通知信` 的信
  2. 寄件者名稱包含 `someone` 的信
  3. 寄件者名稱包含 `the other` 且標題包含 `hello` 且寄件日期在 `2021-12-28 12:34:56` 之前的信
