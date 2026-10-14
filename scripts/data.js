#!/usr/bin/env node
/**
 * data/*.md（事实源） → data/*.json（页面读取的内容集合）
 *
 * 约定：所有内容都记录在「主 md」里，json 只是处理产物，不手改、不入库。
 *   - data/site.md     分卷清单  →  data/site.json
 *   - data/tastes.md   喜好志条目 →  data/tastes.json
 *   - data/timeline.md 经历志节点 →  data/timeline.json
 *   - data/training.md 训练记录 →  data/training.json
 *   - data/resume.md   履历志整页 →  data/resume.json
 *
 * 原始素材（txt 表 / 导出 json / 描述 md）放在 data/sources/<卷>/，
 * 只被人和 AI 读，本脚本不解析、build 不打包。
 *
 * md 结构：
 *   --- 前置元信息（key: value）---
 *   ## 一级标题   （site.md = 卷标题；tastes.md = 分类名）
 *   ### 条目名    （tastes.md = 条目；timeline.md = 时间线节点）
 *   field: value
 */
const fs = require('fs');
const path = require('path');
const { deriveBlocks } = require('./workout-blocks');

const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'data');

/**
 * 训练志的上游：cat-newsroom 的运动记录导出。
 * 取 data/sources/training/workouts*.json 里「日期最新」的一个。
 * 按文件名里的 YYYY-MM-DD 排，而不是按文件名字符串：手存的 workouts-export-<日期>.json
 * 按字典序会排在自动拉的 workouts-<日期>.json 之后，把新数据顶掉。
 * 拿不到就返回 null，parseTraining 退回手写内容，不让构建挂掉。
 */
function loadWorkoutRecords() {
  const dir = path.join(DATA, 'sources', 'training');
  if (!fs.existsSync(dir)) return null;
  const stampOf = (f) => (f.match(/\d{4}-\d{2}-\d{2}/) || [''])[0];
  const files = fs.readdirSync(dir)
    .filter((f) => /^workouts.*\.json$/.test(f))
    .sort((a, b) => stampOf(a).localeCompare(stampOf(b)) || a.localeCompare(b));
  if (!files.length) return null;
  const file = files[files.length - 1];
  try {
    const raw = JSON.parse(read(path.join(dir, file)));
    const records = Array.isArray(raw) ? raw : (raw.sport || raw.records || raw.items || []);
    return { file, records };
  } catch (err) {
    console.warn(`训练记录读不动（${file}）：${err.message}`);
    return null;
  }
}

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

/** `标签=一句|标签=一句` → [{ k, v }]（用于 elements / stops） */
function pairs(v) {
  return String(v || '').split('|').map((s) => s.trim()).filter(Boolean).map((s) => {
    const i = s.indexOf('=');
    return i < 0 ? { k: '', v: s } : { k: s.slice(0, i).trim(), v: s.slice(i + 1).trim() };
  });
}

/**
 * 卷首语：第一个 `##` 之前、连续成段的第一批 `>` 行。
 * 页面只从 json 读它，不再把卷首语写在 HTML 里（两处存会漂）。
 * `**x**` 转成 <b>x</b>，与 resume.md 同一套约定。
 */
