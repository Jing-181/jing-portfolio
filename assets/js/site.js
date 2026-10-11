// 全站共享交互：滚动淡入
(function () {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('on');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  function bind() {
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
  window.__revealBind = bind; // 供动态渲染后重新注册
})();

// 分卷完成度：从 data/site.json 读本卷状态，填进页面上的 #vol-state
window.__volState = function (id) {
  var el = document.getElementById('vol-state');
  if (!el) return;
  var base = /\/pages\//.test(location.pathname) ? '../' : '';
  fetch(base + 'data/site.json')
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (site) {
      var v = (site.volumes || []).filter(function (x) { return x.id === id; })[0];
      if (!v || !v.progress || v.progress === '已成') return;
      el.className = 'vol-state is-wip';
      el.textContent = '这一卷还没写完';
      el.hidden = false;
    })
    .catch(function () {});
};
