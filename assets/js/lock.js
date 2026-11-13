/* 口令门：拦随手，不拦有心人。
 *
 * 说清楚尺度：这不是安全机制。口令在前端比对，页面数据和源码仍是公开可读的，
 * 挡住的是"随手点进来的人"，不是"存心要看的人"。要真安全，得让内容根本不公开。
 *
 * 机制：
 *   - 门是 HTML 里静态摆好的（见 assets/css/lock.css 的说明），首帧即遮住内容，不会闪。
 *   - 口令只做本地 SHA-256 比对，不进网络。哈希是页内算的，不依赖 WebCrypto：
 *     crypto.subtle 只在 HTTPS 与 localhost 下存在，用局域网 IP、Tailscale IP 或 file:// 打开时是
 *     undefined，拿它校验会直接抛异常，门就永远过不去。所以这里自带一份纯 JS 实现。
 *   - 解锁状态存 sessionStorage，同一浏览器会话内通行，关掉标签页即失效。
 *   - 首页（卷首）不自动设门，只在点「需口令」的卷时调 window.__askPass() 弹门。
 *
 * 改口令：
 *   node -e "console.log(require('crypto').createHash('sha256').update('你的新口令').digest('hex'))"
 *   把输出的 64 位十六进制替换下面的 HASH；门上的文案改各页 HTML 里的静态标记。
 */
(function () {
  var KEY = 'jing-unlock';
  var HASH = '13866cf8eae1190617fdd93d93ef0fcda588ee37e856f76262bd09b8ffe2d308';
  var WRONG = '口令不对，再想想';

  function unlocked() {
    try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }
  function mark() {
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    document.documentElement.classList.add('pass');
  }
  /* 纯 JS 的 SHA-256（同步）。用 WebCrypto 的话，非 HTTPS、非 localhost 的环境下
     crypto.subtle 是 undefined，局域网 IP 与 Tailscale 访问就永远验不过。官方口径本来就是
     「拦随手，不拦有心人」，不必为此依赖安全上下文。 */
  var SHA256_K = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
  ];
  function sha256Hex(str) {
    var bytes = new TextEncoder().encode(str);
    var l = bytes.length;
    var total = (((l + 8) >> 6) + 1) << 6;
    var m = new Uint8Array(total);
    m.set(bytes);
    m[l] = 0x80;
    var bits = l * 8;
    m[total - 4] = (bits >>> 24) & 255;
    m[total - 3] = (bits >>> 16) & 255;
    m[total - 2] = (bits >>> 8) & 255;
    m[total - 1] = bits & 255;
    var H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    var w = new Uint32Array(64);
    var K = SHA256_K;
    function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }
    for (var i = 0; i < total; i += 64) {
      for (var t = 0; t < 16; t++) {
        w[t] = (m[i + t * 4] << 24) | (m[i + t * 4 + 1] << 16) | (m[i + t * 4 + 2] << 8) | m[i + t * 4 + 3];
      }
      for (t = 16; t < 64; t++) {
        var s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
        var s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
      }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (t = 0; t < 64; t++) {
        var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        var ch = (e & f) ^ (~e & g);
        var t1 = (h + S1 + ch + K[t] + w[t]) >>> 0;
        var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var t2 = (S0 + maj) >>> 0;
        h = g; g = f; f = e; e = (d + t1) >>> 0;
        d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
      H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
    }
    var out = '';
    for (var k = 0; k < 8; k++) out += ('00000000' + H[k].toString(16)).slice(-8);
    return out;
  }
  function hashable() {
    return typeof TextEncoder !== 'undefined' && typeof Uint8Array !== 'undefined';
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
      var h;
      try { h = sha256Hex(v); } catch (err) { hint.textContent = '这个浏览器算不了口令'; return; }
      if (h === HASH) pass(); else wrong();
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
    if (!hashable()) {
      // 环境太老（无 TextEncoder）时不设门，避免把人挡在自家门外
      console.warn('[lock] 当前环境不支持 TextEncoder，已跳过口令门');
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
