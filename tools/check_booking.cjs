// Exercise the real homepage handler with simulated transport; never send a booking.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const html = fs.readFileSync(process.argv[2] || path.join(__dirname, '../index.html'), 'utf8');
const start = html.indexOf('async function submitForm(){');
const end = html.indexOf('\ndocument.querySelectorAll(', start);
assert(start >= 0 && end > start, 'Homepage booking handler must exist');

async function check(scenario) {
  const fields = Object.fromEntries(['fn', 'fp', 'fs', 'ft', 'fa', 'fno', 'fw', 'fsuc']
    .map(id => [id, { value: '', style: {} }]));
  fields.fn.value = scenario === 'empty' ? '' : 'TEST ONLY';
  fields.fp.value = scenario === 'empty' ? '' : '0000000000';
  fields.fsuc.style.display = 'none';
  const label = { textContent: '送出預約申請' };
  const button = { disabled: false, querySelector: () => label };
  const alerts = [];
  let calls = 0, timer, cleared = false;
  const context = vm.createContext({
    document: { getElementById: id => fields[id], querySelector: () => button },
    URLSearchParams, AbortController, console,
    alert: text => alerts.push(text),
    setTimeout: (fn, ms) => { assert.equal(ms, 15000); timer = fn; return 1; },
    clearTimeout: () => { cleared = true; },
    fetch: async (url, options) => {
      calls++;
      assert.equal(new URL(url).searchParams.get('userName'), 'TEST ONLY');
      assert.equal(options.mode, 'no-cors');
      if (scenario === 'failure') throw new Error('Network unavailable');
      if (scenario === 'timeout') return new Promise((resolve, reject) => {
        options.signal.addEventListener('abort', () => reject(new Error('Aborted')));
        queueMicrotask(timer);
      });
      return { type: 'opaque', status: 0 };
    }
  });
  vm.runInContext(html.slice(start, end), context);
  await context.submitForm();
  assert.equal(calls, scenario === 'empty' ? 0 : 1);
  if (scenario === 'opaque') {
    assert.equal(fields.fsuc.style.display, 'block');
    assert(!html.includes('我們已收到您的申請'), 'Opaque response cannot prove receipt');
  } else {
    assert.equal(fields.fsuc.style.display, 'none');
    assert.notEqual(fields.fw.style.display, 'none');
    assert.equal(button.disabled, false);
    assert.equal(alerts.length, 1);
    assert.equal(fields.fn.value, scenario === 'empty' ? '' : 'TEST ONLY');
  }
  if (scenario !== 'empty') assert(cleared, 'Timeout must be cleared');
  console.log(`PASS booking: ${scenario}`);
}
(async () => {
  for (const scenario of ['empty', 'failure', 'timeout', 'opaque']) await check(scenario);
})().catch(error => { console.error(error); process.exitCode = 1; });
