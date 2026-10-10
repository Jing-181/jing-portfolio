# 技术个人主页 - 项目展示总结

> 本文件是完整项目档案的**精简版**，用于个人主页前端页面筛选展示内容。
> 展示优先级：P0 首页展示 → P1 精选 → P2 更多 → P3 归档。

---

## 基础信息

| 字段 | 值 | 备注 |
| --- | --- | --- |
| 真实姓名 | 潘静 | |
| 当前职位 | Web 前端开发负责人 | |
| 所在城市 | _(暂不填写)_ | |
| GitHub | Jing-181 | |

---

## 一句话简介

> 长期负责 MOJiDict 全系列产品线的前端工程化和多平台交付，推动 dict-web-H5 持续迭代、Hybrid H5 架构升级与 AI Agent 前端落地。

---

## 精选项目展示（P0 首页展示）

### 🥇 MOJiDict 全系列产品线 — 迭代最多的核心业务

- **覆盖**：dict-web-H5（移动端）、Hybrid（iOS/Android/Harmony 三端共用 H5 内核）、旧版 Web SSR 等
- **技术栈**：Nuxt 2 + Vue 2.7/3 + Vite + Vant + Vuex/Pinia + SCSS
- **亮点**：从早期版本持续迭代至今，覆盖首页发现、搜索详情、翻译、收藏、支付、学习报告全链路；Hybrid 承载 8 个产品线统一内容详情页组件与 50+ Native Bridge 方法；多语言（日/中/英/韩/马来/泰）、完整版本治理与发布回退体系

### 🥈 MOJi Admin — 运营后台

- **定位**：公司统一运营后台（运营中心/资源库/用户中心/订单中心）
- **技术栈**：Vue 3 + TypeScript + Vite + Arco Design
- **亮点**：前端负责人，从 0 到 1 搭建，统一鉴权体系 + 模块化路由 + 权限粒度控制，服务全部产品线

### 🥉 KoriDict H5 — 韩语词典 H5

- **定位**：韩语词典移动端 H5，Nuxt 4 + Vue 3 重写版
- **技术栈**：Nuxt 4 + Vant 4 + Pinia
- **亮点**：从旧版迁移至 Nuxt 4，SSR 优化、组件重构、性能显著提升

---

## 精选项目展示（P1 次重点）

| 项目 | 目录 | 一句话亮点 | 技术栈 |
| --- | --- | --- | --- |
| AI Agent 对话前端 | mojidict-agent/ | 公司引入 AI 后的新项目，独立 Agent 对话前端 | Vue 3.5 + TS 5.6 + Vite 6 + Pinia + TanStack Query + Tailwind 4 |
| 猫咪生活报 | cat-newsroom/ | 个人产品：复古报刊风生活工作台，双端一体 + Supabase 同步 + AI 周报 | Vue 3.5 + Vite 6 + Supabase + GitHub Pages |
| hugecore.net | hugecore_web/ | 公司官网 + 帮助中心 + App 协议文档 | Nuxt 3 + Tailwind + @nuxt/content |
| MOJiTest Web | mojitest-web/ | 在线考试平台 Web 端 | Nuxt 2 + Vue 2.7 + Element UI |

---

## 更多项目（P2 折叠展示）

| 项目 | 目录 | 简述 |
| --- | --- | --- |
| More Digital Hybrid H5 | — | 8 个产品线共用 Hybrid 平台，用户负责多条产品线并参与框架设计 |
| Moddict 微信小程序 | mojidict-mini-program/ | 公司小程序，全程参与迭代，主导开发并制定规范 |
| Echo Layer | echo-layer/ | Python 3 标准库私人养成叙事游戏 |
| autoFirebase | autoFirebase/ | Firebase Crashlytics 周报自动化（Node.js） |
| jing-next | jing-next/ | Next.js 15 + React 19 个人作品 |
| hugecore_vibecodingdemo | hugecore_vibecodingdemo/ | Demo 静态资源构建工具 |
| mojitekku-web / kori-web / krosea-web | — | 各产品 Web 端 |
| mojidict-web-plugin | — | 浏览器插件 |
| quiz-pages | — | 答题页面集合 |
| Demo | — | 前端实验项 |

---

## 待补充项目（用户口述）

| 项目 | 展示优先级 | 状态 |
| --- | --- | --- |
| Core H5 | _(待确认)_ | 本地无对应仓库，待补充 |
| Core Web | _(待确认)_ | 本地无对应仓库，待补充 |
| Modularized Test | _(待确认)_ | 本地无对应仓库，待补充 |
| More Digital Web | _(待确认)_ | 本地无对应仓库，待补充 |
| ✅ More Digital H5 | P2 | 已补全详情（多产品线 Hybrid 平台，见 complete.md） |
| ✅ Moddict 微信小程序 | P2 | 已补全详情（全程参与迭代，见 complete.md） |

---

## 技术标签云

**框架 & 语言**：Vue 3 / Vue 2 / React 19 / TypeScript / JavaScript / Python

**元框架**：Nuxt 2 / Nuxt 3 / Nuxt 4 / Next.js 15

**构建工具**：Vite / Webpack

**状态管理**：Pinia / Vuex

**UI 组件**：Element UI / Arco Design / Vant / Mint UI

**样式**：Tailwind CSS 4 / SCSS / Sass / postcss-pxtorem

**测试**：Playwright / Vue Test Utils / unittest

**DevOps**：GitLab CI / Docker / Aliyun OSS / Kubernetes

**其他**：ECharts / Lottie / Swiper / markdown-it / html2canvas

---

## 页面展示建议

- **首页 Hero 区**：基础信息 + 一句话简介
- **项目卡片区**：P0 三个重点项目（MOJiDict 全系列产品线、MOJi Admin、KoriDict H5）
- **技术栈标签云**：放在 Hero 区或 About 区
- **更多项目折叠区**：P1 + P2，按产品线分组展示
- **待补充项目**：用户口述的 Core H5/Core Web/Modularized Test/More Digital Web/H5 作为空占位，等待后续补充

---

## 备注

- 本文件是完整项目档案的精简子集，详细信息见 `projects-complete.md`
- 迭代最多的项目：**MOJiDict 全系列产品线**（包括 dict-web-H5、Hybrid 等完整 MOJiDict 系列项目）
- AI Agent 为公司引入 AI 后的新项目，前端/Web 负责人
