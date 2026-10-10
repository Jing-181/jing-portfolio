#!/usr/bin/env node
/**
 * data/*.md（事实源） → data/*.json（页面读取的内容集合）
 *
 * 约定：所有内容都记录在 md 里，json 只是处理产物，不手改、不入库。
 *   - data/site.md     分卷清单  →  data/site.json
 *   - data/tastes.md   喜好志条目 →  data/tastes.json
 *   - data/timeline.md 经历志节点 →  data/timeline.json
 *   - data/training.md 训练记录 →  data/training.json
 *
 * md 结构：
 *   --- 前置元信息（key: value）---
 *   ## 一级标题   （site.md = 卷标题；tastes.md = 分类名）
 *   ### 条目名    （tastes.md = 条目；timeline.md = 时间线节点）
 *   field: value
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'data');

/**
 * 中国传统色：名字 → 色值。
 * `hex` 用于分卷卡片等装饰；`accent / deep / soft` 是页面级主题色，
 * 需要保证深色文字压在纸底上仍有足够对比度（烟雨青偏浅，故加深后再用）。
 */
const PALETTE = {
  绛缨:   { hex: '#9E3B3B', accent: '#9E3B3B', deep: '#75302C', soft: '#F4E7E5' },
  烟雨青: { hex: '#6A8D8C', accent: '#4E7A78', deep: '#35554F', soft: '#E4EDEC' },
  黛蓝:   { hex: '#2A5C82', accent: '#2A5C82', deep: '#1E4462', soft: '#E3EAF2' },
  檀色:   { hex: '#8C6A4F', accent: '#8C6A4F', deep: '#6B4F3A', soft: '#F2EBE3' },
};

const read = (p) => fs.readFileSync(p, 'utf8');
const writeJSON = (p, o) => fs.writeFileSync(p, JSON.stringify(o, null, 2) + '\n');
const toBool = (v) => /^(true|yes|1|是)$/i.test(String(v == null ? '' : v).trim());

/** 拆出 --- 前置元信息 与正文行 */
function splitFrontMatter(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const meta = {};
  let i = 0;
  if ((lines[0] || '').trim() === '---') {
    i = 1;
    for (; i < lines.length; i++) {
      if (lines[i].trim() === '---') { i++; break; }
      const m = lines[i].match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
      if (m) meta[m[1]] = m[2].trim();
    }
  }
  return { meta, body: lines.slice(i) };
}