function takeLede(body) {
  const out = [];
  for (const line of body) {
    if (/^#{2,3}\s/.test(line)) break;
    const q = line.match(/^>\s?(.*)$/);
    if (q) { if (q[1].trim()) out.push(q[1].trim()); continue; }
    if (!line.trim()) { if (out.length) break; continue; }   // 一段 `>` 行就是卷首语，后面的是维护者注释
    if (out.length) break;                                   // 收完了，遇到正文就停
  }                                                        // 之前的前导行（如 `# 卷名`）略过
  const text = out.reduce((a, b) => (/[A-Za-z0-9]$/.test(a) && /^[A-Za-z0-9]/.test(b) ? a + ' ' + b : a + b), '');
  return text.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
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
    else if (k === 'lock') cur.lock = toBool(v);
    else if (k === 'data') cur.data = v || null;
    else cur[k] = v;
  }
  const ORDER = ['no', 'id', 'title', 'subtitle', 'desc', 'page', 'data', 'accent', 'status', 'private'];
  return {
    owner: meta.owner || '',
    title: meta.title || '卷首',
    subtitle: meta.subtitle || '',
    lede: meta.lede || '',
    prelude: meta.prelude || '',
    seal: meta.seal || '',
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
  const groups = [];
  let cat = null, cur = null, grp = null;
  for (const line of body) {
    const h2 = line.match(/^##\s+(.+?)\s*$/);          // ## 分组
    if (h2) { cat = h2[1]; cur = null; grp = { name: cat, sub: '' }; groups.push(grp); continue; }
    const h3 = line.match(/^###\s+(.+?)\s*$/);         // ### 条目名
    if (h3) { cur = { name: h3[1], category: cat || '其他' }; items.push(cur); continue; }
    if (!line.trim()) continue;
    if (!cur) {                                        // 分组下紧跟的 > 行是分组小注
      const q = line.match(/^>\s*(.+?)\s*$/);
      if (q && grp && !grp.sub) grp.sub = q[1];
      continue;
    }
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    const k = kv[1].toLowerCase(), v = kv[2].trim();
    if (k === 'tags') cur.tags = v ? v.split(/[,，]/).map((s) => s.trim()).filter(Boolean) : [];
    else if (k === 'rating') cur.rating = Math.max(0, Math.min(5, parseInt(v, 10) || 0));
    else if (k === 'elements') cur.elements = pairs(v);
    else if (k === 'stops') cur.stops = v ? v.split('|').map((s) => s.trim()).filter(Boolean) : [];
    else if (k === 'featured') cur.featured = toBool(v);
    else if (k === 'private') cur.private = toBool(v);
    else cur[k] = v;
  }
  return {
    vol: meta.vol || 'tastes',
    updated: meta.updated || '',
    lede: takeLede(body),
    categories,
    groups: groups.filter((g) => items.some((it) => it.category === g.name) || categories.includes(g.name)),
    items: items.map((it) => orderKeys({
      name: it.name,
      category: it.category,
      kind: it.kind || '签',
      tagline: it.tagline || '',
      elements: it.elements || [],
      stops: it.stops || [],
      roll: it.roll || '',
      note: it.note || '',
      tags: it.tags || [],
      since: it.since || '',
      link: it.link || '',
      featured: !!it.featured,
      private: !!it.private,
    }, ['name', 'category', 'kind', 'tagline', 'elements', 'stops', 'roll', 'note', 'tags', 'since', 'link', 'featured', 'private'])),
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
    lede: takeLede(body),
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
 *  按 `##` 分区摆块（页面按 section 分组渲染），不再是一条按天倒的流水：
 *    ## 概览       → stats（label=标题，value=metric，sub=note）
 *    其余 ##       → items，各自带 section / part
 *  date 为 YYYY-MM-DD，新的在前。
 *
 *  「常用动作」「样例训练日」不写 md，从 sources/training 的运动记录算（见 workout-blocks.js）；
 *  传了 records 就用算出来的，没传就退回 md 里手写的那两段（兼容旧文件，也方便离线构建）。
 */
function parseTraining(text, source) {
  const { meta, body } = splitFrontMatter(text);
  const kinds = (meta.kinds || '')
    .split(/[,，]/).map((s) => s.trim()).filter(Boolean);
  const items = [];
  const movements = [];
  const stats = [];
  let cur = null;
  let lastKey = null;
  let mode = 'items';
  let section = '';
  const seq = {};
  for (const line of body) {
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h2) {
      section = h2[1];
      if (/常用动作/.test(section)) mode = 'movements';
      else if (/概览/.test(section)) mode = 'stats';
      else mode = 'items';
      cur = null; lastKey = null;
      continue;
    }
    const h3 = line.match(/^###\s+(.+?)\s*$/);
    if (h3) {
      cur = { title: h3[1] };
      if (mode === 'movements') movements.push(cur);
      else if (mode === 'stats') stats.push(cur);
      else { cur.section = section; cur.seq = (seq[section] = (seq[section] || 0) + 1); items.push(cur); }
      lastKey = null;
      continue;
    }
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
  const derived = source && source.records && source.records.length
    ? deriveBlocks(source.records, { file: source.file })
    : null;
  const sampleDays = items.filter((it) => it.section === '样例训练日');
  return {
    vol: meta.vol || 'training',
    updated: meta.updated || '',
    lede: takeLede(body),
    kinds,
    stats: stats.map((s) => orderKeys({
      label: s.title,
      value: s.metric || '',
      sub: s.note || '',
    }, ['label', 'value', 'sub'])),
    // 数据来源写在产物里，页面底部能说清「这份形状是从哪算的、到哪天」
    records: derived ? derived.records : null,
    days: derived ? derived.days : sampleDays.map((it) => orderKeys({
      date: String(it.date || ''),
      title: it.title,
      part: it.part || '',
      metric: it.metric || '',
      note: it.note || '',
      tags: it.tags || [],
    }, ['date', 'title', 'part', 'metric', 'note', 'tags'])),
    movements: (derived ? derived.movements : movements).map((m) => orderKeys({
      name: m.name || m.title || '',
      part: m.part || '',
      load: m.load || '',
      meta: m.meta || '',
      note: m.note || '',
      tags: m.tags || [],
    }, ['name', 'part', 'load', 'meta', 'note', 'tags'])),
    items: items.map((it) => orderKeys({
      date: String(it.date || ''),
      kind: it.kind || '其他',
      title: it.title,
      section: it.section || '',
      seq: it.seq || 0,
      part: it.part || '',
      place: it.place || '',
      metric: it.metric || '',
      note: it.note || '',
      tags: it.tags || [],
      private: !!it.private,
    }, ['date', 'kind', 'title', 'section', 'seq', 'part', 'place', 'metric', 'note', 'tags', 'private'])),
  };
}

/** data/resume.md → 履历志数据对象
 *  整页分块：## 卷首 / 关于 / 技术能力 / 技术标签云 / 工作方式 / 精选项目 / 其他经验 / 经历 / 联系 / 页脚。
 *  块名中英混排、字段多为自由文本；`**x**` 统一转成 <b>x</b>，`|` 拆段，`- ` 行是一个子项。
 */
function parseResume(text) {
  const { meta, body } = splitFrontMatter(text);
  const inline = (s) => String(s == null ? '' : s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  const csv = (v) => String(v == null ? '' : v).split(/[,，]/).map((s) => s.trim()).filter(Boolean);
  const parts = (v) => String(v == null ? '' : v).split('|').map((s) => s.trim());

  const R = {
    vol: meta.vol || 'resume',
    updated: meta.updated || '',
    meta: { title: meta.title || '', description: meta.description || '' },
    hero: { eyebrow: [], name: '', nameEm: '', role: '', desc: '', tags: [], motto: '', mottoEm: '', mottoSub: '' },
    about: { tag: '', title: '', paragraphs: [], quoteLabel: '', quote: '', facts: [] },
    skills: { tag: '', title: '', groups: [] },
    tagcloud: { title: '', groups: [] },
    workflow: { tag: '', title: '', group: '', gsub: '', steps: [], deliveryTitle: '', delivery: [] },
    projects: { tag: '', title: '', items: [] },
    more: { title: '', items: [] },
    experience: { tag: '', title: '', items: [] },
    contact: { tag: '', title: '', desc: '', links: [] },
    footer: { left: '', right: '' },
  };

  let block = '';
  let sub = null;      // 当前 ### 子项对象
  let subKind = '';    // skill | step | project | exp

  const setField = (k, v) => {
    v = String(v == null ? '' : v).trim();
    switch (block) {
      case '卷首':
        if (k === 'eyebrow') R.hero.eyebrow = csv(v);
        else if (k === 'tags') R.hero.tags = csv(v);
        else if (k === 'name') R.hero.name = v;
        else if (k === 'nameem') R.hero.nameEm = v;
        else if (k === 'role') R.hero.role = inline(v);
        else if (k === 'desc') R.hero.desc = inline(v);
        else if (k === 'motto') R.hero.motto = v;
        else if (k === 'mottoem') R.hero.mottoEm = v;
        else if (k === 'mottosub') R.hero.mottoSub = v;
        break;
      case '关于':
        if (k === 'tag') R.about.tag = v;
        else if (k === 'title') R.about.title = v;
        else if (k === 'p') R.about.paragraphs.push(inline(v));
        else if (k === 'quotelabel') R.about.quoteLabel = v;
        else if (k === 'quote') R.about.quote = inline(v);
        else if (k === 'fact') { const a = parts(v); R.about.facts.push({ k: a[0] || '', v: inline(a[1] || ''), href: a[2] || '' }); }
        break;
      case '技术能力':
        if (subKind === 'skill' && sub) {
          if (k === 'level') sub.level = v;
          else if (k === 'sub') sub.sub = v;
        } else if (k === 'tag') R.skills.tag = v;
        else if (k === 'title') R.skills.title = v;
        break;
      case '技术标签云':
        if (k === 'title') R.tagcloud.title = v;
        else if (k === 'fw') R.tagcloud.groups.push({ cls: 'k-fw', tags: csv(v) });
        else if (k === 'eng') R.tagcloud.groups.push({ cls: 'k-eng', tags: csv(v) });
        else if (k === 'lib') R.tagcloud.groups.push({ cls: 'k-lib', tags: csv(v) });
        break;
      case '工作方式':
        if (k === 'deliverytitle') R.workflow.deliveryTitle = v;
        else if (k === 'delivery') R.workflow.delivery = csv(v);
        else if (subKind === 'step' && sub) {
          if (k === 'num') sub.num = v;
          else if (k === 'desc') sub.desc = v;
        } else if (k === 'tag') R.workflow.tag = v;
        else if (k === 'title') R.workflow.title = v;
        else if (k === 'group') R.workflow.group = v;
        else if (k === 'gsub') R.workflow.gsub = v;
        break;
      case '精选项目':
        if (subKind === 'project' && sub) {
          if (k === 'num') sub.num = v;
          else if (k === 'role') sub.role = v;
          else if (k === 'co') sub.co = toBool(v);
          else if (k === 'stack') sub.stack = v;
          else if (k === 'desc') sub.desc = v;
          else if (k === 'point') sub.points.push(inline(v));
          else if (k === 'prove') sub.prove = v;
          else if (k === 'link') { const a = parts(v); sub.link = { text: a[0] || '', href: a[1] || '' }; }
        } else if (k === 'tag') R.projects.tag = v;
        else if (k === 'title') R.projects.title = v;
        break;
      case '其他经验':
        if (k === 'title') R.more.title = v;
        break;
      case '经历':
        if (subKind === 'exp' && sub) {
          if (k === 'variant') sub.variant = v;
          else if (k === 'time') sub.time = v;
          else if (k === 'sub') sub.sub = v;
          else if (k === 'extra') sub.extra = v;
          else if (k === 'list') sub.list.push(inline(v));
        } else if (k === 'tag') R.experience.tag = v;
        else if (k === 'title') R.experience.title = v;
        break;
      case '联系':
        if (k === 'tag') R.contact.tag = v;
        else if (k === 'title') R.contact.title = v;
        else if (k === 'desc') R.contact.desc = v;
        else if (k === 'link') { const a = parts(v); R.contact.links.push({ label: a[0] || '', href: a[1] || '', style: a[2] || '' }); }
        break;
      case '页脚':
        if (k === 'left') R.footer.left = v;
        else if (k === 'right') R.footer.right = v;
        break;
    }
  };

  for (const line of body) {
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h2) { block = h2[1]; sub = null; subKind = ''; continue; }
    const h3 = line.match(/^###\s+(.+?)\s*$/);
    if (h3) {
      const t = h3[1];
      if (block === '技术能力') { sub = { name: t, level: '', sub: '', items: [] }; subKind = 'skill'; R.skills.groups.push(sub); }
      else if (block === '工作方式') { sub = { title: t, num: '', desc: '' }; subKind = 'step'; R.workflow.steps.push(sub); }
      else if (block === '精选项目') { sub = { num: '', title: t, role: '', co: false, stack: '', desc: '', points: [], prove: '', link: null }; subKind = 'project'; R.projects.items.push(sub); }
      else if (block === '经历') { sub = { title: t, variant: '', time: '', sub: '', extra: '', list: [] }; subKind = 'exp'; R.experience.items.push(sub); }
      else { sub = null; subKind = ''; }
      continue;
    }
    if (!line.trim()) continue;
    const bullet = line.match(/^\s*-\s+(.*)$/);
    if (bullet) {
      const v = bullet[1].trim();
      if (block === '技术能力' && subKind === 'skill' && sub) {
        const a = parts(v);
        sub.items.push({ name: a[0] || '', scene: a[1] || '', evi: a[2] || '' });
      } else if (block === '其他经验') {
        const a = parts(v);
        R.more.items.push({ name: a[0] || '', type: a[1] || '', desc: inline(a[2] || '') });
      }
      continue;
    }
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    setField(kv[1].toLowerCase(), kv[2]);
  }

  return R;
}

/** 登记表：md 文件名 → 解析器。以后加卷在这里加一行即可。 */
const JOBS = [
  { md: 'site.md', json: 'site.json', parse: parseSite },
  { md: 'tastes.md', json: 'tastes.json', parse: parseTastes },
  { md: 'timeline.md', json: 'timeline.json', parse: parseTimeline },
  { md: 'training.md', json: 'training.json', parse: parseTraining },
  { md: 'resume.md', json: 'resume.json', parse: parseResume },
];

function generate() {
  const report = [];
  for (const job of JOBS) {
    const src = path.join(DATA, job.md);
    if (!fs.existsSync(src)) continue;
    const source = job.md === 'training.md' ? loadWorkoutRecords() : undefined;
    const out = job.parse(read(src), source);
    writeJSON(path.join(DATA, job.json), out);
    const n = Array.isArray(out.items) ? out.items.length
      : Array.isArray(out.volumes) ? out.volumes.length
      : Array.isArray(out.projects && out.projects.items) ? out.projects.items.length : 0;
    report.push(`${job.md} → ${job.json}（${n} 条）`);
  }
  return report;
}

module.exports = { generate, parseSite, parseTastes, parseTimeline, parseTraining, parseResume, resolveColor, PALETTE };

if (require.main === module) {
  const report = generate();
  console.log(report.length ? 'data/ ← md 生成：\n  ' + report.join('\n  ') : 'data/ 下没有找到 md 事实源');
}
