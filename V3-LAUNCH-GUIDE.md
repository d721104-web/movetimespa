# 幕府時代 Move Time｜V3.1 上線手冊（2026-10-22）

V3.1 = V3.0 的內容修正 + 首頁、樂齡頁全面改版（暖簾設計）+ 修正 V3.0 的 bug 與漏改。

## V3.1 改了什麼

| 項目 | 內容 |
| --- | --- |
| 新設計系統 | 新增 `assets/css/v3.css`：藍染靛＋和紙白，標題霞鶩文楷、內文 Noto Sans TC 17px。首頁與樂齡頁共用，品牌一致 |
| 首頁 `index.html` | 15 個區塊收斂為 8 個（頁長約減半）；移除假游標、載入動畫、emoji 圖示、Pexels 圖庫照片；價目改為日式菜單式；`<head>`（GA、meta、canonical、Schema）與 V3.0 完全相同 |
| 樂齡頁 | 同一套設計；新增「方案與費用」表、「適合先詢問／請先問過醫師」兩欄、長輩本人意願提醒；`<head>` 沿用 V3.0（僅 `lang` 統一為 zh-TW） |
| 預約工具 | 新增 `assets/js/v3-booking.js`：即時預覽將複製的訊息、必填欄位標示、修改後要求重新複製；不傳送、不儲存、不放進網址 |
| Bug 修正 | V3.0 首頁 FAQ 第一題少一個 `</div>`，後面題目全部被包進第一題（已改用原生 `<details>`） |
| 漏改補齊 | 初次預約文章仍寫「可指定男／女按摩師」「希望女按摩師」；飯店、價格、安全、久坐等文章的「合作按摩師／可接單人力」說法，皆改為阿凱師傅一人 |

## 上線前請你確認

- [ ] **阿凱本人授權**：姓名、照片。拿到照片後，把兩頁的 `.monogram` 區塊換成 `<img>` 即可（HTML 內有註解）
- [ ] **價格與加價**：樂齡 60 分 NT$1,600、其他七項原價；21:00 後加價、六區以外車馬費（頁面寫「LINE 先報價」，未寫金額）
- [ ] **全職爸媽套餐**：原文案寫「專屬陪玩服務陪伴小孩」——只有阿凱一人無法同時按摩＋陪玩，已刪除該描述。若此方案已停辦，請從首頁價目、表單選單與 `/services/` 移除
- [ ] **阿凱是否承接全部 8 項服務**（例如臉部保濕護理）；不做的請先下架
- [ ] **LINE**：`https://lin.ee/tXNyqDX` 是否開到 @927psgor
- [ ] **複製功能**：iPhone Safari、Android Chrome、電腦各測一次「複製 → 開 LINE → 貼上」
- [ ] 保險、契約、消保與個資法遵仍需另行確認（本版只改網站）

## 本機預覽

```bash
python3 -m http.server 8000
```

開 http://localhost:8000/ 與 http://localhost:8000/elderly-relaxation/ 。文章頁（`_guides`）需經 GitHub Actions 的 Jekyll 流程才會產生。

## 部署（GitHub Pages）

1. 先備份原 repo。**只覆蓋這次有變動的檔案**，不要清空原站：
   - `index.html`、`elderly-relaxation/index.html`、`tainan-home-massage/index.html`
   - `assets/css/v3.css`（新增）、`assets/js/v3-booking.js`（新增）
   - `_guides/` 內 5 篇：first-home-massage、tainan-hotel-massage、home-massage-price、home-massage-safety、desk-worker-shoulder-duration（V3.1 修改）
   - `V3-LAUNCH-GUIDE.md`、`README.md`
2. 推到測試 branch → 手機實測 → 合併至 `main`，確認 Actions 的 Build / Deploy 全綠。
3. 上線後到 Search Console 對首頁與 `/elderly-relaxation/` 要求重新索引。
