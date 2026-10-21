---
vol: resume
updated: 2026-10-10
title: 潘静 — 多端前端开发负责人 · 个人主页
description: 多端前端开发负责人（广州）。多年负责 MOJiDict 全系列产品线多端前端开发：H5、Hybrid、PC Web、小程序与 AI Agent 前端。
---

# 履历志

> 这是履历志的主 md（叙述 + 索引），`data/resume.json` 由它生成，页面读 json、不读本文件。
> 每块用 `## 块名` 开，块内字段 `field: value`；重复的键累积成列表，`- ` 行也是一条。
> 字段值里的 `**x**` 会渲染成加粗；用 `|` 分隔的字段按位置拆成几段。
> 完整项目档案与精简版见 `data/sources/resume/`。
> 改完跑 `npm run data`（或 `npm run build`）重新生成 json。

## 卷首

eyebrow: PORTFOLIO, FRONTEND LEAD, GUANGZHOU
name: 潘静
nameEm: 静
role: 多端前端开发负责人 · **MOJiDict 全系列**长期迭代
desc: 长期负责 MOJiDict 全系列产品线的前端工程化和多平台交付：H5、Hybrid 三平台、PC Web、微信小程序与 AI Agent 前端。相比一次性写出优雅代码，更在意项目能不能被长期迭代。
tags: 多端前端开发, 老项目长周期迭代, AI 工具协作实践, 工程化与发布治理
motto: 锲而不舍，金石可镂
mottoEm: 金石
mottoSub: 坚持不懈 · 金石可镂

## 关于

tag: 01 · ABOUT
title: 关于我
p: 我是前端开发负责人，坐标广州。多年负责 **MOJiDict 全系列产品线**的前端开发：从 Nuxt 2 SSR 的移动端 H5 和 PC 站，到 Android / iOS / Harmony 三平台的 Hybrid H5，再到微信小程序与 AI Agent 前端。
p: 迭代最多的项目自 2021 年加入起持续迭代至今。这些年反复在做的事：推进**公共组件抽离**、拆分目录结构、把开发规范沉淀成文档让新人快速跟上，以及为发布建立体积门禁与回退机制。
p: 近年开始实践 **AI 工具辅助开发**：在 Agent 项目里负责项目启动与方案设计，与同事协作借助 AI 工具完成落地。我认为 AI 工具是效率放大器，但工程判断和契约设计仍然需要人来把关。
quoteLabel: // 另一个版本的我
quote: 在广州写了很多年前端，主战场是 MOJiDict 全系列：H5、PC、Hybrid、小程序、浏览器插件、AI Agent 前端都做过。习惯把目录结构和协作规范写清楚，AGENTS.md 是常用工具。相信 AI 工具能提效，也相信它需要人盯着——毕竟它写得快，改得也快。
fact: base | **广州** · 前端开发负责人
fact: since | 2019 年入行至今
fact: main | Vue / Nuxt 全链路多端开发
fact: domain | 日语 · 韩语学习产品
fact: edu | 景德镇陶瓷大学 · 信息管理与信息系统（本科）
fact: github | github.com/Jing-181 | https://github.com/Jing-181
fact: email | Jing1813289006@163.com

## 技术能力

tag: 02 · SKILLS
title: 技术能力

### 核心能力

level: core
sub: // 可独立负责 · 有长期生产项目佐证
- Vue 2 / Vue 3 | 长周期业务迭代 · 渐进优化 · 多应用架构 | mojidict_h5 · mojidict_web · hybrid-release
- Nuxt 2 (SSR) | 服务端渲染 · 单码多应用架构 | mojidict_h5（7 应用）· mojidict_web
- JS Bridge | window 双向注入 · 原生 ↔ H5 通信 · 三平台适配 | hybrid-release（50+ Bridge 方法）
- 移动端适配 | SCSS + postcss-pxtorem · 多机型兼容 | mojidict_h5
- 国际化 i18n | 中 / 英 / 日 / 韩 / 泰 / 马来 / 繁中 多语种 | mojidict_h5 · hybrid-release
- 工程治理 | 目录规范 · 开发规范 · 版本治理 · AGENTS.md 协作文档 | 全系列项目

