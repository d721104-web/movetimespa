# Move Time｜Search Console × GA4 下一步設定

## 1. 建立 Search Console 資源
建議新增「網域」資源：
- movetimespa.com

使用 DNS TXT 驗證。完成後，Search Console 可涵蓋 http/https、www/非 www 與其他子網域。

## 2. 提交 Sitemap
Search Console → Sitemap → 新增 Sitemap：
- https://www.movetimespa.com/sitemap.xml

V2.5 Sitemap 目前收錄：
- /
- /services/
- /tainan-home-massage/
- /guide/
- /guide/home-massage-price/
- /elderly-relaxation/
- /partner/
- /massager/

## 3. 優先要求建立索引
用「網址檢查」依序測試並要求建立索引：
1. https://www.movetimespa.com/
2. https://www.movetimespa.com/services/
3. https://www.movetimespa.com/tainan-home-massage/
4. https://www.movetimespa.com/guide/
5. https://www.movetimespa.com/guide/home-massage-price/
6. https://www.movetimespa.com/elderly-relaxation/
7. https://www.movetimespa.com/partner/
8. https://www.movetimespa.com/massager/

## 4. GA4 串接 Search Console
GA4 → 管理 → 產品連結 → Search Console 連結 → 連結

選擇：
- Search Console 資源：movetimespa.com
- Web 串流：Move Time Website
- Measurement ID：G-BHWV74H0DQ

完成後，GA4 的 Search Console 報表集合預設可能仍未發布：
GA4 → 報表 → 資料庫（Library）→ Search Console → 發布。

## 5. 未來每週看 5 個數字
- Organic clicks
- Organic impressions
- Search query
- Landing page
- line_click Key event

第一個月不要只看排名；先確認 Google 是否開始對正確搜尋詞曝光正確 Landing Page。
