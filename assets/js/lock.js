/* 三卷共用的一道小门：拦随手，不拦有心人。
 *
 * 说清楚尺度：这不是安全机制。口令在前端比对，页面数据和源码仍是公开可读的，
 * 挡住的是"随手点进来的人"，不是"存心要看的人"。要真安全，得让内容根本不公开。
 *
 * 机制：
 *   - 口令只做本地 SHA-256 比对，不进网络。
 *   - 解锁状态存在 sessionStorage，同一浏览器会话内三卷通行，关掉标签页即失效。
 *
 * 改口令：
 *   node -e "console.log(require('crypto').createHash('sha256').update('你的新口令').digest('hex'))"
 *   把输出的 64 位十六进制替换下面的 HASH 即可。
 */
(function () {
  var KEY = 'jing-unlock';
  // HASH 对应的当前口令：jing2026
  var HASH = '13866cf8eae1190617fdd93d93ef0fcda588ee37e856f76262bd09b8ffe2d308';

  var SEAL = 'Jing';
  var TITLE = '这一卷，只给自己看';
  var HINT = '输入口令';
  var WRONG = '口令不对，再想想';
  var BTN = '进';

  var CSS = '' +
    '.lock-gate{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;' +
      'justify-content:center;background:var(--paper,#FAF7F2);padding:24px;' +
      'opacity:0;transition:opacity .4s ease}' +
    '.lock-gate.on{opacity:1}' +
    '.lock-card{width:100%;max-width:340px;text-align:center;' +
      'font-family:var(--serif,Georgia,serif)}' +
    '.lock-seal{display:inline-flex;align-items:center;justify-content:center;' +
      'width:46px;height:46px;border-radius:5px;background:var(--accent,#9E3B3B);' +
      'color:#FCFAF6;font-family:var(--mono,monospace);font-size:14px;' +
      'letter-spacing:.02em;margin-bottom:22px}' +
    '.lock-title{margin:0 0 26px;font-size:20px;font-weight:600;' +
      'color:var(--ink,#2b2b2b);letter-spacing:.04em}' +
    '.lock-row{display:flex;gap:10px;align-items:stretch}' +
    '.lock-input{flex:1;min-width:0;border:0;border-bottom:1.5px solid var(--line,#dcdcdc);' +
      'background:transparent;padding:10px 2px;font-family:var(--mono,monospace);' +
      'font-size:16px;color:var(--ink,#2b2b2b);outline:none;text-align:center;' +
      'letter-spacing:.28em;transition:border-color .2s}' +
    '.lock-input:focus{border-color:var(--accent,#9E3B3B)}' +
    '.lock-btn{border:0;border-radius:4px;background:var(--accent,#9E3B3B);color:#FCFAF6;' +
      'font-family:var(--serif,serif);font-size:15px;padding:0 18px;cursor:pointer;' +
      'transition:background .2s}' +
    '.lock-btn:hover{background:var(--accent-deep,var(--accent,#9E3B3B))}' +
    '.lock-hint{margin:16px 0 0;min-height:1.2em;font-size:12.5px;letter-spacing:.06em;' +
      'color:var(--muted,#999);font-family:var(--sans,system-ui,sans-serif)}' +
    '.lock-card.shake{animation:lock-shake .4s}' +
    '@keyframes lock-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}' +
      '40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}';

  function unlocked() {
    try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }
  function setScrollLock(on) {
    document.documentElement.style.overflow = on ? 'hidden' : '';
  }
  function sha256(s) {
    var data = new TextEncoder().encode(s);
    return crypto.subtle.digest('SHA-256', data).then(function (buf) {
      var b = new Uint8Array(buf), out = '';
      for (var i = 0; i < b.length; i++) out += ('0' + b[i].toString(16)).slice(-2);
      return out;
    });
  }

  function build() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var gate = document.createElement('div');
    gate.className = 'lock-gate';
    gate.setAttribute('role', 'dialog');
    gate.setAttribute('aria-modal', 'true');
    gate.setAttribute('aria-label', '口令');
    gate.innerHTML =
      '<div class="lock-card">' +
        '<div class="lock-seal">' + SEAL + '</div>' +
        '<h2 class="lock-title">' + TITLE + '</h2>' +
        '<div class="lock-row">' +
          '<input class="lock-input" type="password" autocomplete="off" spellcheck="false" aria-label="口令">' +
          '<button class="lock-btn" type="button">' + BTN + '</button>' +
        '</div>' +
        '<p class="lock-hint">' + HINT + '</p>' +
      '</div>';
    document.body.appendChild(gate);
    setScrollLock(true);
    requestAnimationFrame(function () { gate.classList.add('on'); });

    var card = gate.querySelector('.lock-card');
    var input = gate.querySelector('.lock-input');
    var btn = gate.querySelector('.lock-btn');
    var hint = gate.querySelector('.lock-hint');
    setTimeout(function () { input.focus(); }, 60);

    function wrong() {
      card.classList.remove('shake');
      void card.offsetWidth; // 重启动画
      card.classList.add('shake');
      hint.textContent = WRONG;
      input.value = '';
      input.focus();
    }
    function tryUnlock() {
      var v = input.value.trim();
      if (!v) { input.focus(); return; }
      sha256(v).then(function (h) {
        if (h === HASH) {
          try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
          gate.classList.remove('on');
          setScrollLock(false);
          setTimeout(function () { gate.remove(); }, 420);
        } else {
          wrong();
        }
      }).catch(wrong);
    }
    btn.addEventListener('click', tryUnlock);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') tryUnlock();
    });
  }

  function start() {
    if (unlocked()) return;
    if (!(window.crypto && window.crypto.subtle)) {
      // 环境不支持 WebCrypto（如 file:// 打开）时不设门，避免把人挡在自家门外
      console.warn('[lock] 当前环境不支持 WebCrypto，已跳过口令门');
      return;
    }
    build();
  }

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);
})();
