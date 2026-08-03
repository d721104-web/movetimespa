# 幕府時代 Move Time — 官網

Jekyll + GitHub Pages。四個獨立 HTML 頁面已整併為一套可維護的架構。

---

## 一、上線前必做（依序）

### 1. 填入表單接收端
搜尋整個專案的 `FORM_ENDPOINT`（共 2 處：`index.html`、`join/index.html`），
換成你的 GAS Web App 網址（`doPost`）。

GAS 端最小可用範例：
```js
function doPost(e){
  const d = JSON.parse(e.postData.contents);
  SpreadsheetApp.openById('你的試算表ID').getSheetByName(d.source || 'form')
    .appendRow([d.ts, d.name, d.phone, d.service||d.exp, d.address||d.area, d.note||d.msg]);
  // 順便發 Telegram / LINE Notify 通知自己
  return ContentService.createTextOutput('ok');
}
```

### 2. 確認 `_data/site.yml` 的三組數字
| 欄位 | 目前值 | 要確認什麼 |
|---|---|---|
| `hours.display` | 每日 10:00–23:00 | 舊站首頁寫 22:30、內頁寫 23:00，我統一成 23:00。**以實際為準**。 |
| `commission.base` | 60 | 你實際給的起跳分潤 |
| `commission.tiers` | 60/65/70 + 【】 | **級距條件含佔位符，必須填**（見下方風險提示） |
| `commission.shop_ref` | 45 | 對照組傳統店家比例，建議問現職師傅確認 |

### 3. 換 LINE 連結
全站 LINE 只在 `_data/site.yml` 的 `contact.line_url` / `line_url_join` 兩處。
建議招募另開一個官方帳號，才分得出流量來源。

### 4. 補 OG 圖
放一張 1200×630 的圖到 `assets/og.jpg`。

---

## 二、部署

```bash
git init && git add -A && git commit -m "整合重構"
git remote add origin git@github.com:你的帳號/movetimespa.git
git push -u origin main
```
GitHub → Settings → Pages → Source 選 `main` / root。
Custom domain 填 `www.movetimespa.com`，勾選 Enforce HTTPS。

推上去約 1–3 分鐘後自動建置完成。之後每次 push 都會自動更新。

---

## 三、日常維護（重點）

### 改價格
只改 `_data/site.yml` 的 `services`。首頁、服務頁、區域頁、表單下拉選單、schema 全部同步。

### 改營業時間 / 電話 / 地址
只改 `_data/site.yml`。全站頁尾、schema、聯絡區塊同步。

### 新增一個區域頁
在 `_area/` 新增一個 `.md`（**資料夾要有底線**，Jekyll 集合的規定）：
```markdown
---
layout: area-page
slug: yongkang
title: 台南永康區
sub: 人口成長最快的行政區
roads: 中華路・小東路・三民路
crumb: 台南永康區
parent_url: /area/
parent_name: 服務地區
description: 台南永康區到府按摩服務…
---
內文（Markdown）
```
存檔 push，首頁、頁尾、schema 的區域清單會自動長出來。

### 新增一篇指南
在 `_guide/` 新增 `.md`，front matter 第一行寫 `layout: guide-page`。
你的 GAS-Gemini-Blogger 管線可以直接產出這個格式。

---

## 四、301 導向（已設定，不用手動做）

| 舊網址 | 新網址 |
|---|---|
| `/tainan-home-massage/` | `/guide/tainan-home-massage/` |
| `/elderly-relaxation/` | `/service/elderly/` |

由 `tainan-home-massage/index.html` 與 `elderly-relaxation/index.html` 兩個實體導向頁處理
（canonical + meta refresh + JS redirect，且標記 noindex）。不依賴任何外掛，一定會生效。

---

## 五、上線後 48 小時內

1. Google Search Console 提交 `https://www.movetimespa.com/sitemap.xml`
2. 用「網址審查」逐一提交 8 個服務頁 + 6 個區域頁 + 4 篇指南
3. 複合式搜尋結果測試工具驗證 `/join/` 的 JobPosting
4. **開 Google 商家檔案（GBP）** ← 對客源的效益大於整個網站改版
5. 裝 GA4，設定「LINE 點擊」與「表單送出」為轉換事件

---

## 六、⚠️ 法律風險提示（務必處理）

1. **`commission.tiers` 的級距條件含 `【】` 佔位符。**
   寫上去就必須執行。師傅達標不調 → 《就業服務法》第 5 條第 2 項第 1 款不實廣告，
   依第 65 條處 30–150 萬罰鍰並公布負責人姓名（法院見解：一部不符亦構成）。
   **規則未定案前，請把 `join/index.html` 的 `.ladder` 區塊加 `hidden`。**

2. **客戶推薦文已全部移除。**
   舊站首頁的「李小姐／王太太／孫小姐」若非真實客人所寫，涉《公平交易法》第 21 條。
   要放請改成嵌入真實 Google 評論。

3. **「PTT 推薦首選」相關段落已全部移除。** 同上，且同業檢舉成本極低。

4. **醫療用語已全站清除**，並在每頁頁尾附上免責聲明（`_data/site.yml` 的 `legal.disclaimer`）。

5. **承攬 vs 僱傭**：招募頁用「合作」中性語言，未寫死。
   若實際上你會排班、規定制服、統一定價、設罰則，很可能被認定為僱傭關係
   （勞保、勞退 6%、職災、資遣費）。擴編前建議先請勞務顧問把契約與管理方式對齊。


---

## 七、踩過的坑（新增內容時避開）

| 禁忌 | 原因 |
|---|---|
| front matter 不要用 `min:` 當鍵名 | 與 Liquid 內建方法衝突，會讓 Jekyll 直接崩潰（`stack level too deep`）。本專案已改用 `mins:`。 |
| 集合資料夾一定要有底線 | `_service/`、`_area/`、`_guide/`。沒底線 Jekyll 不會當成集合，`site.area` 會是空的，首頁的區域清單會整區消失。 |
| layout 名稱不可與集合同名 | 所以叫 `service-page` 而非 `service`，否則同樣觸發無限遞迴。 |
| `_config.yml` 的 `defaults` 已移除 | 同樣會觸發遞迴。改成每個 `.md` 明確寫 `layout:`，更直觀也更穩。 |

## 八、本機預覽

**方法一（推薦）**：直接 push 到 GitHub Pages，1–3 分鐘後看線上版。

**方法二**：解壓 `preview-離線預覽版.zip`，雙擊任一 `.html` 即可瀏覽（連結已改為相對路徑）。
此版本僅供看畫面，不要拿來部署——部署請用 Jekyll 原始碼。

**方法三**：本機裝 Jekyll 後 `bundle exec jekyll serve`，開 http://localhost:4000
