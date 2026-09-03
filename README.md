# Move Time 網站維護版（Jekyll + GitHub Pages）

這一版的目的：**之後新增 SEO 文章時，不再手動改 `/guide/index.html` 和 `sitemap.xml`，也不用整包網站重傳。**

## 一次性設定

1. 把本版本內容合併到目前 GitHub repository 的 `main`。
2. GitHub → **Settings → Pages → Build and deployment → Source → GitHub Actions**。
3. 到 **Actions** 看 `Build and deploy Move Time site` 是否綠色完成。
4. 檢查正式站：首頁、`/guide/`、`/guide/home-massage-price/`、`/sitemap.xml`。

> GitHub 官方目前建議使用 GitHub Actions 來部署與自動化 Pages；本專案已放入 `.github/workflows/pages.yml`。

## 以後新增文章：只做 1 件主要工作

在 `_guides/` 新增一個 Markdown 檔，例如：

`_guides/first-home-massage.md`

可直接複製根目錄 `ARTICLE-TEMPLATE.md` 的格式。

Commit 到 `main` 後，系統會自動：

- 產生 `/guide/first-home-massage/`
- 把文章卡片加入 `/guide/`
- 把文章網址加入 `/sitemap.xml`
- 套用同一套 SEO meta、GA4、Header、Footer、Article JSON-LD
- 執行文章欄位檢查
- 部署到 GitHub Pages

## 常用資料在哪裡

- `_guides/`：SEO 文章正文
- `_layouts/guide-article.html`：所有文章共同版型
- `_layouts/guide-index.html`：知識庫首頁版型
- `_includes/`：GA4、Header、Footer、CTA 等共用元件
- `_data/site.yml`：LINE、電話、GA4 ID、公司等共用資料
- `_data/sitemap.yml`：主要固定頁面的 sitemap 清單
- `assets/css/guide.css`：知識庫與文章共用樣式
- `assets/js/ga4-tracking.js`：GA4 事件追蹤

## 修改一篇文章

直接修改 `_guides/<slug>.md`，並把 front matter 的 `modified` 更新成當天日期。Commit 後自動重建。

## 修改共用 CTA / Header / Footer

只改 `_includes/` 對應檔案一次，所有 Guide 頁會一起更新。

## 修改 GA4 或 LINE

只改 `_data/site.yml`，所有 Jekyll Guide 頁會同步更新。

## 注意

目前首頁、服務頁、樂齡頁、Partner、Massager 等既有頁面仍保留原本靜態 HTML，避免一次大改造成版面或 SEO 風險。**這次先把成長最快的內容 SEO 區塊模組化。** 等 Guide 累積約 10～20 篇後，再視需要把其他主頁也逐步搬到共用 layout。
