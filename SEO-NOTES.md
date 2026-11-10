# COz Cos 搜尋與 AI 可見度

2026-10-18：已上線，GitHub da61fb4／Netlify 6ad44e7e99c0ef8091260cd7，CI通過。中文新手指南已由指定帳戶送出 Search Console 索引要求，Google確認排入抓取佇列；尚不代表已收錄或排名改善。

## 內容方向

- 使用者確認的目標需求：Cosplay／第一次體驗 Cosplay。
- 核心頁：cosplay-experience-zh.html、cosplay-experience.html。提供素人是否能體驗、角色準備、尺碼查詢、公開套餐價格、服務據點及詢問清單。
- 價格只取自 service-data.json；修改套餐後須重新執行 build-seo.mjs，同步指南、價目表與結構化資料。
- 頁尾、關於我們、FAQ 可前往指南；指南連回價目表、角色列表及 IG。首頁維持原本精簡版型。
- Organization／WebSite 保留 COz Cos 品牌名稱與官方帳號，COZCOS／COzCos 是品牌拼寫別名。未加入不明語音詞、虛構地址、評價、庫存或服務保證。
- 價目表的 OfferCatalog 與指南的 Article 資料須與可見內容一致。這些不是保證排名或 AI 引用的特殊標記。
- llms.txt 僅作補充資料索引；Google 明確指出不使用它提高搜尋或 AI 搜尋排名。

## 2026-11-09 目標查詢：Cosplay 一條龍

- 落地頁固定為 cosplay-experience-zh，不另建同義詞頁。開頭先回答「什麼是一條龍、多少錢、在哪裡」，其後是流程、套餐與比較。使用者指定落地頁不放客人作品照（2026-11-09）。
- 價格、套餐數與角色數由 service-data.json 帶入，不要手寫。
- 導向落地頁的頁尾、首頁、About／FAQ 與價目表連結都使用含「Cosplay 一條龍」的文字。build-seo.mjs 與 app.js 的頁尾要同步。
- 未加入虛構評價、第一名宣稱或完整地址。LocalBusiness 需要實際地址，取得可公開地址後再改。
- 站外工作：Google 商家檔案、真實評論、IG／FB／Threads 連到落地頁、活動與社群的自然連結。

## 2026-11-09 轉換與索引

- 首頁第一屏按鈕前往服務價目表，避免讓人以為只有一條龍；一條龍落地頁由首頁第一段的文字連結進入。文案與連結在 content.js，build-seo.mjs 與 app.js 同步。
- 落地頁的 inquiry.js 只在瀏覽器整理詢問內容，不送出也不儲存。GA 事件 home_cta_click、inquiry_copy、inquiry_open_instagram 不含欄位內容，且須訪客同意統計。
- 最新消息內容由 CMS 於執行時載入、目前僅 3 則，故 news 頁設 noindex 並移出 sitemap。公告累積後再評估伺服器輸出。

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
