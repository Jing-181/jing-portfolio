---
vol: tastes
updated: 2026-10-10
categories: 食物, 饮品, 音乐, 影剧, 书, 游戏, 城市, 其他
---

# 喜好志

> 这是喜好志的事实源，`data/tastes.json` 由它生成（页面读 json，不读本文件）。
> 每条 = 一个 `### 名称`，下面跟几行 `字段: 值`；分类用 `## 分类名`。
> 字段：rating(1–5) / note / tags / since / private。`private: true` 的条目只在本地可见，部署时被剔除。
> 改完跑 `npm run data`（或 `npm run build`）重新生成 json。

## 饮品

### 示例条目 · 手冲咖啡

rating: 5
since: 2023
tags: 日常, 提神
note: 这是一条示例，用来展示数据长什么样。换成你自己的内容即可。

## 音乐

### 示例条目 · 某首循环过很多遍的歌

rating: 4
since: 2021
tags: 单曲循环
note: 示例条目。写到副歌部分的感受也可以，一两句话就好。

## 其他

### 示例条目 · 一条不公开的私人偏好

rating: 5
since: 2024
tags: 私密
note: private 为 true 的条目只在你本地能看到，构建部署时会被自动剔除。
private: true
