#!/usr/bin/env node
/**
 * 组装站点到 dist/，并在这一步剔除所有标记为 private 的内容。
 * 规则：
 *   - data/site.json 里 private:true 的整卷 → 不部署（页面与数据都不进 dist）
 *   - data/*.json 里 private:true 的单条 → 从部署数据里删掉（本地仍可见）
 * 只要没进 dist，GitHub Pages 就永远看不到它。这就是“隐藏”的全部机制。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const writeJSON = (p, o) => fs.writeFileSync(p, JSON.stringify(o, null, 2) + '\n');

function rmrf(p) { fs.rmSync(p, { recursive: true, force: true }); }
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

rmrf(DIST);
fs.mkdirSync(path.join(DIST, 'data'), { recursive: true });

// 1) 卷清单：剔除 private 卷
const site = readJSON(path.join(ROOT, 'data/site.json'));
const volumes = site.volumes || [];
const publicVols = volumes.filter((v) => !v.private);
const droppedVols = volumes.length - publicVols.length;
writeJSON(path.join(DIST, 'data/site.json'), { ...site, volumes: publicVols });

// 2) 卷数据：剔除 private 条目
let droppedItems = 0;
for (const v of publicVols) {
  if (!v.data) continue;
  const src = path.join(ROOT, 'data', v.data);
  if (!fs.existsSync(src)) continue;
  const json = readJSON(src);
  const list = Array.isArray(json) ? json : (json.items || []);
  const kept = list.filter((it) => !(it && it.private));
  droppedItems += list.length - kept.length;
  const out = Array.isArray(json) ? kept : { ...json, items: kept };
  writeJSON(path.join(DIST, 'data', v.data), out);
}

// 3) 公共资源与页面
fs.copyFileSync(path.join(ROOT, 'index.html'), path.join(DIST, 'index.html'));
copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));
fs.mkdirSync(path.join(DIST, 'pages'), { recursive: true });
for (const v of publicVols) {
  if (!v.page) continue;
  const p = path.join(ROOT, 'pages', v.page);
  if (fs.existsSync(p)) fs.copyFileSync(p, path.join(DIST, 'pages', v.page));
}
fs.writeFileSync(path.join(DIST, '.nojekyll'), '');

console.log(
  `built dist/ · 分卷 ${publicVols.length}（隐藏 ${droppedVols}）· 条目剔除 ${droppedItems}`
);
