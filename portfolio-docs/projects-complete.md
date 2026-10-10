# 个人项目完整贡献档案

> 此文件记录所有项目的完整贡献细节，作为技术个人主页的数据源。
> 文档结构：基础信息 → 重点项目（按迭代频次排序）→ 其他 JS/TS 项目 → Python 项目 → 小程序与工具 → 技术栈全景 → 待补充项目。

---

## 基础信息

| 字段 | 值 | 备注 |
| --- | --- | --- |
| 真实姓名 | 潘静 | 用户指定 |
| 当前职位 | Web 前端开发负责人 | 用户指定 |
| 所在城市 | _(暂不填写)_ | 用户指定 |
| GitHub | Jing-181 | https://github.com/Jing-181 |
| 邮箱 | Jing1813289006@163.com | |

---

## 重点项目（按迭代频次排序）

### P0-1. dict-web-H5 — MOJiDict 移动端 Web

| 属性 | 值 |
| --- | --- |
| 本地目录 | `mojidict_h5/` |
| 项目定位 | MOJiDict 全系列产品线核心成员，**迭代最多**的移动端 H5 站点 |
| 技术栈 | Nuxt 2 + Vue 2.7 + Vant 2 + Mint UI + Vuex 3 + ECharts 6 |
| 版本 | 1.33.5（持续迭代） |
| 端口 | 8081 |
| 构建工具 | Nuxt 2 + Webpack 4 |

**用户角色与贡献**

- 负责从早期版本到 1.33.5 的全周期迭代（页面功能、支付流程、活动配置、国际化）
- 主导移动端工程化：`postcss-pxtorem` 自动 rem 转换、PWA 支持、Ali OSS 资源上传
- 持续优化用户体验：Swiper 轮播 + Lottie 动画、Markdown 渲染（markdown-it）、富文本编辑器（vue-quill-editor）
- 引入工程质量：Playwright 端到端测试、ESLint + Stylelint 规范
- 国际化：`vue-i18n` 覆盖日/中/英/韩/马来/泰等多语言

**核心功能域**

- 首页发现流（活动/课程/推荐）
- 搜索与词条详情
- 翻译与智能辅助（smart translate / 批改）
- 收藏夹与笔记（jspdf + html2canvas 导出）
- 播放器与精读
- AI 问答模块
- 会员/支付模块
- 学习报告与打卡

**依赖亮点**

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| vant | 2.13.2 | 移动端组件库 |
| mint-ui | ^2.2.13 | 早期移动端组件 |
| echarts | ^6.0.0 | 数据可视化（学习报告） |
| lottie-web | 5.12.2 | 动画效果 |
| @playwright/test | ^1.58.2 | E2E 测试 |
| @fingerprintjs/fingerprintjs | ^4.6.2 | 设备指纹 |
| html2canvas + jszip | ^1.4.1 / ^3.2.2 | 收藏夹导出 |
| viewerjs | ^1.10.3 | 图片查看器 |

---

### P0-2. Hybrid — 多平台混合应用核心 H5

| 属性 | 值 |
| --- | --- |
| 本地目录 | `hybrid-release/` |
| 项目定位 | iOS / Android / Harmony **三端共用**的 Hybrid H5 内核，公司**迭代最多**的项目之一 |
| 技术栈 | Vue 3.2 + Vite 4 + SCSS + JavaScript |
| 版本 | 1.8.17（高频迭代） |
| 浏览器兼容 | Chrome ≥ 61 / Android ≥ 7 / iOS 7+ |

**用户角色与贡献**

- 作为 Hybrid H5 负责人，主持从早期 Vue 2 升级到 Vue 3 + Vite 的完整工程改造
- 主导多应用共享架构设计：8 个产品线（mojidict/endict/koridict/mojitest/mojiyaku/mojikana/mojiread/mojitool）共用一套 common 层
- 设计原生桥接协议：`nativeUtils.js` / `bridge.js` 统一封装 50+ Native Bridge 方法
- 建立完整的发布治理体系：版本记录文档、代码审查工作流、JSON 压缩插件、构建体积检查插件、fallback 回退构建
- 建立文档治理规范：`readme/platform/` 平台规范 + `readme/document/` 业务交付文档的分层体系

**核心工程亮点**

