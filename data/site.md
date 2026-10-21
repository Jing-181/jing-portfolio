---
owner: 潘静
title: 卷首
subtitle: 分卷 · 各卷独立
updated: 2026-10-21
lede: 履历只回答了“我做过什么”。歌单签名里那句“些纠结些选择困难些胆小些幼稚些多愁”，履历里写不下。这里放几卷别的：喜欢的东西、走过的路、练的重量。
prelude: 外婆家的那个夏天，一整个假期在看《武林外传》。
seal: ISFJ · 别人说，这个类型里我算典型的
---

# 分卷清单

> 履历志、训练志已成，另两卷还在增补。改内容只动 `data/*.md`，
> 页面读的 `data/*.json` 是跑出来的，不手改。

> 这是分卷的事实源，`data/site.json` 由它生成（页面读 json，不读本文件）。
> 前置元信息：`owner / title / subtitle / updated`，外加卷首那三行：
> `lede`（开头那段）/ `prelude`（引子，一段实事）/ `seal`（落款小字）。
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
progress: 已成

## 喜好志

no: 第二卷
id: tastes
subtitle: 心上与手边
desc: 几样放在心上很久的东西，一件一件拆开来看。
page: tastes.html
data: tastes.json
accent: 烟雨青
status: 已上线
progress: 未完
lock: true

## 经历志

no: 第三卷
id: timeline
subtitle: 时间与轨迹
desc: 从童年到此刻，读书、入行、迁居，还有一路走过的那些地方。
page: timeline.html
data: timeline.json
accent: 黛蓝
status: 已上线
progress: 未完
lock: true

## 训练志

no: 第四卷
id: training
subtitle: 身体与负荷
desc: 力量训练、跑步、跑山与羽毛球记录：动作、配速、主观感受与恢复。
page: training.html
data: training.json
accent: 檀色
status: 已上线
progress: 已成
lock: true
