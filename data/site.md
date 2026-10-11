---
owner: 潘静
title: 卷首
subtitle: 分卷 · 各卷独立
updated: 2026-10-10
lede: 履历只回答了“我做过什么”。这里还放几卷别的：喜欢的东西、走过的路、练过的重量。每卷各看一个侧面，互不关联，从这一页进去就行。
---

# 分卷清单

> 履历志、训练志是成品，另外两卷还在长：想到什么补什么。改内容只动 `data/*.md`，
> 页面读的 `data/*.json` 是跑出来的，不手改。

> 这是分卷的事实源，`data/site.json` 由它生成（页面读 json，不读本文件）。
> 结构：`## 标题` 开一卷，下面跟 `字段: 值` 行。
> `accent` 可以写中国传统色名（见 README 配色表），也可以直接写 `#hex`。
> 改完跑 `npm run data`（或 `npm run build`）重新生成 json。

## 履历志

no: 第一卷
id: resume
subtitle: 工作与能力
desc: 多端前端开发负责人的职业档案：项目、技术栈、工作方式与经历。
page: resume.html
data: resume.json
accent: 绛缨
status: 已上线
progress: 成品

## 喜好志

no: 第二卷
id: tastes
subtitle: 感官与偏好
desc: 记录喜欢的东西：食物、音乐、影剧、书、游戏、城市，还有常看的人。逐条攒成一份口味地图。
page: tastes.html
data: tastes.json
accent: 烟雨青
status: 已上线
progress: 未完成

## 经历志

no: 第三卷
id: timeline
subtitle: 时间与轨迹
desc: 把人生里的节点按时间铺开：学业、入行、迁居，以及某个开始坚持的爱好。
page: timeline.html
data: timeline.json
accent: 黛蓝
status: 已上线
progress: 未完成

## 训练志

no: 第四卷
id: training
subtitle: 身体与负荷
desc: 力量训练、跑步、跑山与羽毛球记录：动作、配速、主观感受与恢复。
page: training.html
data: training.json
accent: 檀色
status: 已上线
progress: 成品
