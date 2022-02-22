# 勇者大聲說模組
Bahamut Automation v0.6.7+

- Module Name: `sayloud`

## 每日大聲說？
找個機器人來幫你每天發勇者大聲說！

## 參數
必要參數： `sayloud`

`sayloud` 為一陣列，每項物件由 `to`（暱稱）及 `text`（發表內容）組成。

執行時會**隨機**挑選陣列中的一個物件。

其中，`text` 可以接受時間參數：
- `$time$` 等同於 `$year$/$month$/$day$ $hour$:$minute$:$second$`
- `$year$` 等同於執行時的西元年
- `$month$` 等同於執行時的月份
- `$day$` 等同於執行時的日期
- `$hour$` 等同於執行時的小時
- `$minute$` 等同於執行時的分鐘
- `$second$` 等同於執行時的秒鐘

### 範例
```json
{
    "sayloud": [{ "to": "所有人", "text": "提醒大家，今天是 $month$/$day$ 喔！" }]
}
```

## 附註
請不要亂說話，不要亂用。

執行時間的偏移可能會導致間隔未滿 24 小時，沒辦法發。
極端的情況建議設專門給勇者大聲說的自動化，用 `login,sayloud,logout` 就好，然後每小時執行。

勇者大聲說發一次好像要 60 巴幣。