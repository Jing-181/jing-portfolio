#!/usr/bin/env node
/**
 * 训练志的「常用动作」「样例训练日」不再手写，从 cat-newsroom 的运动记录算出来。
 *
 * 输入：cat-newsroom `data.sport` 的原样导出（workout_session 数组），
 *       放在 data/sources/training/workouts*.json。
 * 输出：{ movements, days, records }，由 scripts/data.js 注进 training.json。
 *
 * 口径与 cat-newsroom 的 src/lib/workout.js 保持一致（那边是唯一事实源）：
 *   - 一条力量组以「次数 > 0」为有记录；自重（重量 0）也算，助力写负数。
 *   - 一条有氧组以「时长或距离 > 0」为有记录。
 *   - 容量 = 重量 × 次数，逐组累加（组不额外乘组数）。
 *   - 只取 status = completed 的 workout_session；草稿、旧版 progress 记录不进。
 *
 * 这份代码没有直接 import cat-newsroom 的模块：个人志在自己的 CI 里构建，
 * 那边仓库不一定在场。字段语义保持一致就够了，别让两个仓库在构建期互相依赖。
 */

const CARDIO_EQUIPMENT = ['有氧', '恢复'];
const BODYWEIGHT_EQUIPMENT = ['自重', '自重/器械', '哑铃/自重'];

// 一个训练日 id → 页面上的部位小签
const DAY_PART = {
  chest: '胸', back: '背', shoulders: '肩', legs: '腿',
  arms: '臂', full_body: '全身', cardio: '有氧',
};

// 记录里的 body_part 是解剖名（股四头、臀中肌…），页面上那排小签要粗一些。
const PART_RULES = [
  [/后链/, '后链'],
  [/心肺|有氧/, '有氧'],
  [/核心|腹/, '核心'],
  [/后束/, '后束'],
  [/三头/, '三头'],
  [/二头|肱/, '二头'],
  [/背阔|中背|斜方|背/, '背'],
  [/上胸|下胸|胸/, '胸'],
  [/中束|三角|肩/, '肩'],
  [/内收|外展|臀|股四头|腘绳|腿/, '腿'],
];

function coarsePart(bodyPart) {
  const s = String(bodyPart || '');
  for (const [re, label] of PART_RULES) if (re.test(s)) return label;
  return s;
}

const trim = (v) => Math.round(Number(v || 0) * 100) / 100;
const num = (v) => Number(v || 0);

const isSession = (r) => !!r && r.kind === 'workout_session' && r.schema_version === 2;
const isCardioEquip = (eq) => CARDIO_EQUIPMENT.includes(eq);

function setHasRecord(set) {
  if (!set || typeof set !== 'object') return false;
  if ('duration_min' in set || 'distance_km' in set) {
    return num(set.duration_min) > 0 || num(set.distance_km) > 0;
  }
  return num(set.reps) > 0;
}

const recordedSets = (ex) => ((ex && ex.sets) || []).filter(setHasRecord);

// 负重文案：负数=助力，0=自重（仅自重类动作），正数=负重
function weightText(weight, equipment) {
  const v = num(weight);
  if (v < 0) return `助力 ${trim(-v)} kg`;
  if (v === 0) return BODYWEIGHT_EQUIPMENT.includes(equipment) ? '自重' : '0 kg';
  return `${trim(v)} kg`;
}

function setText(set, equipment) {
  if (isCardioEquip(equipment)) {
    const parts = [`${num(set.duration_min)} 分钟`];
    if (num(set.distance_km) > 0) parts.push(`${num(set.distance_km)} km`);
    return parts.join(' · ');
  }
  return `${weightText(set.weight_kg, equipment)} × ${num(set.reps)}`;
}

const setList = (sets, equipment) => sets.map((s) => setText(s, equipment)).join(' / ');

/** 完成的训练，日期新的在前 */
function completedSessions(records) {
  return (records || [])
    .filter(isSession)
    .filter((s) => s.status !== 'draft' && !s.deleted_at)
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))
      || String(b.updated_at || '').localeCompare(String(a.updated_at || '')));
}

