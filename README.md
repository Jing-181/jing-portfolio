# 潘静 · 个人志（jing-portfolio）

> 这个仓库是一个**纯静态、零构建依赖**的个人站点，用「分卷」的方式存放一个人不同侧面的东西。
> 一句话：`简历`只是其中一卷；其余的卷（喜好、经历、训练…）各自独立成页，靠一个导航首页进入。
>
> **给未来的 AI 会话**：读完本文件即可接手，不需要再问背景。改动前请遵守第 8 节的协作约定。

---

## 1. 定位

- 站点是一位 Web 前端开发负责人（潘静，广州）的个人志。
- **每一卷看一个侧面，卷与卷之间不互相关联**，只在导航首页 `index.html` 各给一个入口。
  - 第一卷 · 履历 —— 职业与能力（`pages/resume.html`）
  - 第二卷 · 喜好志 —— 感官与偏好（`pages/tastes.html`）
  - 第三卷 · 经历线 —— 时间与轨迹（`pages/timeline.html`）
  - 第四卷 · 训练档案 —— 身体与负荷（`pages/training.html`）
- **记录写在 md，页面读 json**：内容一律记录在 `data/*.md` 里（人读、AI 写都舒服），
  由 `scripts/data.js` 处理成 `data/*.json`（页面读取的内容集合）。
  页面不写死内容；要改内容，改 md；要加一卷，加一条 md + 一个页面模板。

## 2. 目录结构

```
jing-portfolio/
├── index.html               # 导航首页（读取 data/site.json 渲染分卷入口）
├── pages/                   # 各卷页面（每个卷一个独立 html）
│   ├── resume.html          # 第一卷 · 履历
│   ├── tastes.html          # 第二卷 · 喜好志
│   ├── timeline.html        # 第三卷 · 经历线
│   └── training.html        # 第四卷 · 训练档案
├── data/                    # ← 事实源在这里（md）
│   ├── site.md              # 分卷清单
│   ├── tastes.md            # 喜好志条目
│   ├── timeline.md          # 经历线节点
│   ├── training.md          # 训练记录
│   └── *.json               # 由上面的 md 生成（页面读它），不入库
├── assets/
│   ├── css/site.css         # 设计系统（纸感底色 + 墨色 + 中国传统色强调）
│   ├── css/volumes.css      # 分卷通用组件（分卷卡片、筛选、喜好卡片…）
│   └── js/site.js           # 全站共享交互（滚动淡入）
├── scripts/
│   ├── data.js              # md → json：事实源 → 页面内容集合
│   └── build.js             # 组装 dist/：先跑 data.js，再剔除 private 内容
├── portfolio-docs/          # 早期的人写档案（写作区/草稿，不参与渲染）
├── package.json             # data / dev / build / preview 脚本
└── .github/workflows/deploy.yml  # 推送 main 自动构建并发布到 GitHub Pages
```

## 3. 数据规范（md 事实源）

两种数据文件共用一套极简结构：

```
--- 前置元信息（key: value）---
## 一级标题
field: value
```

### `data/site.md` —— 分卷清单

前置元信息写全站信息（`owner / title / subtitle / lede / updated`）；
`## 标题` 开一卷，下面跟该卷的字段：

| 字段 | 说明 |
| --- | --- |
| `no` | 卷序号，如「第二卷」 |
| `id` | 英文标识，如 `tastes` |
| `subtitle` | 卡片副标题 |
| `desc` | 卡片上的一句话简介 |
| `page` | 页面文件名（在 `pages/` 下） |
| `data` | 对应的数据文件（在 `data/` 下），没有就留空 |
| `accent` | 这一卷的主题色，写中国传统色名即可（见第 4 节） |
| `status` | `已上线` 才可点击进入；其它值显示为“规划中/锁定” |
| `private` | `true` = 整卷不部署（见第 5 节） |

### `data/tastes.md` —— 喜好志条目

前置元信息写 `vol / updated / categories`（分类展示顺序）；
`## 分类名` 分组，`### 名称` 开一条，下面跟字段：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `rating` | | 喜爱度 1–5（显示为圆点） |
| `note` | | 一两句短评，保留最有画面的一句原话 |
| `tags` | | 标签，用逗号分隔 |
| `since` | | 起始年份 |
| `link` | | 可选的来源链接，卡片上会渲染成一行可点的地址（如歌单、主页） |
| `private` | | `true` = 只在本地可见，部署时剔除 |

> 条目顺序无所谓，页面会按需排序；分类的展示顺序由前置元信息里的 `categories` 决定。

### `data/timeline.md` —— 经历线节点

前置元信息写 `vol / updated / kinds`（分类的展示顺序）；
节点直接写成 `### 标题`（**不用 `##` 分组**，分类走 `kind` 字段），下面跟：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `date` | ✓ | `YYYY` 或 `YYYY-MM`，排序用（按 年×100+月） |
| `est` | | `true` = 年份是推算的，页面会打一个「推算」小标 |
| `kind` | | 分类：童年 / 学业 / 工作 / 迁徙 / 旅行 / 生活 |
| `place` | | 地点，可写多个，用 `·` 分隔 |
| `note` | | 一两句说明 |
| `tags` | | 标签，用逗号分隔 |
| `private` | | `true` = 只在本地可见，部署时剔除 |

> 时间锚点（写在 `timeline.md` 顶部注释里）：1997 出生 · 2015 上大学 · 2019 毕业工作。

### `data/training.md` —— 训练记录