- **多产品线共享架构**：`common/` 包含 components、contentDetails / contentDetails_v2（内容详情页）、tool、directives、images 等共享模块
- **内容详情页 v2**：统一 8 个产品线的单词/例句展示逻辑，包含 16 个核心组件（Header、Paraphrase、Example、Note、Sentence、Question、QA、Conjunctive、Verb、Author、Image、BriefParaphrase、Empty、Test、aiTip、Tab）
- **原生桥接体系**：`triggerActionInNative` / `updateHTML` 双向通信 + `$reqApp` 注入，支持 Android/iOS/Harmony 三平台差异适配
- **构建优化插件**：`json-compression`（业务 JSON 压缩）、`size-check`（产物体积门禁）、`dir-structure`（目录结构约束）
- **降级策略**：`.fallback/` 目录保留旧版本构建产物，支持新版本发布异常时快速回退

**功能模块矩阵（按产品线）**

| 产品线 | 目录 | 核心功能 |
| --- | --- | --- |
| MOJiDict（日语词典） | `mojidict/` | AIScan、aiExplain、article、contentDetails_v2、ocrScan、readAlong、sentenceAna、trans、transAnalysis、pronunciationSetting |
| MOJiTest（考试） | `mojitest/` | contentDetails_v2、contentDetails_v2/word、paper、analysisReading、sentenceAna |
| KoriDict（韩语词典） | `koridict/` | contentDetails、aiSearchResult、trans |
| ENDict（英语词典） | `endict/` | contentDetails、note |
| MOJiYaku（翻译） | `mojiyaku/` | trans |
| MOJiKana（假名） | `mojikana/` | note |

**原生桥接核心方法（节选）**

- `triggerActionInNative(actionInfo)` → 触发原生操作
- `$reqApp(path, params)` → 调用指定 Native Bridge
- `window.updateHTML(encodedData)` → 原生向 H5 推送数据
- `common/tool/nativeUtils.js` → 统一封装 Toast、分享、页面切换、支付、相册等

**依赖亮点**

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| vue | ^3.2.47 | 前端框架 |
| vite | ^4.1.4 | 构建工具 |
| dompurify | ^3.3.0 | HTML 净化（笔记/翻译内容安全） |
| html2canvas | ^1.4.1 | 网页截图 |
| web-highlighter | ^0.7.4 | 文本高亮 |
| commonmark | ^0.31.1 | Markdown 解析 |
| @floating-ui/dom | ^1.6.7 | 浮动元素定位 |
| jquery | ^3.6.4 | 兼容旧桥接逻辑 |
| rangy | ^1.3.1 | 选区操作 |
| terser | ^5.17.6 | 构建压缩 |
| vconsole | ^3.15.0 | 移动端调试 |

**构建脚本**

| 命令 | 描述 |
| --- | --- |
| `npm run dev` | Vite 开发服务器 |
| `npm run build:test` | 测试环境构建 |
| `npm run build` | 生产环境构建 |
| `npm run build:fallback` | Fallback 回退构建 |
| `npm run build:reader` | 阅读器模块独立构建 |
| `npm run images` | 图片资源处理 |

**发布与治理文档**

- `readme/platform/code-review-workflow.md` — 代码审查工作流
- `readme/document/release-management/version-record.md` — 版本记录（可追溯到 v1.6.x）
- `readme/document/release-management/code-review-report-v1-*.md` — 每次发布的代码审查报告
- `readme/document/planning/optimization-plan-2025-03-28.md` — 优化规划

---

### P0-3. AI Agent 对话前端（mojidict-agent）

| 属性 | 值 |
| --- | --- |
| 本地目录 | `mojidict-agent/` |
| 项目定位 | **公司引入 AI 后的新项目**，独立 Agent 对话前端 |
| 技术栈 | Vue 3.5 + TypeScript 5.6 + Vite 6 + Pinia + TanStack Query + Tailwind CSS 4 + VueUse |
| 版本 | 0.1.0 |
| 访问入口 | https://www.mojidict.com/moji-agent |

**用户角色与贡献**

- 担任前端/Web 负责人
- 主导技术选型：Vue 3 + Vite 6 + TS + Tailwind CSS 4 组合
- 独立完成项目搭建（脚手架、目录规范、类型契约、Composable 模式）
- 设计并实现部署方案：GitLab CI 多环境构建 + Aliyun OSS 静态资源上传 + Nginx 子路径部署

**核心模块**

- `src/api/`：Agent SSE 流式接口、MOJi 登录认证接口、Parse Cloud 收藏接口
- `src/stores/`：authStore / sessionStore / themeStore / uiStore
- `src/composables/`：useChatStream / useConversationHistory / useResponsiveLayout
- `src/components/`：chat / history / layout / cards / ui 五大域，含 Data Card 注册表与未知类型降级
- `src/types/agent.ts`：前后端 Agent 事件和会话数据主契约

**已覆盖能力**

