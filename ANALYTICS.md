# COz Cos 流量統計

## 管理入口與目前狀態

- 網站原始碼：https://github.com/ozof70/coz-cos-website （私人儲存庫，帳戶 ozof70）
- 統計服務：Google Analytics 4，管理帳戶 dennis02101014@gmail.com。
- 2026-10-11：使用者已自行完成 Google 設定並提供評估 ID `G-VN7FHRQ8FH`。本機 analytics-config.js 已填入該 ID，enabled=true。資料串流名稱、資源 ID 與後台實際收件狀態仍須登入後確認；未聲稱已接收到正式站流量。
- 使用者於 2026-10-13 明確要求將這批修改上線；GA4 追蹤程式、隱私說明與選擇開關已部署到正式站。Netlify deploy：6acda1c0837c6cb48b2dc44f；未修改 DNS 或建立自動部署。
- 本機 analytics-config.js、analytics.js 與 privacy.html 已接入中英公開頁面與打包腳本。即使設定啟用，本機與 Netlify 預覽站也不會載入 Google tag；正式網域須經訪客允許才收集。
- GitHub 登入已排除：使用官方 Git Credential Manager 明確選取已保存的 ozof70 帳戶；以既有 main 提交歷史為基底同步，不覆寫歷史。GitHub 未連接自動部署。

## 完成接入的步驟

1. 本機接入及驗證已完成；設定使用 `G-VN7FHRQ8FH`。
2. 本批新版已部署到原 Netlify 專案，正式站 analytics-config.js 回應 200 並包含指定 ID。
3. 接下來在正式站允許統計，登入對應 Analytics 資源，用即時報表確認 page_view 收件，再查看每日統計。程式上線不等於已核實 Analytics 後台收件。

## 如何看每天的流量

登入 https://analytics.google.com/analytics/web/?authuser=1，選取 COz Cos 官網資源。

- 瀏覽次數（Views）：頁面被觀看的次數；同一訪客看多頁或再次瀏覽，可能增加次數。
- 使用者（Users）：Analytics 所識別的使用者，不等於精確的人頭數；跨裝置、Cookie 設定及阻擋追蹤會影響計算。
- 將報表日期選為「今天」，以台灣時區計算；即時報表與每日報表的資料更新時間不同。
- 統計只能從正式追蹤啟用後開始累計，不能補回啟用前的瀏覽紀錄。未收到資料不應解讀為今天沒人造訪。
- 訪客拒絕、阻擋追蹤或瀏覽器限制時，不列入這份 Analytics 統計，數字不等於全站所有實際造訪。
- 開發驗證：node verify-analytics.mjs、node verify-seo.mjs。前者驗證正式網域限制、未同意時不載入、允許/撤回/重新允許、網址去除參數及無重複初始化；不能代替上線後即時報表驗證。

Google 說明：https://developers.google.com/analytics/devguides/collection/ga4/views
