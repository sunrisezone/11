# 蓋樓模組
Bahamut Automation v0.6.8+

- Module Name: `builder`

## 每日蓋樓？
對於心愛的大樓當然要親自蓋！

但，忘記蓋的話會很對不起它。所以...

找個機器人來幫你每日蓋樓！

## 參數
必要參數： `builder`

`builder` 為一陣列，每項物件由 `bsn`（看版 ID）、 `snA`（文章 ID）、 `content`（發表內容）組成。

其中，`content` 可以接受時間參數：
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
    "builder": [
        { "bsn": "60111", "snA": "120687", "content": "$month$/$day$ 第一次測試" },
        { "bsn": "60111", "snA": "120687", "content": "$month$/$day$ 第二次測試" }
    ]
}
```

## 附註
請不要亂蓋樓，不要亂用