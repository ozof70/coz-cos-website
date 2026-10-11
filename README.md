# COz Cos 官網

## 目前版本與管理入口

- 正式站：https://cozcos.com/；預設繁體中文，英文位於 /en.html。
- 私人原始碼儲存庫：https://github.com/ozof70/coz-cos-website （ozof70）。
- 下方歷史紀錄依日期累積；最新設定以此節、content.js 與生成的 HTML 為準。
- 目前使用 Huninn 圓體、漫畫風標題及英文標語 Bring Your Character to Life.；20 張背景照片分成四欄，上、下、上、下輪動。沒有「暫停照片」按鈕。
- 五個玻璃平台入口與名稱一起在向下捲動到聯絡區時出現，點擊直接前往平台。
- 中英文 About 與 FAQ 頁、每語言 11 則常見問題、搜尋與分享資訊均已完成。
- Netlify 沿用 stellar-pothos-be4f0b；不要建立新站點。GitHub 存放原始碼，不連接自動部署。一般修改先留在本機。
- 流量統計採 Google Analytics 4；目前等待服務條款確認，尚未接入正式站。詳見 [ANALYTICS.md](ANALYTICS.md)。

## 初版與修改紀錄

繁體中文靜態官網，HTML / CSS / JavaScript，不需要安裝套件或執行建置。精簡一頁版：品牌與服務介紹、聯絡我們。整個頁面只提供五個圖像連結：Instagram、Facebook、Threads、共享衣櫃、賣貨便。下方區塊以 IntersectionObserver 逐步淡入；減少動態效果設定下直接顯示，鍵盤聚焦也會即時顯示內容。圖像連結提供 aria-label 與 title。

全站採霞鶩文楷繁體（Google Fonts），未載入時使用裝置可用的楷書字體。深色背景以官方 IG 的 10 張不同客片交錯形成 4×4 網格，緩慢向上循環；文字直接顯示在深色遮罩上，不使用白色內容面板。標題旁使用共享衣櫃相同的原始 Logo。可用「暫停照片」按鈕停止，減少動態效果設定下不移動。客片原始檔保存在 assets/clients/，出處見該資料夾 SOURCES.md。移除英文品牌標語，維持五個連結。

## 修改與預覽

- `content.js`：五個正式入口、服務卡片與社群名稱。
- `index.html`：首頁文案、區塊、SEO 資訊。
- `styles.css`：配色、排版、響應式設定。
- `assets/`：品牌圖形與 Meta 官方社群圖像，來源見 BRAND-SOURCES.md。作品入口導向官方 IG，不複製未確認授權的客片。

執行 `node preview.mjs`，開啟 http://localhost:4173。按 Ctrl+C 停止。

## 打包部署

在 PowerShell 執行 `./package.ps1`，產出 `coz-cos-netlify.zip` 與 `dist/`。部署時只上傳此 ZIP 或 dist，不上傳整個原始碼資料夾。

1. 登入 Netlify，以手動部署建立新站點，上傳 dist 資料夾或 ZIP。
2. 在 netlify.app 預览網址檢查首頁、手機選單及全部外部入口。
3. 在 Domain management 新增 `cozcos.com`，以 Netlify 當下提供的 DNS 指引配置網域。
4. 修改前記錄既有 A / AAAA / CNAME / MX / TXT / CAA。只調整官網所需的根網域記錄，保留 `closet.cozcos.com` 的 Railway CNAME，以及郵件 MX / TXT 等記錄，不切換 nameserver。
5. 確認網域驗證與 TLS 憑證成功，再測試 https://cozcos.com 與 https://closet.cozcos.com。

如使用預覽網址對外分享，先按需要調整 canonical / og:url / sitemap。正式網域上線前保留目前設定。社群分享圖提供 1200×630 PNG，SVG 保留為可編輯來源。

## 素材與內容

服務依官方 IG / Threads / Facebook、共享衣櫃與賣貨便公開介紹整理。未在官網固定價格、詳細地址與租借條件。預約導向 IG，衣櫃與賣場維持各自交易流程。加入客片前需確認官網刊登授權並保留署名。

## 正式部署紀錄（2026-10-11）

- 正式官網：https://cozcos.com/
- Netlify：https://stellar-pothos-be4f0b.netlify.app/
- 專案管理：https://app.netlify.com/projects/stellar-pothos-be4f0b/overview
- 主網域：cozcos.com；www.cozcos.com 導回主網域。
- Name.com DNS 新增 ANAME @ → apex-loadbalancer.netlify.com，以及 CNAME www → stellar-pothos-be4f0b.netlify.app，TTL 300。
- 原本 closet CNAME 與 Railway 驗證 TXT 保留。
- Netlify 已啟用 Let's Encrypt HTTPS，涵蓋 cozcos.com 與 www.cozcos.com，自動續期。
- 字體改為 Huninn 繁中圓體，標題採漫畫描邊；玻璃入口透出背景。IG/FB 使用透明素材。首次點擊顯示五個入口名稱，再次點擊前往平台。
- 後续更新：執行 package.ps1，進入上方同一 Netlify 專案上傳 coz-cos-netlify.zip，不必重新建立專案或 DNS。

最新呈現：預設英文，右上角按鈕可切換繁體中文；Logo 與中央品牌字標合併。照片拆成四個獨立欄位，上、下、上、下循環移動。文字分區淡入，五個等尺寸玻璃入口只在使用者往下滑到聯絡區時由底下浮出。支援減少動態設定與鍵盤焦點。

