# 潘静 · 个人志（jing-portfolio）

> 这个仓库是一个**纯静态、零构建依赖**的个人站点，用「分卷」的方式存放一个人不同侧面的东西。
> 一句话：`简历`只是其中一卷；其余的卷（喜好、经历、训练…）各自独立成页，靠一个导航首页进入。
>
> **给未来的 AI 会话**：读完本文件即可接手，不需要再问背景。改动前请遵守第 8 节的协作约定。

---

## 1. 定位

- 站点是一位 Web 前端开发负责人（潘静，广州）的个人志。
- **每一卷看一个侧面，卷与卷之间不互相关联**，只在导航首页 `index.html` 各给一个入口。
  - 第一卷 · 履历志 —— 职业与能力（`pages/resume.html`）
  - 第二卷 · 喜好志 —— 感官与偏好（`pages/tastes.html`）
  - 第三卷 · 经历志 —— 时间与轨迹（`pages/timeline.html`）
  - 第四卷 · 训练志 —— 身体与负荷（`pages/training.html`）
- **内容写在主 md，页面读主 json**：正文与结构化事实记在 `data/<卷>.md`（人读、AI 写都舒服），
  由 `scripts/data.js` 处理成 `data/<卷>.json`（页面读取的内容集合）；上游的原始素材堆在 `data/sources/<卷>/`。
  页面不写死内容；要改内容，改主 md；要加一卷，加一条 md + 一个页面模板。

## 2. 目录结构

```
jing-portfolio/
├── index.html               # 卷首 / 导航首页（读取 data/site.json 渲染分卷入口）
├── pages/                   # 各卷页面（每个卷一个独立 html）
│   ├── resume.html          # 第一卷 · 履历志
│   ├── tastes.html          # 第二卷 · 喜好志
│   ├── timeline.html        # 第三卷 · 经历志
│   └── training.html        # 第四卷 · 训练志
├── data/                    # ← 事实层：每卷「主 md + 主 json」
│   ├── site.md   site.json          # 卷首 · 分卷清单
│   ├── resume.md  resume.json       # 第一卷 · 履历志（整页）
│   ├── tastes.md  tastes.json     # 第二卷
│   ├── timeline.md timeline.json  # 第三卷
│   ├── training.md training.json  # 第四卷
│   ├── brief.md                   # 交接文档（后续方向 + 最近更新状态），不参与生成
│   ├── sources/                   # ← 原始素材层（只被主 md 引用，构建不解析）
│   │   ├── resume/                #   projects-complete.md、projects-showcase.md
│   │   ├── tastes/                #   网易云 / b 站 txt、微信读书 md、快照
│   │   ├── timeline/              #   快照
│   │   └── training/              #   训练导出 json
│   └── *.json                     # 由主 md 生成（页面读它），不入库
├── assets/
│   ├── css/site.css         # 设计系统（纸感底色 + 墨色 + 中国传统色强调）
│   ├── css/volumes.css      # 分卷通用组件（分卷卡片、筛选、喜好卡片…）
│   └── js/site.js           # 全站共享交互（滚动淡入）
├── scripts/
│   ├── data.js              # md → json：主 md → 页面内容集合
│   └── build.js             # 组装 dist/：先跑 data.js，再剔除 private 内容
├── package.json             # data / dev / build / preview 脚本
└── .github/workflows/deploy.yml  # 推送 main 自动构建并发布到 GitHub Pages
```

## 3. 数据规范

每一卷的数据分三层，各管一件事，不要混：

| 层 | 文件 | 谁读 | 能手写吗 | 管什么 |
| --- | --- | --- | --- | --- |
| **主 md** | `data/<卷>.md` | 人 / AI | 就写这里 | 卷的叙述 + 结构化事实 + 素材导航 |
| **主 json** | `data/<卷>.json` | 页面 | 产物，别改 | 只放页面要展示的内容 |
| **原始素材** | `data/sources/<卷>/…` | 人 / AI | ✓ | txt 表 / 导出 json / 描述 md，是事实的上游 |