### 熟悉使用

level: familiar
sub: // 有实际项目经验 · 非日常主力
- Nuxt 3 / 4 | 新版架构 · 站点开发 · 迁移升级 | kori-h5 · hugecore_web
- Vuex / Pinia | 模块化状态管理（47 个 store 模块长期维护） | mojidict_web · mojidict-agent · kori-h5
- uni-app 小程序 | 微信小程序全流程开发 · 目录重构 · 规范制定 | mojidict-mini-program
- Chrome MV3 | content script · 选区识别 · 截图导出 | mastergo-oneclick-exporter
- Vite 构建 | 构建配置 · 体积门禁 · fallback 回退 | hybrid-release
- CI / CD | GitLab CI · Docker · Aliyun OSS 多环境发布 | mojidict-agent · 多项目
- SSE 流式 | Agent 流式对话架构 · 协作落地 | mojidict-agent

### 了解

level: know
sub: // 有实践或学习经验 · 非日常工作主力
- React 19 / Next.js 15 | 个人作品实验 · 新框架方向 | jing-next
- Tailwind CSS 4 | 新项目样式主力 · 工具链协作 | mojidict-agent
- Python 3 | 标准库工具与游戏 · 存档校验 | echo-layer
- ECharts | 数据可视化（学习报告） | mojidict_h5 · mojidict_web

## 技术标签云

title: 技术标签云
fw: Vue 3, Vue 2, React 19, TypeScript, JavaScript, Python, Nuxt 2, Nuxt 3, Nuxt 4, Next.js 15
eng: Vite, Webpack, Tailwind CSS 4, SCSS, postcss-pxtorem, Playwright, GitLab CI, Docker, Aliyun OSS
lib: Pinia, Vuex, Element UI, Arco Design, Vant, Mint UI, ECharts, Lottie, Swiper, html2canvas

## 工作方式

tag: 03 · WORKFLOW
title: 工作方式
group: Agent 协作工作流
gsub: // 用 AI 工具放大效率 · 由人把关工程判断与契约

### 理解

num: 01 / UNDERSTAND
desc: 读取需求、接口、仓库约定和现有实现。

### 构建

num: 02 / BUILD
desc: 按业务域拆分页面、组件、状态和接口。

### 验证

num: 03 / VERIFY
desc: 执行测试、浏览器验证、代码审查和回归检查。

### 交付

num: 04 / SHIP
desc: 完成容器构建、代理配置、发布和部署验证。

deliveryTitle: 部署交付能力
delivery: Docker 多阶段构建, Nginx 静态托管与反向代理, GitLab CI 镜像构建, Kubernetes Deployment 更新, OSS 静态资源上传, 发布后的环境验证

## 精选项目

tag: 04 · PROJECTS
title: 精选项目

### MOJi辞書 H5

num: 01
role: 日常迭代主力
stack: Nuxt 2 · Vue 2.7 · Vuex 3 · Vant / Mint UI · ECharts · SSR · SCSS
desc: MOJiDict 全系列产品线核心成员、迭代最多的移动端 H5 站点。单码服务 7 个日语学习应用（辞书 / Test / Read / 假名 / 会话 / 课堂 / 留学），自 2021 年加入起持续迭代至今。
point: **单码 7 应用**：路由级应用检测（$getApp）+ 多 layout 按应用切换，独立 API 端点
point: **7 语种国际化**：日 / 中 / 英 / 韩 / 马来 / 泰 / 繁中（vue-i18n）
point: **核心功能域**：搜索详情、翻译、收藏夹导出、学习报告（ECharts）、AI 问答、会员支付
point: **工程化**：postcss-pxtorem 自动 rem · PWA · Lottie 动画 · Playwright E2E 与 lint 规范
prove: Nuxt 2 SSR 架构 · 多应用单码设计
link: m.mojidict.com ↗ | https://m.mojidict.com

