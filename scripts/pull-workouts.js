#!/usr/bin/env node
/**
 * 从 cat-newsroom 的云端把运动记录拉到本地，写成 data/sources/training/workouts-<日期>.json。
 * 拿到之后跑 `npm run data`，「常用动作」「样例训练日」就会按新数据重算。
 *
 * 读的是只读视图 public.sport_feed（建在 cat-newsroom 的
 * supabase/migrations/*_sport_readonly_feed.sql）：只给 sport，对 anon 开放 SELECT。
 * 所以这里**不需要任何秘密密钥**——用的 publishable key
 * 本来就在前端公开（见 cat-newsroom/supabase-sync.js）。
 *
 * 视图还没建时会拿到 404，脚本会把「先跑那条 migration」提示出来。
 *
 * 每次拉取先清掉上一份自动生成的文件（workouts-<日期>.json），只留最新一份；
 * 手存的 workouts-export-<日期>.json 不动，留着当离线兜底。
 *
 * 透镜还连不上、或不想连云时的退路：在 cat-newsroom 里点导出备份，
 * 把 json 里 data.sport 存成 sources/training/workouts-<日期>.json，效果一样。
 *
 * 用法：
 *   npm run training:pull
 *   SUPABASE_URL=… SUPABASE_PUBLISHABLE=… npm run training:pull   # 一般不用改
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

/** 从 .env.local 读一个键（只有本脚本用，不当全局环境变量） */
function fromEnvFile(key) {
  const file = path.join(ROOT, '.env.local');
  if (!fs.existsSync(file)) return '';
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][\w-]*)\s*=\s*(.*)\s*$/);
    if (m && m[1] === key) return m[2].replace(/^["']|["']$/g, '').trim();
  }
  return '';
}

const SUPABASE_URL = process.env.SUPABASE_URL || fromEnvFile('SUPABASE_URL') || 'https://qqtasmilusrpyxhrqptd.supabase.co';
// 公开的 publishable key，本来就写在前端，不是秘密；只读视图 sport_feed 允许 anon 读。
const SUPABASE_PUBLISHABLE = process.env.SUPABASE_PUBLISHABLE || fromEnvFile('SUPABASE_PUBLISHABLE') || 'sb_publishable_xnVYIwduEPYcIpV0aLSC0Q_Lz8U7nf5';
const VIEW = process.env.SPORT_VIEW || 'sport_feed';

const OUT_DIR = path.join(ROOT, 'data', 'sources', 'training');

// 自动拉取产物的命名：workouts-<日期>.json。手存的离线导出带 -export-，不匹配。
const AUTO_FILE_RE = /^workouts-\d{4}-\d{2}-\d{2}\.json$/;

/** 清掉上一轮自动拉的文件，只留 keep 那一份；返回被删的文件名 */
function pruneAutoFiles(dir, keep) {
  if (!fs.existsSync(dir)) return [];
  const removed = [];
  for (const f of fs.readdirSync(dir)) {
    if (AUTO_FILE_RE.test(f) && f !== keep) {
      fs.unlinkSync(path.join(dir, f));
      removed.push(f);
    }
  }
  return removed;
}

async function main() {
  const qs = new URLSearchParams({ select: 'id,updated_at,data', order: 'updated_at.asc' });
  const url = `${SUPABASE_URL}/rest/v1/${VIEW}?${qs}`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_PUBLISHABLE, Accept: 'application/json' },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error(
      `拉取失败：HTTP ${res.status}\n${body.slice(0, 400)}\n\n` +
      `若提示找不到 ${VIEW}，先在 Supabase 里执行 cat-newsroom 的\n` +
      'supabase/migrations/*_sport_readonly_feed.sql（建只读视图），再重试。'
    );
    process.exit(1);
  }

  const rows = await res.json();
  const records = rows.map((r) => r.data).filter(Boolean);
  if (!records.length) {
    console.error(
      `视图 ${VIEW} 里没有数据。可能的原因：\n` +
      '  · 视图过滤的 user_id 与记录里的不一致；\n' +
      '  · 云端本来就没有 sport 记录 —— 本地 localStorage 的记录不上云，只有登录正式账号同步过的才在表里。'
    );
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  const name = `workouts-${stamp}.json`;
  const out = path.join(OUT_DIR, name);
  const removed = pruneAutoFiles(OUT_DIR, name);
  fs.writeFileSync(out, JSON.stringify(records, null, 2) + '\n');

  const sessions = records.filter((r) => r.kind === 'workout_session' && r.schema_version === 2);
  const latest = sessions.map((r) => r.date).sort().pop() || '';
  console.log(
    `写入 ${path.relative(ROOT, out)}：${records.length} 条（其中训练 ${sessions.length} 次，最近 ${latest || '—'}）` +
    (removed.length ? `\n清掉上一份自动文件：${removed.join('、')}` : '') +
    '\n接着跑 `npm run data` 重算「常用动作」「样例训练日」。'
  );
}

main().catch((err) => { console.error(err.message || err); process.exit(1); });
