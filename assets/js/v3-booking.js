/* 幕府時代 Move Time — LINE 預約訊息整理工具（V3）
   只在瀏覽器內組合文字：不傳送、不儲存、不放進網址。
   預約是否成立，以客服在 LINE 回覆確認為準。 */
(function () {
  'use strict';
  var form = document.getElementById('booker');
  if (!form) return;

  var fields = {
    name: form.querySelector('#bk-name'),
    service: form.querySelector('#bk-service'),
    time: form.querySelector('#bk-time'),
    area: form.querySelector('#bk-area'),
    phone: form.querySelector('#bk-phone'),
    notes: form.querySelector('#bk-notes')
  };
  var preview = form.querySelector('#bk-preview');
  var status = form.querySelector('#bk-status');
  var copyBtn = form.querySelector('#bk-copy');
  var required = ['name', 'service', 'time', 'area'];
  var copiedOnce = false;

  function val(k) { return fields[k] ? fields[k].value.trim() : ''; }

  function buildText() {
    var lines = ['【幕府時代 預約詢問】'];
    lines.push('稱呼：' + (val('name') || '（未填）'));
    lines.push('服務：' + (val('service') || '（未選）'));
    lines.push('希望時段：' + (val('time') || '（未填）'));
    lines.push('區域：' + (val('area') || '（未選）'));
    if (val('phone')) lines.push('電話：' + val('phone'));
    if (val('notes')) lines.push('其他：' + val('notes'));
    lines.push('', '想確認阿凱師傅是否可以安排，謝謝！');
    return lines.join('\n');
  }

  function refresh() { preview.value = buildText(); }

  function setStatus(msg, kind) {
    status.textContent = msg;
    status.className = 'booker-status' + (kind ? ' ' + kind : '');
  }

  function copyFallback(text) {
    preview.removeAttribute('readonly');
    preview.focus();
    preview.select();
    preview.setSelectionRange(0, text.length);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    preview.setAttribute('readonly', '');
    return ok;
  }

  Object.keys(fields).forEach(function (k) {
    if (!fields[k]) return;
    fields[k].addEventListener('input', function () {
      fields[k].removeAttribute('aria-invalid');
      if (copiedOnce) { copiedOnce = false; copyBtn.textContent = '① 複製預約訊息'; setStatus('內容有修改，請重新複製。', ''); }
      refresh();
    });
    fields[k].addEventListener('change', refresh);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var missing = required.filter(function (k) { return !val(k); });
    required.forEach(function (k) {
      if (missing.indexOf(k) > -1) fields[k].setAttribute('aria-invalid', 'true');
    });
    if (missing.length) {
      var labels = { name: '稱呼', service: '服務', time: '希望時段', area: '區域' };
      setStatus('請先填寫：' + missing.map(function (k) { return labels[k]; }).join('、'), 'err');
      fields[missing[0]].focus();
      return;
    }
    var text = buildText();
    preview.value = text;

    var done = function (ok) {
      if (ok) {
        copiedOnce = true;
        copyBtn.textContent = '已複製 ✓';
        setStatus('已複製。下一步：開啟 LINE，在聊天室貼上並送出。客服回覆確認後，預約才成立。', 'ok');
        if (window.gtag) window.gtag('event', 'booking_copy', { service: val('service'), area: val('area') });
      } else {
        setStatus('這個瀏覽器無法自動複製。請長按上方訊息框全選複製，再到 LINE 貼上。', 'err');
        preview.focus();
        preview.select();
      }
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(copyFallback(text)); });
    } else {
      done(copyFallback(text));
    }
  });

  var lineBtn = form.querySelector('#bk-line');
  if (lineBtn) {
    lineBtn.addEventListener('click', function () {
      if (!copiedOnce) setStatus('提醒：還沒複製訊息。LINE 開啟後可以先打招呼，再回來按「複製預約訊息」。', '');
    });
  }

  refresh();
})();
