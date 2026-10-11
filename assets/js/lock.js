/* 口令门：拦随手，不拦有心人。
 *
 * 说清楚尺度：这不是安全机制。口令在前端比对，页面数据和源码仍是公开可读的，
 * 挡住的是"随手点进来的人"，不是"存心要看的人"。要真安全，得让内容根本不公开。
 *
 * 机制：
 *   - 门是 HTML 里静态摆好的（见 assets/css/lock.css 的说明），首帧即遮住内容，不会闪。
 *   - 口令只做本地 SHA-256 比对，不进网络。
 *   - 解锁状态存 sessionStorage，同一浏览器会话内通行，关掉标签页即失效。
 *   - 首页（卷首）不自动设门，只在点「需口令」的卷时调 window.__askPass() 弹门。
 *
 * 改口令：
 *   node -e "console.log(require('crypto').createHash('sha256').update('你的新口令').digest('hex'))"
 *   把输出的 64 位十六进制替换下面的 HASH；门上的文案改各页 HTML 里的静态标记。
 */
(function () {
  var KEY = 'jing-unlock';
  // HASH 对应的当前口令：jing2026
  var HASH = '13866cf8eae1190617fdd93d93ef0fcda588ee37e856f76262bd09b8ffe2d308';
  var WRONG = '口令不对，再想想';

  function unlocked() {
    try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }
  function mark() {
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    document.documentElement.classList.add('pass');
  }
  function sha256(s) {
    var data = new TextEncoder().encode(s);
    return crypto.subtle.digest('SHA-256', data).then(function (buf) {
      var b = new Uint8Array(buf), out = '';
      for (var i = 0; i < b.length; i++) out += ('0' + b[i].toString(16)).slice(-2);
      return out;
    });
  }

  function findGate() { return document.getElementById('lock-gate'); }

  function buildGate() {
    var g = document.createElement('div');
    g.className = 'lock-gate';
    g.id = 'lock-gate';
    g.setAttribute('role', 'dialog');
    g.setAttribute('aria-modal', 'true');
    g.setAttribute('aria-label', '口令');
    g.innerHTML =
      '<div class="lock-card">' +
        '<div class="lock-seal">Jing</div>' +
        '<h2 class="lock-title">这一卷，只给自己看</h2>' +
        '<div class="lock-row">' +
          '<input class="lock-input" type="password" autocomplete="off" spellcheck="false" aria-label="口令">' +
          '<button class="lock-btn" type="button">进</button>' +
        '</div>' +
        '<p class="lock-hint">输入口令</p>' +
      '</div>';
    document.body.appendChild(g);
    return g;
  }

  /* 把门接上。同一个门只会接一次，重复调用只更新回调。 */
  function wire(gate, onDone, onCancel) {
    gate.__onDone = onDone || null;
    gate.__onCancel = onCancel || null;

    var input = gate.querySelector('.lock-input');
    if (gate.__wired) {
      input.value = '';
      setTimeout(function () { input.focus(); }, 40);
      return;
    }
    gate.__wired = true;

    var card = gate.querySelector('.lock-card');
    var btn = gate.querySelector('.lock-btn');
    var hint = gate.querySelector('.lock-hint');
    var cancel = gate.querySelector('.lock-cancel');
    var defaultHint = hint.textContent;

    function wrong() {
      card.classList.remove('shake');
      void card.offsetWidth; // 重启动画
      card.classList.add('shake');
      hint.textContent = WRONG;
      input.value = '';
      input.focus();
    }
    function pass() {
      mark();
      gate.classList.add('off');
      document.documentElement.style.overflow = '';
      setTimeout(function () {
        gate.hidden = true;
        gate.classList.remove('off');
      }, 340);
      if (gate.__onDone) gate.__onDone();
    }
    function dismiss() {
      gate.hidden = true;
      document.documentElement.style.overflow = '';
      if (gate.__onCancel) gate.__onCancel();
    }
    function tryUnlock() {
      var v = input.value.trim();
      if (!v) { input.focus(); return; }
      sha256(v).then(function (h) { h === HASH ? pass() : wrong(); }).catch(wrong);
    }

    btn.addEventListener('click', tryUnlock);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') tryUnlock();
      else if (e.key === 'Escape' && cancel) dismiss();
    });
    if (cancel) cancel.addEventListener('click', dismiss);
    setTimeout(function () { input.focus(); }, 60);
  }

  /* 卷内页：门在 HTML 里，直接接上 */
  function autoGate() {
    var gate = findGate();
    if (!gate || gate.hidden) return;              // 首页的门是隐藏的，按需再开
    if (unlocked()) { gate.remove(); return; }     // 已解锁（正常由 html.pass 藏掉），兜底撤门
    if (!(window.crypto && window.crypto.subtle)) {
      // 环境不支持 WebCrypto（如 file:// 打开）时不设门，避免把人挡在自家门外
      console.warn('[lock] 当前环境不支持 WebCrypto，已跳过口令门');
      gate.remove();
      return;
    }
    document.documentElement.style.overflow = 'hidden';
    wire(gate, null, null);
  }

  /* 首页：点被锁的卷时按需弹门
   *   onDone   验过口令后做什么（通常是跳到该卷页面）
   *   onCancel 放弃时做什么（传了才给「算了」按钮，可 Esc 关掉）
   */
  window.__askPass = function (title, onDone, onCancel) {
    if (unlocked()) { if (onDone) onDone(); return; }
    var gate = findGate() || buildGate();
    var t = gate.querySelector('.lock-title');
    if (title && t) t.textContent = title;
    var card = gate.querySelector('.lock-card');
    var has = gate.querySelector('.lock-cancel');
    if (onCancel && !has) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'lock-cancel';
      b.textContent = '算了';
      card.appendChild(b);
    } else if (!onCancel && has) {
      has.remove();
    }
    gate.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    wire(gate, onDone, onCancel);
  };
  window.__unlocked = unlocked;

  if (document.body) autoGate();
  else document.addEventListener('DOMContentLoaded', autoGate);
})();
