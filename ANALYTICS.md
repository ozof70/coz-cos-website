# COz Cos 流量統計

## 管理入口與目前狀態

- 網站原始碼：https://github.com/ozof70/coz-cos-website （私人儲存庫，帳戶 ozof70）
- 統計服務：Google Analytics 4，管理帳戶 dennis02101014@gmail.com。
- 2026-10-11：已填妥 COz Cos 帳戶、COz Cos 官網資源、台灣時區與新台幣；目前停在台灣服務條款確認，尚未完成建立，也尚未取得評估 ID。
- 正式站目前沒有新增 GA4 追蹤程式。本次不部署 Netlify，不修改 DNS，不建立自動部署。

## 完成接入的步驟

1. 帳戶所有人確認 Google Analytics 服務條款。
2. 建立網站資料串流：https://cozcos.com/，取得 G- 開頭的評估 ID。
3. 加入各公開頁面的 Google tag、流量使用說明與隱私控制。只在 cozcos.com 與 www.cozcos.com 啟用；排除 localhost 與預覽站，避免開發測試污染統計。不得把私訊、姓名、電子郵件等資料送進 Analytics。
4. 本機驗證與 GitHub 更新後，依 AGENTS.md 部署節奏，等待重大更新或使用者明確要求上線。
5. 上線後用即時報表驗證 page_view，再查看每日統計。

## 如何看每天的流量

登入 https://analytics.google.com/analytics/web/?authuser=1，選取 COz Cos 官網資源。

- 瀏覽次數（Views）：頁面被觀看的次數；同一訪客看多頁或再次瀏覽，可能增加次數。
- 使用者（Users）：Analytics 所識別的使用者，不等於精確的人頭數；跨裝置、Cookie 設定及阻擋追蹤會影響計算。
- 將報表日期選為「今天」，以台灣時區計算；即時報表與每日報表的資料更新時間不同。
- 統計只能從正式追蹤啟用後開始累計，不能補回啟用前的瀏覽紀錄。未收到資料不應解讀為今天沒人造訪。

Google 說明：https://developers.google.com/analytics/devguides/collection/ga4/views
