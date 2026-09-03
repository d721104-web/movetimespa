# 新增 SEO 文章模板

> 使用方式：複製本檔內容，建立到 `_guides/英文網址.md`。例如：`_guides/first-home-massage.md`。

```yaml
---
title: 第一次預約到府按摩，要準備什麼？
seo_title: 第一次預約到府按摩要準備什麼？完整清單｜Move Time
description: 60～160 字左右的搜尋摘要，直接回答這篇文章會解決什麼問題。
og_title: 第一次預約到府按摩，要準備什麼？｜Move Time
og_description: 給社群分享用的短摘要。
schema_headline: 第一次預約到府按摩，要準備什麼？Move Time 完整準備清單
h1: 第一次預約到府按摩，<br>要準備什麼？
breadcrumb: 第一次預約到府按摩
eyebrow: FIRST VISIT GUIDE
lede: 用 1～2 句直接回答搜尋者最在意的問題。
category: 第一次預約
summary: 顯示在知識庫首頁卡片上的 1～2 句摘要。
card_title: 第一次預約到府按摩，要準備什麼？
date: 2026-09-09
modified: 2026-09-09
order: 20
---

<div class="summary">
<strong>先看答案：</strong>先用 2～4 句給答案，不要先講背景故事。
</div>

## 第一個主要段落

正文。

## 第二個主要段落

正文。

{% include guide-cta.html location="article_middle" title="還不確定怎麼選？" text="把日期、區域與需求傳給客服，我們會協助確認。" primary_text="LINE 詢問" secondary_url="/services/" secondary_text="查看服務與價格" %}

## 常見問題

<section class="faq">
<details><summary>問題一？</summary><p>回答。</p></details>
<details><summary>問題二？</summary><p>回答。</p></details>
</section>

{% include guide-cta.html location="article_bottom" title="準備預約？" text="LINE 傳送日期、時間、區域與需求即可。" primary_text="LINE 立即詢問" secondary_url="/services/" secondary_text="先看服務與價格" %}
```

## 發布規則

1. 檔名只用小寫英文、數字、連字號，例如 `first-home-massage.md`。
2. `description` 每篇都要不同，不要複製同一段。
3. `date` 是首次發布日期；內容更新時只改 `modified`。
4. `order` 決定知識庫卡片順序：10、20、30……方便中間插入文章。
5. 一篇文章至少放 2～4 個有意義的站內連結。
6. 不要加入醫療診斷、治療、療效保證等宣稱。
7. Commit 到 `main` 後，GitHub Actions 會自動建置、更新 `/guide/` 與 `/sitemap.xml`。