- 会话新建、历史列表、历史恢复
- 登录弹窗和登录态持久化（手动/共享 SSO/App WebView 三种来源）
- `POST /api/chat_stream` SSE 流式读取，`message_delta` 实时显示
- `trace_step` 驱动生成状态提示
- Data Card 注册表 + 未知类型降级 + 停止生成 + Token/Context Window 显示
- PC 桌面侧栏 + 移动端历史抽屉
- 主题色固定 MOJi Red，明暗模式切换

---

## 次重点 JS/TS 项目

### 1. MOJiDict Web SSR — 桌面端 Web（旧版）

| 属性 | 值 |
| --- | --- |
| 本地目录 | `mojidict_web/` |
| 技术栈 | Nuxt 2 + Vue 2.7 + Element UI 2.15 + Vuex + ECharts |
| 版本 | 4.18.4 |

---

### 2. MOJi Admin — 后台管理系统

| 属性 | 值 |
| --- | --- |
| 本地目录 | `moji_admin_web/` |
| 技术栈 | Vue 3.2 + TypeScript 4.8 + Vite 3 + Arco Design 2 + Pinia |
| 版本 | 1.5.17 |

---

### 3. hugecore.net — 公司官网与帮助中心

| 属性 | 值 |
| --- | --- |
| 本地目录 | `hugecore_web/` |
| 技术栈 | Nuxt 3.17 + TypeScript + Tailwind CSS + @nuxt/content |
| 版本 | 2.2.20 |

**用户角色与贡献**

- 独立负责官网搭建和持续迭代
- 设计 App 双入口模式（`APP_TYPE=hugecore` / `APP_TYPE=shareintelli`），同一仓库支持两个应用
- `@nuxt/content` 驱动 Markdown 内容型文档（帮助中心、隐私协议）

---

### 4. KoriDict H5 — 韩语词典移动端

| 属性 | 值 |
| --- | --- |
| 本地目录 | `kori-h5/` |
| 技术栈 | Nuxt 4 + Vue 3.5 + Vant 4 + Pinia 3 |
| 版本 | 1.2.0 |

---

### 5. MOJiTest Web — 在线考试平台

| 属性 | 值 |
| --- | --- |
| 本地目录 | `mojitest-web/` |
| 技术栈 | Nuxt 2 + Vue 2.7 + Element UI + Vuex |
| 版本 | 1.6.4 |

---

### 6. More Digital Hybrid H5 — Hybrid 产品线

| 属性 | 值 |
| --- | --- |
| 本地目录 | _(本地扫描未找到，可补充)_ |
| 项目定位 | More Digital Hybrid H5 平台，**多产品线共用**一套框架 |
| 技术栈 | _(待补充)_ |

**用户角色与贡献**

- **用户实际负责多个产品线**的开发与交付
- **参与整体框架设计**，从架构层面统一多应用的工程结构与发布流程

---

### 7. 其他 JS/TS 项目

| 项目 | 目录 | 简述 |
| --- | --- | --- |
| hugecore_vibecodingdemo | `hugecore_vibecodingdemo/` | Demo 静态资源构建与发布工具 |
| moji-agent-backend-ts | `moji-agent-backend-ts/` | Agent 后端 TypeScript 服务 |
| mojitekku-web | `mojitekku-web/` | MOJiTekku Web 端 |
| kori-web | `kori-web/` | KoriDict Web 端 |
| krosea-web | `krosea-web/` | Krosea Web 端 |
| mojidict-web-plugin | `mojidict-web-plugin/` | 浏览器插件 |
| autoFirebase | `autoFirebase/` | Firebase Crashlytics 周报自动化 |
| jing-next | `jing-next/` | Next.js 15 + React 19 个人作品 |
| cat-newsroom（猫咪生活报） | `/Users/hugecore/Jing/cat-newsroom/` | 个人产品：复古报刊风生活工作台，Vue 3 + Vite + Supabase，已部署 GitHub Pages |
| madaha-translate-fe | `madaha-translate-fe/` | Madaha 翻译前端 |

---

## Moddict 微信小程序

| 属性 | 值 |
| --- | --- |
| 本地目录 | `mojidict-mini-program/` |
| 项目定位 | 公司开发的微信小程序产品 |

**用户角色与贡献**

- 全程参与项目迭代，**自进入公司起即负责该项目**
- 前期与另一位开发者各负责一半模块，共同推进
- 另一位开发者离职后，**主导项目大部分开发工作**
- **拆分项目目录结构**并**制定开发规范**，后续指导新人按规范持续优化
- 项目经历了**多次整体重构和结构优化**
- 用户至今仍维护项目的一部分核心内容

---

## Python 项目