前置元信息写 `vol / updated / kinds`；每条写成 `### 标题`，下面跟：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `date` | ✓ | `YYYY-MM-DD`，排序用（**新的在前**） |
| `kind` | | 分类：力量 / 跑步 / 跑山 / 羽毛球 / 有氧恢复 / 其他 |
| `title` | ✓ | 这条练的是什么，如「深蹲日」 |
| `place` | | 在哪练的（可留空） |
| `metric` | | 关键数据，一行写完，如 `深蹲 5×5 @100kg` |
| `note` | | 主观感受、状态、恢复情况 |
| `tags` | | 标签，用逗号分隔 |
| `private` | | `true` = 只在本地可见，部署时剔除 |

> 四个卷的解析器都在 `scripts/data.js` 里，登记在文件末尾的 `JOBS` 表中；
> 以后新增卷，在 `JOBS` 里加一行，再在 `pages/` 加一个模板页即可。

## 4. 设计与主题（中国传统色）

- 全站复用 `assets/css/site.css` 的设计变量（`--paper` 纸感底色、`--ink` 墨色、`--accent` 强调色、衬线/无衬线/等宽三套字体）。
- **每一卷用页面级 `:root` 覆盖 `--accent / --accent-deep / --accent-soft` 换气质**，骨架不变。
  配色取自中国传统色：

  | 卷 | 色名 | hex | 意象 |
  | --- | --- | --- | --- |
  | 第一卷 · 履历 | 绛缨 | `#9E3B3B` | 武士冠缨凝血初染，沉毅凛然 |
  | 第二卷 · 喜好志 | 烟雨青 | `#6A8D8C`（页面取加深版 `#4E7A78`） | 江南春晨，薄雾浮江，青色氤氲 |
  | 第三卷 · 经历线 | 黛蓝 | `#2A5C82` | 远山含黛，秋水凝蓝，清幽沉静 |
  | 第四卷 · 训练档案 | 檀色 | `#8C6A4F` | 老檀木静卧幽室，温厚沉敛 |

  > `data/site.md` 的 `accent` 直接写色名，`scripts/data.js` 里的 `PALETTE` 负责解析成 hex。
  > 分卷卡片用色名的原色；页面主题色用 `PALETTE` 里的加深版，保证深色文字压在纸底上有足够对比度
  > （烟雨青偏浅，直接用会低于 4.5:1，所以页面取加深的 `#4E7A78`）。
  > 以后加卷，在 `PALETTE` 里补一条色名即可。
- 响应式与「减少动态效果」都已处理，新增页面沿用 `.reveal` 淡入与 `.wrap` 容器即可。

## 5. 隐私模型（重要）

**GitHub Pages 站点是公开可访问的，仓库私有 ≠ 页面私有。** 所以“隐藏敏感数据”唯一的可靠做法是：**不让它进入部署产物**。

机制：

- 在 `data/site.md` 的某一卷上写 `private: true` → 整卷不部署（页面与数据都不进 `dist/`）。
- 在 `data/tastes.md` 的某条目上写 `private: true` → 该条只在本地可见（页面会打上“仅本地”标记），**构建时从部署数据里删掉**。
- `scripts/build.js` 负责这个过滤；有没有生效，看它的输出：`分卷 N（隐藏 X）· 条目剔除 Y`。

> 本地看到全部、线上只看到公开部分——这是设计意图，不是 bug。
> 判断某条要不要公开的标准：**凡是你不希望陌生人看到的，就标 `private: true`。**

## 6. 本地预览 / 构建 / 部署

页面通过 `fetch` 读取 `data/*.json`，**所以必须用 HTTP 服务打开**，`file://` 双击会因浏览器限制读不到数据。

```bash
npm run data      # 只做一件事：md → json
npm run dev       # 先生成 json，再在项目根起服务 → http://localhost:8000
npm run build     # 生成 json + 组装 dist/（含 private 过滤）
npm run preview   # 构建后预览 dist/
```

> `data/*.json` 是产物，已在 `.gitignore` 里，**不要直接改它**，改了也会被下次生成覆盖。
> 直接改 `data/*.md`，再跑 `npm run data` 或 `npm run dev`（`dev` 已挂 `predev` 自动生成）。

部署：推送到 `main` 分支，GitHub Actions（`.github/workflows/deploy.yml`）会自动 `node scripts/build.js` 并发布 `dist/`。

## 7. 加一卷的操作步骤

1. 在 `pages/` 新建 `xxx.html`（可复制 `tastes.html` 改：换 `--accent`、换标题、换 fetch 路径与渲染逻辑）。
2. 在 `data/` 新建 `xxx.md`，按第 3 节的结构写内容；需要的字段在 `scripts/data.js` 里加个解析器并登记到 `JOBS`。
3. 在 `data/site.md` 里加一条卷信息：填 `no / id / title / page / data / accent / status`。
4. 本地 `npm run dev` 看效果；满意后 `npm run build` 检查过滤输出，再推送。

## 8. 与 AI 的协作约定

- 数据由 AI 汇总产出，**不需要人工手写**。给 AI 原始素材时，让它产出/追加到对应的 `data/*.md`，**不要碰 json 产物**。
- 新增或修改内容后，跑一次 `npm run data`（或 `npm run build`）重新生成 json，并确认没报错。
- 保持“md → json → 页面渲染”的分离：不要为了让某条内容好看而在页面里写死内容。
- 页面文案、卷的取舍由本人决定；AI 负责结构与实现，改动前先确认涉及哪些卷。
