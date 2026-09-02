# Move Time GA4 轉換追蹤設定

Measurement ID：`G-BHWV74H0DQ`

## 已埋入事件
- `line_click`：所有 LINE 連結點擊
- `phone_click`：所有 `tel:` 電話連結點擊
- `booking_click`：預約 CTA／`#contact` 等預約意圖點擊
- `massager_apply`：按摩師表單通過驗證後實際送出（Web Form 或 LINE fallback）
- `partner_contact`：合作頁的 LINE／電話／Email／合作聯絡 CTA

## 事件參數
- `page_path`
- `page_title`
- `lead_type`：customer / elderly / massager / partner
- `cta_location`
- `link_url`
- `link_text`
- `submit_method`（僅 massager_apply）

> 注意：GA4 不傳送姓名、電話、Email、地址、備註等個資。

## GA4 後台建議
把下列事件標記為 Key events：
1. `line_click`（主要）
2. `phone_click`
3. `massager_apply`
4. `partner_contact`

`booking_click` 建議先保留為分析事件，不一定設為 Key event，避免與 LINE 預約按鈕重複計算主要轉換。

## 自訂維度
在 GA4「管理 → 資料顯示 → 自訂定義」建立事件範圍自訂維度：
- CTA 位置：`cta_location`
- Lead 類型：`lead_type`
- 送出方式：`submit_method`

## 上線驗證
1. 部署網站。
2. 開啟 GA4 → 即時。
3. 無痕視窗開啟網站。
4. 點一個 LINE 按鈕，確認 `line_click` 出現。
5. 點「立即預約」確認 `booking_click` 出現。
6. 手機點電話連結確認 `phone_click`（如頁面有電話按鈕）。
7. 招募頁填寫表單並送出，確認 `massager_apply`。
