# COz Cos 官網

## 目前版本與管理入口

- 正式站：https://cozcos.com/；預設繁體中文，英文位於 /en.html。
- 私人原始碼儲存庫：https://github.com/ozof70/coz-cos-website （ozof70）。
- 下方歷史紀錄依日期累積；最新設定以此節、content.js 與生成的 HTML 為準。
- 目前使用 Huninn 圓體、漫畫風標題及英文標語 Bring Your Character to Life.；20 張背景照片分成四欄，上、下、上、下輪動。沒有「暫停照片」按鈕。
- 五個玻璃平台入口與名稱一起在向下捲動到聯絡區時出現，點擊直接前往平台。
- 中英文 About、FAQ、服務價目表與角色列表已完成；每語言 11 則常見問題、搜尋與分享資訊均已完成。
- Netlify 沿用 stellar-pothos-be4f0b；不要建立新站點。GitHub 存放原始碼，不連接自動部署。一般修改先留在本機。
- 流量統計採 Google Analytics 4，評估 ID G-VN7FHRQ8FH；接入程式、選擇開關與隱私說明已於 2026-10-13 上線。訪客同意後才收集；後台實際收件仍須確認。詳見 [ANALYTICS.md](ANALYTICS.md)。
- 2026-10-13 版本：右上角服務選單、中英價目表（4 種套餐、9 種單項服務）及可搜尋的 53 筆圓夢角色，全部合併為同一主清單，不分合作衣櫃。service-data.json 集中管理內容，service-pages.mjs 生成頁面；更新後依序執行 build-seo.mjs、verify-seo.mjs、verify-services.mjs、verify-analytics.mjs，再執行 package.ps1。
- 同批追加：服務按鈕移除箭頭，電腦滑過自動展開；選项與套餐卡片滑過亮起。服務頁標題減輕字重，底部使用官方 IG 的 client-11.jpg 原圖並附來源。角色列交錯從左、右進場，角色頁有四欄上下交錯的作品背景；減少動態設定下停用。首頁背景略為調亮，取景改向臉部上方，client-06/client-20 額外靠上取景。
- 最終追加批次 Netlify deploy：6acda54feabbee6b63cedd2a，沿用既有站點與 DNS；所有追加調整完成後一起部署。之後仍只在重大更新或明確要求時部署。
- 四種視窗寬度（375、768、1024、1440px）均以独立測試瀏覽器驗證五個主要頁面：無橫向溢出、選單/鍵盤/搜尋正常。另確認 53 列交錯進場、四欄圖片輪動、標題字重、滑過亮起與底部原圖載入。測試截圖位於 qa/，不納入 GitHub 或正式部署。

## 初版與修改紀錄

### 尚未部署的本機修改（2026-10-13）

- 使用者更正漫展代妝為 NT$950 起；中英文價目表已同步。
- About／FAQ／隱私與流量的底部連結在桌面與手機均置中。
- 中英文價目表與角色列表四頁共用獨立的 serviceBackgroundPhotos 設定，背景遮罩調亮；不沿用首頁照片。
- 新背景照片尚待取得：官方 IG 的公開頁面可連上，但外部讀取未取得作品圖片。因此目前 serviceBackgroundPhotos 為空，服務頁以較亮的深色漸層暫代，沒有把首頁照片當新素材。
- 本批僅修改本機，不同步 GitHub、不部署 Netlify。補齊新照片再累積更新。

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

## 場次頁與新照片（2026-10-13，尚未部署）

- 服務新增場次資訊及預訂（events-zh.html / events.html），目前北中南共 46 筆未結束場次，來源為台灣同人誌中心。每列附日期、地點、COz 預訂狀態和 IG 入口。實際檔期仍以 IG 確認。
- 更新資料使用 update-events.mjs；完整抓取成功才寫入 events-data.json，失敗保留原資料。
- 已從使用者登入的官方 IG 下載九張新作品圖，共八篇貼文；服務頁共用此背景，與首頁原有貼文完全不同。網站版九張合計約 1.4 MB，原圖保留於 photo-originals，不納入網站部署與 GitHub。來源及出鏡署名見 assets/services/SOURCES.md。
- 這次本機已更新，尚未同步 GitHub 或部署 Netlify。上方『素材待取得』為先前狀態，現已補齊。