- `<卷>` 取该卷的 `id`：`site / tastes / timeline / training / resume`。
  一律小写、单数、无空格。
- 主 md 与主 json **同名不同后缀，都放在 `data/` 顶层**；要改内容，改主 md，再跑 `npm run data`。
- 原始素材放 `data/sources/<卷>/`，格式随便、不进页面，被主 md 引用即可。
  命名 `<来源或主题>.<ext>`；带日期的快照或导出加后缀 `-YYYY-MM-DD`
  （例：`workouts-export-2026-10-10.json`、`snapshot-2026-10-10.md`）。
- 素材层**只有人 / AI 读**：`scripts/data.js` 与 `scripts/build.js` 都不碰它，
  往里堆多少原始数据都不影响生成与构建。

主 md（以及 `site.md`）共用一套极简结构：

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

### `data/timeline.md` —— 经历志节点

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

### `data/training.md` —— 训练志

前置元信息写 `vol / updated / kinds`（`kinds` 是底部档案筛选器的分类顺序）。

**这一卷按 `##` 分区摆块**，页面不再按天倒流水。分区与用到的字段：

| `##` 分区 | 页面呈现 | 用到的字段 |
| --- | --- | --- |
| `概览` | 页首那排大数字 | `### 标题` → label，`metric` → value，`note` → 小字 |
| `怎么练` | 一段练法（`tags` 变成胸/背/腿小签） | `note`、`tags` |
| `常用动作` | 那排动作卡（顺序＝条目顺序） | `part / load / meta / note` |
| `样例训练日` | 一天一张卡，`note` 每行一个动作 | `part / metric / note / tags` |
| `力量突破` | 里程碑卡（复用动作卡样式） | `part / metric / note` |
| `档案` | 底部可筛选总账 | `date / kind / metric / note / tags` |

通用字段：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `date` | ✓ | `YYYY-MM-DD` 或 `YYYY-MM`，排序用（**新的在前**） |
| `kind` | | 档案分类：总计 / 年份（「2026 年」）/ 力量 / 跑步 / 功能性 / 有氧 / 其他 |
| `title` | ✓ | 取 `### 标题` |
| `part` | | 部位小标签：胸 / 背 / 腿 / 后链 / 后束 / 三头 / 二头 |
| `metric` | | 关键数据，一行写完 |
| `note` | | 说明，可多行（缩进的行会接到上一字段后面） |
| `tags` | | 标签，用逗号分隔；**值里不能出现逗号**（会被切开） |
| `private` | | `true` = 只在本地可见，部署时剔除 |

> `section` 不用手写：`parseTraining` 按条目所在的 `##` 自动打上，页面据此分区渲染。
> 约定：**页面只显示「形状」，不显示流水**；只有力量上的突破才往 `## 力量突破` 补条目。
> 逐次流水不写在 md 里，放在 `data/sources/training/workouts-export-2026-10-10.json`，用来核对卡片里的数字。

### `data/resume.md` —— 履历志整页

这一卷不是条目流，而是整页：按 `## 块名` 分块，块内 `field: value`，`### ` 作子项。

| 块 | 页面位置 | 说明 |
| --- | --- | --- |
| `卷首` | hero | `eyebrow / name / nameEm / role / desc / tags / motto / mottoEm / mottoSub` |
| `关于` | 01 · ABOUT | `p` 累积成段落；`fact: 名 \| 值 \| 链接` 是右侧事实表；`quote / quoteLabel` 是旁白 |
| `技术能力` | 02 · SKILLS | `### 分组名` + `level / sub`；`- 名称 \| 场景 \| 佐证` 是一条技能 |
| `技术标签云` | 标签云 | `fw / eng / lib` 三行分类，各自逗号分隔 |
| `工作方式` | 03 · WORKFLOW | `group / gsub` 是标题；`### 步骤` + `num / desc`；`delivery` 是交付能力清单 |
| `精选项目` | 04 · PROJECTS | `### 项目名` + `num / role / co / stack / desc / prove / link: 文案 \| 地址`；`point` 累积成要点 |
| `其他经验` | 项目下方 | `- 名称 \| 类型 \| 说明` |
| `经历` | 05 · EXPERIENCE | `### 标题` + `variant(compact/edu) / time / sub / extra`；`list` 累积成小点 |
| `联系` | 06 · CONTACT | `link: 文案 \| 地址 \| solid/ghost` |
| `页脚` | footer | `left / right` |