### Hybrid 多平台 H5

num: 02
role: 框架共同设计 · 8 条产品线参与
stack: Vue 3.2 · Vite 4 · SCSS · Android / iOS / Harmony 三平台
desc: MOJi 系列 App 内嵌 H5 内核：8 条产品线（辞书 / 英日韩词典 / Test / 翻译 / 假名 / 阅读 / 工具等）共用一套 common 层，同时服务 Android / iOS / Harmony 三平台，承载活动页与核心功能页——单词详情、翻译、文章阅读、OCR 扫描、语音朗读等。
point: **多产品线共享**：common 层沉淀 components、contentDetails_v2、tool、directives、images 等共享模块
point: **内容详情页 v2**：统一 8 条产品线的单词 / 例句展示，16 个核心组件
point: **原生桥接**：nativeUtils.js / bridge.js 封装 50+ Bridge 方法，双向注入三平台适配
point: **发布治理**：JSON 压缩 + 构建体积门禁 + fallback 回退构建，异常快速回滚
prove: Hybrid 架构 · 原生双向通信 · 跨平台兼容
link: 随 App 发布 · 无独立链接

### MOJiDict Web SSR

num: 03
role: 全模块维护 · 结构治理
stack: Nuxt 2 · Vue 2.7 · Vuex 3 · Element UI · ECharts · SSR
desc: MOJi辞書 桌面端 Nuxt 2 SSR 生产站，全模块长期维护，覆盖搜索详情、创作入口、课堂页面及运营入口，按业务域组织组件，沉淀路由映射与目录规范。
point: **全模块维护**：用户端页面、搜索详情、创作入口、课堂页面与旧管理后台入口
point: **主导核心页面**：搜索详情、创作入口、课堂页面均主导开发，部分功能分配同事协作
point: **结构治理**：按业务域组织组件，沉淀路由映射 / 目录规范 / 代码审查文档
prove: 生产站全模块维护 · 老项目结构治理
link: www.mojidict.com ↗ | https://www.mojidict.com

### MOJiDict Agent 前端

num: 04
role: 项目启动 · AI 工具协作落地
co: true
stack: Vue 3.5 · TypeScript · Vite 6 · Pinia · TanStack Query · Tailwind CSS 4
desc: 公司引入 AI 后的新项目：独立 Agent 对话前端，承载登录、流式对话、会话历史、工具结果卡片与用量展示。负责项目启动与方案设计，落地开发由同事借助 AI 工具完成，遇到问题共同探讨解决。
point: **SSE 流式对话**：10 类事件消费与解析，sse.ts 只做 frame 解析不写业务状态
point: **类型契约**：types/agent.ts 作为前后端事件与会话数据主契约
point: **Data Card 注册表**：未知工具结果类型自动降级，页面不空白
point: **工程与部署**：GitLab CI 多环境构建 + Aliyun OSS 上传 + Nginx 子路径部署
prove: 技术方案设计 · AI 辅助开发协作
link: mojidict.com/moji-agent ↗ | https://www.mojidict.com/moji-agent

### 猫咪生活报

num: 05
role: 个人产品 · 独立设计 / 开发 / 部署
stack: Vue 3.5 · Vite 6 · Supabase · 原生 CSS · GitHub Pages
desc: 复古报刊风格的个人生活工作台：把训练、打卡、待办、阅读、记账、日记收进一份“报纸”，再用 AI 周报回看一周。桌面与移动是同一页面按视口切换外壳，数据经 Supabase 跨设备同步。
point: **双端一体**：同一页面 ≤820px 切移动外壳（顶栏 + 底部导航），与桌面共用一份本地数据和登录账号
point: **同步分层**：全量同步与记录级原子同步分开，失败操作进 outbox，联网后按单项重试
point: **训练计划**：本地规则引擎生成“2 轮 × 3 天推拉腿（PPL）”，训练以 Session 形式原子保存
point: **工程化**：Vue 组件化 + 内容 hash chunk + node --test 单测，push 到 main 自动发布 Pages
prove: 从 0 到上线 · 一个人负责全部
link: jing-181.github.io/cat-newsroom ↗ | https://jing-181.github.io/cat-newsroom/