## SEO 與 GEO（2026-10-11）

- 預設英文首頁 /，繁體中文首頁 /zh.html；中英內容直接寫在 HTML，語言按鈕切換對應網址。
- 中英關於我們 /about.html、/about-zh.html；中英 FAQ /faq.html、/faq-zh.html，共 8 則常見問題。
- 每頁獨立 title、description、canonical、hreflang、OG／Twitter 分享資訊；sitemap.xml 包含六頁。
- Organization、WebSite、AboutPage、FAQPage 與 BreadcrumbList JSON-LD。FAQ 標示與可見答案相符，不捏造價格、評價或地址。
- 1200×630 專用分享圖 assets/social-card-v2.jpg；原始版型 assets/social-card.svg。舊的 social-card.png 不再用於分享。
- robots.txt 允許索引公開頁面。llms.txt 為額外的品牌摘要，不代表 AI 服務一定採用或保證被引用。
- 五個 icon 與名稱一起滑入，點擊直接前往對應平台。
- 最終據點文案：新北・鶯歌車站附近 ／ 台中・南屯捷運附近。
- 修改翻譯／FAQ 時，更新 content.js 或 build-seo.mjs，執行 node build-seo.mjs、node verify-seo.mjs、package.ps1，再上傳同一 Netlify 專案。
- 後續可於 Google Search Console 與 Bing Webmaster Tools 驗證網域並提交 https://cozcos.com/sitemap.xml，查閱索引與 AI 引用狀態；本次未代為建立或登入這兩個服務。
- Google 指南：https://developers.google.com/search/docs/appearance/ai-features
- Bing 指南：https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a

Netlify 的 Powered by Netlify badge 已於專案設定關閉。

## Google 品牌搜尋收錄（2026-10-11）

- 目標搜尋詞：COz Cos 品牌名稱。
- 已透過 Name.com 根網域 TXT 完成 Google Search Console 網域擁有權驗證；保留此 TXT 以維持驗證。
- 使用當時瀏覽器已登入的 Google 帳戶建立/驗證資源，沒有授權 Google 管理 Name.com DNS。
- 已提交 https://cozcos.com/sitemap.xml。首次報表顯示無法擷取；實際 HTTPS 檢查回應 200、application/xml、完整六頁 XML，需以後續 Search Console 處理結果為準。
- Googlebot 即時測試首頁成功，顯示「Google 可為網址建立索引」；已要求首頁建立索引，Google 確認加入優先檢索佇列。
- 提交不等於已收錄或排名第一。之後在 Search Console 成效報表查看品牌查詢 COz Cos 的曝光、點擊與平均排名。
- 建議官方 IG/FB/Threads 個人檔案加上 https://cozcos.com/ 官網連結，以建立品牌與官網的對應關係；本次未修改社群帳號。

- 中文首頁 https://cozcos.com/zh.html 也已成功要求建立索引。Sitemap 重新提交後仍顯示『無法擷取』；未將其標記為已讀取成功，需待 Google 再次抓取後查看。

## Search Console 管理帳戶更新（2026-10-11）

依使用者指定，改用 dennis02101014@gmail.com 管理 cozcos.com 網域資源，加入該帳戶專屬 Google 驗證 TXT。先前提交的索引要求屬於同一網域，無須重複送出。

## 中文預設與新手體驗搜尋更新（2026-10-11）

- 正式首頁 / 預設繁體中文；英文首頁 /en.html。舊 /zh.html 保留中文內容並以 / 為 canonical。
- 首頁搜尋標題：COz Cos｜Cosplay 一條龍體驗・角色妝容・服裝租借與攝影。地區留在服務據點內容，不放首頁搜尋標題。
- 首頁摘要、介紹與 About 頁加入第一次體驗 Cosplay、新手與素人的服務詢問內容。
- FAQ 增為中英各 11 則，包含沒有經驗、妝容服裝攝影一條龍、首次出角準備；答案與 JSON-LD 一致。姿勢引導僅說明預約前詢問確認，不宣稱固定包含。
- canonical、hreflang、x-default、sitemap 與 llms.txt 已同步更新；verify-seo.mjs 額外驗證中文預設及精確 canonical。

- 2026-10-11 晚間正式複查：Google Search Console 顯示主首頁 URL is on Google / Page is indexed；官網 sitemap 狀態 Success，已發現 6 頁。原先無法擷取狀態已解除。新版已重新提出檢索要求，以更新服務標題與新手體驗內容。

## 背景作品與輪動更新（2026-10-11）

- 從官方 IG 另外 10 則公開貼文補入 client-11.jpg 至 client-20.jpg，出處見 assets/clients/SOURCES.md。
- backgroundPhotos 集中於 content.js，現為 20 張，每欄 5 張；四欄維持上、下、上、下。
- 以每張 12 秒計算動畫週期，現為每欄 60 秒循環。相較舊版每張約 16.25 秒，移動速度約快 35%。群組高度依照片數計算，複製一組以無縫接續。
- 本機驗證 20 個不同圖片全部載入，4 欄方向與高度正常，無橫向溢出；減少動態設定保持停用照片動畫。

## 部署偏好（2026-10-11）

一般修改先保留在本機並預覽驗證，累積到重大更新，或使用者明確要求上線時，才重新部署 Netlify。專案長期指示記錄於 AGENTS.md。
