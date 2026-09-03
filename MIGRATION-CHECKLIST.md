# V2.6 上線檢查

- [ ] 先備份目前 GitHub repository
- [ ] 將 V2.6 檔案合併到 main（不是刪除 CNAME）
- [ ] Settings → Pages → Source 改為 **GitHub Actions**
- [ ] Actions → `Build and deploy Move Time site` 顯示綠色
- [ ] `https://www.movetimespa.com/` 正常
- [ ] `https://www.movetimespa.com/guide/` 正常
- [ ] `https://www.movetimespa.com/guide/home-massage-price/` 正常
- [ ] `https://www.movetimespa.com/sitemap.xml` 有文章網址
- [ ] GA4 Realtime 仍有 `page_view` / `line_click`
- [ ] Search Console sitemap 保持 `sitemap.xml`，不用重新建立新資源

之後新增文章只要新增 `_guides/*.md` 並 Commit。