## 其他经验

title: 其他开发经验
- moji_admin_web | 后台 | MOJi 运营后台（Vue 3 + Arco Design + Pinia）：运营 / 资源 / 订单 / 用户中心，RBAC 权限路由与模块化。
- kori-h5 / kori-web | Web / H5 | Kori辞書（韩语）PC 与 H5 双端，Nuxt 4 重写，SSR 优化与组件重构。
- hugecore_web | 官网 | 公司官网 + 帮助中心（Nuxt 3 + @nuxt/content），双应用单仓库（APP_TYPE 切换）。
- mojitest-web | 考试 | MOJiTest 在线考试平台 Web 端（Nuxt 2 + Element UI）。
- mojidict-mini-program | 小程序 | 公司微信小程序（uni-app）。前期两人各半，后期主导开发、拆分目录结构、制定规范带新人。
- mastergo-oneclick-exporter | Chrome 插件 | MasterGo 一键导出选中图层：选区多级识别（不依赖官方 API）、截图裁剪、多格式多倍率导出。
- echo-layer | Python | Python 3 标准库私人养成叙事游戏，JSON Schema + 运行时双重存档校验。
- jing-next | Next.js | Next.js 15 + React 19 个人作品。
- mojidict-web-plugin | 浏览器插件 | MOJiDict 浏览器插件。

## 经历

tag: 05 · EXPERIENCE
title: 经历

### MOJiDict 全系列产品 · Web 前端开发负责人

time: 2021 — 至今
sub: 广州聚合 · 日语 / 韩语学习产品 · 2023 年起由工程师晋升为负责人
list: **多端全覆盖**：负责 H5、Hybrid（Android / iOS / Harmony）、PC Web、微信小程序与 AI Agent 前端
list: **H5 / Hybrid 双主力**：日常迭代最多的两条线；Hybrid 参与整体框架设计，8 条产品线共用一套 common 层，推进公共组件与方法抽离
list: **带人与规范**：小程序后期主导开发，拆分目录结构、制定开发规范，指导新人按规范持续优化
list: **发布治理**：构建体积门禁 + fallback 回退构建 + 版本记录文档，异常可快速回滚
list: **AI 协作落地**：Agent 项目负责启动与方案设计，协作同事用 AI 工具完成落地开发

### 早期经历

variant: compact
time: 2019 — 2021
list: **科蓝软件 · 前端开发工程师**（2020 — 2021）：金融 / 银行方向的前端开发
list: **箭牌家居集团 · 前端开发工程师**（2019 — 2020）：家居 / 电商方向的前端开发

### 景德镇陶瓷大学

variant: edu
time: 2015 — 2019
extra: · 本科
sub: 信息管理与信息系统

## 联系

tag: 06 · CONTACT
title: 聊聊合作，或下一个项目
desc: 如果你在招前端，或者想聊聊多端 / Hybrid / AI 协作开发的实践，欢迎联系。
link: Jing1813289006@163.com | mailto:Jing1813289006@163.com | solid
link: GitHub ↗ | https://github.com/Jing-181 | ghost

## 页脚

left: © 2026 潘静 · 广州
right: 锲而不舍，金石可镂

## 素材导航

本卷的主 md 就是本文件（叙述 + 索引），页面只读 `data/resume.json`。
原始素材放在 `data/sources/resume/`：

- `sources/resume/projects-complete.md` —— 完整项目贡献档案（技术栈、版本、目录、依赖、发布文档）
- `sources/resume/projects-showcase.md` —— 精简版展示总结（P0/P1/P2 分级），页面结构的上游
