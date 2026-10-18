# COz Cos 搜尋與 AI 可見度

2026-10-18：本機完成，未推送 GitHub、未部署。新增頁面上線後才能被公開搜尋引擎發現。

## 內容方向

- 使用者確認的目標需求：Cosplay／第一次體驗 Cosplay。
- 核心頁：cosplay-experience-zh.html、cosplay-experience.html。提供素人是否能體驗、角色準備、尺碼查詢、公開套餐價格、服務據點及詢問清單。
- 價格只取自 service-data.json；修改套餐後須重新執行 build-seo.mjs，同步指南、價目表與結構化資料。
- 頁尾、關於我們、FAQ 可前往指南；指南連回價目表、角色列表及 IG。首頁維持原本精簡版型。
- Organization／WebSite 保留 COz Cos 品牌名稱與官方帳號，COZCOS／COzCos 是品牌拼寫別名。未加入不明語音詞、虛構地址、評價、庫存或服務保證。
- 價目表的 OfferCatalog 與指南的 Article 資料須與可見內容一致。這些不是保證排名或 AI 引用的特殊標記。
- llms.txt 僅作補充資料索引；Google 明確指出不使用它提高搜尋或 AI 搜尋排名。

## 下次獲准部署後

1. 驗證兩份指南、canonical、互相對應的 hreflang、sitemap.xml 及服務頁可正常載入。
2. 在既有 Search Console 的 cozcos.com 資源檢查新指南 URL，確認可索引並提交索引要求；確認 sitemap.xml 已提交。
3. 以 28 天區間比較查詢：COz Cos、Cosplay 體驗、第一次 Cosplay、素人 Cosplay、Cosplay 一條龍。記錄曝光、點擊、CTR、平均排名及實際落地頁。沒有 Search Console 實測數據前不聲稱排名改善。
4. 觀察 GA4 的同意統計資料與前往 IG 的點擊；流量少時延長觀察，不為了等待收錄反覆部署。
5. AI 回答是否引用網站由各搜尋服務決定，不保證第一名或一定推薦。先保持資訊正確與可抓取，再依實際需求補內容；不建立大量同義詞頁面。

## 官方參考

- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.google.com/search/docs/appearance/site-names

## 本機驗證

- node build-seo.mjs
- node verify-seo.mjs（16 個公開頁面、對應網址、指南價格及套餐結構化資料）
- node verify-services.mjs
- node verify-analytics.mjs
- qa/verify-beginner-guide.mjs：375、768、1024、1440px 與首頁中英文切換後的指南入口；qa 不部署。