/** 最近一次同动作的组里出现最多的次数，用来写「8 次为主」 */
function modeReps(sets) {
  const tally = new Map();
  sets.forEach((s) => {
    const r = num(s.reps);
    if (r > 0) tally.set(r, (tally.get(r) || 0) + 1);
  });
  let best = 0; let bestN = 0;
  tally.forEach((n, r) => { if (n > bestN || (n === bestN && r > best)) { best = r; bestN = n; } });
  return best;
}

/**
 * 常用动作：按练到的次数排，取前 limit 个力量动作。
 * 只出力量动作（有氧动作按分钟记，做成动作卡没意义）。
 */
function deriveMovements(sessions, { limit = 14, minSessions = 2 } = {}) {
  const map = new Map();
  for (const s of sessions) {
    for (const ex of s.exercises || []) {
      const sets = recordedSets(ex);
      if (!sets.length || isCardioEquip(ex.equipment)) continue;
      const key = String(ex.exercise_id || ex.name || '');
      if (!key) continue;
      const entry = map.get(key) || {
        name: ex.name || key, part: ex.body_part || '', equipment: ex.equipment || '',
        count: 0, maxWeight: -Infinity, lastDate: '', lastSets: [],
      };
      entry.count += 1;
      sets.forEach((set) => { entry.maxWeight = Math.max(entry.maxWeight, num(set.weight_kg)); });
      const date = String(s.date || '');
      if (date > entry.lastDate) { entry.lastDate = date; entry.lastSets = sets; }
      map.set(key, entry);
    }
  }
  return [...map.values()]
    .filter((e) => e.count >= minSessions)
    .sort((a, b) => b.count - a.count || b.maxWeight - a.maxWeight)
    .slice(0, limit)
    .map((e) => ({
      name: e.name,
      part: coarsePart(e.part),
      load: e.maxWeight === -Infinity ? '' : weightText(e.maxWeight, e.equipment),
      meta: `${modeReps(e.lastSets)} 次为主 · ${e.lastSets.length} 组`,
      note: `最近 ${e.lastDate}　${setList(e.lastSets, e.equipment)}`,
      tags: [],
    }));
}

/** 样例训练日：先按训练日各取一个（胸/背/腿都能露一面），不够再按日期补，凑够 limit 天 */
function deriveDays(sessions, { limit = 4, minExercises = 4 } = {}) {
  const fit = sessions.filter((s) => (s.exercises || []).length >= minExercises);
  const picked = [];
  const seenDay = new Set();
  for (const s of fit) {
    const day = s.training_day || '';
    if (seenDay.has(day)) continue;
    seenDay.add(day);
    picked.push(s);
    if (picked.length >= limit) break;
  }
  for (const s of fit) {
    if (picked.length >= limit) break;
    if (!picked.includes(s)) picked.push(s);
  }
  picked.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  return picked.slice(0, limit).map((s) => {
      const lines = (s.exercises || []).map((ex) => {
        const sets = recordedSets(ex);
        return `${ex.name} ${setList(sets, ex.equipment)}`;
      });
      const duration = num(s.duration_min);
      return {
        date: String(s.date || ''),
        title: s.title || '',
        part: DAY_PART[s.training_day] || '',
        metric: `${(s.exercises || []).length} 个动作${duration ? ` · ${duration} 分钟` : ''}`,
        note: lines.join('\n'),
        tags: [],
      };
    });
}

/** 记录本身的一点元信息，页面底部写「数据来自哪、到哪天」 */
function summarize(records, file = '') {
  const sessions = completedSessions(records);
  return {
    file,
    sessions: sessions.length,
    latest: sessions.length ? String(sessions[0].date || '') : '',
    legacy: (records || []).length - (records || []).filter(isSession).length,
  };
}

/** 主入口：给 records 数组，拿到三个块 */
function deriveBlocks(records, { file = '', movementLimit = 14, dayLimit = 4 } = {}) {
  const sessions = completedSessions(records);
  return {
    records: summarize(records, file),
    movements: deriveMovements(sessions, { limit: movementLimit }),
    days: deriveDays(sessions, { limit: dayLimit }),
  };
}

module.exports = { deriveBlocks, deriveMovements, deriveDays, summarize, completedSessions, recordedSets, setText, weightText, coarsePart };
