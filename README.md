# 潘静 · 个人志（jing-portfolio）

> 这个仓库是一个**纯静态、零构建依赖**的个人站点，用「分卷」的方式存放一个人不同侧面的东西。
> 一句话：`简历`只是其中一卷；其余的卷（喜好、经历、训练…）各自独立成页，靠一个导航首页进入。
>
> **给未来的 AI 会话**：读完本文件即可接手，不需要再问背景。改动前请遵守第 6 节的协作约定。

---

## 1. 定位

- 站点是一位 Web 前端开发负责人（潘静，广州）的个人志。
- **每一卷看一个侧面，卷与卷之间不互相关联**，只在导航首页 `index.html` 各给一个入口。
  - 第一卷 · 履历 —— 职业与能力（`pages/resume.html`）
  - 第二卷 · 喜好志 —— 感官与偏好（`pages/tastes.html`）
  - 后续卷（规划中）：经历线、训练档案……
- **数据即事实源**：页面本身不写死内容，内容全部来自 `data/*.json`，页面只负责把它画出来。
  要改内容，改数据；要加一卷，加数据 + 一个页面模板。

## 2. 目录结构

```
jing-portfolio/
├── index.html               # 导航首页（读取 data/site.json 渲染分卷入口）
├── pages/                   # 各卷页面（每个卷一个独立 html）
│   ├── resume.html          # 第一卷 · 履历
│   └── tastes.html          # 第二卷 · 喜好志
├── data/                    # ← 事实源，内容都在这里
│   ├── site.json            # 分卷清单（导航首页读它）
│   └── tastes.json          # 喜好志数据
├── assets/
│   ├── css/site.css         # 设计系统（纸感底色 + 墨色 + 朱红；从旧 index.html 抽出的）
│   ├── css/volumes.css      # 分卷通用组件（分卷卡片、筛选、喜好卡片…）
│   └── js/site.js           # 全站共享交互（滚动淡入）
├── scripts/build.js         # 构建：组装 dist/ 并剔除 private 内容
├── portfolio-docs/          # 早期的人写档案（写作区/草稿，不参与渲染）
├── package.json             # dev / build / preview 脚本
└── .github/workflows/deploy.yml  # 推送 main 自动构建并发布到 GitHub Pages
```

## 3. 数据规范

### `data/site.json` —— 分卷清单

一个对象，`volumes` 数组列出所有卷：

```json
{
  "no": "第二卷",
  "id": "tastes",
  "title": "喜好志",
  "subtitle": "感官与偏好",
  "desc": "卡片上的一句话简介",
  "page": "tastes.html",       // 页面文件名（在 pages/ 下）
  "data": "tastes.json",       // 对应的数据文件（在 data/ 下），没有就写 null
  "accent": "#2F6B4F",         // 这一卷的主题色
  "status": "已上线",           // "已上线" 才可点击进入；其它值显示为“规划中/锁定”
  "private": false             // true = 整卷不部署（见第 5 节）
}
```

### 卷数据文件（如 `data/tastes.json`）

统一结构：一个对象，内容放 `items` 数组。

```json
{
  "vol": "tastes",
  "updated": "2026-10-10",     // 会显示在页脚
  "categories": ["食物", "音乐"], // 分类展示顺序（可省）
  "items": [ /* 条目 */ ]
}
```

**喜好志条目字段：**

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `name` | ✅ | 名称 |
| `category` | ✅ | 分类，如 食物 / 饮品 / 音乐 / 影剧 / 书 / 游戏 / 城市 |
| `rating` | | 喜爱度 1–5（显示为圆点） |
| `note` | | 一两句短评 |
| `tags` | | 标签数组 |
| `since` | | 起始年份（字符串） |
| `private` | | `true` = 只在本地可见，部署时剔除 |

> 以后新增别的卷时，在同样的 `data/*.json` 里定义自己的 `items` 字段即可，
> 并在 `pages/` 里加一个对应模板页。

## 4. 设计与主题

- 全站复用 `assets/css/site.css` 的设计变量（`--paper` 纸感底色、`--ink` 墨色、`--accent` 强调色、衬线/无衬线/等宽三套字体）。
- **每一卷用页面级 `:root` 覆盖 `--accent` 换气质**，骨架不变：
  - 第一卷 · 履历：朱红 `#BC3E2A`
  - 第二卷 · 喜好志：墨青绿 `#2F6B4F`
  - 后续卷已预留：经历线 `#3A5A8C`、训练档案 `#96591F`
- 响应式与「减少动态效果」都已处理，新增页面沿用 `.reveal` 淡入与 `.wrap` 容器即可。

## 5. 隐私模型（重要）

**GitHub Pages 站点是公开可访问的，仓库私有 ≠ 页面私有。** 所以“隐藏敏感数据”唯一的可靠做法是：**不让它进入部署产物**。

机制：

- 在 `data/site.json` 的某一卷上写 `"private": true` → 整卷不部署（页面与数据都不进 `dist/`）。
- 在 `data/*.json` 的某条目上写 `"private": true` → 该条只在本地可见（页面会打上“仅本地”标记），**构建时从部署数据里删掉**。
- `scripts/build.js` 负责这个过滤；有没有生效，看它的输出：`分卷 N（隐藏 X）· 条目剔除 Y`。

> 本地看到全部、线上只看到公开部分——这是设计意图，不是 bug。
> 判断某条要不要公开的标准：**凡是你不希望陌生人看到的，就标 `private: true`。**

## 6. 本地预览 / 构建 / 部署

页面通过 `fetch` 读取 `data/*.json`，**所以必须用 HTTP 服务打开**，`file://` 双击会因浏览器限制读不到数据。

```bash
npm run dev       # 在项目根起服务 → http://localhost:8000
npm run build     # 组装 dist/（含 private 过滤）
npm run preview   # 构建后预览 dist/
```

部署：推送到 `main` 分支，GitHub Actions（`.github/workflows/deploy.yml`）会自动 `node scripts/build.js` 并发布 `dist/`。

## 7. 加一卷的操作步骤

1. 在 `pages/` 新建 `xxx.html`（可复制 `tastes.html` 改：换 `--accent`、换标题、换 fetch 路径与渲染逻辑）。
2. 在 `data/` 新建 `xxx.json`，按第 3 节的结构写数据。
3. 在 `data/site.json` 的 `volumes` 里加一条：填 `no / id / title / page / data / accent / status`。
4. 本地 `npm run dev` 看效果；满意后 `npm run build` 检查过滤输出，再推送。

## 8. 与 AI 的协作约定

- 数据由 AI 汇总产出，**不需要人工手写**。给 AI 原始素材时，让它直接产出/追加到对应的 `data/*.json`。
- 新增或修改数据后，**务必同步 `data/site.json`**（新增卷时）并跑一次 `npm run build` 确认没报错。
- 保持“数据结构 → 页面渲染”的分离：不要为了让某条内容好看而在页面里写死内容。
- 页面文案、卷的取舍由本人决定；AI 负责结构与实现，改动前先确认涉及哪些卷。