> 字段值里的 `**x**` 会渲染成加粗；用 `|` 分隔的字段按位置拆段。页面 `pages/resume.html`
> 读 `data/resume.json` 渲染，标题与描述取自前置元信息的 `title / description`。

> 五个卷的解析器都在 `scripts/data.js` 里，登记在文件末尾的 `JOBS` 表中；
> 以后新增卷，在 `JOBS` 里加一行，再在 `pages/` 加一个模板页即可。

### 素材导航段（约定）

每卷主 md 的末尾统一放一段 `## 素材导航`，把本卷的上游素材列出来；它既是给人的描述，
也是文件索引。四个解析器都不会把这段当成数据：tastes 的分类只认前置元信息里的 `categories`，
timeline 的 `##` 只作分隔，training 里没有条目的空分区不渲染。所以写它不影响生成。

```md
## 素材导航

本卷的主 md 就是本文件（叙述 + 索引），页面只读 `data/<卷>.json`。
原始素材放在 `data/sources/<卷>/`：

- `sources/tastes/netease-playlist.txt` —— 网易云歌单 214 首原样抓取
- `sources/tastes/snapshot-2026-10-10.md` —— 打磨前的本卷快照（原话存档）
```

## 4. 设计与主题（中国传统色）

- 全站复用 `assets/css/site.css` 的设计变量（`--paper` 纸感底色、`--ink` 墨色、`--accent` 强调色、衬线/无衬线/等宽三套字体）。
- **每一卷用页面级 `:root` 覆盖 `--accent / --accent-deep / --accent-soft` 换气质**，骨架不变。
  配色取自中国传统色：

  | 卷 | 色名 | hex | 意象 |
  | --- | --- | --- | --- |
  | 第一卷 · 履历志 | 绛缨 | `#9E3B3B` | 武士冠缨凝血初染，沉毅凛然 |
  | 第二卷 · 喜好志 | 烟雨青 | `#6A8D8C`（页面取加深版 `#4E7A78`） | 江南春晨，薄雾浮江，青色氤氲 |
  | 第三卷 · 经历志 | 黛蓝 | `#2A5C82` | 远山含黛，秋水凝蓝，清幽沉静 |
  | 第四卷 · 训练志 | 檀色 | `#8C6A4F` | 老檀木静卧幽室，温厚沉敛 |

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

## 5.1 三卷口令门（拦随手，不拦有心人）

`喜好志 / 经历志 / 训练志` 三卷各挂了一道前端口令门（`assets/js/lock.js`）。
它是**礼貌性拦截，不是安全机制**：

- 口令在前端比对（SHA-256），页面数据 `data/*.json` 与源码仍是公开可读的。
- 挡住的是随手点进来的人，挡不住存心看源码或直接下 json 的人。
- 解锁状态存 `sessionStorage`，同一浏览器会话内三卷通行，关掉标签页失效。

**改口令**：

```bash
node -e "console.log(require('crypto').createHash('sha256').update('你的新口令').digest('hex'))"
```

把输出的 64 位十六进制替换 `assets/js/lock.js` 里的 `HASH`；门的文案改同文件顶部的 `TITLE / HINT / WRONG`。

> 真要藏住东西，还是走第 5 节的 `private: true`（内容根本不进 `dist/`），
> 或把站点放到带服务端鉴权的地方（如 Cloudflare Access）。前端口令门只是玄关，不是保险箱。

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
