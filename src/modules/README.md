# Modules

各模組的介紹

## login

登入巴哈姆特的模組

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： username, password
- 可選參數： twofa, login_max_attempts

## logout

登出巴哈姆特的模組，需先執行 login 模組

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： 無

## ad_handler

用來處理 Google AD 的模組

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： 無

## sign

巴哈簽到的模組，需先執行 login 模組，雙倍獎勵需先執行 ad_handler 模組

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： sign_double_max_attempts

## answer

動畫瘋答題的模組，需先執行 login 模組

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： answer_max_attempts

## lottery

勇者福利社抽獎的模組，需先執行 login 及 ad_handler 模組

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： lottery_max_attempts

> **注意事項：使用前請先自己抽一次，填寫一次收件人資料並勾選「記住收件人資料」**

## lottery_plus

跟 lottery 模組類似，且支援並行抽獎

> _實驗中，有 Bug 請回報_

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： lottery_plus_max_attempts, lottery_plus_max_parallel

## report

產生執行報告的模組

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： report_title, report_ignore

## issue

將報告發到 GitHub Issue 的模組

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： gh_pat
- 可選參數： gh_labels

## telegram

串接 telegram 的模組，[詳細說明在 telegram 資料夾內](./telegram#readme)

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： tg_id
- 可選參數： 無

## discord

串接 discord 的模組，[詳細說明在 discrd 資料夾內](./discord#readme)

- 作者： [cow03haha](https://github.com/cow03haha)
- 必要參數： dc_url
- 可選參數： 無

## line_notify

串接 Line Notify 的模組，[詳細說明在 line_notify 資料夾內](./line_notify#readme)

- 作者： [dxball](https://github.com/dxball)
- 必要參數： line_notify_token
- 可選參數： 無

## guild

公會簽到的模組，需先執行 login 模組

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： guild_max_attempts

## sayloud

勇者大聲說的模組，需先執行 login 模組

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： sayloud
- 可選參數： 無

## builder

蓋樓（回文）模組，需先執行 login 模組，[詳細說明在 builder 資料夾內](./builder#readme)

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： builder
- 可選參數： 無

## test

測試用的模組

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： test_parameter

## module

說明模組格式的模組

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： module_needs_this_parameter
- 可選參數： optional_parameter