/** 把 md 里的颜色值解析成 hex：名字查表，`#hex` 原样返回 */
function resolveColor(v) {
  const s = String(v == null ? '' : v).trim();
  if (!s) return null;
  if (/^#[0-9a-fA-F]{3,8}$/.test(s)) return s;
  return PALETTE[s] ? PALETTE[s].hex : s;
}

/** 按给定顺序重排对象键，保证产物稳定 */
function orderKeys(obj, order) {
  const out = {};
  order.forEach((k) => { if (obj[k] !== undefined) out[k] = obj[k]; });
  Object.keys(obj).forEach((k) => { if (!(k in out)) out[k] = obj[k]; });
  return out;
}

/** data/site.md → 分卷清单对象 */
function parseSite(text) {
  const { meta, body } = splitFrontMatter(text);
  const volumes = [];
  let cur = null;
  for (const line of body) {
    const h = line.match(/^##\s+(.+?)\s*$/);           // ## 标题 = 卷标题
    if (h) { cur = { title: h[1] }; volumes.push(cur); continue; }
    if (!cur || !line.trim()) continue;
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    const k = kv[1], v = kv[2].trim();
    if (k === 'accent') cur.accent = resolveColor(v);
    else if (k === 'private') cur.private = toBool(v);
    else if (k === 'data') cur.data = v || null;
    else cur[k] = v;
  }
  const ORDER = ['no', 'id', 'title', 'subtitle', 'desc', 'page', 'data', 'accent', 'status', 'private'];
  return {
    owner: meta.owner || '',
    title: meta.title || '卷首',
    subtitle: meta.subtitle || '',
    lede: meta.lede || '',
    updated: meta.updated || '',
    volumes: volumes.map((v) => orderKeys({ private: false, ...v }, ORDER)),
  };
}

/** data/tastes.md → 喜好志数据对象 */
function parseTastes(text) {
  const { meta, body } = splitFrontMatter(text);
  const categories = (meta.categories || '')
    .split(/[,，]/).map((s) => s.trim()).filter(Boolean);
  const items = [];
  let cat = null, cur = null;
  for (const line of body) {
    const h2 = line.match(/^##\s+(.+?)\s*$/);          // ## 分类
    if (h2) { cat = h2[1]; cur = null; continue; }
    const h3 = line.match(/^###\s+(.+?)\s*$/);         // ### 条目名
    if (h3) { cur = { name: h3[1], category: cat || '其他' }; items.push(cur); continue; }
    if (!cur || !line.trim()) continue;
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    const k = kv[1].toLowerCase(), v = kv[2].trim();
    if (k === 'tags') cur.tags = v ? v.split(/[,，]/).map((s) => s.trim()).filter(Boolean) : [];
    else if (k === 'rating') cur.rating = Math.max(0, Math.min(5, parseInt(v, 10) || 0));
    else if (k === 'private') cur.private = toBool(v);
    else cur[k] = v;
  }
  return {
    vol: meta.vol || 'tastes',
    updated: meta.updated || '',
    categories,
    items: items.map((it) => orderKeys({
      name: it.name,
      category: it.category,
      rating: it.rating || 0,
      note: it.note || '',
      tags: it.tags || [],
      since: it.since || '',
      link: it.link || '',
      private: !!it.private,
    }, ['name', 'category', 'rating', 'note', 'tags', 'since', 'link', 'private'])),
  };
}

/** data/timeline.md → 经历志数据对象
 *  节点直接写在 ### 下（本卷用 kind 字段分类，不用 ## 分组）。
 *  date 支持 `YYYY` / `YYYY-MM`，按 年*100+月 排序。
 */
function parseTimeline(text) {
  const { meta, body } = splitFrontMatter(text);
  const kinds = (meta.kinds || '')
    .split(/[,，]/).map((s) => s.trim()).filter(Boolean);
  const items = [];
  let cur = null;
  for (const line of body) {
    if (/^##\s+/.test(line)) { cur = null; continue; }  // ## 仅作分隔，不参与分类
    const h3 = line.match(/^###\s+(.+?)\s*$/);         // ### 节点标题
    if (h3) { cur = { title: h3[1] }; items.push(cur); continue; }
    if (!cur || !line.trim()) continue;
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    const k = kv[1].toLowerCase(), v = kv[2].trim();
    if (k === 'tags') cur.tags = v ? v.split(/[,，]/).map((s) => s.trim()).filter(Boolean) : [];
    else if (k === 'est' || k === 'private') cur[k] = toBool(v);
    else cur[k] = v;
  }
  const sortKey = (d) => {
    const m = String(d || '').match(/(\d{4})(?:\D+(\d{1,2}))?/);
    return m ? (+m[1]) * 100 + (m[2] ? +m[2] : 0) : 0;
  };
  items.sort((a, b) => sortKey(a.date) - sortKey(b.date));
  return {
    vol: meta.vol || 'timeline',
    updated: meta.updated || '',
    kinds,
    items: items.map((it) => orderKeys({
      date: String(it.date || ''),
      est: !!it.est,
      kind: it.kind || '生活',
      title: it.title,
      place: it.place || '',
      note: it.note || '',
      tags: it.tags || [],
      private: !!it.private,
    }, ['date', 'est', 'kind', 'title', 'place', 'note', 'tags', 'private'])),
  };
}

/** data/training.md → 训练志数据对象
 *  记录直接写在 ### 下；date 为 YYYY-MM-DD，新的在前。
 */
function parseTraining(text) {
  const { meta, body } = splitFrontMatter(text);
  const kinds = (meta.kinds || '')
    .split(/[,，]/).map((s) => s.trim()).filter(Boolean);
  const items = [];
  let cur = null;
  let lastKey = null;
  for (const line of body) {
    if (/^##\s+/.test(line)) { cur = null; lastKey = null; continue; }
    const h3 = line.match(/^###\s+(.+?)\s*$/);
    if (h3) { cur = { title: h3[1] }; items.push(cur); lastKey = null; continue; }
    if (!cur) continue;
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) {
      // 续行：缩进的行接在上一个字段后面（note 可以写成多行清单）
      if (lastKey && line.trim() && /^\s/.test(line)) cur[lastKey] += '\n' + line.trim();
      continue;
    }
    const k = kv[1].toLowerCase(), v = kv[2].trim();
    lastKey = k;
    if (k === 'tags') cur.tags = v ? v.split(/[,，]/).map((s) => s.trim()).filter(Boolean) : [];
    else if (k === 'private') cur.private = toBool(v);
    else cur[k] = v;
  }
  items.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  return {
    vol: meta.vol || 'training',
    updated: meta.updated || '',
    kinds,
    items: items.map((it) => orderKeys({
      date: String(it.date || ''),
      kind: it.kind || '其他',
      title: it.title,
      place: it.place || '',
      metric: it.metric || '',
      note: it.note || '',
      tags: it.tags || [],
      private: !!it.private,
    }, ['date', 'kind', 'title', 'place', 'metric', 'note', 'tags', 'private'])),
  };
}

/** 登记表：md 文件名 → 解析器。以后加卷在这里加一行即可。 */
const JOBS = [
  { md: 'site.md', json: 'site.json', parse: parseSite },
  { md: 'tastes.md', json: 'tastes.json', parse: parseTastes },
  { md: 'timeline.md', json: 'timeline.json', parse: parseTimeline },
  { md: 'training.md', json: 'training.json', parse: parseTraining },
];

function generate() {
  const report = [];
  for (const job of JOBS) {
    const src = path.join(DATA, job.md);
    if (!fs.existsSync(src)) continue;
    const out = job.parse(read(src));
    writeJSON(path.join(DATA, job.json), out);
    const n = Array.isArray(out.items) ? out.items.length : (out.volumes || []).length;
    report.push(`${job.md} → ${job.json}（${n} 条）`);
  }
  return report;
}

module.exports = { generate, parseSite, parseTastes, parseTimeline, parseTraining, resolveColor, PALETTE };

if (require.main === module) {
  const report = generate();
  console.log(report.length ? 'data/ ← md 生成：\n  ' + report.join('\n  ') : 'data/ 下没有找到 md 事实源');
}