- 每週場次排程已建立：週一上午 9 點（台灣時間），有效資料有變更且驗證完成才整批同步 GitHub / Netlify；不重複發布相同內容。

- 首頁 Logo 與 COz Cos 字樣共用液態玻璃面板，新增透光背景、模糊及邊緣高光，Logo 提亮；中英文首頁共用。僅本機更新，尚未部署。
- 使用者最終更正：首頁中央的大 Logo 不加液態玻璃；只有各內頁左上角 Logo 與 COz Cos 共用玻璃面板。前一筆首頁玻璃紀錄已被此更正取代。

- 角色列表已依作品名稱分組，預設收合；電腦滑過展開、滑離收合，手機點選及鍵盤 Enter/Space 也可切換。搜尋時自動展開符合的作品，清空搜尋恢復收合。保留全部 53 筆角色、中英文頁及交錯進場。已驗證桌面滑過、手機點選、鍵盤與搜尋；本機更新，尚未部署。
- 最新確認：首頁中央 Logo 與 COz Cos 恢復共用液態玻璃面板，內頁左上角玻璃效果保留；此確認取代前一筆首頁取消玻璃的紀錄。尚未部署。
- 套餐卡片玻璃模糊從 12px 降至 3px，減淡底色，保留細邊高光及滑過亮起；文字增加陰影維持可讀性。中英文共用，本機更新尚未部署。

- 本次使用者明確要求將累積改動同步 GitHub 並重新部署，新增服務下拉玻璃展開動畫與去小字品牌 favicon；完整改動見 CHANGES-2026-10-13.md。

## 本批部署完成（2026-10-13）

- GitHub main 已同步：901433f，包含全部累積程式及網站素材改動。
- Netlify 正式部署：6acdb36d10ee87f10f24f744；正式網域 https://cozcos.com。整批僅部署一次。
- 已驗證正式首頁、32 個作品分類、場次預訂頁、漫展代妝 NT950、新 Logo 與 PNG favicon、玻璃選單動畫，共享衣櫃 HTTPS 回應 200。Google 搜尋顯示由後續重新抓取決定。


- 最新本機修改：場次範圍限北部與中部（最南到台中），排除花東及台中以南，現有 34 場。六個中英文服務內頁移除背景照片，改一般深色漸層；首頁維持照片輪動。每週排程已同步，尚未部署。
- 首頁新增第六個聯絡入口：假髮研究室 https://www.instagram.com/cozcos_cos.wig/，使用官方帳號頭貼並沿用滑入動畫。手機為三欄兩排，維持等高。中英文同步；本機更新尚未部署。

## 最新本機後台（尚未部署）

- 最新消息：news-zh.html / news.html。關於我們上方管理員登入通往 admin.html，支援公告標題／全文及角色作品／名稱／尺碼新增。
- 本機使用 preview.mjs 的 /api/cms 與 .local-data 儲存，.local-admin.json 放鹽、密碼雜湊及簽章金鑰。這些私密檔案均不公開打包。
- 正式後台使用 Netlify Functions + Netlify Blobs；安裝依賴後，須先設定三個 Functions 環境變數：COZ_ADMIN_SALT、COZ_ADMIN_PASSWORD_HASH、COZ_ADMIN_SESSION_KEY。從本機私密設定取值，不在程式或 GitHub 記錄密碼。再使用既有 Netlify 專案部署 dist 及 netlify/functions。單純上傳 ZIP 不包含後台功能。
- 流量只統計同意後的正式站瀏覽，不保存完整 IP、姓名及查詢參數；本機不送統計。從啟用後累積本日／本月瀏覽數。
- 共享衣櫃 icon 改白底；資訊內頁標題字重 400。場次改兩個可收合區塊，未來四個月共 22 場。
- 驗證：未授權存取、密碼錯誤、Origin/CSRF、簽章 Cookie、輸入驗證、內容保存、統計同意與去重；本機登入／公告詳細內容／新增角色前台流程及 375、768、1440px 通過。測試公告和角色已移除。


- 使用者本次要求上線並同步 GitHub：中部畫面名稱移除『到台中』，篩選規則維持原範圍。後台採 Functions 範圍的正式環境密鑰，密碼不公開。