### 1. Echo Layer（回声层）— 私人养成叙事游戏

| 属性 | 值 |
| --- | --- |
| 本地目录 | `echo-layer/` |
| 技术栈 | Python 3 标准库（无第三方依赖） |
| 核心文件 | `scripts/validate.py`、`scripts/validate_training.py`、`scripts/build_training_context.py` |
| 测试 | `tests/test_validate.py`、`tests/test_training.py`（unittest） |

**用户角色与贡献**

- 独立设计游戏规则、存档协议、校验器
- JSON Schema + 运行时双重校验存档一致性
- 存档持久化在普通 JSON 文件，跨会话可恢复

### 2. 测试脚本

- `test/open_urls.py` — URL 批量打开测试

---

## 小程序与工具

| 项目 | 目录 | 简述 |
| --- | --- | --- |
| Moddict 微信小程序 | `mojidict-mini-program/` | 公司小程序，详情见下方独立条目 |
| quiz-pages | `quiz-pages/` | 答题页面集合 |
| test | `test/` | 自动化测试脚本（答题自动化 / 估分器自动化） |
| Demo | `Demo/` | 前端实验项（雷达图 / 图片上传 / HTML 原型） |

---

## 技术栈全景

### 前端框架
- Vue 2.7（旧项目） / Vue 3.5（新项目主力）
- React 19（jing-next）

### SSR / 元框架
- Nuxt 2 / 3 / 4（主力）
- Next.js 15

### 构建工具
- Vite 3 / 4 / 6（新项目主力）
- Webpack 4（旧 Nuxt 2 项目）

### 状态管理
- Vuex 3（旧项目）
- Pinia 2 / 3（新项目主力）

### UI 组件库
- Element UI 2.15（桌面端）
- Arco Design 2（后台）
- Vant 2 / 4（移动端）
- Mint UI（早期移动端）

### 样式
- Tailwind CSS 4（新项目主力）
- SCSS / Sass（全项目）
- postcss-pxtorem（移动端 rem 转换）

### 其他工具
- TypeScript 5.6-5.9（新项目强类型）
- ECharts（数据可视化）
- Ali OSS（资源上传）
- Lottie / Swiper（动画与轮播）
- Playwright / Vue Test Utils（测试）

---

## 待补充项目（用户口述，本地无对应仓库）

以下项目由用户提及但本地扫描未找到对应目录，请用户后续补充具体信息（定位、技术栈、角色、贡献）。

### □ Core H5

| 属性 | 值 |
| --- | --- |
| 本地目录 | _(未找到)_ |
| 项目定位 | _(待用户补充)_ |
| 技术栈 | _(待用户补充)_ |
| 用户角色 | _(待用户补充)_ |
| 贡献描述 | _(待用户补充)_ |

### □ Core Web

| 属性 | 值 |
| --- | --- |
| 本地目录 | _(未找到)_ |
| 项目定位 | _(待用户补充)_ |
| 技术栈 | _(待用户补充)_ |
| 用户角色 | _(待用户补充)_ |
| 贡献描述 | _(待用户补充)_ |

### □ Modularized Test

| 属性 | 值 |
| --- | --- |
| 本地目录 | _(未找到)_ |
| 项目定位 | _(待用户补充)_ |
| 技术栈 | _(待用户补充)_ |
| 用户角色 | _(待用户补充)_ |
| 贡献描述 | _(待用户补充)_ |

### ✅ More Digital H5 — 已补全详情（见次重点 JS/TS 项目 #6）

| 属性 | 值 |
| --- | --- |
| 本地目录 | _(未找到)_ |
| 项目定位 | More Digital Hybrid H5 平台，多产品线共用一套框架 |
| 技术栈 | _(待用户补充)_ |
| 用户角色 | 用户实际负责多个产品线，参与整体框架设计 |
| 贡献描述 | 详见上方条目 |

### ✅ Moddict 微信小程序 — 已补全详情（见独立条目）

| 属性 | 值 |
| --- | --- |
| 本地目录 | `mojidict-mini-program/` |
| 项目定位 | 公司开发的微信小程序 |
| 技术栈 | _(待用户补充)_ |
| 用户角色 | 全程参与迭代，主导开发，拆分目录结构并制定规范 |
| 贡献描述 | 详见上方条目 |

---

## 备注

- 本文件基于本地项目目录扫描 + 用户口述整理
- 迭代最多的项目：**MOJiDict 全系列产品线**（包括 dict-web-H5、Hybrid 等完整 MOJiDict 系列项目）
- AI Agent 对话前端为公司引入 AI 后的**新项目**，非迭代最多的项目
